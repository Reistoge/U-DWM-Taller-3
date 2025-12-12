import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { FleetService } from './fleet.service';
import { CreateVehicleDto } from './dto/create-fleet.dto';
import { UpdateVehicleDto } from './dto/update-fleet.dto';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiOperation, ApiParam, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { Vehicle } from './schemas/fleet.schemas';
import { DashboardDataDto } from './dto/dashboard-data.dto';

@Controller('fleet') // Ruta base: /fleet
export class FleetController {
  constructor(private readonly fleetService: FleetService) { }


  @Get('dashboard')
  @ApiOperation({summary:"Returns basic data needed to render dashboard"}) @ApiResponse({ status: 200, type: DashboardDataDto })
  async getDashboard(): Promise<DashboardDataDto> {
    return this.fleetService.getDashboardData();
  }

  @Post('vehicle')
  @ApiOperation({ summary: 'Create a new vehicle' }) @ApiCreatedResponse({ description: 'Vehicle successfully created', type: Vehicle, }) @ApiBadRequestResponse({ description: 'Invalid vehicle data provided', }) @ApiConflictResponse({ description: 'Vehicle with the same identifier already exists', })
  async createVehicle(@Body() createVehicleDto: CreateVehicleDto) {
    return this.fleetService.createVehicle(createVehicleDto);
  }


  @Patch('vehicle/:id')
  @ApiOperation({ summary: 'Update a vehicle record' }) @ApiParam({ name: 'id', description: 'The unique identifier of the vehicle', type: 'string', example: 'vehicle-123' }) @ApiBody({ type: UpdateVehicleDto, description: 'Vehicle data to update' })
  async updateVehicle(@Param('id') id: string, @Body() updateData: UpdateVehicleDto): Promise<Vehicle> {
    const recordDate = updateData.recordDate ? new Date(updateData.recordDate) : undefined;
    return this.fleetService.updateVehicle(id, updateData, recordDate);
  }

  @Post('seed')
  @ApiOperation({ summary: "Seeds the database with body data" }) @ApiBody({ type: CreateVehicleDto, isArray: true, description: "batch creation of vehicles if null will clear the db" })
  async seedData(@Body() body?: CreateVehicleDto[]) {
    return this.fleetService.seedDatabase({
      orders: body
    });
  }

  @Post('fakerseed/:quantity')
  @ApiOperation({ summary: "Seeds the database with faker-generated data" })
  async fakerSeed(@Param('quantity') quantity: number) {
    return this.fleetService.seedDatabaseWithFaker(quantity);
  }
  @Post('fakerupdate')
  @ApiOperation({ summary: "Updates the database registers with faker-generated data" })
  async fakerUpdateSeed() {
    return this.fleetService.updateDatabaseWithFaker();
  }
}
