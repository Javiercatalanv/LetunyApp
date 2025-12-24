import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PartidosModule } from './partidos/partidos.module';
import { Partidos } from './partidos/partido.entity';
import { JugadoresModule } from './jugadores/jugadores.module';
import { EquipoModule } from './equipos/equipos.module';
import { EventosModule } from './eventos/eventos.module';
import { EstadisticasModule } from './estadisticas/estadisticas.module';
import { HistorialModule } from './historial/historial.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { Equipo } from './equipos/equipo.entity';
import { Jugador } from './jugadores/jugador.entity';
import { Evento } from './eventos/evento.entity';
import { Estadistica } from './estadisticas/estadistica.entity';
import { Historial } from './historial/historial.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Partidos, Equipo, Jugador, Evento, Estadistica, Historial],
      synchronize: true,
      autoLoadEntities: true,
    }),
    PartidosModule,
    EquipoModule,
    JugadoresModule,
    EventosModule,
    EstadisticasModule,
    HistorialModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
