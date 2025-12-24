import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Jugador } from '../jugadores/jugador.entity';
import { Partidos } from '../partidos/partido.entity';

@Entity()
export class Equipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  color: string;

  @OneToMany(() => Jugador, (jugador) => jugador.equipo, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  jugadores: Jugador[];


  @OneToMany(() => Partidos, (partido) => partido.equipo_a)
    partidosComoLocal: Partidos[];

  @OneToMany(() => Partidos, (partido) => partido.equipo_b)
    partidosComoVisitante: Partidos[];

}
