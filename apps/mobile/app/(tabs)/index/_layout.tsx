import { Stack } from 'expo-router';

export default function TodayLayout() {
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
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Today',
                    headerLargeTitle: true,
                }}
            />
        </Stack>
    );
}
