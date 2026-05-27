import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true }) // Agrega createdAt y updatedAt automáticamente
export class Publicacion extends Document {
  @Prop({ required: true })
  titulo!: string;

  @Prop({ required: true })
  mensaje!: string;

  @Prop({ required: false })
  imagen?: string; // Usamos el '?' porque es opcional

  // Relación con el Usuario que crea el post
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  autor!: Types.ObjectId;

  // Array de IDs de usuarios que le dieron "Me gusta"
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Usuario' }], default: [] })
  likes!: Types.ObjectId[];

  // Los comentarios los guardamos como un array de objetos dentro de la publicación
  @Prop({
    type: [
      {
        usuario: { type: Types.ObjectId, ref: 'Usuario', required: true },
        texto: { type: String, required: true },
        fecha: { type: Date, default: Date.now }
      }
    ],
    default: []
  })
  comentarios!: any[];
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);