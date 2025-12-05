import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView, Animated } from 'react-native';
import { useHabit, Habit } from '@habitapp/shared';
import { HABIT_COLORS } from '@habitapp/shared/src/constants';
import { BlurView } from 'expo-blur';
import { ArrowRight, Check, ChevronLeft, Minus, Plus } from 'lucide-react-native';

const { width } = Dimensions.get('window');

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
    const [step, setStep] = useState(0);

    // Step 1: Pet Data
    const [petName, setPetName] = useState('');
    const [petColor, setPetColor] = useState('#FF6B6B');

    // Step 2: Habit Data
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
    const [customHabit, setCustomHabit] = useState('');

    // Step 3: Habit Details
    const [targetCount, setTargetCount] = useState(1);
    const [timeOfDay, setTimeOfDay] = useState<'morning' | 'midday' | 'evening' | 'anytime'>('anytime');

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleFinish = () => {
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

        setIsOnboarding(false);
    };

    return (
        <View style={styles.container}>
            {/* Ambient Background */}
            <View style={[styles.blob, { backgroundColor: petColor, top: -100, left: -100 }]} />
            <View style={[styles.blob, { backgroundColor: '#6366f1', bottom: -100, right: -100 }]} />
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

            {/* Progress Dots */}
            <View style={styles.progressContainer}>
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

            <ScrollView contentContainerStyle={styles.content} scrollEnabled={false}>
                {/* STEP 0: WELCOME */}
                {step === 0 && (
                    <View style={styles.stepContainer}>
                        <View style={styles.welcomeIcon}>
                            <Text style={{ fontSize: 48 }}>✨</Text>
                        </View>
                        <Text style={styles.title}>Habit Companion</Text>
                        <Text style={styles.subtitle}>
                            Build better habits, track your progress, and grow alongside your digital companion.
                        </Text>
                        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
                            <Text style={styles.primaryButtonText}>Get Started</Text>
                            <ArrowRight size={20} color="#000" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* STEP 1: PET SETUP */}
                {step === 1 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.title}>Choose a Companion</Text>
                        <Text style={styles.subtitle}>This little friend will grow as you improve.</Text>

                        <View style={styles.card}>
                            {/* Egg Preview */}
                            <View style={[styles.eggContainer, { backgroundColor: `${petColor}20`, borderColor: `${petColor}40` }]}>
                                <Text style={{ fontSize: 48 }}>🥚</Text>
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="Name your pet..."
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                value={petName}
                                onChangeText={setPetName}
                            />

                            <View style={styles.colorRow}>
                                {HABIT_COLORS.slice(0, 5).map((c) => (
                                    <TouchableOpacity
                                        key={c}
                                        style={[styles.colorDot, { backgroundColor: c }, petColor === c && styles.colorSelected]}
                                        onPress={() => setPetColor(c)}
                                    />
                                ))}
                            </View>
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
                                <Text style={styles.secondaryButtonText}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.primaryButton, !petName.trim() && styles.disabledButton]}
                                onPress={handleNext}
                                disabled={!petName.trim()}
                            >
                                <Text style={styles.primaryButtonText}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* STEP 2: HABIT SELECTION */}
                {step === 2 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.title}>Set Your First Goal</Text>
                        <Text style={styles.subtitle}>Start small. Pick one habit to begin.</Text>

                        <View style={styles.grid}>
                            {PRESETS.map(preset => (
                                <TouchableOpacity
                                    key={preset.id}
                                    style={[
                                        styles.presetCard,
                                        selectedPreset === preset.id && styles.presetCardSelected
                                    ]}
                                    onPress={() => {
                                        setSelectedPreset(preset.id);
                                        setCustomHabit('');
                                        setTargetCount(preset.defaultTarget);
                                        setTimeOfDay(preset.defaultTime as any);
                                    }}
                                >
                                    <Text style={{ fontSize: 24, marginBottom: 8 }}>{preset.icon}</Text>
                                    <Text style={[
                                        styles.presetTitle,
                                        selectedPreset === preset.id && { color: '#000' }
                                    ]}>{preset.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.orText}>OR CREATE CUSTOM</Text>

                        <TextInput
                            style={[styles.input, customHabit ? { borderColor: '#fff' } : {}]}
                            placeholder="e.g. Meditate for 5 mins"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={customHabit}
                            onChangeText={(text) => {
                                setCustomHabit(text);
                                setSelectedPreset(null);
                                setTargetCount(1);
                            }}
                        />

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
                                <Text style={styles.secondaryButtonText}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.primaryButton, (!selectedPreset && !customHabit) && styles.disabledButton]}
                                onPress={handleNext}
                                disabled={!selectedPreset && !customHabit}
                            >
                                <Text style={styles.primaryButtonText}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* STEP 3: HABIT DETAILS */}
                {step === 3 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.title}>Make it Specific</Text>
                        <Text style={styles.subtitle}>When and how often?</Text>

                        <View style={styles.card}>
                            <Text style={styles.label}>DAILY GOAL</Text>
                            <View style={styles.counterRow}>
                                <TouchableOpacity
                                    style={styles.counterButton}
                                    onPress={() => setTargetCount(Math.max(1, targetCount - 1))}
                                >
                                    <Minus size={20} color="#fff" />
                                </TouchableOpacity>
                                <Text style={styles.counterValue}>{targetCount}</Text>
                                <TouchableOpacity
                                    style={styles.counterButton}
                                    onPress={() => setTargetCount(Math.min(99, targetCount + 1))}
                                >
                                    <Plus size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.helperText}>times per day</Text>

                            <Text style={[styles.label, { marginTop: 24 }]}>TIME OF DAY</Text>
                            <View style={styles.grid}>
                                {['morning', 'midday', 'evening', 'anytime'].map((t) => (
                                    <TouchableOpacity
                                        key={t}
                                        style={[
                                            styles.timeButton,
                                            timeOfDay === t && styles.timeButtonSelected
                                        ]}
                                        onPress={() => setTimeOfDay(t as any)}
                                    >
                                        <Text style={[
                                            styles.timeButtonText,
                                            timeOfDay === t && { color: '#000' }
                                        ]}>{t}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
                                <Text style={styles.secondaryButtonText}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.primaryButton} onPress={handleFinish}>
                                <Text style={styles.primaryButtonText}>Start Journey</Text>
                                <Check size={20} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>
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
        paddingTop: 60,
        paddingBottom: 20,
    },
    progressDot: {
        height: 6,
        borderRadius: 3,
    },
    progressDotActive: {
        width: 32,
        backgroundColor: '#fff',
    },
    progressDotInactive: {
        width: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 32,
    },
    stepContainer: {
        gap: 16,
    },
    welcomeIcon: {
        width: 96,
        height: 96,
        borderRadius: 32,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 16,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 24,
        gap: 8,
        marginTop: 16,
        flex: 1,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    secondaryButton: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginTop: 16,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 24,
        padding: 24,
        gap: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    eggContainer: {
        width: 100,
        height: 100,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 2,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    colorRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    colorDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorSelected: {
        borderColor: '#fff',
        transform: [{ scale: 1.2 }],
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    presetCard: {
        width: '48%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    presetCardSelected: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    presetTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
    },
    orText: {
        textAlign: 'center',
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.3)',
        marginTop: 12,
        marginBottom: 12,
    },
    label: {
        fontSize: 12,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 8,
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 8,
        borderRadius: 16,
    },
    counterButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
    },
    helperText: {
        textAlign: 'center',
        fontSize: 12,
        color: 'rgba(255,255,255,0.3)',
    },
    timeButton: {
        width: '48%',
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
    },
    timeButtonSelected: {
        backgroundColor: '#fff',
    },
    timeButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.6)',
        textTransform: 'capitalize',
    },
});
