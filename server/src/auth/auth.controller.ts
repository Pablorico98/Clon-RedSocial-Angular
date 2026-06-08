// server/src/auth/auth.controller.ts
import { Controller, Post, Body, UploadedFile, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { getCloudinaryStorage } from '../utils/cloudinary.config';  

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  @UseInterceptors(FileInterceptor('imagenPerfil', {
    storage: getCloudinaryStorage('perfiles'),
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