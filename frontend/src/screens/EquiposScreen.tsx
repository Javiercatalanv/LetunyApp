import { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert } from 'react-native';
import api from '../api/api';
import { useNavigation } from '@react-navigation/native';

type Equipo = {
  id: number;
  nombre: string;
};

export default function EquiposScreen() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [nombre, setNombre] = useState('');
  const navigation = useNavigation<any>();

  const cargarEquipos = async () => {
    try {
      const res = await api.get('/equipos');
      setEquipos(res.data as Equipo[]);
    } catch (error) {
      console.error(error);
    }
  };

  const crearEquipo = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'Debes ingresar un nombre para el equipo.');
      return;
    }
    try {
      await api.post('/equipos', { nombre });
      setNombre('');
      cargarEquipos();
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarEquipo = async (id: number) => {
    Alert.alert('Confirmar', '¿Deseas eliminar este equipo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        onPress: async () => {
          await api.delete(`/equipos/${id}`);
          cargarEquipos();
        },
      },
    ]);
  };

  useEffect(() => {
    cargarEquipos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Equipos</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del equipo"
        value={nombre}
        onChangeText={setNombre}
      />
      <Button title="Agregar equipo" onPress={crearEquipo} />

      <FlatList
        data={equipos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text
              style={styles.name}
              onPress={() => navigation.navigate('EquipoDetalle', { id: item.id, nombre: item.nombre })}
            >
              {item.nombre}
            </Text>
            <Button title="🗑️" color="#d9534f" onPress={() => eliminarEquipo(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
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
