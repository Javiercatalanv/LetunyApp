import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estadistica } from './estadistica.entity';
import { Jugador } from '../jugadores/jugador.entity';
import { Partidos } from '../partidos/partido.entity';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(Estadistica)
    private readonly repo: Repository<Estadistica>,
  ) {}

  // 🔹 Crear o actualizar estadísticas de un jugador según tipo de evento
  async registrarEvento(
    jugador: Jugador,
    partido: Partidos,
    tipo: string,
    esBueno: boolean,
  ) {
    // Buscar si ya existe una estadística para ese jugador y partido
    let estad = await this.repo.findOne({
      where: { jugador: { id: jugador.id }, partido: { id: partido.id } },
    });

    // Si no existe, crearla
    if (!estad) {
      estad = this.repo.create({ jugador, partido });
    }

    // Actualizar según tipo de evento
    if (!esBueno) {
      estad.errores += 1;
    } else {
      switch (tipo) {
        case 'remache':
          estad.ataques_buenos += 1;
          break;
        case 'bloqueo':
          estad.bloqueos_buenos += 1;
          break;
        case 'saque':
          estad.saques_buenos += 1;
          break;
        case 'recepcion':
          estad.recepciones_buenas += 1;
          break;
      }
    }

    await this.repo.save(estad);
    return estad;
  }

  // 🔹 Obtener estadísticas de un jugador
  findByJugador(jugadorId: number) {
    return this.repo.find({
      where: { jugador: { id: jugadorId } },
      relations: ['jugador', 'partido'],
    });
  }

  // 🔹 Obtener todas las estadísticas de un partido
  async findByPartido(partidoId: number) {
    const estadisticas = await this.repo.find({
      where: { partido: { id: partidoId } },
      relations: ['jugador', 'partido'],
    });

    // Crear resumen del partido
    const resumen = {
      totalAtaques: 0,
      totalBloqueos: 0,
      totalSaques: 0,
      totalRecepciones: 0,
      totalErrores: 0,
    };

    for (const e of estadisticas) {
      resumen.totalAtaques += e.ataques_buenos;
      resumen.totalBloqueos += e.bloqueos_buenos;
      resumen.totalSaques += e.saques_buenos;
      resumen.totalRecepciones += e.recepciones_buenas;
      resumen.totalErrores += e.errores;
    }

    return { resumen, jugadores: estadisticas };
  }

  // 🔹 Resetear estadísticas de un partido (opcional)
  async resetByPartido(partidoId: number) {
    const estadisticas = await this.repo.find({
      where: { partido: { id: partidoId } },
    });
    await this.repo.remove(estadisticas);
    return { message: `Estadísticas del partido ${partidoId} eliminadas` };
  }
}
