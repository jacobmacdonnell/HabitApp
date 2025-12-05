import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { HabitProvider } from '@habitapp/shared';
import { MobileStorageService } from './src/services/storage';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HabitProvider storage={MobileStorageService}>
          <AppNavigator />
          <StatusBar style="light" />
        </HabitProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
