import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Jugador } from '../jugadores/jugador.entity';
import { Partidos } from '../partidos/partido.entity';

@Entity()
export class Evento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string; // remache, bloqueo, saque, etc.

  @Column({ default: false })
  esPunto: boolean;

  @Column({ default: false })
  esError: boolean;

  // Marca la fecha y hora del evento
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  // Relaciones
  @ManyToOne(() => Jugador, { onDelete: 'CASCADE' })
  jugador: Jugador;

  // Relación con el partido
  @ManyToOne(() => Partidos, { onDelete: 'CASCADE' })
  partido: Partidos;
}
