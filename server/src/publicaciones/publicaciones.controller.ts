import { 
  Controller, Post, Body, UploadedFile, UseInterceptors, 
  Get, Delete, Param, Query, Req, HttpCode, HttpStatus, UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto';
import { getCloudinaryStorage } from '../utils/cloudinary.config'; 
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  // 1. Crear: POST /publicaciones (con imagen opcional)
  @Post()
  @UseGuards(JwtAuthGuard) // Protegemos esta ruta con JWT
  @UseInterceptors(FileInterceptor('imagen', {
    storage: getCloudinaryStorage('publicaciones'),  
  }))
  create(
    @Body() dto: CreatePublicacioneDto, 
    @UploadedFile() file: Express.Multer.File, 
    @Req() req: any
  ) {
    
    return this.publicacionesService.create(dto, file, req.user.id);
  }

  // 2. Listar: GET /publicaciones (con filtros y paginación)
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: any) {
    return this.publicacionesService.findAll(query);
  }

  // 3. Baja lógica: DELETE /publicaciones/:id
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.publicacionesService.remove(id, req.user.id, req.user.perfil);
  }

  // 4. Likes: POST /publicaciones/:id/like
  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  addLike(@Param('id') id: string, @Req() req: any) {
    return this.publicacionesService.addLike(id, req.user.id);
  }

  // 5. Quitar Like: DELETE /publicaciones/:id/like
  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  removeLike(@Param('id') id: string, @Req() req: any) {
    return this.publicacionesService.removeLike(id, req.user.id);
  }
}