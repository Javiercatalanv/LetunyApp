import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Screens principales
import HomeScreen from './src/screens/HomeScreen';
import PartidosScreen from './src/screens/PartidosScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import PartidoDetalleScreen from './src/screens/PartidoDetalleScreen';
import ResumenPartidoScreen from './src/screens/ResumenPartidoScreen';

// Screens nuevas
import EquiposScreen from './src/screens/EquiposScreen';
import EquipoDetalleScreen from './src/screens/EquipoDetalleScreen';
import NuevoEquipoScreen from './src/screens/NuevoEquipoScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs inferiores
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Partidos') iconName = 'people';
          else if (route.name === 'Dashboard') iconName = 'bar-chart';
          else if (route.name === 'Equipos') iconName = 'football';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Partidos" component={PartidosScreen} />
      <Tab.Screen name="Equipos" component={EquiposScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Pantalla principal con Tabs */}
        <Stack.Screen
          name="Volver"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        {/* Pantallas ocultas fuera del TabBar */}
        <Stack.Screen
          name="PartidoDetalle"
          component={PartidoDetalleScreen}
          options={({ route }: any) => ({
            title: route.params?.titulo || 'Partido',
          })}
        />

        <Stack.Screen
          name="ResumenPartido"
          component={ResumenPartidoScreen}
          options={({ route }: any) => ({
            title: route.params?.titulo || 'Resumen',
          })}
        />

        {/* Nuevas pantallas de equipos */}
        <Stack.Screen
          name="EquipoDetalle"
          component={EquipoDetalleScreen}
          options={({ route }: any) => ({
            title: route.params?.nombre || 'Detalles del equipo',
          })}
        />

        <Stack.Screen
          name="NuevoEquipo"
          component={NuevoEquipoScreen}
          options={{ title: 'Nuevo equipo' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
