import React, { useEffect } from 'react';
import { useHabit, HabitProvider } from '@habitapp/shared';
import { MobileStorageService } from '../src/services/storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { XPNotificationProvider } from '../src/context/XPNotificationContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import { migrateFromAsyncStorage } from '../src/services/storage';
import { useMigrationHelper } from '../src/db/migrate';
import { Stack, SplashScreen } from 'expo-router';
import { LiquidGlass } from '../src/theme/theme';

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

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const ThemedRoot = () => {
    const { settings } = useHabit();

    // Determine status bar style
    const statusBarStyle =
        settings.theme === 'light' ? 'dark' :
            settings.theme === 'dark' ? 'light' :
                'auto';

    return (
        <>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: LiquidGlass.backgroundColor } }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="habit-form"
                    options={{
                        presentation: 'modal',
                        headerShown: true,
                        headerStyle: { backgroundColor: LiquidGlass.backgroundColor },
                        headerTintColor: '#fff',
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="pet-customize"
                    options={{
                        presentation: 'modal',
                        headerShown: true,
                        headerStyle: { backgroundColor: LiquidGlass.backgroundColor },
                        headerTintColor: '#fff',
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style={statusBarStyle === 'auto' ? 'light' : statusBarStyle} />
        </>
    );
};

export default function RootLayout() {
    const { success, error } = useMigrationHelper();

    useEffect(() => {
        if (success) {
            migrateFromAsyncStorage();
            SplashScreen.hideAsync();
        }
    }, [success]);

    if (!success && !error) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ErrorBoundary>
                    <HabitProvider storage={MobileStorageService}>
                        <ThemeProvider>
                            <XPNotificationProvider>
                                <ThemedRoot />
                            </XPNotificationProvider>
                        </ThemeProvider>
                    </HabitProvider>
                </ErrorBoundary>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
