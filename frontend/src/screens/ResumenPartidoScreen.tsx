import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

type RootStackParamList = {
  ResumenPartido: { id: number; titulo: string; fecha: string };
};

type ResumenPartidoRouteProp = RouteProp<RootStackParamList, 'ResumenPartido'>;

export default function ResumenPartidoScreen() {
  const route = useRoute<ResumenPartidoRouteProp>();
  const { id, titulo, fecha } = route.params;

  const [resumen, setResumen] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarResumen = async () => {
      try {
        // 🔹 Buscar si hay datos guardados localmente de este partido
        const guardado = await AsyncStorage.getItem('partidoActivo');
        if (guardado) {
          const data = JSON.parse(guardado);
          if (data.id === id) {
            setResumen(data);
            setLoading(false);
            return;
          }
        }

        // 🔹 Si no está local, buscar en backend (opcional)
        const res = await api.get(`/partidos/${id}`);
        setResumen(res.data);
      } catch (error) {
        console.error('Error al cargar resumen:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarResumen();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  if (!resumen)
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No se encontró información del partido.</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{titulo}</Text>
      <Text style={styles.subtitle}>Fecha: {fecha}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Equipos:</Text>
        <Text style={styles.text}>
          {resumen.equipoA || 'Equipo A'} vs {resumen.equipoB || 'Equipo B'}
        </Text>

        <Text style={[styles.label, { marginTop: 10 }]}>📊 Sets jugados:</Text>
        {resumen.sets && resumen.sets.length > 0 ? (
          resumen.sets.map((set: any) => (
            <Text key={set.set} style={styles.text}>
              Set {set.set}: {resumen.equipoA} {set.a} — {set.b} {resumen.equipoB}
            </Text>
          ))
        ) : (
          <Text style={styles.text}>Sin sets registrados.</Text>
        )}
      </View>

      {resumen.terminado ? (
        <Text style={styles.finalText}>Partido finalizado</Text>
      ) : (
        <Text style={styles.enJuego}> Partido en curso</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 16, marginBottom: 20, color: '#555' },
  infoBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    width: '100%',
  },
  label: { fontWeight: 'bold', fontSize: 16 },
  text: { fontSize: 16, marginTop: 4 },
  finalText: { fontSize: 18, color: 'green', marginTop: 20, fontWeight: 'bold' },
  enJuego: { fontSize: 18, color: '#f0ad4e', marginTop: 20, fontWeight: 'bold' },
  error: { fontSize: 16, color: 'red' },
});
