import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })  
export class Publicacion extends Document {
  @Prop({ required: true })
  titulo!: string;

  @Prop({ required: true })
  mensaje!: string;

  @Prop({ required: false })
  imagen?: string;  
   
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  autor!: Types.ObjectId;
  
  @Prop({ default: true })
  activo!: boolean;  

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Usuario' }], default: [] })
  likes!: Types.ObjectId[];

  
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);