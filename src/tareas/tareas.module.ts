import { Module } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { TareasController } from './tareas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarea } from './entities/tarea.entity';
import { ProyectosModule } from '../proyectos/proyectos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tarea]), ProyectosModule], // Asegurate de que tenga esto
  controllers: [TareasController],
  providers: [TareasService],
  exports: [TareasService, TypeOrmModule],
})
export class TareasModule {}
