import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, UsuarioEstado } from './entities/usuario.entity';
import { LoginUsuarioDto } from './dto/login-usuario-dto';
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsuariosService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    await this.crearUsuarioPorDefecto();
  }

  private async crearUsuarioPorDefecto() {
    const cantidadUsuarios = await this.usuarioRepository.count();

    if (cantidadUsuarios === 0) {
      console.log('No se encontraron usuarios. Creando usuario por defecto...');

      const salt = await bcrypt.genSalt(10);
      const claveEncriptada = await bcrypt.hash('admin123', salt);

      const usuarioAdmin = this.usuarioRepository.create({
        nombreUsuario: 'admin',
        clave: claveEncriptada,
        estado: UsuarioEstado.ACTIVO,
      });

      await this.usuarioRepository.save(usuarioAdmin);
      console.log(
        'Usuario por defecto creado con exito (Clave encriptada en BD)',
      );
    }
  }

  async login(loginDto: LoginUsuarioDto) {
    const { nombreUsuario, clave } = loginDto;

    const usuario = await this.usuarioRepository.findOne({
      where: { nombreUsuario, estado: UsuarioEstado.ACTIVO },
    });

    if (!usuario) {
      throw new UnauthorizedException(
        'Credenciales incorrectas o usuario inactivo',
      );
    }

    const claveValida = await bcrypt.compare(clave, usuario.clave);
    if (!claveValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = {
      sub: usuario.id,
      nombreUsuario: usuario.nombreUsuario,
    };

    return {
      id: usuario.id,
      nombreUsuario: usuario.nombreUsuario,
      token: this.jwtService.sign(payload),
    };
  }

  // Crear nuevo usuario con clave encriptada
  async create(createUsuarioDto: CreateUsuarioDto) {
    const { nombreUsuario, clave } = createUsuarioDto;

    const existe = await this.usuarioRepository.findOne({
      where: { nombreUsuario },
    });
    if (existe) {
      throw new BadRequestException('El nombre de usuario ya existe');
    }

    const salt = await bcrypt.genSalt(10);
    const claveEncriptada = await bcrypt.hash(clave, salt);

    const nuevoUsuario = this.usuarioRepository.create({
      nombreUsuario,
      clave: claveEncriptada,
      estado: UsuarioEstado.ACTIVO,
    });

    try {
      const guardado = await this.usuarioRepository.save(nuevoUsuario);
      return {
        id: guardado.id,
        nombreUsuario: guardado.nombreUsuario,
        estado: guardado.estado,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  // Listar todos los usuarios
  async findAll() {
    return await this.usuarioRepository.find({
      select: ['id', 'nombreUsuario', 'estado'], // Excluir las claves por seguridad
    });
  }

  // Buscar un usuario por su ID
  async findOne(id: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      select: ['id', 'nombreUsuario', 'estado'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  // Actualizar nombre de usuario o clave
  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (updateUsuarioDto.nombreUsuario) {
      usuario.nombreUsuario = updateUsuarioDto.nombreUsuario;
    }

    if (updateUsuarioDto.clave) {
      const salt = await bcrypt.genSalt(10);
      usuario.clave = await bcrypt.hash(updateUsuarioDto.clave, salt);
    }

    try {
      const actualizado = await this.usuarioRepository.save(usuario);
      return {
        id: actualizado.id,
        nombreUsuario: actualizado.nombreUsuario,
        estado: actualizado.estado,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  // Baja logica de usuario
  async remove(id: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (usuario.nombreUsuario === 'admin') {
      throw new BadRequestException(
        'No se puede dar de baja al usuario administrador por defecto',
      );
    }

    usuario.estado = UsuarioEstado.BAJA;

    try {
      await this.usuarioRepository.save(usuario);
      return {
        message: `Usuario ${usuario.nombreUsuario} dado de baja correctamente`,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al dar de baja al usuario');
    }
  }
}
