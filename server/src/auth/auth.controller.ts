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
    const { token, usuarioLogueado } = await this.authService.login(body);
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      maxAge: 15 * 60 * 1000,
      sameSite: isProd ? 'none' : 'lax',
      path: '/'
    });

    return usuarioLogueado;
  }

  @Post('autorizar')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async autorizar(@Req() req: any) {
    return this.authService.obtenerPorId(req.user.id);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/'
    });
    return { mensaje: 'Sesión cerrada' };
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