import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";

@ApiSchema({description:"stadistic data of register to render other dashboards charts"})
export class DashboardDataVehicleDto {

    @ApiProperty()
    id: string;

    @ApiProperty()
    modelo: string;

    @ApiProperty()
    estado: string;

    @ApiProperty()
    combustible: number;

    @ApiProperty()
    temp: number;

    @ApiProperty()
    km: number;

    @ApiProperty()
    chofer: string;

    @ApiProperty()
    tipo: string;

    @ApiProperty()
    lastUpdate: string;

    @ApiProperty()
    weekStart: Date;

    @ApiProperty()
    weeklyKm: number;
}

@ApiSchema({description:"basic data needed to render the history chart"})
export class HistoryDto {

    @ApiProperty()
    name: string; 

    @ApiProperty()
    km: number;
    
    @ApiProperty()
    costo: number;
}

@ApiSchema({description:"basic data needed to render the radar chart"})
export class RadarDto {

    @ApiProperty() @IsString()
    subject: string;
    
    @ApiProperty() @IsNumber()
    A: number;

    @ApiProperty() @IsNumber()
    fullMark: number;
}
export class DashboardDataDto {
    @ApiProperty({ type: DashboardDataVehicleDto, isArray: true })

    vehicles: DashboardDataVehicleDto[];

    @ApiProperty({ type: HistoryDto, isArray: true })
    historyData: HistoryDto[];

    @ApiProperty({ type: RadarDto, isArray: true })
    radarData: RadarDto[];
}