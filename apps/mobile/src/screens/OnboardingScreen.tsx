import { useHabit, TimeOfDay } from '@habitapp/shared';
import { HABIT_COLORS, HABIT_PRESETS } from '@habitapp/shared/src/constants';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ArrowRight, Check, Minus, Plus, Sparkles } from 'lucide-react-native';
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Animated,
    Easing,
    TextInput,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LiquidGlass } from '../theme/theme';
import { ColorPicker } from '../components/ColorPicker';
import { GlassButton } from '../components/GlassButton';
import { GlassSegmentedControl } from '../components/GlassSegmentedControl';
import { validatePetName } from '../utils/validation';

const { width, height } = Dimensions.get('window');

export const OnboardingScreen = () => {
    const { resetPet, addHabit, setIsOnboarding } = useHabit();
    const insets = useSafeAreaInsets();
    const [step, setStep] = useState(0);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const eggPulse = useRef(new Animated.Value(1)).current;
    const cardScales = useRef(HABIT_PRESETS.map(() => new Animated.Value(1))).current;

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
                Animated.timing(eggPulse, {
                    toValue: 1.05,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(eggPulse, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
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
                    validation.error?.includes('under 12')
                        ? 'Too Long'
                        : validation.error?.includes('friendly')
                          ? 'Whoops!'
                          : 'Name Required',
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

        const preset = HABIT_PRESETS.find((p) => p.id === presetId);
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
        setTargetCount((prev) => Math.max(1, Math.min(99, prev + delta)));
    };

    const handleFinish = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // 1. Create Pet
        resetPet(petName || 'Pet', petColor);

        // 2. Create First Habit
        if (selectedPreset) {
            const preset = HABIT_PRESETS.find((p) => p.id === selectedPreset);
            if (preset) {
                addHabit({
                    title: preset.title,
                    icon: preset.icon,
                    color: preset.color,
                    targetCount,
                    timeOfDay,
                    frequency: { type: 'daily', days: [] },
                });
            }
        } else if (customHabit) {
            addHabit({
                title: customHabit,
                icon: '⚡',
                color: '#FF8C42',
                targetCount,
                timeOfDay,
                frequency: { type: 'daily', days: [] },
            });
        }

        // Navigate to hatching screen for the pet reveal moment
        // (isOnboarding is set to false in HatchingScreen after animation)
        router.replace('/hatching');
    };

    return (
        <View style={styles.container}>
            {/* Progress Dots - at top with safe area */}
            <View style={[styles.progressContainer, { paddingTop: insets.top + 20 }]}>
                {[0, 1, 2, 3].map((i) => (
                    <View
                        key={i}
                        style={[styles.progressDot, i <= step ? styles.progressDotActive : styles.progressDotInactive]}
                    />
                ))}
            </View>

            <View style={[styles.mainContent, { paddingBottom: insets.bottom + 32 }]}>
                {/* STEP 0: WELCOME */}
                {step === 0 && (
                    <View style={styles.welcomeContainer}>
                        <View style={styles.welcomeTop}>
                            <View style={styles.welcomeIcon}>
                                <Sparkles size={40} color={LiquidGlass.colors.white} />
                            </View>
                            <Text style={styles.heroTitle}>Habit Companion</Text>
                            <Text style={styles.heroSubtitle}>
                                Build better habits with your digital pet. Complete habits, earn XP, and watch your
                                companion grow!
                            </Text>
                        </View>
                        <View style={styles.welcomeBottom}>
                            <GlassButton
                                title="Get Started"
                                onPress={handleNext}
                                icon={<ArrowRight size={20} color={LiquidGlass.colors.black} />}
                                style={{ width: '100%' }}
                            />
                        </View>
                    </View>
                )}

                {/* STEP 1: PET SETUP */}
                {step === 1 && (
                    <ScrollView
                        style={styles.scrollContent}
                        contentContainerStyle={styles.scrollInner}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.stepHeader}>
                            <Text style={styles.title}>Name Your Companion</Text>
                            <Text style={styles.subtitle}>This little friend will grow as you improve.</Text>
                        </View>

                        <View style={styles.card}>
                            {/* Egg Preview with pulse */}
                            <Animated.View
                                style={[
                                    styles.eggContainer,
                                    {
                                        backgroundColor: `${petColor}20`,
                                        borderColor: `${petColor}40`,
                                        transform: [{ scale: eggPulse }],
                                    },
                                ]}
                            >
                                <Text style={{ fontSize: 56 }}>🥚</Text>
                            </Animated.View>

                            <View style={styles.inputRow}>
                                <TextInput
                                    placeholder="Name your pet..."
                                    placeholderTextColor={LiquidGlass.text.tertiary}
                                    value={petName}
                                    onChangeText={setPetName}
                                    style={styles.input}
                                />
                            </View>

                            <Text style={styles.colorLabel}>Choose a color</Text>
                            <ColorPicker
                                colors={HABIT_COLORS.slice(0, 6)}
                                selectedColor={petColor}
                                onColorSelect={(color) => handleColorSelect(color)}
                                variant="wrap"
                                showGlow
                            />
                        </View>

                        <View style={styles.buttonRow}>
                            <GlassButton title="Back" variant="secondary" onPress={handleBack} style={{ flex: 0.4 }} />
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
                    <ScrollView
                        style={styles.scrollContent}
                        contentContainerStyle={styles.scrollInner}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.stepHeader}>
                            <Text style={styles.title}>Start with one habit</Text>
                            <Text style={styles.subtitle}>
                                Research shows focusing on one habit leads to 3x better results. You can add more
                                anytime!
                            </Text>
                        </View>

                        <View style={styles.grid}>
                            {HABIT_PRESETS.slice(0, 6).map((preset, index) => (
                                <TouchableOpacity
                                    key={preset.id}
                                    activeOpacity={0.8}
                                    onPress={() => handlePresetSelect(preset.id, index)}
                                    style={{ width: '48%' }}
                                    accessibilityLabel={`${preset.title} habit`}
                                    accessibilityRole="radio"
                                    accessibilityState={{ selected: selectedPreset === preset.id }}
                                >
                                    <Animated.View
                                        style={[
                                            styles.presetCard,
                                            selectedPreset === preset.id && styles.presetCardSelected,
                                            { transform: [{ scale: cardScales[index] }] },
                                        ]}
                                    >
                                        <Text style={{ fontSize: 28, marginBottom: 8 }}>{preset.icon}</Text>
                                        <Text
                                            style={[
                                                styles.presetTitle,
                                                selectedPreset === preset.id && { color: LiquidGlass.colors.black },
                                            ]}
                                        >
                                            {preset.title}
                                        </Text>
                                    </Animated.View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.dividerRow}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.orText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <View
                            style={[
                                styles.inputRow,
                                customHabit
                                    ? { borderColor: LiquidGlass.colors.white, borderWidth: 1 }
                                    : { borderWidth: 1, borderColor: 'transparent' },
                            ]}
                        >
                            <TextInput
                                placeholder="Create custom habit..."
                                placeholderTextColor={LiquidGlass.text.tertiary}
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
                            <GlassButton title="Back" variant="secondary" onPress={handleBack} style={{ flex: 0.4 }} />
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
                    <ScrollView
                        style={styles.scrollContent}
                        contentContainerStyle={styles.scrollInner}
                        showsVerticalScrollIndicator={false}
                    >
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
                                    accessibilityLabel="Decrease target"
                                    accessibilityRole="button"
                                >
                                    <Minus size={20} color={LiquidGlass.colors.white} />
                                </TouchableOpacity>
                                <View style={styles.counterCenter}>
                                    <Text style={styles.counterValue}>{targetCount}</Text>
                                    <Text style={styles.counterUnit}>times per day</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.counterButton}
                                    onPress={() => handleCounterChange(1)}
                                    accessibilityLabel="Increase target"
                                    accessibilityRole="button"
                                >
                                    <Plus size={20} color={LiquidGlass.colors.white} />
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
                            <GlassButton title="Back" variant="secondary" onPress={handleBack} style={{ flex: 0.4 }} />
                            <GlassButton
                                title="Start Journey"
                                onPress={handleFinish}
                                icon={<Check size={20} color={LiquidGlass.colors.black} />}
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
        backgroundColor: LiquidGlass.backgroundColor,
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
        backgroundColor: LiquidGlass.colors.white,
    },
    progressDotInactive: {
        width: 10,
        backgroundColor: LiquidGlass.colors.border,
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
        marginBottom: LiquidGlass.spacing.xxxl,
        shadowColor: LiquidGlass.colors.secondary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: '800',
        color: LiquidGlass.text.primary,
        textAlign: 'center',
        marginBottom: LiquidGlass.spacing.lg,
    },
    heroSubtitle: {
        fontSize: 17,
        color: LiquidGlass.text.secondary,
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
        marginBottom: LiquidGlass.spacing.sm,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: LiquidGlass.text.primary,
        textAlign: 'center',
        marginBottom: LiquidGlass.spacing.sm,
    },
    subtitle: {
        fontSize: 15,
        color: LiquidGlass.text.label,
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: LiquidGlass.spacing.sm,
    },
    card: {
        backgroundColor: LiquidGlass.colors.card,
        borderRadius: 24,
        padding: LiquidGlass.spacing.xxl,
        gap: 16,
        borderWidth: 1,
        borderColor: LiquidGlass.colors.border,
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
        color: LiquidGlass.text.tertiary,
        textAlign: 'center',
        marginBottom: LiquidGlass.spacing.sm,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    presetCard: {
        backgroundColor: LiquidGlass.colors.surface,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: LiquidGlass.colors.border,
    },
    presetCardSelected: {
        backgroundColor: LiquidGlass.colors.white,
        borderColor: LiquidGlass.colors.white,
    },
    presetTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: LiquidGlass.text.secondary,
        textAlign: 'center',
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginVertical: LiquidGlass.spacing.xs,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: LiquidGlass.colors.border,
    },
    orText: {
        fontSize: 11,
        fontWeight: '700',
        color: LiquidGlass.text.tertiary,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: LiquidGlass.text.label,
        marginBottom: LiquidGlass.spacing.sm,
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.2)', // Overlay for contrast
        padding: LiquidGlass.spacing.md,
        borderRadius: 20,
    },
    counterButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: LiquidGlass.colors.cardBorder,
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterCenter: {
        alignItems: 'center',
    },
    counterValue: {
        fontSize: 32,
        fontWeight: '700',
        color: LiquidGlass.text.primary,
    },
    counterUnit: {
        fontSize: 12,
        color: LiquidGlass.text.tertiary,
        marginTop: 2,
    },
    inputRow: {
        backgroundColor: LiquidGlass.colors.surfaceHighlight,
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
        color: LiquidGlass.text.primary,
        padding: LiquidGlass.spacing.md,
        textAlign: 'center',
    },
});
