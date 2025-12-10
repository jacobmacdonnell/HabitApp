import { SafeLiquidGlassView as LiquidGlassView } from '../components/SafeLiquidGlassView';
import { useHabit } from '@habitapp/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassButton } from '../components/GlassButton';
import { Pet } from '../components/Pet';

const { width, height } = Dimensions.get('window');

type HatchingPhase = 'egg' | 'cracking' | 'hatched' | 'speaking';

export const HatchingScreen = () => {
    const { pet, setIsOnboarding } = useHabit();
    const insets = useSafeAreaInsets();
    const [phase, setPhase] = useState<HatchingPhase>('egg');

    // Animations
    const eggScale = useRef(new Animated.Value(1)).current;
    const eggShake = useRef(new Animated.Value(0)).current;
    const petScale = useRef(new Animated.Value(0)).current;
    const petOpacity = useRef(new Animated.Value(0)).current;
    const bubbleOpacity = useRef(new Animated.Value(0)).current;
    const bubbleScale = useRef(new Animated.Value(0.8)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current;
    const crackOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Reset swipe hint for new users coming from onboarding
        AsyncStorage.removeItem('hasSeenSwipeHint');
        // Start the hatching sequence
        startHatchingSequence();
    }, []);

    const startHatchingSequence = async () => {
        // Phase 1: Egg shakes (1.5s)
        await shakeEgg();

        // Phase 2: Egg cracks and shrinks (0.5s)
        setPhase('cracking');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await crackEgg();

        // Phase 3: Pet appears and speech bubble shows together
        setPhase('hatched');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Start pet reveal animation
        revealPet();

        // Show continue button immediately
        Animated.timing(buttonOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Phase 4: Speech bubble appears shortly after
        setTimeout(() => {
            setPhase('speaking');
        }, 100);
    };

    const shakeEgg = () => {
        return new Promise<void>((resolve) => {
            // Shake animation sequence
            const shakeSequence = Animated.sequence([
                // Wait a moment
                Animated.delay(500),
                // Shake 1
                Animated.sequence([
                    Animated.timing(eggShake, { toValue: 10, duration: 50, useNativeDriver: true }),
                    Animated.timing(eggShake, { toValue: -10, duration: 50, useNativeDriver: true }),
                    Animated.timing(eggShake, { toValue: 8, duration: 50, useNativeDriver: true }),
                    Animated.timing(eggShake, { toValue: -8, duration: 50, useNativeDriver: true }),
                    Animated.timing(eggShake, { toValue: 0, duration: 50, useNativeDriver: true }),
                ]),
                Animated.delay(300),
                // Shake 2 - stronger
                Animated.sequence([
                    Animated.timing(eggShake, { toValue: 15, duration: 40, useNativeDriver: true }),
                    Animated.timing(eggShake, { toValue: -15, duration: 40, useNativeDriver: true }),
                    Animated.timing(eggShake, { toValue: 12, duration: 40, useNativeDriver: true }),
                    Animated.timing(eggShake, { toValue: -12, duration: 40, useNativeDriver: true }),
                    Animated.timing(eggShake, { toValue: 8, duration: 40, useNativeDriver: true }),
                    Animated.timing(eggShake, { toValue: -8, duration: 40, useNativeDriver: true }),
                    Animated.timing(eggShake, { toValue: 0, duration: 40, useNativeDriver: true }),
                ]),
            ]);

            shakeSequence.start(() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                resolve();
            });
        });
    };

    const crackEgg = () => {
        return new Promise<void>((resolve) => {
            Animated.parallel([
                // Show cracks
                Animated.timing(crackOpacity, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                // Egg shrinks and fades
                Animated.timing(eggScale, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.back(2),
                    useNativeDriver: true,
                }),
            ]).start(() => resolve());
        });
    };

    const revealPet = () => {
        return new Promise<void>((resolve) => {
            Animated.parallel([
                Animated.spring(petScale, {
                    toValue: 1,
                    friction: 4,
                    tension: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(petOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => resolve());
        });
    };

    const showSpeechBubble = () => {
        return new Promise<void>((resolve) => {
            Animated.parallel([
                Animated.timing(bubbleOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(bubbleScale, {
                    toValue: 1,
                    friction: 6,
                    tension: 150,
                    useNativeDriver: true,
                }),
            ]).start(() => resolve());
        });
    };

    const handleContinue = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsOnboarding(false);
        router.replace('/home');
    };

    return (
        <View style={styles.container}>
            {/* Ambient Background */}
            <View style={[styles.blob, { backgroundColor: pet?.color || '#FF6B6B', top: -100, left: -100 }]} />
            <View style={[styles.blob, { backgroundColor: '#6366f1', bottom: -100, right: -100 }]} />

            <View style={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 32 }]}>
                {/* Title */}
                <Text style={styles.title}>
                    {phase === 'egg' || phase === 'cracking'
                        ? 'Something is happening...'
                        : `${pet?.name || 'Your Pet'} has hatched!`}
                </Text>

                {/* Egg / Pet Container */}
                <View style={styles.petContainer}>
                    {/* Egg (visible during egg and cracking phases) */}
                    {(phase === 'egg' || phase === 'cracking') && (
                        <Animated.View
                            style={[
                                styles.eggWrapper,
                                {
                                    transform: [{ translateX: eggShake }, { scale: eggScale }],
                                },
                            ]}
                        >
                            <View style={[styles.eggGlow, { backgroundColor: `${pet?.color || '#FF6B6B'}30` }]}>
                                <Text style={styles.eggEmoji}>🥚</Text>
                            </View>
                            {/* Crack marks */}
                            <Animated.Text style={[styles.crackMark, { opacity: crackOpacity }]}>💥</Animated.Text>
                        </Animated.View>
                    )}

                    {/* Pet (visible after hatching) - uses Pet's native speech bubble */}
                    {(phase === 'hatched' || phase === 'speaking') && (
                        <Animated.View
                            style={[
                                styles.petWrapper,
                                {
                                    opacity: petOpacity,
                                    transform: [{ scale: petScale }],
                                },
                            ]}
                        >
                            <Pet
                                pet={pet}
                                isFullView
                                hideStats
                                disablePress
                                initialSpeechText={
                                    phase === 'speaking'
                                        ? `Hi! I'm ${pet?.name || 'your new friend'}! Let's build great habits together! 🎉`
                                        : undefined
                                }
                                feedingBounce={0}
                            />
                        </Animated.View>
                    )}
                </View>

                {/* Continue Button */}
                <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
                    <GlassButton
                        title="Let's Go!"
                        onPress={handleContinue}
                        icon={<ArrowRight size={20} color="#000" />}
                        style={{ width: '100%' }}
                    />
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c1e',
    },
    blob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.4,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
    },
    petContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eggWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    eggGlow: {
        width: 180,
        height: 220,
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eggEmoji: {
        fontSize: 120,
    },
    crackMark: {
        position: 'absolute',
        fontSize: 60,
        top: '30%',
    },
    petWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 20,
    },
});
