import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from '../equipos/equipo.entity';
import { Jugador } from '../jugadores/jugador.entity';

@Injectable()
export class EquipoService {
  constructor(
    @InjectRepository(Equipo) private equipoRepo: Repository<Equipo>,
    @InjectRepository(Jugador) private jugadorRepo: Repository<Jugador>,
  ) {}

  async findAll(): Promise<Equipo[]> {
    return this.equipoRepo.find({ relations: ['jugadores'] });
  }

  async findOne(id: number): Promise<Equipo> {
    const equipo = await this.equipoRepo.findOne({
      where: { id },
      relations: ['jugadores'],
    });

    if (!equipo) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    return equipo;
  }

  async create(nombre: string, color?: string): Promise<Equipo> {
    const nuevo = this.equipoRepo.create({ nombre, color });
    return this.equipoRepo.save(nuevo);
  }

async addJugador(equipoId: number, nombre: string, numero: number, posicion: string) {
  const equipo = await this.equipoRepo.findOne({ where: { id: equipoId } });
  if (!equipo) throw new Error('Equipo no encontrado');

  const jugador = this.jugadorRepo.create({ nombre, numero, posicion, equipo });
  return this.jugadorRepo.save(jugador);
}


  async deleteJugador(id: number): Promise<void> {
    await this.jugadorRepo.delete(id);
  }

  async deleteEquipo(id: number) {
  const equipo = await this.equipoRepo.findOne({
    where: { id },
    relations: ['jugadores'],
  });

  if (!equipo) {
    throw new Error('Equipo no encontrado');
  }

  await this.equipoRepo.remove(equipo);
  return { message: 'Equipo eliminado correctamente' };
}

}
