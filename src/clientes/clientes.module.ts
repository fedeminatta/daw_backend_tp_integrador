import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { Cliente } from './entities/cliente.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente]), UsuariosModule],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [ClientesService, TypeOrmModule],
})
export class ClientesModule {}
