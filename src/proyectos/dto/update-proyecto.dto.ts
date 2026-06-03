import { PartialType } from '@nestjs/swagger';
import { CreateProyectoDto } from './create-proyecto.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ProyectoEstado } from '../entities/proyecto.entity';

export class UpdateProyectoDto extends PartialType(CreateProyectoDto) {
  @IsOptional()
  @IsEnum(ProyectoEstado)
  estado?: ProyectoEstado;
}
