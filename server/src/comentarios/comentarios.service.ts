import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comentario } from './entities/comentarios.entity';

@Injectable()
export class ComentariosService {
  constructor(@InjectModel(Comentario.name) private comentarioModel: Model<Comentario>) {}

  async crear(pubId: string, userId: string, texto: string) {
    return await this.comentarioModel.create({
      publicacion: new Types.ObjectId(pubId),
      usuario: new Types.ObjectId(userId),
      texto,
      modificado: false
    });
  }

  async buscarPorPublicacion(pubId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return await this.comentarioModel
      .find({ publicacion: new Types.ObjectId(pubId.trim()) })
      .sort({ createdAt: -1 })  
      .skip(skip)
      .limit(limit)
      .populate('usuario', 'nombreUsuario imagenPerfil');  
  }

async actualizar(id: string, userId: string, nuevoTexto: string) {
  const cleanId = id.trim();
  const comentarioExistente = await this.comentarioModel.findById(cleanId);
  if (!comentarioExistente) {
    throw new NotFoundException(`No existe comentario con ID: ${cleanId}`);
  }
  if (comentarioExistente.usuario.toString() !== userId.toString()) {
    throw new NotFoundException('No autorizado: Este comentario no te pertenece');
  }

  return await this.comentarioModel.findByIdAndUpdate(
    cleanId,
    { $set: { texto: nuevoTexto, modificado: true } },
    { returnDocument: 'after' }
  );
}
}