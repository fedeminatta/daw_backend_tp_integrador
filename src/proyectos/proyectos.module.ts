import { Module } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { ProyectosController } from './proyectos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { ClientesModule } from '../clientes/clientes.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proyecto]),
    ClientesModule,
    UsuariosModule,
  ], // Asegurate de que tenga esto
  controllers: [ProyectosController],
  providers: [ProyectosService],
  exports: [TypeOrmModule],
})
export class ProyectosModule {}
