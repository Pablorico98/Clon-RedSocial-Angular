import { IsEmail, IsNotEmpty, MinLength, IsString, IsDateString } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  nombreUsuario!: string;

  @IsEmail()
  correo!: string;

  @MinLength(8)
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @IsNotEmpty()
  @IsString()
  apellido!: string;

  @IsNotEmpty()
  fechaNacimiento!: string;  

  @IsNotEmpty()
  @IsString()
  descripcion!: string;
}