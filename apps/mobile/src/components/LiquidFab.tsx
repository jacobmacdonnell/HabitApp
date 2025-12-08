import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { LiquidGlassView } from '@callstack/liquid-glass';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';



export const LiquidFab = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Pressable onPress={() => router.push('/habit-form')}>
                <LiquidGlassView style={styles.fabMain} interactive={true}>
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
    }
});
