import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class LoginUsuarioDto {
 @ApiProperty({ example:'admin' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  nombreUsuario!: string;

  @ApiProperty({ example:'admin123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(72)
  clave!: string;
}
