import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateVehicleDto {
  @ApiProperty()
  @IsString()
  modelo: string;

  @ApiProperty()
  @IsString()
  estado: string;

  @ApiProperty()
  @IsNumber()
  combustible: number;

  @ApiProperty()
  @IsNumber()
  temp: number;

  @ApiProperty()
  @IsNumber()
  km: number;

  @ApiProperty()
  @IsString()
  chofer: string;

  @ApiProperty()
  @IsString()
  tipo: string;
}

export class CreateHistoryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  km: number;

  @ApiProperty()
  @IsNumber()
  costo: number;
}

 