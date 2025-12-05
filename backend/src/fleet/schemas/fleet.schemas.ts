import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// ----------------------
// 1. Esquema para Vehículos (Orders)
// ----------------------
export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true }) // timestamps agrega createdAt y updatedAt automáticamente
export class Vehicle {
 

  @Prop({ required: true })
  modelo: string;

  @Prop({ required: true, index: true }) // Indexado para filtros rápidos
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

  // Guardamos la fecha real, el frontend la formatea a "10:05 AM"
  @Prop({ default: Date.now }) 
  lastUpdate: Date; 
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

// // ----------------------
// // 2. Esquema para Historial (HistoryEntry)
// // ----------------------
// export type HistoryDocument = HistoryMetric & Document;

// @Schema()
// export class HistoryMetric {
//   @Prop({ required: true })
//   name: string; // Ej: "Lun", "Mar" (O podrías usar Date real)

//   @Prop({ required: true })
//   km: number;

//   @Prop({ required: true })
//   costo: number;
// }

// export const HistorySchema = SchemaFactory.createForClass(HistoryMetric);

// ----------------------
// 3. Esquema para Radar (RadarEntry)
// ----------------------
// Nota: Este es compatible con tu archivo fleet-performance.schema.ts
// export type RadarDocument = RadarMetric & Document;

// @Schema()
// export class RadarMetric {
//   @Prop({ required: true, unique: true }) // Unique para no repetir "Velocidad"
//   subject: string; 

//   @Prop({ required: true })
//   A: number; // El puntaje actual

//   @Prop({ required: true, default: 150 })
//   fullMark: number;
// }

// export const RadarSchema = SchemaFactory.createForClass(RadarMetric);