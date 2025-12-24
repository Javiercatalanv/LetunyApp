import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import api from '../api/api';
import { Picker } from '@react-native-picker/picker';

type Jugador = {
  id: number;
  nombre: string;
  numero: number;
  posicion?: string;
};

export default function EquipoDetalleScreen() {
  const route = useRoute<any>();
  const { id, nombre } = route.params;

  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [nombreJugador, setNombreJugador] = useState('');
  const [numero, setNumero] = useState('');
  const [posicion, setPosicion] = useState<string>('');
  const [cargando, setCargando] = useState(true);

  const cargarJugadores = async () => {
    try {
      const res = await api.get(`/equipos/${id}`);
      const data = res.data as { jugadores?: Jugador[] };
      setJugadores(data.jugadores || []);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const agregarJugador = async () => {
    if (!nombreJugador.trim() || !numero.trim() || !posicion.trim()) {
      Alert.alert('Error', 'Debes ingresar nombre, número y posición.');
      return;
    }
    try {
      await api.post(`/equipos/${id}/jugadores`, {
        nombre: nombreJugador,
        numero: parseInt(numero, 10),
        posicion,
      });
      setNombreJugador('');
      setNumero('');
      setPosicion('');
      cargarJugadores();
    } catch (err) {
      console.error('Error al agregar jugador:', err);
    }
  };

  const eliminarJugador = async (jugadorId: number) => {
    Alert.alert('Confirmar', '¿Deseas eliminar este jugador?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        onPress: async () => {
          try {
            await api.delete(`/equipos/jugadores/${jugadorId}`);
            cargarJugadores();
          } catch (err) {
            console.error('Error al eliminar jugador:', err);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    cargarJugadores();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{nombre}</Text>

      <Text style={styles.subtitle}>Agregar jugador</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del jugador"
        value={nombreJugador}
        onChangeText={setNombreJugador}
      />

      <TextInput
        style={styles.input}
        placeholder="Número"
        keyboardType="numeric"
        value={numero}
        onChangeText={setNumero}
      />

      {/* 🔽 Picker de posición */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={posicion}
          onValueChange={(itemValue) => setPosicion(itemValue)}
        >
          <Picker.Item label="Selecciona posición..." value="" />
          <Picker.Item label="Libero" value="libero" />
          <Picker.Item label="Punta" value="punta" />
          <Picker.Item label="Armador" value="armador" />
          <Picker.Item label="Central" value="central" />
          <Picker.Item label="Opuesto" value="opuesto" />
        </Picker>
      </View>

      <Button title="Agregar jugador" onPress={agregarJugador} />

      <Text style={[styles.subtitle, { marginTop: 20 }]}>Jugadores</Text>

      <FlatList
        data={jugadores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              #{item.numero} — {item.nombre}
              {item.posicion ? ` (${item.posicion})` : ''}
            </Text>
            <Button
              title="🗑️"
              color="#d9534f"
              onPress={() => eliminarJugador(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  name: { fontSize: 16 },
});
