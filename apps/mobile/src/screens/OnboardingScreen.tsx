import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Animated, Easing, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHabit, TimeOfDay } from '@habitapp/shared';
import { HABIT_COLORS } from '@habitapp/shared/src/constants';
import { LiquidGlassView } from '@callstack/liquid-glass';
import { GlassSegmentedControl } from '../components/GlassSegmentedControl';
import { ArrowRight, Check, Minus, Plus, Sparkles } from 'lucide-react-native';

import { GlassButton } from '../components/GlassButton';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { validatePetName } from '../utils/validation';
import { Alert } from 'react-native';

const { width, height } = Dimensions.get('window');

const PRESETS = [
    { id: 'water', title: 'Drink Water', icon: '💧', color: '#4ECDC4', defaultTarget: 3, defaultTime: 'anytime' },
    { id: 'read', title: 'Read 10 mins', icon: '📚', color: '#FFE66D', defaultTarget: 1, defaultTime: 'evening' },
    { id: 'walk', title: 'Take a Walk', icon: '👣', color: '#FF6B6B', defaultTarget: 1, defaultTime: 'morning' },
    { id: 'meditate', title: 'Meditate', icon: '🧘', color: '#A06CD5', defaultTarget: 1, defaultTime: 'morning' },
    { id: 'journal', title: 'Journal', icon: '✍️', color: '#FF8C42', defaultTarget: 1, defaultTime: 'evening' },
    { id: 'exercise', title: 'Exercise', icon: '💪', color: '#FF6B6B', defaultTarget: 1, defaultTime: 'anytime' },
];

