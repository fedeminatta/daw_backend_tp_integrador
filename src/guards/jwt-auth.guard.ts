/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extraerTokenDeCabecera(request);

    if (!token) {
      throw new UnauthorizedException('Token de autenticacion no encontrado');
    }

    try {
      // Validar el token con la clave secreta
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Adjuntar los datos del usuario a la peticion por si se necesitan mas adelante
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException(
        'Token de autenticacion invalido o expirado',
      );
    }

    return true;
  }

  private extraerTokenDeCabecera(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
