import { useHabit } from '@habitapp/shared';
import { Egg, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pet } from '../components/Pet';
import { CurrencyBadge } from '../components/badges/CurrencyBadge';
import { ColorPicker } from '../components/ColorPicker';
import { LiquidGlass } from '../theme/theme';
import { validatePetName } from '../utils/validation';

export const PetScreen = () => {
    const { pet, resetPet, updatePet } = useHabit();
    const [name, setName] = useState('');
    const [color, setColor] = useState('#FF6B6B');
    const insets = useSafeAreaInsets();

    const handleHatch = () => {
        const validation = validatePetName(name);
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

        resetPet(name.trim(), color);
    };

    if (!pet) {
        return (
            <View style={styles.wrapper}>
                <View style={styles.eggContainer}>
                    <Egg size={120} color={color} strokeWidth={1.5} />
                    <Text style={styles.eggTitle}>Hatch Your Companion</Text>
                    <Text style={styles.eggSubtitle}>Complete habits to help them grow!</Text>

                    <View style={styles.formCard}>
                        <TextInput
                            style={styles.input}
                            placeholder="Name your pet..."
                            placeholderTextColor={LiquidGlass.text.tertiary}
                            value={name}
                            onChangeText={setName}
                        />

                        <ColorPicker
                            colors={['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8C42', '#A06CD5', '#FF99CC']}
                            selectedColor={color}
                            onColorSelect={setColor}
                            variant="wrap"
                        />

                        <TouchableOpacity
                            style={styles.hatchButton}
                            onPress={handleHatch}
                            accessibilityLabel="Hatch egg"
                            accessibilityRole="button"
                            accessibilityHint="Creates your new pet companion"
                        >
                            <Text style={styles.hatchText}>Hatch Egg</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.content]}
                contentInsetAdjustmentBehavior="automatic"
            >
                <View style={[styles.headerRow, { marginTop: 20 }]}>
                    <Text style={styles.headerTitle}>{pet.name || 'My Companion'}</Text>

                    {/* XP Badge (Sparks) */}
                    <CurrencyBadge amount={pet.xp || 0} size="lg" />
                </View>
                <Pet pet={pet} isFullView onUpdate={updatePet} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: LiquidGlass.backgroundColor,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        fontSize: LiquidGlass.typography.size.title1,
        fontWeight: '800',
        color: LiquidGlass.text.primary,
        marginTop: LiquidGlass.spacing.xxl,
        marginBottom: LiquidGlass.spacing.sm,
    },
    eggSubtitle: {
        fontSize: LiquidGlass.typography.size.body,
        color: LiquidGlass.text.label,
        marginBottom: 40,
        textAlign: 'center',
    },
    formCard: {
        width: '100%',
        padding: LiquidGlass.spacing.xxl,
        borderRadius: 24, // Use LiquidGlass.card.borderRadius if 24 matches
        backgroundColor: LiquidGlass.colors.surface,
        overflow: 'hidden',
        gap: 20,
    },
    input: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
        padding: LiquidGlass.spacing.lg,
        color: LiquidGlass.text.primary,
        fontSize: LiquidGlass.typography.size.headline,
        fontWeight: '600',
        textAlign: 'center',
    },
    hatchButton: {
        backgroundColor: LiquidGlass.colors.white,
        padding: LiquidGlass.spacing.lg,
        borderRadius: 16,
        alignItems: 'center',
    },
    hatchText: {
        color: LiquidGlass.colors.black,
        fontSize: LiquidGlass.typography.size.body,
        fontWeight: '700',
    },
});
