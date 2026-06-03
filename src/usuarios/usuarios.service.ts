import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, UsuarioEstado } from './entities/usuario.entity';
import { LoginUsuarioDto } from './dto/login-usuario-dto';
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

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
    const cantidadUsuarios = await this.usuarioRepository.count();

    if (cantidadUsuarios === 0) {
      console.log('No se encontraron usuarios. Creando usuario por defecto...');

      // Encriptar la clave antes de guardarla
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

    // 1. Buscar usuario por su nombre y que estr ACTIVO
    const usuario = await this.usuarioRepository.findOne({
      where: { nombreUsuario, estado: UsuarioEstado.ACTIVO },
    });

    // 2. Si no existe dar error de no autorizado
    if (!usuario) {
      throw new UnauthorizedException(
        'Credenciales incorrectas o usuario inactivo',
      );
    }

    // 3. Comparar la clave que viene del front con el hash de la BD
    const claveValida = await bcrypt.compare(clave, usuario.clave);

    if (!claveValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return {
      id: usuario.id,
      nombreUsuario: usuario.nombreUsuario,
      estado: usuario.estado,
      mensaje: 'Login exitoso',
    };
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
