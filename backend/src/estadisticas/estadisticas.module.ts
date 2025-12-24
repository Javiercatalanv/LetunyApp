import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
import { Estadistica } from './estadistica.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estadistica])],
  providers: [EstadisticasService],
  controllers: [EstadisticasController],
  exports: [EstadisticasService],
})
export class EstadisticasModule {}
