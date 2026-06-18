import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('estadisticas')
@UseGuards(JwtAuthGuard, AdminGuard)
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('publicaciones-por-usuario')
  publicacionesPorUsuario(@Query('desde') desde: string, @Query('hasta') hasta: string) {
    return this.estadisticasService.publicacionesPorUsuario(desde, hasta);
  }

  @Get('comentarios-por-tiempo')
  comentariosPorTiempo(@Query('desde') desde: string, @Query('hasta') hasta: string) {
    return this.estadisticasService.comentariosPorTiempo(desde, hasta);
  }

  @Get('comentarios-por-publicacion')
  comentariosPorPublicacion(@Query('desde') desde: string, @Query('hasta') hasta: string) {
    return this.estadisticasService.comentariosPorPublicacion(desde, hasta);
  }
}
