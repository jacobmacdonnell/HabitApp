import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
 * Uses react-native-reanimated for 120fps UI-thread animations.
 * Per iOS 26 guidelines: withSpring for fluid, physics-based motion.
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
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = (event: any) => {
        scale.value = withSpring(scaleOnPress, { damping, stiffness });
        onPressIn?.(event);
    };

    const handlePressOut = (event: any) => {
        scale.value = withSpring(1, { damping, stiffness });
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
}
