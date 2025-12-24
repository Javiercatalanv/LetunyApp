import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Partidos } from '../partidos/partido.entity';
import { Estadistica } from '../estadisticas/estadistica.entity';
import { Jugador } from '../jugadores/jugador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partidos, Estadistica, Jugador])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
