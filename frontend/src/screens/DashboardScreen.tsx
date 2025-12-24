import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type EstadisticasJugador = {
  nombre: string;
  total: number;
  remache: number;
  bloqueo: number;
  saque: number;
  recepcion: number;
  error: number;
  otro: number;
};

export default function DashboardScreen() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasJugador[]>([]);

  const cargarEstadisticas = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const partidosKeys = keys.filter((k) => k.startsWith('partido_'));
      const partidasData = await AsyncStorage.multiGet(partidosKeys);

      const acumulado: Record<string, EstadisticasJugador> = {};

      for (const [, value] of partidasData) {
        if (!value) continue;
        const partido = JSON.parse(value);

        // Solo analizamos eventos de Letuny
        if (!partido.eventos) continue;

        for (const ev of partido.eventos) {
          const nombre = ev.jugador;
          const tipo = ev.tipo?.toLowerCase?.() || 'otro';

          if (!acumulado[nombre]) {
            acumulado[nombre] = {
              nombre,
              total: 0,
              remache: 0,
              bloqueo: 0,
              saque: 0,
              recepcion: 0,
              error: 0,
              otro: 0,
            };
          }

          acumulado[nombre].total += 1;

          if (tipo.includes('remache')) acumulado[nombre].remache++;
          else if (tipo.includes('bloqueo')) acumulado[nombre].bloqueo++;
          else if (tipo.includes('saque')) acumulado[nombre].saque++;
          else if (tipo.includes('recep')) acumulado[nombre].recepcion++;
          else if (tipo.includes('error')) acumulado[nombre].error++;
          else acumulado[nombre].otro++;
        }
      }

      // Convertir a arreglo y ordenar de mayor a menor total
      const listaOrdenada = Object.values(acumulado).sort(
        (a, b) => b.total - a.total
      );

      setEstadisticas(listaOrdenada);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  // 👇 Se ejecuta automáticamente cada vez que la pantalla se muestra o vuelve a foco
  useFocusEffect(
    useCallback(() => {
      cargarEstadisticas();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏐 Rendimiento general — Letuny</Text>

      {estadisticas.length === 0 ? (
        <Text style={styles.emptyText}>
          No hay estadísticas registradas aún.
        </Text>
      ) : (
        estadisticas.map((jug, index) => (
          <View key={jug.nombre} style={styles.card}>
            <Text style={styles.name}>
              {index + 1}. {jug.nombre} — {jug.total} pts
            </Text>
            <View style={styles.breakdown}>
              <Text style={styles.detail}>Remaches: {jug.remache}</Text>
              <Text style={styles.detail}>Bloqueos: {jug.bloqueo}</Text>
              <Text style={styles.detail}>Saques: {jug.saque}</Text>
              <Text style={styles.detail}>Recepciones: {jug.recepcion}</Text>
              <Text style={styles.detail}>Errores: {jug.error}</Text>
              <Text style={styles.detail}>Otros: {jug.otro}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  emptyText: { color: '#666', marginTop: 20, fontSize: 16 },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  breakdown: { marginLeft: 10 },
  detail: { fontSize: 15, color: '#333' },
});
