import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api/api';

export default function NuevoEquipoScreen() {
  const navigation = useNavigation<any>();
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState('');

  const crearEquipo = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'Debes ingresar un nombre para el equipo.');
      return;
    }
    try {
      await api.post('/equipos', { nombre, color });
      Alert.alert('Éxito', 'Equipo creado correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error('Error al crear equipo:', err);
      Alert.alert('Error', 'No se pudo crear el equipo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo equipo</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del equipo"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Color (opcional)"
        value={color}
        onChangeText={setColor}
      />

      <Button title="Guardar equipo" onPress={crearEquipo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
});
