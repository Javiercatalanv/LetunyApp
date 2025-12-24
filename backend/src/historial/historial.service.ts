import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historial } from './historial.entity';
import { EstadisticasService } from '../estadisticas/estadisticas.service';
import { Partidos } from '../partidos/partido.entity';

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(Historial)
    private readonly repo: Repository<Historial>,
    private readonly estadisticasService: EstadisticasService,
  ) {}

  // 🔹 Guardar un partido terminado en el historial
  async guardarPartido(partido: Partidos) {
    const resumenEstad = await this.estadisticasService.findByPartido(partido.id);

    const historial = this.repo.create({
      titulo: partido.titulo,
      puntos_equipo_a: partido.puntos_equipo_a,
      puntos_equipo_b: partido.puntos_equipo_b,
      partido,
      resumen: JSON.stringify(resumenEstad.resumen),
    });

    return this.repo.save(historial);
  }

  // 🔹 Obtener historial con filtros dinámicos
  async findFiltered(params: { equipoRival?: string; fechaInicio?: string; fechaFin?: string }) {
    const { equipoRival, fechaInicio, fechaFin } = params;

    const query = this.repo.createQueryBuilder('historial')
      .leftJoinAndSelect('historial.partido', 'partido')
      .orderBy('historial.guardado_en', 'DESC');

    // Filtro por nombre del equipo rival (busca dentro del título)
    if (equipoRival) {
      query.andWhere('LOWER(historial.titulo) LIKE LOWER(:equipo)', { equipo: `%${equipoRival}%` });
    }

    // Filtro por rango de fechas
    if (fechaInicio && fechaFin) {
      query.andWhere('historial.guardado_en BETWEEN :inicio AND :fin', { inicio: fechaInicio, fin: fechaFin });
    } else if (fechaInicio) {
      query.andWhere('historial.guardado_en >= :inicio', { inicio: fechaInicio });
    } else if (fechaFin) {
      query.andWhere('historial.guardado_en <= :fin', { fin: fechaFin });
    }

    return query.getMany();
  }

  // 🔹 Obtener un partido guardado del historial
  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['partido'] });
  }

  // 🔹 Eliminar un registro del historial
  async delete(id: number) {
    await this.repo.delete(id);
    return { message: `Historial ${id} eliminado correctamente` };
  }
}
