import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';

@Module({
  imports: [UsuariosModule, PublicacionesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
