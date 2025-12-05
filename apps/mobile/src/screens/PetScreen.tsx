import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useHabit } from '@habitapp/shared';
import { Pet } from '../components/Pet';
import { BlurView } from 'expo-blur';
import { Egg } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const PetScreen = () => {
    const { pet, resetPet, updatePet } = useHabit();
    const [name, setName] = useState('');
    const [color, setColor] = useState('#FF6B6B');

    const handleHatch = () => {
        if (!name.trim()) {
            Alert.alert('Name Required', 'Please name your pet!');
            return;
        }
        resetPet(name, color);
    };

    if (!pet) {
        return (
            <View style={styles.container}>
                <View style={styles.eggContainer}>
                    <Egg size={120} color={color} strokeWidth={1.5} />
                    <Text style={styles.eggTitle}>Hatch Your Companion</Text>
                    <Text style={styles.eggSubtitle}>Complete habits to help them grow!</Text>

                    <BlurView intensity={20} tint="dark" style={styles.formCard}>
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
                    </BlurView>
                </View>
            </View>
        );
    }

    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
                <Text style={styles.headerTitle}>Companion</Text>
            </View>
            <Pet pet={pet} isFullView={true} onUpdate={updatePet} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        paddingBottom: 100,
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
    headerTitle: {
        fontSize: 34,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5,
        marginBottom: 20,
    },
});
