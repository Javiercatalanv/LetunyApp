import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';

@Controller('jugadores')
export class JugadoresController {
  constructor(private readonly service: JugadoresService) {}

  // Listar todos los jugadores
  @Get()
  getAll() {
    return this.service.findAll();
  }

  // Listar jugadores de un partido específico
  @Get('partido/:partidoId')
  getByPartido(@Param('partidoId') partidoId: number) {
    return this.service.findByPartido(partidoId);
  }

  // Obtener un jugador por ID
  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  // Crear jugador
  @Post()
  create(@Body() body) {
    return this.service.create(body);
  }

  // Actualizar jugador
  @Patch(':id')
  update(@Param('id') id: number, @Body() body) {
    return this.service.update(id, body);
  }

  // Eliminar jugador
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
