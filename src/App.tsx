import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import "@/global.css";
import { GluestackUIProvider } from "./../components/ui/gluestack-ui-provider";
import {HomeScreen} from './navigation/screens/Home';
import AltaScreen from './navigation/screens/Alta';
import ListadoScreen from './navigation/screens/Listado';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <GluestackUIProvider mode="light">
        <NavigationContainer>
          <Drawer.Navigator>
            <Drawer.Screen name="Athenea Museum" component={HomeScreen} />
            <Drawer.Screen name="Alta de Obras" component={AltaScreen} />
            <Drawer.Screen name="Listado de Obras" component={ListadoScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </GluestackUIProvider>
    </NativeBaseProvider>
  );
}
