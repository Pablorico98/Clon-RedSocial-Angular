import { Controller, Post, Body, UploadedFile, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto'; 

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  @UseInterceptors(FileInterceptor('imagenPerfil', {
    storage: diskStorage({
      destination: './uploads',  
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      }
    })
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