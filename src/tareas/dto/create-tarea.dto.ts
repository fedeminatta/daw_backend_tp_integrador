import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTareaDto {
  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsUUID()
  @IsNotEmpty()
  proyectoId!: string;
}
