import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Publicacion } from './entities/publicacione.entity';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name) private publicacionModel: Model<Publicacion>,
  ) {}

  async create(dto: CreatePublicacioneDto, file: Express.Multer.File, autorId: string) {
    const nuevaPublicacion = new this.publicacionModel({
      ...dto,
      autor: new Types.ObjectId(autorId),
      imagen: file ? file.path : null,  
    });
    return await nuevaPublicacion.save();
  }

  async findAll(query: any) {
    const { orden, usuarioId, offset = 0, limit = 10 } = query;
    const filter: any = { activo: true };

    if (usuarioId) filter.autor = new Types.ObjectId(usuarioId);

   
    let sortOptions: any = { createdAt: -1 };  
    if (orden === 'likes') sortOptions = { 'likes.length': -1 };
    if (orden === 'fecha') sortOptions = { createdAt: -1 };

    return await this.publicacionModel
      .find(filter)
      .sort(sortOptions)
      .skip(Number(offset))
      .limit(Number(limit))
      .populate('autor', 'nombre nombreUsuario')  
      .exec();
  }

  async remove(id: string, userId: string) {
    const publicacion = await this.publicacionModel.findById(id);
    if (!publicacion) throw new NotFoundException('Publicación no encontrada');

    if (publicacion.autor.toString() !== userId) {
      throw new UnauthorizedException('No tienes permiso para borrar esto');
    }

    return await this.publicacionModel.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true },
    );
  }

  async addLike(id: string, userId: string) {
    return await this.publicacionModel.findByIdAndUpdate(
      id,
      { $addToSet: { likes: new Types.ObjectId(userId) } },
      { new: true },
    );
  }

  async removeLike(id: string, userId: string) {
    return await this.publicacionModel.findByIdAndUpdate(
      id,
      { $pull: { likes: new Types.ObjectId(userId) } },
      { new: true },
    );
  }
}