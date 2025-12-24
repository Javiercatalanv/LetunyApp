import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Equipo } from '../equipos/equipo.entity';
import { Jugador } from '../jugadores/jugador.entity';
import { Evento } from '../eventos/evento.entity';

@Entity()
export class Partidos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  fecha: string;

  @Column({ default: 0 })
  puntos_equipo_a: number;

  @Column({ default: 0 })
  puntos_equipo_b: number;

  // Relacion con los equipo local
  @ManyToOne(() => Equipo, (equipo) => equipo.partidosComoLocal, { eager: true, onDelete: 'SET NULL' })
  equipo_a: Equipo;
  
  // Relacion con el equipo visitante
  @ManyToOne(() => Equipo, (equipo) => equipo.partidosComoVisitante, { eager: true, onDelete: 'SET NULL' })
  equipo_b: Equipo;

  // Relacion con Jugadores
  @OneToMany(() => Jugador, (jugador) => jugador.partido)
  jugadores: Jugador[];

  // Relacion con Eventos
  @OneToMany(() => Evento, (evento) => evento.partido)
  eventos: Evento[];
}
