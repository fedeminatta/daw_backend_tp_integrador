import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre!: string;
}
