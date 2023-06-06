import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Active from './src/screens/Active';
import Definitions from './src/screens/Definitions';
import DefinitionEdit from './src/screens/DefinitionEdit';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
          <Stack.Screen
            name="Active"
            component={Active}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Definitions"
            component={Definitions}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DefinitionEdit"
            component={DefinitionEdit}
            options={{ headerShown: false }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}