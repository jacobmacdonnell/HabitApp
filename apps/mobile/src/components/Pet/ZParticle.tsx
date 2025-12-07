import React, { useEffect, useRef } from 'react';
import { Text, Animated, Easing, StyleSheet } from 'react-native';

/**
 * ZParticle - Floating "z" animation for sleeping pet
 * Extracted from Pet.tsx for better maintainability
 */
interface ZParticleProps {
    delay: number;
    xOffset: number;
    size?: number;
}

export const ZParticle = ({ delay, xOffset, size = 24 }: ZParticleProps) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const liftAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = () => {
            fadeAnim.setValue(0);
            liftAnim.setValue(0);
            scaleAnim.setValue(0.5);
            rotateAnim.setValue(0);

            Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                    // Fade in then out
                    Animated.sequence([
                        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                        Animated.delay(800),
                        Animated.timing(fadeAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
                    ]),
                    // Float upward
                    Animated.timing(liftAnim, {
                        toValue: -60,
                        duration: 1800,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                    // Scale up as it rises
                    Animated.timing(scaleAnim, {
                        toValue: 1.2,
                        duration: 1800,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    // Gentle rotation
                    Animated.timing(rotateAnim, {
                        toValue: 1,
                        duration: 1800,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ]).start(() => animate());
        };
        animate();
    }, []);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['-15deg', '15deg']
    });

    return (
        <Animated.View style={{
            position: 'absolute',
            left: xOffset,
            top: 50,
            opacity: fadeAnim,
            transform: [
                { translateY: liftAnim },
                { scale: scaleAnim },
                { rotate: rotate }
            ]
        }}>
            <Text style={[styles.zText, { fontSize: size }]}>z</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    zText: {
        fontSize: 24,
        fontWeight: '700',
        fontStyle: 'italic',
        color: 'rgba(255,255,255,0.7)',
        textShadowColor: 'rgba(255,255,255,0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
});
