import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('tareas')
@UseGuards(JwtAuthGuard)
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  create(@Body() createTareaDto: CreateTareaDto) {
    return this.tareasService.create(createTareaDto);
  }

  @Get()
  findAll() {
    return this.tareasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tareasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTareaDto: UpdateTareaDto,
  ) {
    return this.tareasService.update(id, updateTareaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tareasService.remove(id);
  }
}
