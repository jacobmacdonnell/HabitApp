import { Stack } from 'expo-router';

export default function TrendsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTransparent: true,
                headerBlurEffect: 'systemMaterialDark',
                headerLargeTitle: true,
                headerLargeTitleShadowVisible: false,
                headerShadowVisible: false,
                contentStyle: { backgroundColor: '#1c1c1e' },
                headerTintColor: '#fff',
                headerLargeTitleStyle: {
                    color: '#fff',
                },
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
