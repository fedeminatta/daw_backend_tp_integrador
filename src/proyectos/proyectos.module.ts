import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectosService } from './proyectos.service';
import { ProyectosController } from './proyectos.controller';
import { Proyecto } from './entities/proyecto.entity';
<<<<<<< HEAD
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto])],
=======
import { Cliente } from '../clientes/entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto, Cliente])],
>>>>>>> 57c2d112a50767aef4959b6b5aac610bfe19f530
  controllers: [ProyectosController],
  providers: [ProyectosService],
})
export class ProyectosModule {}
