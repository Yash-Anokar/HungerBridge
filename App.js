/**
 * HungerBridge - Main App Entry Point
 * =====================================
 * A real-time surplus food coordination app that connects
 * food donors, NGOs, and volunteers to reduce food waste.
 * 
 * Navigation Structure:
 *  Home → Donor | NGO | Volunteer | Dashboard
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import DonorScreen from './src/screens/DonorScreen';
import NGOScreen from './src/screens/NGOScreen';
import VolunteerScreen from './src/screens/VolunteerScreen';
import DashboardScreen from './src/screens/DashboardScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  headerTintColor: '#1A1A2E',
  headerTitleStyle: {
    fontWeight: '600',
    fontSize: 17,
    color: '#1A1A2E',
  },
  headerShadowVisible: true,
  contentStyle: {
    backgroundColor: '#F5F5F5',
  },
  animation: 'slide_from_right',
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={screenOptions}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Donor"
          component={DonorScreen}
          options={{
            title: 'Donate Food',
            headerBackTitle: 'Back',
          }}
        />

        <Stack.Screen
          name="NGO"
          component={NGOScreen}
          options={{
            title: 'NGO Dashboard',
            headerBackTitle: 'Back',
          }}
        />

        <Stack.Screen
          name="Volunteer"
          component={VolunteerScreen}
          options={{
            title: 'Volunteer Hub',
            headerBackTitle: 'Back',
          }}
        />

        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title: 'Dashboard',
            headerBackTitle: 'Back',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
