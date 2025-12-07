import { Stack } from 'expo-router';

export default function TrendsLayout() {
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
                    title: 'Trends',
                    headerLargeTitle: true,
                }}
            />
        </Stack>
    );
}
