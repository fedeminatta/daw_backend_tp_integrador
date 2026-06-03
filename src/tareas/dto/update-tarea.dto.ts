import { PartialType } from '@nestjs/swagger';
import { CreateTareaDto } from './create-tarea.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { TareaEstado } from '../entities/tarea.entity';

export class UpdateTareaDto extends PartialType(CreateTareaDto) {
  @IsOptional()
  @IsEnum(TareaEstado)
  estado?: TareaEstado;
}
