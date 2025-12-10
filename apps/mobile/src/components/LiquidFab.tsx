import { SafeLiquidGlassView as LiquidGlassView } from './SafeLiquidGlassView';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

export const LiquidFab = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => router.push('/habit-form')}
                accessibilityLabel="Add new habit"
                accessibilityRole="button"
                accessibilityHint="Opens the habit creation form"
            >
                <LiquidGlassView
                    style={[styles.fabMain, { backgroundColor: 'rgba(28,28,30,0.5)' }]} // Manual dark tint
                    interactive
                >
                    <SymbolView name="plus" tintColor="#fff" size={28} />
                </LiquidGlassView>
            </Pressable>
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
    },
});
