import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { LiquidGlassContainerView, LiquidGlassView } from '@callstack/liquid-glass';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SymbolView } from 'expo-symbols';

const AnimatedGlass = Animated.createAnimatedComponent(LiquidGlassView);

export const LiquidFab = () => {
    const isOpen = useSharedValue(0);

    const toggleMenu = () => {
        isOpen.value = withSpring(isOpen.value === 0 ? 1 : 0);
    };

    const itemStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: withSpring(isOpen.value === 1 ? -70 : 0) },
                { scale: withSpring(isOpen.value === 1 ? 1 : 0) }
            ],
            opacity: withSpring(isOpen.value)
        };
    });

    return (
        <View style={styles.container}>
            <LiquidGlassContainerView style={styles.morphContainer}>
                {/* Menu Item: Add Habit */}
                <AnimatedGlass style={[styles.fabItem, itemStyle]} interactive={true}>
                    <Pressable style={styles.content}>
                        <SymbolView name="plus" tintColor="#fff" size={24} />
                    </Pressable>
                </AnimatedGlass>

                {/* Main FAB Trigger */}
                <Pressable onPress={toggleMenu}>
                    <LiquidGlassView style={styles.fabMain} interactive={true}>
                        <SymbolView name="sparkles" tintColor="#fff" size={28} />
                    </LiquidGlassView>
                </Pressable>
            </LiquidGlassContainerView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 110, // Spaced to sit above the "Floating Dock"
        right: 20,
        zIndex: 100,
    },
    morphContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    fabMain: {
        width: 60,
        height: 60,
        borderRadius: 30, // Capsule/Circle
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabItem: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', // Hidden behind main FAB initially
        bottom: 5, // Center align with main FAB start pos
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    }
});
