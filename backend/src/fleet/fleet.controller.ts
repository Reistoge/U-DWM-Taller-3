import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { FleetService } from './fleet.service';
import { CreateVehicleDto } from './dto/create-fleet.dto';
import { UpdateVehicleDto } from './dto/update-fleet.dto';

@Controller('fleet') // Ruta base: /fleet
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

 
  @Get('dashboard')
  async getDashboard() {
    return this.fleetService.getDashboardData();
  }
 
  @Post('vehicle')
  async createVehicle(@Body() createVehicleDto: CreateVehicleDto) {
    return this.fleetService.createVehicle(createVehicleDto);
  }


  @Patch('vehicle/:id')
  async updateVehicle(@Param('id') id: string, @Body() updateData: UpdateVehicleDto) {
    const recordDate = updateData.recordDate ? new Date(updateData.recordDate) : undefined;
    return this.fleetService.updateVehicle(id, updateData, recordDate);
  }
 
  @Post('seed')
  async seedData(@Body() body: any) {
    return this.fleetService.seedDatabase(body);
  }
}