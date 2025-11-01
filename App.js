import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import theme from './src/theme';
import DatabaseProvider from './src/context/DatabaseContext';
import HomeScreen from './src/screens/HomeScreen';
import FlightListScreen from './src/screens/FlightListScreen';
import CartScreen from './src/screens/CartScreen';
import BookingScreen from './src/screens/BookingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <DatabaseProvider>
          <StatusBar style="light" />
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#DC143C',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen 
                name="Home" 
                component={HomeScreen}
                options={{ title: 'Uçak Rezervasyon' }}
              />
              <Stack.Screen 
                name="FlightList" 
                component={FlightListScreen}
                options={{ title: 'Uçuş Sonuçları' }}
              />
              <Stack.Screen 
                name="Cart" 
                component={CartScreen}
                options={{ title: 'Sepetim' }}
              />
              <Stack.Screen 
                name="Booking" 
                component={BookingScreen}
                options={{ title: 'Rezervasyon Bilgileri' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </DatabaseProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

