import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from './evento.entity';
import { EstadisticasService } from '../estadisticas/estadisticas.service';
import { Jugador } from '../jugadores/jugador.entity';
import { Partidos } from '../partidos/partido.entity';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento)
    private readonly repo: Repository<Evento>,
    private readonly estadisticasService: EstadisticasService,
  ) {}

  // Registrar evento y actualizar estadísticas automáticamente
  async registrarEvento(data: {
    tipo: string;
    esPunto: boolean;
    esError: boolean;
    jugador: Jugador;
    partido: Partidos;
  }) {
    const evento = this.repo.create(data);
    await this.repo.save(evento);

    // Actualizar estadísticas automáticamente
    if (data.esPunto || data.esError) {
      await this.estadisticasService.registrarEvento(
        data.jugador,
        data.partido,
        data.tipo,
        data.esPunto, // true si fue buena jugada, false si fue error
      );
    }

    return evento;
  }

  // Listar todos los eventos (global)
  findAll() {
    return this.repo.find({
      relations: ['jugador', 'partido'],
      order: { timestamp: 'ASC' },
    });
  }

  // Listar eventos de un partido específico
  findByPartido(partidoId: number) {
    return this.repo.find({
      where: { partido: { id: partidoId } },
      relations: ['jugador', 'partido'],
      order: { timestamp: 'ASC' },
    });
  }

  // Eliminar un evento
  async delete(id: number) {
    const evento = await this.repo.findOne({ where: { id } });
    if (!evento) return { message: 'Evento no encontrado' };

    await this.repo.delete(id);
    return { message: `Evento ${id} eliminado correctamente` };
  }
}
