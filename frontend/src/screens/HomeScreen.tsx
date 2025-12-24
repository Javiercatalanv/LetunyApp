import { View, Text, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Dashboard: undefined;
  Partidos: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 26, marginBottom: 20 }}>LETUNY APP</Text>
      <Text style={{ fontSize: 16, marginBottom: 25, color: '#2E85DE',fontStyle:'italic'}}> App oficial para la organización del equipo. </Text>

      <Button title="Partidos" onPress={() => navigation.navigate('Partidos')} />
      <Button title="Dashboard" onPress={() => navigation.navigate('Dashboard')} />

    </View>
  );
}
