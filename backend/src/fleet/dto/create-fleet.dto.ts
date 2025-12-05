import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  modelo: string;

  @IsString()
  estado: string;

  @IsNumber()
  combustible: number;

  @IsNumber()
  temp: number;

  @IsNumber()
  km: number;

  @IsString()
  chofer: string;

  @IsString()
  tipo: string;
}

export class CreateHistoryDto {
  @IsString()
  name: string;

  @IsNumber()
  km: number;

  @IsNumber()
  costo: number;
}

 