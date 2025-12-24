import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import api from '../api/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

type Partido = {
  id: number;
  titulo: string;
  fecha: string;
};

export default function PartidosScreen() {
  const navigation = useNavigation<any>();
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [rival, setRival] = useState('');
  const [fecha, setFecha] = useState<Date>(new Date());
  const [mostrarFecha, setMostrarFecha] = useState(false);

  const cargarPartidos = async () => {
    const res = await api.get<Partido[]>('/partidos');
    setPartidos(res.data);
  };

  const crearPartido = async () => {
    if (!rival.trim()) {
      alert('Debes ingresar el nombre del equipo rival.');
      return;
    }

    const nuevo = {
      titulo: rival,
      fecha: fecha.toISOString().split('T')[0],
    };

    await api.post('/partidos', nuevo);
    setRival('');
    cargarPartidos();
  };

  useEffect(() => {
    cargarPartidos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear nuevo partido</Text>

      <Text style={styles.label}>Equipo local: Letuny</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del equipo rival"
        value={rival}
        onChangeText={setRival}
      />

      <Button
        title="Seleccionar fecha"
        onPress={() => setMostrarFecha(true)}
      />
      {mostrarFecha && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, selected) => {
            setMostrarFecha(false);
            if (selected) setFecha(selected);
          }}
        />
      )}

      <Text style={styles.dateText}>
        Fecha seleccionada: {fecha.toISOString().split('T')[0]}
      </Text>

      <Button title="Crear partido" onPress={crearPartido} />

      <FlatList
        data={partidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text
            style={styles.item}
            onPress={() =>
              navigation.navigate('PartidoDetalle', {
                id: item.id,
                titulo: item.titulo,
              })
            }
          >
            Letuny vs {item.titulo} — {item.fecha}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 15, fontWeight: 'bold' },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  dateText: { marginVertical: 10 },
  item: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
});
