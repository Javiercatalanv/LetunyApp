import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  // 🔹 Dashboard general
  @Get()
  getDashboard() {
    return this.service.getDashboard();
  }

  // 🔹 Dashboard individual por jugador
  @Get('rendimiento/:jugadorId')
  getRendimiento(@Param('jugadorId') jugadorId: number) {
    return this.service.getRendimientoJugador(jugadorId);
  }
}
