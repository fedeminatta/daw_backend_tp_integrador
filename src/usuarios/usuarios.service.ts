import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, UsuarioEstado } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async onModuleInit() {
    await this.crearUsuarioPorDefecto();
  }

  private async crearUsuarioPorDefecto() {
    // ver si existe algun usuario en la base de datos
    const cantidadUsuarios = await this.usuarioRepository.count();

    if (cantidadUsuarios === 0) {
      console.log('No se encontraron usuarios. Creando usuario por defecto...');

      const usuarioAdmin = this.usuarioRepository.create({
        nombreUsuario: 'admin',
        clave: 'admin123',
        estado: UsuarioEstado.ACTIVO,
      });

      await this.usuarioRepository.save(usuarioAdmin);
      console.log(
        '✅ Usuario por defecto creado con éxito -> Usuario: admin | Clave: admin123',
      );
    } else {
      console.log('ℹ️ La base de datos ya tiene usuarios cargados.');
    }
  }

  create(createUsuarioDto: CreateUsuarioDto) {
    return 'This action adds a new usuario';
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
