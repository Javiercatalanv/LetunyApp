import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evento } from './evento.entity';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { EstadisticasModule } from '../estadisticas/estadisticas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Evento]), EstadisticasModule],
  providers: [EventosService],
  controllers: [EventosController],
})
export class EventosModule {}
