import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from './schemas/fleet.schemas';
import { CreateVehicleDto } from './dto/create-fleet.dto';

@Injectable()
export class FleetService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
 
  ) {}

  // --- OBTENER DATOS (READ & CALCULATE) ---

  async getDashboardData() {
    // 1. Obtenemos SOLO los vehículos (Fuente de la verdad)
    const orders = await this.vehicleModel.find().exec();

    // 2. Formateamos los vehículos para el frontend
    const formattedOrders = orders.map(v => ({
      id: v._id.toString(),
      modelo: v.modelo,
      estado: v.estado,
      combustible: v.combustible,
      temp: v.temp,
      km: v.km,
      chofer: v.chofer,
      tipo: v.tipo,
      lastUpdate: v.lastUpdate ? v.lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
    }));

    // 3. CÁLCULO DINÁMICO DEL RADAR
    // Se recalcula cada vez que se pide el dashboard
    const radarData = this.calculateFleetMetrics(orders);

    // 4. CÁLCULO DINÁMICO DEL HISTORIAL
    // En lugar de leer una tabla estática, generamos una proyección basada en el KM actual.
    // Esto asegura que si editas un vehículo, el historial "crece" o se ajusta acorde.
    const historyData = this.calculateDynamicHistory(orders);

    return {
      orders: formattedOrders,
      historyData, 
      radarData
    };
  }

  // --- ACTUALIZAR DATOS (UPDATE) ---

  async updateVehicle(id: string, updateData: any): Promise<Vehicle> {
    const updatedVehicle = await this.vehicleModel.findByIdAndUpdate(
      id, 
      { ...updateData, lastUpdate: new Date() }, // Actualizamos fecha automáticamente
      { new: true } // Retorna el objeto ya actualizado
    ).exec();

    if (!updatedVehicle) throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
    
    return updatedVehicle;
  }

  // --- LÓGICA DE NEGOCIO (KPIS) ---

  private calculateFleetMetrics(vehicles: Vehicle[]) {
    const total = vehicles.length || 1;
    
    // Filtros
    const enRuta = vehicles.filter(v => v.estado === 'En Ruta').length;
    const enMantenimiento = vehicles.filter(v => v.estado === 'Mantenimiento').length;
    const conIncidencia = vehicles.filter(v => v.estado === 'Incidencia').length;
    
    // Promedios
    const avgCombustible = vehicles.reduce((acc, curr) => acc + curr.combustible, 0) / total;
    const avgTemp = vehicles.reduce((acc, curr) => acc + curr.temp, 0) / total;

    // Fórmulas
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
  }

  private calculateDynamicHistory(vehicles: Vehicle[]) {
    // Calculamos el KM total actual de la flota
    const currentTotalKm = vehicles.reduce((sum, v) => sum + v.km, 0);
    const currentTotalCost = currentTotalKm * 0.8; // Costo teórico acumulado

    const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
    
    // Generamos una curva hacia atrás. 
    // Asumimos que hoy (último día) es el valor actual, y restamos un estimado diario hacia atrás.
    return days.map((day, index) => {
      const daysBack = days.length - 1 - index;
      // Simulamos que la flota hace aprox 5% del total de KM por día
      const factor = 1 - (daysBack * 0.05); 
      
      return {
        name: day,
        km: Math.round(currentTotalKm * factor),
        costo: Math.round(currentTotalCost * factor)
      };
    });
  }

 

  async createVehicle(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const newVehicle = new this.vehicleModel(createVehicleDto);
    return newVehicle.save();
  }

  async seedDatabase(data: { orders: CreateVehicleDto[] }) {
    await this.vehicleModel.deleteMany({});
     
    const vehiclesToInsert = data.orders.map(({...rest}) => ({
        ...rest,
        lastUpdate: new Date()
    }));
    
    await this.vehicleModel.insertMany(vehiclesToInsert);

    return { message: 'Vehículos sembrados. Métricas configuradas para cálculo dinámico.' };
  }
}