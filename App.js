import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MessageList from './MessageList';
import MessageView from './MessageView';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MessageList" component={MessageList} />
        <Stack.Screen name="MessageView" component={MessageView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;