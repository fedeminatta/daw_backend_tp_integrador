import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
export enum UsuarioEstado {
  ACTIVO = 'Activo',
  BAJA = 'Baja',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombreUsuario!: string;

  @Column({ type: 'varchar', length: 255 })
  clave!: string;

  @Column({ type: 'enum', enum: UsuarioEstado, default: UsuarioEstado.ACTIVO })
  estado!: UsuarioEstado;
}
