import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './src/screens/Dashboard';
import Definitions from './src/screens/Definitions';
import DefinitionEdit from './src/screens/DefinitionEdit';
import Task from './src/screens/Task';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
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
          <Stack.Screen
            name="Task"
            component={Task}
            options={{ headerShown: false }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}