export const OnboardingScreen = () => {
    const { resetPet, addHabit, setIsOnboarding } = useHabit();
    const insets = useSafeAreaInsets();
    const [step, setStep] = useState(0);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const eggPulse = useRef(new Animated.Value(1)).current;
    const cardScales = useRef(PRESETS.map(() => new Animated.Value(1))).current;

    // Step 1: Pet Data
    const [petName, setPetName] = useState('');
    const [petColor, setPetColor] = useState('#FF6B6B');

    // Step 2: Habit Data
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
    const [customHabit, setCustomHabit] = useState('');

    // Step 3: Habit Details
    const [targetCount, setTargetCount] = useState(1);
    const [timeOfDay, setTimeOfDay] = useState<'morning' | 'midday' | 'evening' | 'anytime'>('anytime');

    // Egg pulse animation
    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(eggPulse, { toValue: 1.05, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(eggPulse, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    // Animate step transitions
    const animateToStep = (newStep: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: newStep > step ? -30 : 30, duration: 150, useNativeDriver: true }),
        ]).start(() => {
            setStep(newStep);
            slideAnim.setValue(newStep > step ? 30 : -30);
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
            ]).start();
        });
    };

    const handleNext = () => {
        if (step === 1) {
            const validation = validatePetName(petName);
            if (!validation.isValid) {
                Alert.alert(
                    validation.error?.includes('under 12') ? 'Too Long' :
                        validation.error?.includes('friendly') ? 'Whoops!' : 'Name Required',
                    validation.error
                );
                return;
            }
        }
        animateToStep(step + 1);
    };
    const handleBack = () => animateToStep(step - 1);

    // Card selection with haptic + scale animation
    const handlePresetSelect = (presetId: string, index: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Bounce the selected card
        Animated.sequence([
            Animated.timing(cardScales[index], { toValue: 0.95, duration: 50, useNativeDriver: true }),
            Animated.spring(cardScales[index], { toValue: 1, friction: 3, tension: 200, useNativeDriver: true }),
        ]).start();

        const preset = PRESETS.find(p => p.id === presetId);
        setSelectedPreset(presetId);
        setCustomHabit('');
        if (preset) {
            setTargetCount(preset.defaultTarget);
            setTimeOfDay(preset.defaultTime as TimeOfDay);
        }
    };

    // Color selection haptic
    const handleColorSelect = (color: string) => {
        Haptics.selectionAsync();
        setPetColor(color);
    };

    // Counter haptic
    const handleCounterChange = (delta: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setTargetCount(prev => Math.max(1, Math.min(99, prev + delta)));
    };

    const handleFinish = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // 1. Create Pet
        resetPet(petName || 'Pet', petColor);

        // 2. Create First Habit
        if (selectedPreset) {
            const preset = PRESETS.find(p => p.id === selectedPreset);
            if (preset) {
                addHabit({
                    title: preset.title,
                    icon: preset.icon,
                    color: preset.color,
                    targetCount: targetCount,
                    timeOfDay: timeOfDay,
                    frequency: { type: 'daily', days: [] }
                });
            }
        } else if (customHabit) {
            addHabit({
                title: customHabit,
                icon: '⚡',
                color: '#FF8C42',
                targetCount: targetCount,
                timeOfDay: timeOfDay,
                frequency: { type: 'daily', days: [] }
            });
        }

        // Navigate to hatching screen for the pet reveal moment
        // (isOnboarding is set to false in HatchingScreen after animation)
        router.replace('/hatching');
    };

    return (
        <View style={styles.container}>
            {/* Ambient Background */}
            <View style={[styles.blob, { backgroundColor: petColor, top: -100, left: -100 }]} />
            <View style={[styles.blob, { backgroundColor: '#6366f1', bottom: -100, right: -100 }]} />


            {/* Progress Dots - at top with safe area */}
            <View style={[styles.progressContainer, { paddingTop: insets.top + 20 }]}>
                {[0, 1, 2, 3].map(i => (
                    <View
                        key={i}
                        style={[
                            styles.progressDot,
                            i <= step ? styles.progressDotActive : styles.progressDotInactive
                        ]}
                    />
                ))}
            </View>

            <View style={[styles.mainContent, { paddingBottom: insets.bottom + 32 }]}>
                {/* STEP 0: WELCOME */}
                {step === 0 && (
                    <View style={styles.welcomeContainer}>
                        <View style={styles.welcomeTop}>
                            <View style={styles.welcomeIcon}>
                                <Sparkles size={40} color="#fff" />
                            </View>
                            <Text style={styles.heroTitle}>Habit Companion</Text>
                            <Text style={styles.heroSubtitle}>
                                Build better habits with your digital pet. Complete habits, earn XP, and watch your companion grow!
                            </Text>
                        </View>
                        <View style={styles.welcomeBottom}>
                            <GlassButton
                                title="Get Started"
                                onPress={handleNext}
                                icon={<ArrowRight size={20} color="#000" />}
                                style={{ width: '100%' }}
                            />
                        </View>
                    </View>
                )}

                {/* STEP 1: PET SETUP */}
                {step === 1 && (
                    <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
                        <View style={styles.stepHeader}>
                            <Text style={styles.title}>Name Your Companion</Text>
                            <Text style={styles.subtitle}>This little friend will grow as you improve.</Text>
                        </View>

                        <View style={styles.card}>
                            {/* Egg Preview with pulse */}
                            <Animated.View style={[styles.eggContainer, { backgroundColor: `${petColor}20`, borderColor: `${petColor}40`, transform: [{ scale: eggPulse }] }]}>
                                <Text style={{ fontSize: 56 }}>🥚</Text>
                            </Animated.View>

                            <View style={styles.inputRow}>
                                <TextInput
                                    placeholder="Name your pet..."
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    value={petName}
                                    onChangeText={setPetName}
                                    style={styles.input}
                                />
                            </View>

                            <Text style={styles.colorLabel}>Choose a color</Text>
                            <View style={styles.colorRow}>
                                {HABIT_COLORS.slice(0, 6).map((c) => (
                                    <TouchableOpacity
                                        key={c}
                                        style={[styles.colorDot, { backgroundColor: c }, petColor === c && styles.colorSelected]}
                                        onPress={() => handleColorSelect(c)}
                                    />
                                ))}
                            </View>
                        </View>

                        <View style={styles.buttonRow}>
                            <GlassButton
                                title="Back"
                                variant="secondary"
                                onPress={handleBack}
                                style={{ flex: 0.4 }}
                            />
                            <GlassButton
                                title="Continue"
                                onPress={handleNext}
                                disabled={!petName.trim()}
                                style={{ flex: 1 }}
                            />
                        </View>
                    </ScrollView>
                )}

                {/* STEP 2: HABIT SELECTION */}
                {step === 2 && (
                    <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
                        <View style={styles.stepHeader}>
                            <Text style={styles.title}>Pick Your First Habit</Text>
                            <Text style={styles.subtitle}>Start small. You can add more later.</Text>
                        </View>

                        <View style={styles.grid}>
                            {PRESETS.map((preset, index) => (
                                <TouchableOpacity
                                    key={preset.id}
                                    activeOpacity={0.8}
                                    onPress={() => handlePresetSelect(preset.id, index)}
                                    style={{ width: '48%' }}
                                >
                                    <Animated.View style={[
                                        styles.presetCard,
                                        selectedPreset === preset.id && styles.presetCardSelected,
                                        { transform: [{ scale: cardScales[index] }] }
                                    ]}>
                                        <Text style={{ fontSize: 28, marginBottom: 8 }}>{preset.icon}</Text>
                                        <Text style={[
                                            styles.presetTitle,
                                            selectedPreset === preset.id && { color: '#000' }
                                        ]}>{preset.title}</Text>
                                    </Animated.View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.dividerRow}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.orText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={[styles.inputRow, customHabit ? { borderColor: '#fff', borderWidth: 1 } : { borderWidth: 1, borderColor: 'transparent' }]}>
                            <TextInput
                                placeholder="Create custom habit..."
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                value={customHabit}
                                onChangeText={(text: string) => {
                                    setCustomHabit(text);
                                    setSelectedPreset(null);
                                    setTargetCount(1);
                                }}
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.buttonRow}>
                            <GlassButton
                                title="Back"
                                variant="secondary"
                                onPress={handleBack}
                                style={{ flex: 0.4 }}
                            />
                            <GlassButton
                                title="Continue"
                                onPress={handleNext}
                                disabled={!selectedPreset && !customHabit}
                                style={{ flex: 1 }}
                            />
                        </View>
                    </ScrollView>
                )}

                {/* STEP 3: HABIT DETAILS */}
                {step === 3 && (
                    <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
                        <View style={styles.stepHeader}>
                            <Text style={styles.title}>Set Your Goal</Text>
                            <Text style={styles.subtitle}>How often and when?</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.label}>DAILY TARGET</Text>
                            <View style={styles.counterRow}>
                                <TouchableOpacity
                                    style={styles.counterButton}
                                    onPress={() => handleCounterChange(-1)}
                                >
                                    <Minus size={20} color="#fff" />
                                </TouchableOpacity>
                                <View style={styles.counterCenter}>
                                    <Text style={styles.counterValue}>{targetCount}</Text>
                                    <Text style={styles.counterUnit}>times per day</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.counterButton}
                                    onPress={() => handleCounterChange(1)}
                                >
                                    <Plus size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.label, { marginTop: 24 }]}>TIME OF DAY</Text>
                            <GlassSegmentedControl
                                values={['Morning', 'Noon', 'Evening', 'Anytime']}
                                selectedIndex={['morning', 'midday', 'evening', 'anytime'].indexOf(timeOfDay)}
                                onChange={(event: { nativeEvent: { selectedSegmentIndex: number } }) => {
                                    const index = event.nativeEvent.selectedSegmentIndex;
                                    const times = ['morning', 'midday', 'evening', 'anytime'] as const;
                                    setTimeOfDay(times[index]);
                                }}
                            />
                        </View>

                        <View style={styles.buttonRow}>
                            <GlassButton
                                title="Back"
                                variant="secondary"
                                onPress={handleBack}
                                style={{ flex: 0.4 }}
                            />
                            <GlassButton
                                title="Start Journey"
                                onPress={handleFinish}
                                icon={<Check size={20} color="#000" />}
                                style={{ flex: 1 }}
                            />
                        </View>
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    blob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.4,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        paddingBottom: 20,
    },
    progressDot: {
        height: 8,
        borderRadius: 4,
    },
    progressDotActive: {
        width: 40,
        backgroundColor: '#fff',
    },
    progressDotInactive: {
        width: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 24,
    },
    // Welcome screen - full height with content at top and button at bottom
    welcomeContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    welcomeTop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    welcomeBottom: {
        paddingBottom: 16,
    },
    welcomeIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 16,
    },
    heroSubtitle: {
        fontSize: 17,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: 26,
        maxWidth: 300,
    },
    // Scrollable step container
    scrollContent: {
        flex: 1,
    },
    scrollInner: {
        paddingBottom: 24,
        gap: 20,
    },
    stepHeader: {
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: 24,
        gap: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    eggContainer: {
        width: 120,
        height: 120,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 2,
    },
    colorLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.4)',
        textAlign: 'center',
        marginBottom: -8,
    },
    colorRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    colorDot: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 3,
        borderColor: 'transparent',
    },
    colorSelected: {
        borderColor: '#fff',
        transform: [{ scale: 1.15 }],
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    presetCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    presetCardSelected: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    presetTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginVertical: 4,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    orText: {
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.3)',
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 8,
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 12,
        borderRadius: 20,
    },
    counterButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterCenter: {
        alignItems: 'center',
    },
    counterValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
    },
    counterUnit: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 2,
    },
    inputRow: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 4,
        minHeight: 52,
        // @ts-ignore
        cornerCurve: 'continuous',
    },
    input: {
        flex: 1,
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
        padding: 12,
        textAlign: 'center',
    },
});
