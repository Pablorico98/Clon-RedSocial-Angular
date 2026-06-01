import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty({ message: 'El identificador (correo o usuario) es obligatorio' })
  identificador!: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password! : string;
}