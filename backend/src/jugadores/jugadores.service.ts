import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jugador } from './jugador.entity';

@Injectable()
export class JugadoresService {
  constructor(
    @InjectRepository(Jugador)
    private readonly repo: Repository<Jugador>,
  ) {}

  // Listar todos los jugadores
  findAll() {
    return this.repo.find({ relations: ['equipo', 'partido'] });
  }

  // Obtener un jugador por ID
  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['equipo', 'partido'] });
  }

  // Crear un jugador nuevo
  create(data: Partial<Jugador>) {
    const jugador = this.repo.create(data);
    return this.repo.save(jugador);
  }

  // Actualizar datos de un jugador
  async update(id: number, data: Partial<Jugador>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  // Eliminar jugador
  async delete(id: number) {
    await this.repo.delete(id);
    return { message: `Jugador ${id} eliminado correctamente` };
  }

  // Listar jugadores de un partido específico
  findByPartido(partidoId: number) {
    return this.repo.find({
      where: { partido: { id: partidoId } },
      relations: ['equipo', 'partido'],
    });
  }
}
