import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { LiquidGlass } from '../theme/theme';

interface SwipeTutorialProps {
    onDismiss: () => void;
    cardTop: number;
}

export const SwipeTutorial = ({ onDismiss, cardTop }: SwipeTutorialProps) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-8)).current;
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Smooth fade in
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 400,
                delay: 600,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 400,
                delay: 600,
                useNativeDriver: true,
            }),
        ]).start();

        // Stay until after both bounces + extra time
        const timer = setTimeout(() => {
            fadeOut();
        }, 6000);

        return () => clearTimeout(timer);
    }, []);

    const fadeOut = () => {
        if (dismissed) return;
        setDismissed(true);

        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 8,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start(() => onDismiss());
    };

    return (
        <TouchableOpacity style={[styles.container, { top: cardTop }]} activeOpacity={1} onPress={fadeOut}>
            <Animated.View
                style={[
                    styles.tooltip,
                    {
                        opacity,
                        transform: [{ translateY }],
                    },
                ]}
            >
                <Text style={styles.arrow}>←</Text>
                <Text style={styles.tooltipText}>Swipe for options</Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 100,
    },
    tooltip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: LiquidGlass.colors.primary, // Using primary for the green background
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        gap: 6,
        shadowColor: LiquidGlass.colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    arrow: {
        fontSize: 14,
        color: LiquidGlass.colors.white,
        fontWeight: '700',
    },
    tooltipText: {
        fontSize: 13,
        fontWeight: '600',
        color: LiquidGlass.colors.white,
    },
});
