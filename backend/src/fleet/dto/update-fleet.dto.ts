import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './create-fleet.dto';
import { IsISO8601, IsOptional } from 'class-validator';
export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @IsOptional()
  @IsISO8601()
  recordDate?: string;
}

