import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';

@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly service: EstadisticasService) {}

  // 🔹 Obtener estadísticas de un partido
  @Get(':partidoId')
  getByPartido(@Param('partidoId') partidoId: number) {
    return this.service.findByPartido(partidoId);
  }

  // 🔹 Registrar evento (para testing manual)
  @Post('registrar')
  registrarEvento(@Body() body) {
    const { jugador, partido, tipo, esBueno } = body;
    return this.service.registrarEvento(jugador, partido, tipo, esBueno);
  }
}
