import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from './entities/tarea.entity';
import { Proyecto } from '../proyectos/entities/proyecto.entity';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
  ) {}

  async create(createTareaDto: CreateTareaDto): Promise<Tarea> {
    const { proyectoId, descripcion } = createTareaDto;

    //La tarea debe pertenecer a un proyecto ya creado
    const proyecto = await this.proyectoRepository.findOne({
      where: { id: proyectoId },
    });

    if (!proyecto) {
      throw new NotFoundException(`
        Proyecto con ID ${proyectoId} no encontrado`);
    }

    const nuevaTarea = this.tareaRepository.create({
      descripcion,
      proyecto,
    });

    try {
      return await this.tareaRepository.save(nuevaTarea);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Errro al crear la tarea');
    }
  }

  async findAll(): Promise<Tarea[]> {
    return await this.tareaRepository.find({ relations: ['proyecto'] });
  }

  async findOne(id: string): Promise<Tarea> {
    const tarea = await this.tareaRepository.findOne({
      where: { id },
      relations: ['proyecto'],
    });

    if (!tarea) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }
    return tarea;
  }

  async update(id: string, updateTareaDto: UpdateTareaDto): Promise<Tarea> {
    const tarea = await this.findOne(id);
    const { proyectoId, descripcion, estado } = updateTareaDto;

    if (descripcion) tarea.descripcion = descripcion;
    if (estado) tarea.estado = estado;

    //Si se envia un nuevo proyectoId se tiene que verificar que veriicar que exista antes de reasignar
    if (proyectoId) {
      const proyecto = await this.proyectoRepository.findOne({
        where: { id: proyectoId },
      });
      if (!proyecto) {
        throw new NotFoundException(`
          Proyecto con ID ${proyectoId} no encontrado`);
      }
      tarea.proyecto = proyecto;
    }

    try {
      return await this.tareaRepository.save(tarea);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar la tarea');
    }
  }

  //Eliminacion de tareas

  async remove(id: string): Promise<void> {
    const tarea = await this.findOne(id);
    try {
      await this.tareaRepository.remove(tarea);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al eliminar la tarea');
    }
  }
}
