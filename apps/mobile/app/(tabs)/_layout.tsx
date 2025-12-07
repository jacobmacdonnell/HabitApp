import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { LiquidGlass } from '../../src/theme/theme';

export default function TabLayout() {
    return (
        <NativeTabs
            // Native styling options
            tintColor={LiquidGlass.colors.primary} // Brand primary green
            backgroundColor={null} // Transparent to allow blur
            blurEffect="systemMaterial" // The "Liquid Glass" effect
            shadowColor="transparent" // Clean look
        >
            <NativeTabs.Trigger
                name="home"
                options={{
                    title: 'Home',
                    // Using SF Symbols for true native iOS appearance
                    icon: { sf: 'house.fill' },
                    selectedIcon: { sf: 'house.fill' },
                }}
            />
            <NativeTabs.Trigger
                name="pet"
                options={{
                    title: 'Pet',
                    icon: { sf: 'pawprint.fill' },
                    selectedIcon: { sf: 'pawprint.fill' },
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
                    icon: { sf: 'gearshape.fill' },
                    selectedIcon: { sf: 'gearshape.fill' },
                }}
            />
        </NativeTabs>
    );
}
