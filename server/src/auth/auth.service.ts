import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-auth.dto'; 
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
    private jwtService: JwtService
  ) {}

async registro(datos: CreateUsuarioDto, archivo: Express.Multer.File) {
    const { nombreUsuario, correo, password } = datos;
    const existeUsuario = await this.usuarioModel.findOne({
      $or: [{ correo }, { nombreUsuario }]
    });
    if (existeUsuario) {
      throw new BadRequestException('El correo o nombre de usuario ya están en uso');
    }
    const hashedPassword = await bcrypt.hash(password, 10); 

    const imageUrl = archivo ? archivo.path : 'https://res.cloudinary.com/dki6gegsz/image/upload/q_auto/f_auto/v1780359436/default-avatar_ghcegh.jpg';
    
    const nuevoUsuario = new this.usuarioModel({
      ...datos,
      password: hashedPassword,
      imagenPerfil: imageUrl
    });
    await nuevoUsuario.save();    
    const payload = { sub: nuevoUsuario._id, email: nuevoUsuario.correo, perfil: nuevoUsuario.perfil };
    const token = this.jwtService.sign(payload);
    const usuarioObj = nuevoUsuario.toObject();
    const { password: _, ...usuarioLogueado } = usuarioObj;

    return { token, usuarioLogueado };
  }

  async login(credenciales: LoginAuthDto) {
      const { identificador, password } = credenciales;
      const usuario = await this.usuarioModel.findOne({
        $or: [{ correo: identificador }, { nombreUsuario: identificador }]
      });

      if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
        throw new UnauthorizedException('Credenciales incorrectas');
      }

      const payload = { sub: usuario._id, email: usuario.correo, perfil: usuario.perfil };
      const token = this.jwtService.sign(payload);

      const { password: _, ...usuarioLogueado } = usuario.toObject();
      return { token, usuarioLogueado };
    }


  async refreshToken(user: any) {
    const payload = { sub: user.id, email: user.email, perfil: user.perfil };
    return this.jwtService.sign(payload);
  }

  async obtenerPorId(id: string) {
    const usuario = await this.usuarioModel.findById(id).select('-password').lean();
    return usuario;
  }
}

  


