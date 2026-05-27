import { Controller, Post, Body, UploadedFile, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  @UseInterceptors(FileInterceptor('imagenPerfil', {
    storage: diskStorage({
      destination: './uploads', // Guarda el archivo en la carpeta que creamos
      filename: (req, file, cb) => {
        // Le generamos un nombre único para que no se pisen si se llaman igual
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      }
    })
  }))
  registro(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this.authService.registro(body, file);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // Por defecto POST devuelve 201, pero un login correcto devuelve 200 (OK)
  login(@Body() body: any) {
    return this.authService.login(body);
  }
}