import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Equipo } from '../equipos/equipo.entity';
import { Partidos } from '../partidos/partido.entity';

@Entity()
export class Jugador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  numero: number;

  @Column({ nullable: true }) // 🔥 Ahora puede estar vacío si no se elige
  posicion?: string;

  // Relación con el equipo
  @ManyToOne(() => Equipo, (equipo) => equipo.jugadores, { onDelete: 'CASCADE' })
  equipo: Equipo;
  
  // Relación con los partidos (muchos a muchos a través de estadísticas)
  @ManyToOne(() => Partidos, (Partidos) => Partidos.jugadores, { onDelete: 'CASCADE' })
  partido: Partidos;
}
