export type JugadorEstadistica = {
  nombre: string;
  puntajeTotal: number;
};

export type DashboardData = {
  totalPartidos: number;
  promedioPuntosPartido: number;
  top3Jugadores: JugadorEstadistica[];
};
