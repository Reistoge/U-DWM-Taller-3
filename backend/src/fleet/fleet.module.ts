import { Module } from '@nestjs/common';
import { FleetService } from './fleet.service';
import { FleetController } from './fleet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from './schemas/fleet.schemas';

@Module({
  imports: [MongooseModule.forFeature([
      { name: Vehicle.name, schema: VehicleSchema },
   
    ])],

  controllers: [FleetController],
  providers: [FleetService],
})
export class FleetModule {}
