import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TareasService } from './tareas.service';
import { TareasController } from './tareas.controller';
import { Tarea } from './entities/tarea.entity';
<<<<<<< HEAD
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Tarea])],
=======
import { Proyecto } from '../proyectos/entities/proyecto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tarea, Proyecto])],
>>>>>>> 57c2d112a50767aef4959b6b5aac610bfe19f530
  controllers: [TareasController],
  providers: [TareasService],
})
export class TareasModule {}
