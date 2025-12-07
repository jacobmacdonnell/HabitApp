import React from 'react';
import { useHabit, HabitProvider } from '@habitapp/shared';
import { MobileStorageService } from './src/services/storage';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { XPNotificationProvider } from './src/context/XPNotificationContext';
import { migrateFromAsyncStorage } from './src/services/storage';
import { db } from './src/db/client';
import { useMigrationHelper } from './src/db/migrate';

// Initialize notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
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
  const { success, error } = useMigrationHelper();

  React.useEffect(() => {
    if (success) {
      migrateFromAsyncStorage();
    }
  }, [success]);

  if (!success && !error) return null; // Loading migrations

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <HabitProvider storage={MobileStorageService}>
            <XPNotificationProvider>
              <ThemedApp />
            </XPNotificationProvider>
          </HabitProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
