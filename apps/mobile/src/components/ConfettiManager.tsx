import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Types
interface ConfettiBurst {
    id: string;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    color: string;
    timestamp: number;
}

interface ConfettiParticleProps {
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    color: string;
    delay: number;
    index: number;
    onReachTarget?: () => void;
}

// Individual confetti particle - flows smoothly from checkbox to pet
const ConfettiParticle = ({ startX, startY, targetX, targetY, color, delay, index, onReachTarget }: ConfettiParticleProps) => {
    const progress = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.3)).current;
    const rotation = useRef(new Animated.Value(0)).current;

    // Calculate smooth arc path
    const spreadX = (Math.random() - 0.5) * 60; // Initial spread
    const arcPeakY = Math.min(startY, targetY) - 60 - Math.random() * 40; // Arc peak above both points

    useEffect(() => {
        const hasCalledTarget = { value: false };

        Animated.sequence([
            // Staggered delay for cascade effect
            Animated.delay(delay),
            Animated.parallel([
                // Gentle fade in
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                }),
                // Smooth scale up
                Animated.spring(scale, {
                    toValue: 1,
                    friction: 6,
                    tension: 100,
                    useNativeDriver: true
                }),
                // Smooth path progress (0 to 1) - SLOWER
                Animated.timing(progress, {
                    toValue: 1,
                    duration: 1200 + Math.random() * 400, // 1.2-1.6 seconds
                    useNativeDriver: true
                }),
                // Gentle spin
                Animated.timing(rotation, {
                    toValue: 2 + Math.random() * 2,
                    duration: 1400,
                    useNativeDriver: true
                }),
            ]),
            // Gentle shrink and fade into pet
            Animated.parallel([
                Animated.timing(scale, {
                    toValue: 0.2,
                    duration: 300,
                    useNativeDriver: true
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                }),
            ]),
        ]).start(() => {
            // Notify when particle reaches target (only first particle triggers pet reaction)
            if (index === 0 && onReachTarget && !hasCalledTarget.value) {
                hasCalledTarget.value = true;
                onReachTarget();
            }
        });
    }, []);

    // Smooth bezier-like curve interpolation
    // Stage 1 (0-0.3): Burst out with spread
    // Stage 2 (0.3-0.7): Arc upward
    // Stage 3 (0.7-1.0): Converge smoothly to pet
    const translateX = progress.interpolate({
        inputRange: [0, 0.25, 0.5, 1],
        outputRange: [startX, startX + spreadX, startX + spreadX * 0.5, targetX],
    });

    const translateY = progress.interpolate({
        inputRange: [0, 0.3, 0.6, 1],
        outputRange: [startY, arcPeakY, arcPeakY + 20, targetY],
    });

    const spin = rotation.interpolate({
        inputRange: [0, 4],
        outputRange: ['0deg', '1440deg'],
    });

    // Particle shapes - varied
    const shapes = ['circle', 'square', 'diamond'];
    const shape = shapes[index % 3];

    return (
        <Animated.View
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                opacity,
                transform: [
                    { translateX },
                    { translateY },
                    { scale },
                    { rotate: spin }
                ],
            }}
        >
            <View
                style={[
                    styles.particle,
                    { backgroundColor: color },
                    shape === 'circle' && styles.circle,
                    shape === 'square' && styles.square,
                    shape === 'diamond' && styles.diamond,
                ]}
            />
        </Animated.View>
    );
};

// Hook to use confetti in any component
export const useConfetti = () => {
    const [bursts, setBursts] = useState<ConfettiBurst[]>([]);
    const [petPosition, setPetPosition] = useState({ x: SCREEN_WIDTH / 2, y: 100 });

    const triggerConfetti = useCallback((x: number, y: number, color: string) => {
        const id = `${Date.now()}-${Math.random()}`;
        const newBurst: ConfettiBurst = {
            id,
            x,
            y,
            // Target the stored pet position
            targetX: petPosition.x,
            targetY: petPosition.y,
            color,
            timestamp: Date.now()
        };

        setBursts(prev => [...prev, newBurst]);

        // Remove burst after animation completes (longer duration now)
        setTimeout(() => {
            setBursts(prev => prev.filter(b => b.id !== id));
        }, 2000);
    }, [petPosition]);

    // Allow updating pet position
    const updatePetPosition = useCallback((x: number, y: number) => {
        setPetPosition({ x, y });
    }, []);

    return { bursts, triggerConfetti, updatePetPosition, petPosition };
};

// Confetti colors palette - vibrant and celebratory
const CONFETTI_COLORS = [
    '#FFD700', // Gold
    '#FF6B6B', // Coral
    '#4ECDC4', // Teal
    '#A06CD5', // Purple
    '#FF85C0', // Pink
    '#85FF9E', // Green
    '#FFB347', // Orange
    '#87CEEB', // Sky blue
    '#FF69B4', // Hot pink
    '#98FB98', // Pale green
];

// Container component that renders all confetti bursts
interface ConfettiManagerProps {
    bursts: ConfettiBurst[];
    onParticleReachPet?: () => void;
}

export const ConfettiManager = ({ bursts, onParticleReachPet }: ConfettiManagerProps) => {
    if (bursts.length === 0) return null;

    return (
        <View style={styles.container} pointerEvents="none">
            {bursts.map(burst => (
                <View key={burst.id}>
                    {/* Generate 8 particles per burst - spread for smooth cascade */}
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ConfettiParticle
                            key={`${burst.id}-${i}`}
                            startX={burst.x}
                            startY={burst.y}
                            targetX={burst.targetX + (Math.random() - 0.5) * 30}
                            targetY={burst.targetY + (Math.random() - 0.5) * 15}
                            color={i === 0 ? burst.color : CONFETTI_COLORS[i % CONFETTI_COLORS.length]}
                            delay={i * 60} // Slower stagger for cascade effect
                            index={i}
                            onReachTarget={i === 0 ? onParticleReachPet : undefined}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
    },
    particle: {
        width: 10,
        height: 10,
    },
    circle: {
        borderRadius: 5,
    },
    square: {
        borderRadius: 2,
    },
    diamond: {
        borderRadius: 2,
        transform: [{ rotate: '45deg' }],
    },
});
