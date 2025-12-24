import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import api from '../api/api';

type RootStackParamList = {
  PartidoDetalle: { id: number; titulo: string };
};

type PartidoDetalleRouteProp = RouteProp<RootStackParamList, 'PartidoDetalle'>;

type Evento = {
  id: number;
  jugador: string;
  tipo: string;
  set: number;
};

export default function PartidoDetalleScreen() {
  const route = useRoute<PartidoDetalleRouteProp>();
  const { id, titulo } = route.params;

  const [equipoA] = useState('Letuny');
  const [equipoB] = useState(titulo);
  const [puntosA, setPuntosA] = useState(0);
  const [puntosB, setPuntosB] = useState(0);
  const [sets, setSets] = useState<{ set: number; a: number; b: number }[]>([]);
  const [partidoTerminado, setPartidoTerminado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [jugadores, setJugadores] = useState<string[]>([]);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState('');
  const [tipoEvento, setTipoEvento] = useState('');
  const [eventos, setEventos] = useState<Evento[]>([]);

  const tiposEvento = ['Remache', 'Bloqueo', 'Saque', 'Recepción', 'Error rival', 'Otro'];

  const equipoLetunyId = 1; 
  const currentSetNumber = () => sets.length + 1;

  const cargarJugadores = async () => {
    try {
      const res = await api.get(`/equipos/${equipoLetunyId}`);
      const data = res.data as { jugadores: { nombre: string }[] };
      setJugadores(data.jugadores.map((j) => j.nombre));
    } catch (err) {
      console.error('Error al cargar jugadores:', err);
    }
  };


  const guardarProgreso = async () => {
    const data = {id,equipoA,equipoB,puntosA,puntosB,sets,partidoTerminado,eventos};
    await AsyncStorage.setItem(`partido_${id}`, JSON.stringify(data));
  };

  const cargarProgreso = async () => {
    const dataGuardada = await AsyncStorage.getItem(`partido_${id}`);
    if (dataGuardada) {
      const partido = JSON.parse(dataGuardada);
      setSets(partido.sets || []);
      setPuntosA(partido.puntosA);
      setPuntosB(partido.puntosB);
      setPartidoTerminado(partido.partidoTerminado);
      setEventos(partido.eventos || []);
    }
  };

  useEffect(() => {
    cargarJugadores();
    cargarProgreso();
  }, []);

  useEffect(() => {
    guardarProgreso();
  }, [puntosA, puntosB, sets, partidoTerminado, eventos]);

  const limiteSetActual = sets.length === 2 && sets[0].a !== sets[1].a ? 15 : 25;

  const verificarFinDeSet = () => {
    const diferencia = Math.abs(puntosA - puntosB);
    const ganador =
      (puntosA >= limiteSetActual && diferencia >= 2 && puntosA > puntosB)
        ? 'A'
        : (puntosB >= limiteSetActual && diferencia >= 2 && puntosB > puntosA)
        ? 'B'
        : null;

    if (ganador) {
      Alert.alert(
        'Set terminado',
        `Ganador: ${ganador === 'A' ? equipoA : equipoB}`,
        [
          {
            text: 'Continuar',
            onPress: () => {
              const nuevoSet = { set: sets.length + 1, a: puntosA, b: puntosB };
              setSets([...sets, nuevoSet]);
              setPuntosA(0);
              setPuntosB(0);

              const ganadosA = [...sets, nuevoSet].filter((s) => s.a > s.b).length;
              const ganadosB = [...sets, nuevoSet].filter((s) => s.b > s.a).length;
              if (ganadosA === 2 || ganadosB === 2) {
                setPartidoTerminado(true);
                Alert.alert(
                  '🏁 Partido terminado',
                  `${ganadosA > ganadosB ? equipoA : equipoB} gana el partido.`
                );
              }
            },
          },
        ]
      );
    }
  };

  const abrirModal = () => {
    if (partidoTerminado) return;
    setModalVisible(true);
  };

  const confirmarEvento = () => {
    if (!jugadorSeleccionado || !tipoEvento) {
      Alert.alert('Campos incompletos', 'Selecciona jugador y tipo de jugada.');
      return;
    }

    const nuevoEvento: Evento = {
      id: eventos.length + 1,
      jugador: jugadorSeleccionado,
      tipo: tipoEvento,
      set: sets.length + 1,
    };

    setEventos((prev) => [...prev, nuevoEvento]);
    setModalVisible(false);
    setJugadorSeleccionado('');
    setTipoEvento('');
    setPuntosA((p) => p + 1);
  };

  const sumarPuntoRival = () => {
    if (partidoTerminado) return;
    setPuntosB((p) => p + 1);
  };

const removeLastEventOfCurrentSet = (prev: Evento[]) => {
  const cur = currentSetNumber();

  for (let i = prev.length - 1; i >= 0; i--) {
    if (prev[i].set === cur) {
      const next = prev.slice();
      next.splice(i, 1);


      return next.map((e, idx) => ({ ...e, id: idx + 1 }));
    }
  }
  return prev;
};

const restarPunto = (equipo: 'A' | 'B') => {
  if (partidoTerminado) return;

  if (equipo === 'A') {
    if (puntosA > 0) {
      setPuntosA((p) => p - 1);
      setEventos((prev) => removeLastEventOfCurrentSet(prev));
    }
  } else {
    if (puntosB > 0) {
      setPuntosB((p) => p - 1);
    }
  }
};

  useEffect(() => {
    verificarFinDeSet();
  }, [puntosA, puntosB]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {equipoA} vs {equipoB}
      </Text>

      <Text style={styles.score}>
        {puntosA} — {puntosB}
      </Text>

      <View style={styles.row}>
        <Button title={`+1 ${equipoA}`} onPress={abrirModal} />
        <Button title={`+1 ${equipoB}`} onPress={sumarPuntoRival} />
      </View>

      <View style={styles.row}>
        <Button title={`-1 ${equipoA}`} color="#d9534f" onPress={() => restarPunto('A')} />
        <Button title={`-1 ${equipoB}`} color="#d9534f" onPress={() => restarPunto('B')} />
      </View>

      <Text style={styles.subtitle}>Sets jugados:</Text>
      {sets.map((s) => (
        <Text key={s.set} style={styles.event}>
          Set {s.set}: {equipoA} {s.a} — {s.b} {equipoB}
        </Text>
      ))}

      <Text style={styles.subtitle}>Eventos Letuny:</Text>
      {eventos.length === 0 ? (
        <Text style={{ color: '#666' }}>Sin eventos registrados.</Text>
      ) : (
        eventos.map((e) => (
          <Text key={e.id} style={styles.event}>
            Set {e.set}: {e.jugador} — {e.tipo}
          </Text>
        ))
      )}

      {partidoTerminado && (
        <Text style={styles.finalText}>🏆 Partido finalizado 🏆</Text>
      )}

      {/* Modal de selección */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Registrar punto Letuny</Text>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={jugadorSeleccionado}
                onValueChange={(val) => setJugadorSeleccionado(val)}
              >
                <Picker.Item label="Seleccionar jugador..." value="" />
                {jugadores.map((j) => (
                  <Picker.Item key={j} label={j} value={j} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tipoEvento}
                onValueChange={(val) => setTipoEvento(val)}
              >
                <Picker.Item label="Seleccionar tipo de jugada..." value="" />
                {tiposEvento.map((t) => (
                  <Picker.Item key={t} label={t} value={t} />
                ))}
              </Picker>
            </View>

            <View style={styles.row}>
              <Button title="Cancelar" color="#999" onPress={() => setModalVisible(false)} />
              <Button title="Confirmar" onPress={confirmarEvento} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  score: { fontSize: 48, fontWeight: 'bold', marginBottom: 20 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  event: { fontSize: 16, marginBottom: 5 },
  finalText: { fontSize: 20, fontWeight: 'bold', color: '#28a745', marginTop: 20 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '85%',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
});
