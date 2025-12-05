import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Image } from 'react-native';
import { useHabit } from '@habitapp/shared';
import { BlurView } from 'expo-blur';
import { ArrowRight, Check } from 'lucide-react-native';
import Animated, { FadeIn, SlideInRight, SlideOutLeft } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export const OnboardingScreen = () => {
    const { resetPet, setIsOnboarding } = useHabit();
    const [step, setStep] = useState(0);
    const [name, setName] = useState('');
    const [color, setColor] = useState('#FF6B6B');

    const handleNext = () => {
        if (step === 0) {
            setStep(1);
        } else {
            if (!name.trim()) return;
            resetPet(name, color);
            setIsOnboarding(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Background Elements */}
            <View style={[styles.blob, { backgroundColor: color, top: -100, left: -100 }]} />
            <View style={[styles.blob, { backgroundColor: '#6366f1', bottom: -100, right: -100 }]} />
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

            <View style={styles.content}>
                {step === 0 ? (
                    <Animated.View entering={FadeIn} exiting={SlideOutLeft} style={styles.stepContainer}>
                        <Text style={styles.title}>Welcome to HabitApp</Text>
                        <Text style={styles.subtitle}>Your personal companion for building better habits.</Text>
                        <TouchableOpacity style={styles.button} onPress={handleNext}>
                            <Text style={styles.buttonText}>Get Started</Text>
                            <ArrowRight size={20} color="#000" />
                        </TouchableOpacity>
                    </Animated.View>
                ) : (
                    <Animated.View entering={SlideInRight} style={styles.stepContainer}>
                        <Text style={styles.title}>Meet Your Companion</Text>
                        <Text style={styles.subtitle}>Name your pet and choose a color.</Text>

                        <View style={styles.form}>
                            <TextInput
                                style={styles.input}
                                placeholder="Pet Name"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                value={name}
                                onChangeText={setName}
                                autoFocus
                            />

                            <View style={styles.colorRow}>
                                {['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8C42', '#A06CD5', '#FF99CC'].map((c) => (
                                    <TouchableOpacity
                                        key={c}
                                        style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorSelected]}
                                        onPress={() => setColor(c)}
                                    />
                                ))}
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.button, !name.trim() && styles.buttonDisabled]}
                            onPress={handleNext}
                            disabled={!name.trim()}
                        >
                            <Text style={styles.buttonText}>Start Journey</Text>
                            <Check size={20} color="#000" />
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    blob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.4,
    },
    content: {
        width: width,
        padding: 40,
    },
    stepContainer: {
        gap: 24,
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 48,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 28,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 20,
        gap: 12,
        marginTop: 20,
        alignSelf: 'flex-start',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    form: {
        gap: 20,
        marginTop: 20,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 20,
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
    },
    colorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    colorDot: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: 'transparent',
    },
    colorSelected: {
        borderColor: '#fff',
        transform: [{ scale: 1.1 }],
    },
});
