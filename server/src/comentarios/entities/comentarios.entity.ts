import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comentario extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Publicacion', required: true })
  publicacion!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario!: Types.ObjectId;

  @Prop({ required: true })
  texto!: string;

  @Prop({ default: false })
  modificado!: boolean;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);