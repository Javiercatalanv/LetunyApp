import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { EventosService } from './eventos.service';

@Controller('eventos')
export class EventosController {
  constructor(private readonly service: EventosService) {}

  // 🔹 Registrar un evento
  @Post()
  registrar(@Body() body) {
    return this.service.registrarEvento(body);
  }

  // 🔹 Listar todos los eventos
  @Get()
  getAll() {
    return this.service.findAll();
  }

  // 🔹 Listar eventos de un partido específico
  @Get('partido/:partidoId')
  getByPartido(@Param('partidoId') partidoId: number) {
    return this.service.findByPartido(partidoId);
  }

  // 🔹 Eliminar un evento
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
