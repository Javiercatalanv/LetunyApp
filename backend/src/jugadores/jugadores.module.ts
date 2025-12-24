import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JugadoresService } from './jugadores.service';
import { JugadoresController } from './jugadores.controller';
import { Jugador } from './jugador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Jugador])],
  providers: [JugadoresService],
  controllers: [JugadoresController],
})
export class JugadoresModule {}
