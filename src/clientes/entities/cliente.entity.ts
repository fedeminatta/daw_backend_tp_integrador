import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';

export enum ClienteEstado {
  ACTIVO = 'Activo',
  BAJA = 'Baja',
}

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  nombre!: string;

  @Column({ type: 'enum', enum: ClienteEstado, default: ClienteEstado.ACTIVO })
  estado!: ClienteEstado;

  @OneToMany(() => Proyecto, (proyecto) => proyecto.cliente)
  proyectos!: Proyecto[];
}
