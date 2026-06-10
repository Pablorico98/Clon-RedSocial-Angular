import { 
  Controller, Post, Body, Get, Put, Param, Query, 
  UseGuards, Req, HttpCode, HttpStatus 
} from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateComentarioDto } from './dto/create-comentario.dto'; 


@Controller('publicaciones/:pubId/comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  // POST: Agregar nuevo comentario
  @Post()
  @UseGuards(JwtAuthGuard)
  crear(@Param('pubId') pubId: string, @Body() dto: CreateComentarioDto, @Req() req: any) {
    return this.comentariosService.crear(pubId, req.user.id, dto.texto);
  }

  // GET: Traer comentarios paginados y ordenados
  @Get()
  listar(
    @Param('pubId') pubId: string, 
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.comentariosService.buscarPorPublicacion(pubId, Number(page), Number(limit));
  }

  // PUT: Modificar mensaje
  @Put(':comentarioId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  modificar(
    @Param('comentarioId') comentarioId: string, 
    @Body() dto: CreateComentarioDto, 
    @Req() req: any
  ) {
    return this.comentariosService.actualizar(comentarioId, req.user.id, dto.texto);
  }
}