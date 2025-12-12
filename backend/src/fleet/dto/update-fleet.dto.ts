import { PartialType } from '@nestjs/swagger'; 
import { CreateVehicleDto } from './create-fleet.dto';
import { IsISO8601, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @ApiPropertyOptional({ description: 'Date to record the history entry' })
  @IsOptional() @IsISO8601()
  recordDate?: string;
}

