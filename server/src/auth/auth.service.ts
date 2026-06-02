import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-auth.dto'; 
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>
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
    const usuarioObj = nuevoUsuario.toObject();
    const { password: _, ...usuarioGuardado } = usuarioObj;

    return {
      mensaje: 'Usuario registrado exitosamente',
      usuario: usuarioGuardado
    };
  }

  async login(credenciales: LoginAuthDto) {
    const { identificador, password } = credenciales; 
    const usuario = await this.usuarioModel.findOne({
      $or: [{ correo: identificador }, { nombreUsuario: identificador }]
    });
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const usuarioObj = usuario.toObject();
    const { password: _, ...usuarioData } = usuarioObj;

    return {
      mensaje: 'Login exitoso',
      usuario: usuarioData
    };
  }
}