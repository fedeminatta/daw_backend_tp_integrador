import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Proyecto, ProyectoEstado } from './entities/proyecto.entity';
import { Cliente, ClienteEstado } from '../clientes/entities/cliente.entity';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createProyectoDto: CreateProyectoDto): Promise<Proyecto> {
    const { clienteId, ...proyectoData } = createProyectoDto;
    const nuevoProyecto = this.proyectoRepository.create(
      proyectoData as Partial<Proyecto>,
    );

    //Validar cliente (Activo o Nulo)
    if (clienteId) {
      const cliente = await this.clienteRepository.findOne({
        where: { id: clienteId },
      });
      if (!cliente) {
        throw new NotFoundException(
          `Cliente con ID ${clienteId} no encontrado`,
        );
      }
      if (cliente.estado !== ClienteEstado.ACTIVO) {
        throw new BadRequestException(
          'Solo se puede asignar un cliente si su estado es "Activo"',
        );
      }
      nuevoProyecto.cliente = cliente;
    } else {
      nuevoProyecto.cliente = null;
    }

    try {
      return await this.proyectoRepository.save(nuevoProyecto);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al crear el proyecto');
    }
  }

  async findAll(): Promise<Proyecto[]> {
    return this.proyectoRepository.find({ relations: ['cliente', 'tareas'] });
  }

  async findOne(id: string): Promise<Proyecto> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id },
      relations: ['cliente', 'tareas'],
    });
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }
    return proyecto;
  }

  async update(
    id: string,
    updateProyectoDto: UpdateProyectoDto,
  ): Promise<Proyecto> {
    const proyecto = await this.findOne(id);
    const { clienteId, ...updateData } = updateProyectoDto;

    Object.assign(proyecto, updateData);

    //
    if (clienteId !== undefined) {
      if (clienteId === null) {
        proyecto.cliente = null;
      } else {
        const cliente = await this.clienteRepository.findOne({
          where: { id: clienteId },
        });
        if (!cliente) {
          throw new NotFoundException(
            `Cliente con ID ${clienteId} no encontrado`,
          );
        }
        if (cliente.estado !== ClienteEstado.ACTIVO) {
          throw new BadRequestException(
            'Solo se puede asignar un cliente si su estado es "Activo"',
          );
        }
        proyecto.cliente = cliente;
      }
    }

    try {
      return await this.proyectoRepository.save(proyecto);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al actualziar el proyecto');
    }
  }

  async darDeBaja(id: string): Promise<Proyecto> {
    const proyecto = await this.findOne(id);
    if (proyecto.estado === ProyectoEstado.BAJA) {
      throw new BadRequestException('El proyecto ya se encuentra dado de baja');
    }

    proyecto.estado = ProyectoEstado.BAJA;

    try {
      return await this.proyectoRepository.save(proyecto);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al dar de baja el proyecto',
      );
    }
  }

  async remove(id: string) {
    const proyecto = await this.proyectoRepository.findOne({ where: { id } });

    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }

    // Retornar la eliminacion
    return await this.proyectoRepository.remove(proyecto);
  }
}
