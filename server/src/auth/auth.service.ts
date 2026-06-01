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

    // 2. Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Armar el objeto a guardar, incluyendo la ruta de la imagen
    const nuevoUsuario = new this.usuarioModel({
      ...datos,
      password: hashedPassword,
      imagenPerfil: archivo ? `uploads/${archivo.filename}` : 'uploads/default-avatar.jpg'
    });

    await nuevoUsuario.save();

    // 4. Convertimos a objeto y extraemos el password limpiamente usando desestructuración
    const usuarioObj = nuevoUsuario.toObject();
    const { password: _, ...usuarioGuardado } = usuarioObj;

    return {
      mensaje: 'Usuario registrado exitosamente',
      usuario: usuarioGuardado
    };
  }

  async login(credenciales: LoginAuthDto) {
    const { identificador, password } = credenciales; 

    if (!identificador || !password) {
      throw new BadRequestException('Debe enviar identificador y password');
    }

    // 1. Buscar en la base de datos por correo O por nombreUsuario
    const usuario = await this.usuarioModel.findOne({
      $or: [{ correo: identificador }, { nombreUsuario: identificador }]
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Comparar la contraseña enviada con la encriptada
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. Convertimos a objeto y extraemos el password limpiamente
    const usuarioObj = usuario.toObject();
    const { password: _, ...usuarioData } = usuarioObj;

    return {
      mensaje: 'Login exitoso',
      usuario: usuarioData
    };
  }
}