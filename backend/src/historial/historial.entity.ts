import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Partidos } from '../partidos/partido.entity';

@Entity()
export class Historial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  guardado_en: Date;

  @Column({ type: 'text', nullable: true })
  resumen: string;

  @Column({ default: 0 })
  puntos_equipo_a: number;

  @Column({ default: 0 })
  puntos_equipo_b: number;

  @ManyToOne(() => Partidos, { onDelete: 'CASCADE' })
  partido: Partidos;
}
