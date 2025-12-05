import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './create-fleet.dto';
export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {

}

 