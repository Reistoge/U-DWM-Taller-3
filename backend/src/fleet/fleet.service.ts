import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument, FleetHistory, getWeekStart, getDayName, HistoryDocument } from './schemas/fleet.schemas';
import { CreateVehicleDto } from './dto/create-fleet.dto';
import { DashboardDataDto } from './dto/dashboard-data.dto';
const { execSync } = require('child_process');

@Injectable()
export class FleetService {

  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(FleetHistory.name) private historyModel: Model<HistoryDocument>,
  ) { }
  private readonly logger = new Logger(FleetService.name);
  async getDashboardData(): Promise<DashboardDataDto> {
    try {
      const vehicles = await this.vehicleModel.find().exec();

      const formattedOrders = vehicles.map(v => ({
        id: v._id.toString(),
        modelo: v.modelo,
        estado: v.estado,
        combustible: v.combustible,
        temp: v.temp,
        km: v.km,
        chofer: v.chofer,
        tipo: v.tipo,
        lastUpdate: v.lastUpdate ? v.lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A',

        weekStart: v.weekStart,
        weeklyKm: v.weeklyKm,

      }));

      const radarData = this.calculateFleetMetrics(vehicles);
      const historyData = await this.getWeeklyHistory();

      return {
        vehicles: formattedOrders,
        historyData,
        radarData
      };
    } catch (err) {
      this.logger.log(`Error while getting dashboard data \nError:\n${err}`);
      throw new InternalServerErrorException(`An error ocurred while getting dashboard data`);
    }
  }

  async updateVehicle(id: string, updateData: any, recordDate?: Date): Promise<Vehicle> {
    try {
      const oldVehicle = await this.vehicleModel.findById(id).exec();

      if (!oldVehicle) throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);

      // Calculate KM difference for this week - always positive (new km should be higher)
      const weekStart = this.getNormalizedWeekStart(new Date());
      const newKm = updateData.km || 0;
      const oldKm = oldVehicle?.km || 0;
      const kmDifference = Math.max(0, newKm - oldKm); // Ensure positive

      const updatedVehicle = await this.vehicleModel.findByIdAndUpdate(
        id,
        {
          ...updateData,
          lastUpdate: new Date(),
          weekStart,
          weeklyKm: (oldVehicle?.weeklyKm || 0) + kmDifference,
        },
        { new: true }
      ).exec();

      if (!updatedVehicle) throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);

      // Record in history only if there's a positive change
      if (kmDifference > 0) {
        await this.recordHistoryEntry(kmDifference, recordDate);
      }

      return updatedVehicle;
    } catch (err) {
      this.logger.log(`Error in update vehicle \nError:\n${err}`);
      throw new InternalServerErrorException(`An error ocurred while updating a vehicle entry data`);

    }
  }

  /**
   * Normalize date to start of day (00:00:00) in local timezone
   */
  private getNormalizedDate(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Get week start (Monday) normalized to start of day
   */
  private getNormalizedWeekStart(date: Date): Date {
    const normalized = this.getNormalizedDate(date);
    const day = normalized.getDay();
    const diff = normalized.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(normalized.setDate(diff));
  }

  /**
   * Get day name from a specific date (0=Monday, 6=Sunday)
   */
  private getDayOfWeekName(date: Date): string {
    const normalized = this.getNormalizedDate(date);
    const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']; // Monday=0, Sunday=6
    const dayIndex = (normalized.getDay() + 6) % 7; // Convert JS day (0=Sun) to our system (0=Mon)
    return days[dayIndex];
  }

  private async recordHistoryEntry(kmDifference: number, recordDate?: Date): Promise<void> {
    try {
      const dateToRecord = recordDate ? new Date(recordDate) : new Date();
      const weekStartDate = this.getNormalizedWeekStart(dateToRecord);
      const dayName = this.getDayOfWeekName(dateToRecord);

      const weekEnd = new Date(weekStartDate);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      console.log(`Recording history: Day=${dayName}, KmDiff=${kmDifference}, WeekStart=${weekStartDate.toISOString()}, RecordDate=${dateToRecord.toDateString()}`);

      // Find or create history entry for the specified day
      const existingEntry = await this.historyModel.findOne({
        dayOfWeek: dayName,
        weekStart: weekStartDate,
      }).exec();

      if (existingEntry) {
        console.log(`Found existing entry for ${dayName}, updating km from ${existingEntry.totalKm} to ${existingEntry.totalKm + kmDifference}`);
        existingEntry.totalKm += kmDifference;
        existingEntry.totalCost = existingEntry.totalKm * 0.8;
        await existingEntry.save();
      } else {
        console.log(`Creating new history entry for ${dayName}`);
        await this.historyModel.create({
          weekStart: weekStartDate,
          weekEnd,
          dayOfWeek: dayName,
          totalKm: kmDifference,
          totalCost: kmDifference * 0.8,
          vehicleCount: await this.vehicleModel.countDocuments(),
        });
      }
    } catch (err) {
      this.logger.log(`Error calculating recordHistoryEntry \nError:\n${err}`);
      throw new InternalServerErrorException(`An error ocurred while getting the record history entry data`);
    }
  }

  private async getWeeklyHistory() {
    try {
      const weekStartDate = this.getNormalizedWeekStart(new Date());

      const history = await this.historyModel
        .find({
          weekStart: weekStartDate,
        })
        .sort({ dayOfWeek: 1 })
        .exec();

      console.log(`Found ${history.length} history entries for week starting ${weekStartDate.toISOString()}`);

      // Days in order: Lun, Mar, Mie, Jue, Vie, Sab, Dom
      const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
      return days.map(day => {
        const found = history.find((h: any) => h.dayOfWeek === day);
        return {
          name: day,
          km: found?.totalKm || 0,
          costo: found?.totalCost || 0,
        };
      });
    } catch (err) {
      this.logger.log(`Error calculating weeklyHistory \nError:\n${err}`);
      throw new InternalServerErrorException(`An error ocurred while getting the weekly history data`);
    }
  }

  private calculateFleetMetrics(vehicles: Vehicle[]) {
    try {
      const total = vehicles.length || 1;

      const enRuta = vehicles.filter(v => v.estado === 'En Ruta').length;
      const enMantenimiento = vehicles.filter(v => v.estado === 'Mantenimiento').length;
      const conIncidencia = vehicles.filter(v => v.estado === 'Incidencia').length;

      const avgCombustible = vehicles.reduce((acc, curr) => acc + curr.combustible, 0) / total;
      const avgTemp = vehicles.reduce((acc, curr) => acc + curr.temp, 0) / total;

      const scoreDisponibilidad = Math.round((enRuta / total) * 150);
      const scoreMantenimiento = Math.round(150 * (1 - (enMantenimiento / total)));
      const scoreSeguridad = Math.round(150 * (1 - (conIncidencia / total)));
      const scoreConsumo = Math.round(avgCombustible * 1.5);
      const scoreMotor = avgTemp > 95 ? 60 : (avgTemp > 85 ? 100 : 140);

      return [
        { subject: 'Disponibilidad', A: scoreDisponibilidad, fullMark: 150 },
        { subject: 'Mantenimiento', A: scoreMantenimiento, fullMark: 150 },
        { subject: 'Seguridad', A: scoreSeguridad, fullMark: 150 },
        { subject: 'Eficiencia', A: scoreConsumo, fullMark: 150 },
        { subject: 'Salud Motor', A: scoreMotor, fullMark: 150 },
      ];
    } catch (err) {
      this.logger.log(`Error while calculating fleet metrics \nError:\n${err}`)
      throw new InternalServerErrorException(`An Error ocurred calculating fleet metrics`)
    }
  }

  async createVehicle(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    try {
      const newVehicle = new this.vehicleModel(createVehicleDto);
      return await newVehicle.save();
    } catch (err) {
      this.logger.log(`Error while creating vehicle \nError:\n ${err}`);
      throw new InternalServerErrorException('Error while creating vehicle');
    }
  }

  async seedDatabase(data: { orders?: CreateVehicleDto[] }) {
    try {
      await this.vehicleModel.deleteMany({});
      await this.historyModel.deleteMany({});
      if (data && data.orders) {
        const vehiclesToInsert = data.orders?.map(({ ...rest }) => ({
          ...rest,
          lastUpdate: new Date(),
          weekStart: this.getNormalizedWeekStart(new Date()),
          weeklyKm: rest.km,
        }));

        await this.vehicleModel.insertMany(vehiclesToInsert);

        // Initialize history with zeros for all days of current week
        const weekStartDate = this.getNormalizedWeekStart(new Date());
        const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

        for (const day of days) {
          const weekEnd = new Date(weekStartDate);
          weekEnd.setDate(weekEnd.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);

          await this.historyModel.create({
            weekStart: weekStartDate,
            weekEnd,
            dayOfWeek: day,
            totalKm: 0,
            totalCost: 0,
            vehicleCount: vehiclesToInsert.length,
          });
        }
      }


      return { message: 'Vehículos sembrados con historial semanal inicializado.' };
    } catch (err) {
      this.logger.log(`Error while seeding database`)
      throw new InternalServerErrorException(`Error while seeding database`);
    }
  }

  async seedDatabaseWithFaker(quantity: number) {
    try {
      execSync(`npm run faker:create ${quantity}`, { stdio: 'inherit' });
      return { message: `Seeded database with ${quantity} vehicles using faker` };
    } catch (err) {
      this.logger.log(`Error while seeding database with faker\n${err}`);
      throw new InternalServerErrorException(`Error while seeding database with faker`);
    }
  }
  async updateDatabaseWithFaker() {
    try {
      execSync(`npm run faker:update`, { stdio: 'inherit' });
      return { message: `updating registers using faker` };
    } catch (err) {
      this.logger.log(`Error while updating database with faker\n${err}`);
      throw new InternalServerErrorException(`Error while updating database with faker`);
    }
  }
}