import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from './equipo.entity';
import { EquipoController } from './equipos.controller';
import { EquipoService } from './equipos.service';
import { Jugador } from '../jugadores/jugador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Equipo, Jugador])],
  controllers: [EquipoController],
  providers: [EquipoService],
  exports: [EquipoService],
})
export class EquipoModule {}
