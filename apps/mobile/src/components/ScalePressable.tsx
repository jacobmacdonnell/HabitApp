import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Pressable, PressableProps, StyleProp, ViewStyle, Platform } from 'react-native';

// Runtime detection of Reanimated availability
let reanimatedAvailable = false;
let Animated: typeof import('react-native-reanimated').default | null = null;
let useSharedValue: typeof import('react-native-reanimated').useSharedValue | null = null;
let useAnimatedStyle: typeof import('react-native-reanimated').useAnimatedStyle | null = null;
let withSpring: typeof import('react-native-reanimated').withSpring | null = null;

// Try to load Reanimated - this will work in production builds
try {
    const reanimated = require('react-native-reanimated');
    // Check if the native module is actually available (not just JS)
    if (reanimated.default && typeof reanimated.useSharedValue === 'function') {
        Animated = reanimated.default;
        useSharedValue = reanimated.useSharedValue;
        useAnimatedStyle = reanimated.useAnimatedStyle;
        withSpring = reanimated.withSpring;
        reanimatedAvailable = true;
    }
} catch {
    // Reanimated not available (Expo Go or missing native modules)
    reanimatedAvailable = false;
}

interface ScalePressableProps extends Omit<PressableProps, 'style'> {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    /** Scale factor when pressed (default: 0.95) */
    scaleOnPress?: number;
    /** Spring damping - lower = more bouncy (default: 15) */
    damping?: number;
    /** Spring stiffness - higher = faster (default: 150) */
    stiffness?: number;
}

/**
 * A Pressable component with native spring-based scale animation.
 * Uses react-native-reanimated for 120fps UI-thread animations in production.
 * Falls back to simple TouchableOpacity in Expo Go.
 */
export function ScalePressable({
    children,
    style,
    scaleOnPress = 0.95,
    damping = 15,
    stiffness = 150,
    onPressIn,
    onPressOut,
    ...props
}: ScalePressableProps) {
    // Check if Reanimated threw an error during initialization
    const [hasError, setHasError] = useState(false);

    // Fallback for Expo Go or when Reanimated fails
    if (!reanimatedAvailable || hasError || !Animated || !useSharedValue || !useAnimatedStyle || !withSpring) {
        return (
            <TouchableOpacity
                style={style as any}
                activeOpacity={scaleOnPress}
                onPressIn={onPressIn as any}
                onPressOut={onPressOut as any}
                {...(props as any)}
            >
                {children}
            </TouchableOpacity>
        );
    }

    // Production: Use Reanimated for smooth spring animations
    try {
        const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
        const scale = useSharedValue(1);

        const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }],
        }));

        const handlePressIn = (event: any) => {
            scale.value = withSpring!(scaleOnPress, { damping, stiffness });
            onPressIn?.(event);
        };

        const handlePressOut = (event: any) => {
            scale.value = withSpring!(1, { damping, stiffness });
            onPressOut?.(event);
        };

        return (
            <AnimatedPressable
                style={[animatedStyle, style]}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                {...props}
            >
                {children}
            </AnimatedPressable>
        );
    } catch (e) {
        // If Reanimated fails at runtime, fall back
        console.warn('ScalePressable: Reanimated failed, using fallback', e);
        return (
            <TouchableOpacity
                style={style as any}
                activeOpacity={scaleOnPress}
                onPressIn={onPressIn as any}
                onPressOut={onPressOut as any}
                {...(props as any)}
            >
                {children}
            </TouchableOpacity>
        );
    }
}
