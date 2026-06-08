import { 
  Controller, Post, Body, UploadedFile, UseInterceptors, 
  Get, Delete, Param, Query, Req, HttpCode, HttpStatus 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto';
import { getCloudinaryStorage } from '../utils/cloudinary.config'; 

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  // 1. Crear: POST /publicaciones (con imagen opcional)
  @Post()
  @UseInterceptors(FileInterceptor('imagen', {
    storage: getCloudinaryStorage('publicaciones'),  
  }))
  create(
    @Body() dto: CreatePublicacioneDto, 
    @UploadedFile() file: Express.Multer.File, 
    @Req() req: any
  ) {
    // Nota: req.user.id vendrá del token cuando implemente el Guard en el Sprint 3
    // Por ahora, usamos un ID de usuario mock para probar la funcionalidad
    return this.publicacionesService.create(dto, file, "6a1637a948974b36ded30ca2");
  }

  // 2. Listar: GET /publicaciones (con filtros y paginación)
  @Get()
  findAll(@Query() query: any) {
    return this.publicacionesService.findAll(query);
  }

  // 3. Baja lógica: DELETE /publicaciones/:id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.publicacionesService.remove(id, "6a1637a948974b36ded30ca2");
  }

  // 4. Likes: POST /publicaciones/:id/like
  @Post(':id/like')
  addLike(@Param('id') id: string, @Req() req: any) {
    return this.publicacionesService.addLike(id, "6a1637a948974b36ded30ca2");
  }

  // 5. Quitar Like: DELETE /publicaciones/:id/like
  @Delete(':id/like')
  removeLike(@Param('id') id: string, @Req() req: any) {
    return this.publicacionesService.removeLike(id, "6a1637a948974b36ded30ca2");
  }
}