import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('clientes')
@UseGuards(JwtAuthGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  async create(@Body() createClienteDto: CreateClienteDto) {
    return await this.clientesService.create(createClienteDto);
  }

  @Get()
  async findAll() {
    return await this.clientesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.clientesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClienteDto: Partial<CreateClienteDto>,
  ) {
    return await this.clientesService.update(id, updateClienteDto);
  }

  @Patch(':id/baja')
  async darDeBaja(@Param('id', ParseUUIDPipe) id: string) {
    return await this.clientesService.darDeBaja(id);
  }
}
