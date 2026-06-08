import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePublicacioneDto {
  @IsNotEmpty()
  @IsString()
  titulo!: string;

  @IsNotEmpty()
  @IsString()
  mensaje!: string;

  @IsOptional()
  imagen?: string; 
}