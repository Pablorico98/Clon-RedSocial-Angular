import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicacion } from '../publicaciones/entities/publicaciones.entity';
import { Comentario } from '../comentarios/entities/comentarios.entity';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel(Publicacion.name) private publicacionModel: Model<Publicacion>,
    @InjectModel(Comentario.name) private comentarioModel: Model<Comentario>,
  ) {}

  private buildFiltroFecha(desde: string, hasta: string) {
    const filtro: any = {};
    if (desde) filtro.$gte = new Date(`${desde}T00:00:00.000Z`);
    if (hasta) filtro.$lte = new Date(`${hasta}T23:59:59.999Z`);
    return filtro;
  }

  async publicacionesPorUsuario(desde: string, hasta: string) {
    const filtroFecha = this.buildFiltroFecha(desde, hasta);

    return this.publicacionModel.aggregate([
      {
        $match: {
          activo: true,
          ...(desde || hasta ? { createdAt: filtroFecha } : {}),
        },
      },
      { $group: { _id: '$autor', total: { $sum: 1 } } },
      {
        $lookup: {
          from: 'usuarios',
          localField: '_id',
          foreignField: '_id',
          as: 'autor',
        },
      },
      { $unwind: '$autor' },
      {
        $project: {
          _id: 0,
          label: '$autor.nombreUsuario',
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);
  }

  async comentariosPorTiempo(desde: string, hasta: string) {
    const filtroFecha = this.buildFiltroFecha(desde, hasta);

    return this.comentarioModel.aggregate([
      {
        $match: {
          ...(desde || hasta ? { createdAt: filtroFecha } : {}),
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: 1 },
        },
      },
      { $project: { _id: 0, label: '$_id', total: 1 } },
      { $sort: { label: 1 } },
    ]);
  }

  async comentariosPorPublicacion(desde: string, hasta: string) {
    const filtroFecha = this.buildFiltroFecha(desde, hasta);

    return this.comentarioModel.aggregate([
      {
        $match: {
          ...(desde || hasta ? { createdAt: filtroFecha } : {}),
        },
      },
      { $group: { _id: '$publicacion', total: { $sum: 1 } } },
      {
        $lookup: {
          from: 'publicacions',
          localField: '_id',
          foreignField: '_id',
          as: 'publicacion',
        },
      },
      { $unwind: '$publicacion' },
      {
        $project: {
          _id: 0,
          label: '$publicacion.titulo',
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);
  }
}
