import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Check } from 'lucide-react-native';
import { useHabit } from '@habitapp/shared';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { LiquidGlass } from '../theme/theme';
import { BlurView } from 'expo-blur';

const COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#06b6d4',
    '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
    '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
];

export const PetStyleScreen = () => {
    const { pet, updatePet } = useHabit();
    const navigation = useNavigation();

    // Guard if pet doesn't exist (shouldn't happen if navigated here)
    if (!pet) return null;

    const [name, setName] = useState(pet.name);
    const [selectedColor, setSelectedColor] = useState(pet.color);

    const handleSave = () => {
        updatePet({ name, color: selectedColor });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.goBack();
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Style Pet',
            headerRight: () => (
                <TouchableOpacity onPress={handleSave} style={{ padding: 8 }}>
                    <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Done</Text>
                </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: '#1c1c1e' },
            headerTintColor: '#fff',
        });
    }, [navigation, name, selectedColor]);

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        Haptics.selectionAsync();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.content}>
                {/* Name Input */}
                <View style={styles.section}>
                    <Text style={styles.label}>NAME</Text>
                    <BlurView intensity={LiquidGlass.intensity.light} tint="dark" style={styles.glassContainer}>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Pet Name"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            maxLength={20}
                        />
                    </BlurView>
                </View>

                {/* Color Picker */}
                <View style={styles.section}>
                    <Text style={styles.label}>COLOR</Text>
                    <BlurView intensity={LiquidGlass.intensity.light} tint="dark" style={styles.glassContainer}>
                        <View style={styles.colorGrid}>
                            {COLORS.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorDot,
                                        { backgroundColor: color },
                                        selectedColor === color && styles.selectedColor
                                    ]}
                                    onPress={() => handleColorSelect(color)}
                                >
                                    {selectedColor === color && <Check size={16} color="#fff" strokeWidth={3} />}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </BlurView>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Deep black background for better glass contrast
    },
    content: {
        padding: 24,
        gap: 24,
    },
    section: {
        gap: 12,
    },
    label: {
        fontSize: 12,
        fontWeight: '800', // Heaviest weight from Liquid Glass specs
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 0.5,
        marginLeft: 4,
    },
    glassContainer: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    input: {
        padding: 20,
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        padding: 20,
    },
    colorDot: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColor: {
        borderColor: '#fff',
        transform: [{ scale: 1.1 }],
    },
});
