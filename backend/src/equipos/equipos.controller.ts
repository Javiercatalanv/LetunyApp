import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { EquipoService } from './equipos.service';

@Controller('equipos')
export class EquipoController {
  constructor(private readonly equipoService: EquipoService) {}

  @Get()
  findAll() {
    return this.equipoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.equipoService.findOne(id);
  }

  @Post()
  create(@Body() body: { nombre: string; color?: string }) {
    return this.equipoService.create(body.nombre, body.color);
  }

@Post(':id/jugadores')
addJugador(
  @Param('id') id: number,
  @Body('nombre') nombre: string,
  @Body('numero') numero: number,
  @Body('posicion') posicion: string,
) {
  return this.equipoService.addJugador(id, nombre, numero, posicion);
}

  @Delete('jugadores/:id')
  deleteJugador(@Param('id') id: number) {
    return this.equipoService.deleteJugador(id);
  }

  @Delete(':id')
  deleteEquipo(@Param('id') id: number) {
  return this.equipoService.deleteEquipo(id);
}

}
