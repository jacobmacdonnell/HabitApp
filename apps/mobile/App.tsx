import React from 'react';
import { useHabit, HabitProvider } from '@habitapp/shared';
import { MobileStorageService } from './src/services/storage';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

// Initialize notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const ThemedApp = () => {
  const { settings } = useHabit();

  // Determine status bar style
  const statusBarStyle =
    settings.theme === 'light' ? 'dark' :
      settings.theme === 'dark' ? 'light' :
        'auto'; // or default to light/dark based on system

  return (
    <>
      <AppNavigator />
      <StatusBar style={statusBarStyle === 'auto' ? 'light' : statusBarStyle} />
    </>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HabitProvider storage={MobileStorageService}>
          <ThemedApp />
        </HabitProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
