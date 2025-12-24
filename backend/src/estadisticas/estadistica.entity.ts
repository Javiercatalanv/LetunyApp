import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Jugador } from '../jugadores/jugador.entity';
import { Partidos } from '../partidos/partido.entity';

@Entity()
export class Estadistica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 }) 
  ataques_buenos: number;

  @Column({ default: 0 }) 
  bloqueos_buenos: number;

  @Column({ default: 0 }) 
  saques_buenos: number;

  @Column({ default: 0 }) 
  recepciones_buenas: number;
  
  @Column({ default: 0 }) 
  errores: number;

  @ManyToOne(() => Jugador, { onDelete: 'CASCADE' })
  jugador: Jugador;

  @ManyToOne(() => Partidos, { onDelete: 'CASCADE' })
  partido: Partidos;
}
