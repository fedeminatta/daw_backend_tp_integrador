import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Tarea } from '../../tareas/entities/tarea.entity';

export enum ProyectoEstado {
  ACTIVO = 'Activo',
  FINALIZADO = 'Finalizado',
  BAJA = 'Baja',
}

@Entity('proyectos')
export class Proyecto {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  nombre!: string;

  @Column({
    type: 'enum',
    enum: ProyectoEstado,
    default: ProyectoEstado.ACTIVO,
  })
  estado!: ProyectoEstado;

  //Un proyecto puede ser internmo
  @ManyToOne(() => Cliente, (cliente) => cliente.proyectos, { nullable: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente!: Cliente | null;

  @OneToMany(() => Tarea, (tarea) => tarea.proyecto)
  tareas!: Tarea[];
}
