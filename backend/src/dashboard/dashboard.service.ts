import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partidos } from '../partidos/partido.entity';
import { Estadistica } from '../estadisticas/estadistica.entity';
import { Jugador } from '../jugadores/jugador.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Partidos)
    private readonly partidosRepo: Repository<Partidos>,
    @InjectRepository(Estadistica)
    private readonly estadisticasRepo: Repository<Estadistica>,
    @InjectRepository(Jugador)
    private readonly jugadoresRepo: Repository<Jugador>,
  ) {}

  // 🔹 Dashboard general
  async getDashboard() {
    const totalPartidos = await this.partidosRepo.count();

    const partidos = await this.partidosRepo.find();
    const totalPuntos = partidos.reduce(
      (acc, p) => acc + (p.puntos_equipo_a + p.puntos_equipo_b),
      0,
    );
    const promedioPuntosPartido = totalPartidos > 0 ? totalPuntos / totalPartidos : 0;

    const estadisticas = await this.estadisticasRepo.find({
      relations: ['jugador', 'partido'],
    });

    const rendimientoPorJugador: Record<number, { jugador: Jugador; puntaje: number }> = {};
    for (const e of estadisticas) {
      const puntaje =
        e.ataques_buenos * 3 +
        e.bloqueos_buenos * 2 +
        e.saques_buenos * 2 +
        e.recepciones_buenas * 1 -
        e.errores * 2;

      if (!rendimientoPorJugador[e.jugador.id]) {
        rendimientoPorJugador[e.jugador.id] = { jugador: e.jugador, puntaje: 0 };
      }
      rendimientoPorJugador[e.jugador.id].puntaje += puntaje;
    }

    const top3 = Object.values(rendimientoPorJugador)
      .sort((a, b) => b.puntaje - a.puntaje)
      .slice(0, 3);

    return {
      totalPartidos,
      promedioPuntosPartido: Number(promedioPuntosPartido.toFixed(2)),
      top3Jugadores: top3.map((x) => ({
        nombre: x.jugador.nombre,
        numero: x.jugador.numero,
        puntajeTotal: x.puntaje,
      })),
    };
  }

  // 🔹 Dashboard individual: rendimiento de un jugador
  async getRendimientoJugador(jugadorId: number) {
    const jugador = await this.jugadoresRepo.findOne({ where: { id: jugadorId } });
    if (!jugador) throw new Error('Jugador no encontrado');

    const estadisticas = await this.estadisticasRepo.find({
      where: { jugador: { id: jugadorId } },
      relations: ['partido'],
    });

    if (estadisticas.length === 0) {
      return { message: 'El jugador no tiene estadísticas registradas aún.' };
    }

    // Calcular promedios
    const totales = {
      ataques_buenos: 0,
      bloqueos_buenos: 0,
      saques_buenos: 0,
      recepciones_buenas: 0,
      errores: 0,
    };

    const rendimientoPorPartido: any[] = [];

    estadisticas.forEach((e) => {
      totales.ataques_buenos += e.ataques_buenos;
      totales.bloqueos_buenos += e.bloqueos_buenos;
      totales.saques_buenos += e.saques_buenos;
      totales.recepciones_buenas += e.recepciones_buenas;
      totales.errores += e.errores;

      const puntaje =
        e.ataques_buenos * 3 +
        e.bloqueos_buenos * 2 +
        e.saques_buenos * 2 +
        e.recepciones_buenas * 1 -
        e.errores * 2;

      rendimientoPorPartido.push({
        partido: e.partido.titulo,
        puntaje,
      });
    });

    const partidosJugados = estadisticas.length;

    const promedios = {
      ataques_buenos: Number((totales.ataques_buenos / partidosJugados).toFixed(2)),
      bloqueos_buenos: Number((totales.bloqueos_buenos / partidosJugados).toFixed(2)),
      saques_buenos: Number((totales.saques_buenos / partidosJugados).toFixed(2)),
      recepciones_buenas: Number((totales.recepciones_buenas / partidosJugados).toFixed(2)),
      errores: Number((totales.errores / partidosJugados).toFixed(2)),
    };

    const puntajeTotal = rendimientoPorPartido.reduce((acc, p) => acc + p.puntaje, 0);
    const totalAcciones =
      totales.ataques_buenos +
      totales.bloqueos_buenos +
      totales.saques_buenos +
      totales.recepciones_buenas +
      totales.errores;

    const efectividad =
      totalAcciones > 0
        ? (((totalAcciones - totales.errores) / totalAcciones) * 100).toFixed(2) + '%'
        : '0%';

    return {
      jugador: jugador.nombre,
      partidosJugados,
      promedios,
      puntajeTotal,
      efectividad,
      rendimientoPorPartido,
    };
  }
}
