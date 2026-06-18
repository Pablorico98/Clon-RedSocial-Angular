import { IsEmail, IsNotEmpty, MinLength, IsString, IsIn, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @IsNotEmpty()
  @IsString()
  apellido!: string;

  @IsEmail()
  correo!: string;

  @IsNotEmpty()
  @IsString()
  nombreUsuario!: string;

  @MinLength(8)
  @IsString()
  password!: string;

  @IsNotEmpty()
  fechaNacimiento!: string;

  @IsOptional()
  @IsString()
  descripcionBreve?: string;

  @IsOptional()
  @IsIn(['usuario', 'administrador'])
  perfil?: string;
}
