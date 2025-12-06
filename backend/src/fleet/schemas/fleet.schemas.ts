import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// ----------------------
// 1. Esquema para Vehículos (Orders)
// ----------------------
export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ required: true })
  modelo: string;

  @Prop({ required: true, index: true })
  estado: string;

  @Prop({ required: true })
  combustible: number;

  @Prop({ required: true })
  temp: number;

  @Prop({ required: true })
  km: number;

  @Prop({ required: true })
  chofer: string;

  @Prop({ required: true })
  tipo: string;

  @Prop({ default: Date.now })
  lastUpdate: Date;

  // NEW: Track week start date for grouping
  @Prop({ default: () => getWeekStart(new Date()) })
  weekStart: Date;

  // NEW: Weekly KM for that week
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
  @Prop({ required: true, index: true })
  weekStart: Date; // Lunes de esa semana

  @Prop({ required: true })
  weekEnd: Date; // Domingo de esa semana

  @Prop({ required: true })
  dayOfWeek: string; // "Lun", "Mar", etc.

  @Prop({ required: true })
  totalKm: number; // KM total ese día

  @Prop({ required: true })
  totalCost: number; // Costo ese día (KM * 0.8)

  @Prop({ default: 0 })
  vehicleCount: number; // Cantidad de vehículos activos ese día
}

export const HistorySchema = SchemaFactory.createForClass(FleetHistory);

// ----------------------
// Helper: Get Monday of current week
// ----------------------
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

export function getDayName(date: Date): string {
  const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  return days[date.getDay()];
}