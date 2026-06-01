import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';

export enum TareaEstado {
  PENDIENTE = 'Pendiente',
  FINALIZADO = 'Finalizado',
  BAJA = 'Baja',
}

@Entity('tareas')
export class Tarea {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column({ type: 'enum', enum: TareaEstado, default: TareaEstado.PENDIENTE })
  estado!: TareaEstado;

  //La tarea requiere estrictamente perteneceer a un proyecto
  @ManyToOne(() => Proyecto, (proyecto) => proyecto.tareas, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto!: Proyecto;
}
