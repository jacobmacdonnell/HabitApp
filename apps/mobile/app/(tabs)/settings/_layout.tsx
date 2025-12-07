import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function SettingsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#1c1c1e' },
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
