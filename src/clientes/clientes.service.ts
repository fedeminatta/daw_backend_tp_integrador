import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { Cliente, ClienteEstado } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    const nuevoCliente = this.clienteRepository.create({
      ...createClienteDto,  
      estado: ClienteEstado.ACTIVO,
    });
    return await this.clienteRepository.save(nuevoCliente);
  }

  async findAll() {
    return await this.clienteRepository.find({
      relations: ['proyectos'],
    });
  }

  async findOne(id: string) {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: ['proyectos'],
    });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  async update(
    id: string,
    updateClienteDto: Partial<CreateClienteDto>,
  ): Promise<Cliente> {
    const cliente = await this.findOne(id);
    Object.assign(cliente, updateClienteDto);

    try {
      return await this.clienteRepository.save(cliente);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar el cliente');
    }
  }

  async darDeBaja(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: ['proyectos'],
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    if (cliente.estado === ClienteEstado.BAJA) {
      throw new BadRequestException('El cliente ya se encuentra dado de baja');
    }

    // Validar regla de negocio antes de la baja logica
    if (cliente.proyectos && cliente.proyectos.length > 0) {
      throw new BadRequestException(
        'No se puede dar de baja el cliente porque tiene proyectos asociados',
      );
    }

    cliente.estado = ClienteEstado.BAJA;

    try {
      return await this.clienteRepository.save(cliente);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al dar de baja al cliente');
    }
  }
}
