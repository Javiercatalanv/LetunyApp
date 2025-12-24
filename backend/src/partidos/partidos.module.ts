import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partidos } from './partido.entity';
import { PartidosService } from './partidos.service';
import { PartidosController } from './partidos.controller';
import { Equipo } from '../equipos/equipo.entity'; // 👈 importa la entidad Equipo

@Module({
  imports: [
    TypeOrmModule.forFeature([Partidos, Equipo]), // 👈 registra ambos repositorios
  ],
  providers: [PartidosService],
  controllers: [PartidosController],
})
export class PartidosModule {}
