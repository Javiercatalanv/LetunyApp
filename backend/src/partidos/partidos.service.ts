import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partidos } from './partido.entity';
import { Equipo } from '../equipos/equipo.entity';

@Injectable()
export class PartidosService {
  constructor(
    @InjectRepository(Partidos)
    private readonly partidoRepo: Repository<Partidos>,

    @InjectRepository(Equipo)
    private readonly equipoRepo: Repository<Equipo>,
  ) {}

  // Obtener todos los partidos con sus equipos
  async findAll(): Promise<Partidos[]> {
    return this.partidoRepo.find({
      relations: ['equipo_a', 'equipo_b'],
    });
  }

  // Crear un nuevo partido
  async create(data: any): Promise<Partidos> {
    const equipoA = await this.equipoRepo.findOne({ where: { id: data.equipo_a_id } });
    const equipoB = await this.equipoRepo.findOne({ where: { id: data.equipo_b_id } });

    if (!equipoA || !equipoB) {
      throw new Error('Uno o ambos equipos no existen');
    }

    const partido = this.partidoRepo.create({
      titulo: data.titulo,
      fecha: data.fecha,
      equipo_a: equipoA,
      equipo_b: equipoB,
      puntos_equipo_a: 0,
      puntos_equipo_b: 0,
    });

    return this.partidoRepo.save(partido);
  }

  // Eliminar partido por ID
  async delete(id: number): Promise<void> {
    const result = await this.partidoRepo.delete(id);
    if (result.affected === 0) {
      throw new Error(`No se encontró el partido con ID ${id}`);
    }
  }
}
