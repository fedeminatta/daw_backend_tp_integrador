import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateProyectoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre!: string | null;

  @IsOptional()
  @IsUUID()
  clienteId?: string | null;
}
