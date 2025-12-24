import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialService } from './historial.service';
import { HistorialController } from './historial.controller';
import { Historial } from './historial.entity';
import { EstadisticasModule } from '../estadisticas/estadisticas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Historial]), EstadisticasModule],
  providers: [HistorialService],
  controllers: [HistorialController],
})
export class HistorialModule {}
