import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { HistorialService } from './historial.service';

@Controller('historial')
export class HistorialController {
  constructor(private readonly service: HistorialService) {}

  // 🔹 Guardar partido en historial
  @Post()
  guardar(@Body() body) {
    return this.service.guardarPartido(body);
  }

  // 🔹 Listar todo el historial (sin filtros)
  @Get()
  getAll() {
    return this.service.findFiltered({});
  }

  // 🔹 Listar historial filtrado por equipo rival o fechas
  @Get('filtrar')
  getFiltered(
    @Query('equipoRival') equipoRival?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.service.findFiltered({ equipoRival, fechaInicio, fechaFin });
  }

  // 🔹 Ver un historial específico
  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  // 🔹 Eliminar registro del historial
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
