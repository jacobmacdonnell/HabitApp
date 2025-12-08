import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTheme } from '../../src/context/ThemeContext';
import { useHabit } from '@habitapp/shared';

export default function TabLayout() {
    const { colors: themeColors } = useTheme();
    const { pet } = useHabit();

    return (
        <NativeTabs
            // Native styling options
            tintColor={themeColors.accent} // Dynamic pet color
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
                    title: pet?.name || 'Pet',
                    icon: { sf: 'pawprint.circle.fill' },
                    selectedIcon: { sf: 'pawprint.circle.fill' },
                }}
            />
            <NativeTabs.Trigger
                name="trends"
                options={{
                    title: 'Streaks',
                    icon: { sf: 'flame.fill' },
                    selectedIcon: { sf: 'flame.fill' },
                }}
            />
            <NativeTabs.Trigger
                name="settings"
                options={{
                    title: 'Settings',
                    icon: { sf: 'slider.horizontal.3' }, // "Control Center" vibe
                    selectedIcon: { sf: 'slider.horizontal.3' },
                }}
            />
        </NativeTabs>
    );
}
