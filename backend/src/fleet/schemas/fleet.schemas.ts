import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

// ----------------------
// 1. Esquema para Vehículos (Orders)
// ----------------------
export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })
export class Vehicle {
  
  @ApiProperty({ description: 'Vehicle model name' })
  @Prop({ required: true })
  modelo: string;

  @ApiProperty({ description: 'Vehicle status' })
  @Prop({ required: true, index: true })
  estado: string;

  @ApiProperty({ description: 'Fuel level' })
  @Prop({ required: true })
  combustible: number;

  @ApiProperty({ description: 'Current temperature' })
  @Prop({ required: true })
  temp: number;

  @ApiProperty({ description: 'Kilometers traveled' })
  @Prop({ required: true })
  km: number;

  @ApiProperty({ description: 'Driver name' })
  @Prop({ required: true })
  chofer: string;

  @ApiProperty({ description: 'Vehicle type' })
  @Prop({ required: true })
  tipo: string;

  @ApiProperty({ description: 'Last update timestamp' })
  @Prop({ default: Date.now })
  lastUpdate: Date;

  @ApiProperty({ description: 'Week start date for grouping' })
  @Prop({ default: () => getWeekStart(new Date()) })
  weekStart: Date;

  @ApiProperty({ description: 'Total kilometers for the week' })
  @Prop({ default: 0 })
  weeklyKm: number;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

// ----------------------
// 2. Esquema para Historial Semanal (Weekly History)
// ----------------------
export type HistoryDocument = FleetHistory & Document;

@Schema({ timestamps: true })
export class FleetHistory {
  @ApiProperty({ description: 'Monday of the week' })
  @Prop({ required: true, index: true })
  weekStart: Date;

  @ApiProperty({ description: 'Sunday of the week' })
  @Prop({ required: true })
  weekEnd: Date;

  @ApiProperty({ description: 'Day of week abbreviation' })
  @Prop({ required: true })
  dayOfWeek: string;

  @ApiProperty({ description: 'Total kilometers for the day' })
  @Prop({ required: true })
  totalKm: number;

  @ApiProperty({ description: 'Total cost for the day' })
  @Prop({ required: true })
  totalCost: number;

  @ApiProperty({ description: 'Number of active vehicles' })
  @Prop({ default: 0 })
  vehicleCount: number;
}

export const HistorySchema = SchemaFactory.createForClass(FleetHistory);

// ----------------------
// Helper: Get Monday of current week
// ----------------------
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export function getDayName(date: Date): string {
  const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  return days[date.getDay()];
}