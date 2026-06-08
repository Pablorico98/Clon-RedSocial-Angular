import { Controller, Post, Body, UploadedFile, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto'; 
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  @UseInterceptors(FileInterceptor('imagenPerfil', {
    storage: new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'perfiles', // Carpeta en Cloudinary
        format: async (req, file) => 'jpg',  
        public_id: (req, file) => `user_${Date.now()}`,
      } as any,
    }),
  }))
  registro(@Body() body: CreateUsuarioDto, @UploadedFile() file: Express.Multer.File) {
   
    return this.authService.registro(body, file);
  }
  
  @Post('login')
  @HttpCode(HttpStatus.OK)  
  login(@Body() body: LoginAuthDto) {
    return this.authService.login(body);
  }
}