import { 
  Controller, Post, Body, UploadedFile, UseInterceptors, 
  HttpCode, HttpStatus, Res, UseGuards, Req 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';  
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { getCloudinaryStorage } from '../utils/cloudinary.config';
import { JwtAuthGuard } from './jwt-auth.guard'; 

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
  async login(@Body() body: LoginAuthDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.login(body);

    
    res.cookie('token', token, {
      httpOnly: true,     // Importante: No dejar en false. Mantiene el token seguro contra XSS.
      secure: false,      // false permite probar en localhost (http). Cambiar a true solo en deploy HTTPS.
      maxAge: 15 * 60 * 1000, // 15 minutos
      sameSite: 'lax',    // Estándar para evitar problemas de CORS en peticiones POST
      path: '/'           // La cookie debe estar disponible en toda la aplicación
    });
    
  
    return { mensaje: 'Login exitoso' };
  }

  @Post('autorizar')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  autorizar(@Req() req: any) {
     
    return req.user;
  }

  @Post('refrescar')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refrescar(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const newToken = await this.authService.refreshToken(req.user);
    
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
      sameSite: 'none',
      path: '/'
    });
    
    return { mensaje: 'Token refrescado' };
  }
}