import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
    return (
        <NativeTabs
            // Native styling options
            tintColor="#007AFF" // Native blue, or use white for dark theme if preferred
            backgroundColor={null} // Transparent to allow blur
            blurEffect="systemMaterial" // The "Liquid Glass" effect
            shadowColor="transparent" // Clean look
        >
            <NativeTabs.Trigger
                name="index"
                options={{
                    title: 'Today',
                    // Using SF Symbols for true native iOS appearance
                    icon: { sf: 'house' },
                    selectedIcon: { sf: 'house.fill' },
                }}
            />
            <NativeTabs.Trigger
                name="pet"
                options={{
                    title: 'Pet',
                    icon: { sf: 'person' },
                    selectedIcon: { sf: 'person.fill' },
                }}
            />
            <NativeTabs.Trigger
                name="trends"
                options={{
                    title: 'Trends',
                    icon: { sf: 'chart.xyaxis.line' },
                    selectedIcon: { sf: 'chart.xyaxis.line' },
                }}
            />
            <NativeTabs.Trigger
                name="settings"
                options={{
                    title: 'Settings',
                    icon: { sf: 'gearshape' },
                    selectedIcon: { sf: 'gearshape.fill' },
                }}
            />
        </NativeTabs>
    );
}
