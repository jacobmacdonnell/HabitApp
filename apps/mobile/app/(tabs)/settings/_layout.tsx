import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function SettingsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTransparent: true,
                headerBlurEffect: 'systemMaterialDark', // Matches our dark theme liquid glass
                headerLargeTitle: true,
                headerLargeTitleShadowVisible: false,
                headerShadowVisible: false, // Clean glass look
                contentStyle: { backgroundColor: '#1c1c1e' }, // Match app background
                headerTintColor: '#fff',
                headerLargeTitleStyle: {
                    color: '#fff',
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Settings',
                    headerLargeTitle: true,
                }}
            />
        </Stack>
    );
}
