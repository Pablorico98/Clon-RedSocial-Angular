import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
  ) {}

  async listar() {
    return this.usuarioModel.find().select('-password').lean();
  }

  async crear(dto: CreateUsuarioDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const nuevo = new this.usuarioModel({
      ...dto,
      password: hashedPassword,
      perfil: dto.perfil ?? 'usuario',
      imagenPerfil: 'https://res.cloudinary.com/dki6gegsz/image/upload/q_auto/f_auto/v1780359436/default-avatar_ghcegh.jpg',
    });
    const guardado = await nuevo.save();
    const { password: _, ...resultado } = guardado.toObject();
    return resultado;
  }

  async deshabilitar(id: string) {
    const usuario = await this.usuarioModel.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true },
    ).select('-password');
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async habilitar(id: string) {
    const usuario = await this.usuarioModel.findByIdAndUpdate(
      id,
      { activo: true },
      { new: true },
    ).select('-password');
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }
}
