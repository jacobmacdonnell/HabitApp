import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useHabit } from '@habitapp/shared';
import { Pet } from '../components/Pet';
import { BlurView } from 'expo-blur';
import { GlassView } from 'expo-glass-effect';
import { Egg } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LiquidGlass } from '../theme/theme';

export const PetScreen = () => {
    const { pet, resetPet, updatePet } = useHabit();
    const [name, setName] = useState('');
    const [color, setColor] = useState('#FF6B6B');
    const insets = useSafeAreaInsets();

    const handleHatch = () => {
        if (!name.trim()) {
            Alert.alert('Name Required', 'Please name your pet!');
            return;
        }
        resetPet(name, color);
    };

    if (!pet) {
        return (
            <View style={styles.wrapper}>
                <View style={styles.eggContainer}>
                    <Egg size={120} color={color} strokeWidth={1.5} />
                    <Text style={styles.eggTitle}>Hatch Your Companion</Text>
                    <Text style={styles.eggSubtitle}>Complete habits to help them grow!</Text>

                    <GlassView glassEffectStyle="regular" style={styles.formCard}>
                        <TextInput
                            style={styles.input}
                            placeholder="Name your pet..."
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={name}
                            onChangeText={setName}
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

                        <TouchableOpacity style={styles.hatchButton} onPress={handleHatch}>
                            <Text style={styles.hatchText}>Hatch Egg</Text>
                        </TouchableOpacity>
                    </GlassView>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            {/* Ambient Background - Only behind Pet */}
            <View style={[styles.blob, { backgroundColor: pet.color || '#6366f1', top: -50, left: -50, opacity: 0.15 }]} />
            {/* Removed secondary blob */}
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

            <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.content, { paddingTop: insets.top + LiquidGlass.header.contentTopPadding }]}
            >
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>{pet.name}</Text>
                </View>
                <Pet pet={pet} isFullView={true} onUpdate={updatePet} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#1c1c1e',
    },
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: LiquidGlass.screenPadding,
        paddingBottom: 100,
    },
    headerRow: {
        marginBottom: LiquidGlass.header.marginBottom,
    },
    headerTitle: {
        fontSize: LiquidGlass.header.titleSize,
        fontWeight: LiquidGlass.header.titleWeight,
        color: LiquidGlass.header.titleColor,
        letterSpacing: LiquidGlass.header.titleLetterSpacing,
    },
    eggContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    eggTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        marginTop: 24,
        marginBottom: 8,
    },
    eggSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 40,
        textAlign: 'center',
    },
    formCard: {
        width: '100%',
        padding: 24,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
        gap: 20,
    },
    input: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
        padding: 16,
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    colorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
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
        transform: [{ scale: 1.1 }],
    },
    hatchButton: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    hatchText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
    blob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.3,
    },
});
