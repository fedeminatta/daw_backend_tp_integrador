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

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    try {
      const nuevoCliente = this.clienteRepository.create(createClienteDto);
      return await this.clienteRepository.save(nuevoCliente);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al crear el cliente');
    }
  }

  async findAll(): Promise<Cliente[]> {
    return await this.clienteRepository.find();
  }

  async findOne(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({ where: { id } });
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
    //Se carga el cliente con su relacion de proyectos para validar la regla del negocio
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: ['proyectos'],
    });

    if (!cliente) {
      throw new NotFoundException('Cliente con ID ${id} no encontrado');
    }

    if ((cliente.estado as ClienteEstado) === ClienteEstado.BAJA) {
      throw new BadRequestException('El cliente ya se encuentra dado de baja');
    }

    //Solo se puede dar de baja si no se encuentra registrado en ningun proyecto
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
