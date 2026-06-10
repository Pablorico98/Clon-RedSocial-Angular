import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comentario, ComentarioSchema } from './entities/comentarios.entity';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comentario.name, schema: ComentarioSchema }])
  ],
  controllers: [ComentariosController],
  providers: [ComentariosService],
  exports: [ComentariosService]  
})
export class ComentariosModule {}