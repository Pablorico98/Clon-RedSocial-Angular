import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Usuario extends Document {
  @Prop({ required: true })
  nombre!: string;

  @Prop({ required: true })
  apellido!: string;

  @Prop({ required: true, unique: true })
  correo!: string; 

  @Prop({ required: true, unique: true })
  nombreUsuario!: string;  

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  fechaNacimiento!: Date;

  @Prop({ required: false })
  descripcionBreve?: string;

  @Prop({ required: false })
  imagenPerfil?: string;  

  @Prop({ default: 'usuario', enum: ['usuario', 'administrador'] })
  perfil!: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);