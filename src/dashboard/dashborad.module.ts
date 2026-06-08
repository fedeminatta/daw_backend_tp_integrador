import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Tarea } from '../tareas/entities/tarea.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Proyecto } from '../proyectos/entities/proyecto.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';


@Module({
    imports:[
    TypeOrmModule.forFeature([Proyecto, Cliente, Tarea, Usuario]),
    UsuariosModule,],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboradModule {}
