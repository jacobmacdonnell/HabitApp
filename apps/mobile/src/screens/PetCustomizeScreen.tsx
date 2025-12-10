import { useHabit, HAT_ITEMS } from '@habitapp/shared';
import { HeaderButton } from '../components/HeaderButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import React, { useState, useLayoutEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, TextInput, Alert } from 'react-native';

import { GlassSegmentedControl } from '../components/GlassSegmentedControl';
import { ColorPicker } from '../components/ColorPicker';
import { PetPreview, HatIcon } from '../components/PetPreview';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { RootStackParamList } from '../navigation/types';
import { validatePetName } from '../utils/validation';
import { LiquidGlass } from '../theme/theme';

const { width } = Dimensions.get('window');

// Pet colors
const COLORS = [
    '#f97316',
    '#f59e0b',
    '#eab308',
    '#84cc16',
    '#10b981',
    '#06b6d4',
    '#0ea5e9',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#d946ef',
    '#f43f5e',
    '#ef4444',
];

export const PetCustomizeScreen = () => {
    const { pet, updatePet, equipHat } = useHabit();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'identity' | 'wardrobe'>('identity');
    const [name, setName] = useState(pet?.name || '');
    const [selectedColor, setSelectedColor] = useState(pet?.color || COLORS[0]);

    const handleSave = useCallback(() => {
        const validation = validatePetName(name);

        if (!validation.isValid) {
            Alert.alert(validation.error?.includes('under 12') ? 'Too Long' : 'Whoops!', validation.error);
            return;
        }

        updatePet({ name: name.trim(), color: selectedColor });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
    }, [name, selectedColor, updatePet, router]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: activeTab === 'identity' ? 'Identity' : 'Wardrobe',
            headerLeft: () => <HeaderButton title="Cancel" onPress={() => router.back()} variant="cancel" />,
            headerRight: () => <HeaderButton title="Save" onPress={handleSave} variant="primary" />,
        });
    }, [navigation, router, handleSave, activeTab]);

    if (!pet) return null;

    const handleEquip = (itemId: string) => {
        Haptics.selectionAsync();
        equipHat(itemId);
    };

    // Filter only owned items for Wardrobe
    const ownedHats = HAT_ITEMS.filter((item) => item.id === 'none' || pet.inventory?.includes(item.id));

    return (
        <ScreenWrapper keyboardAvoiding isModal contentContainerStyle={styles.content}>
            {/* Live Pet Preview */}
            <View style={styles.previewSection}>
                <PetPreview
                    color={activeTab === 'identity' ? selectedColor : pet.color}
                    hat={pet.hat || 'none'}
                    mood={pet.mood}
                />
            </View>

            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
                <GlassSegmentedControl
                    values={['Identity', 'Wardrobe']}
                    selectedIndex={activeTab === 'identity' ? 0 : 1}
                    onChange={(event) => {
                        setActiveTab(event.nativeEvent.selectedSegmentIndex === 0 ? 'identity' : 'wardrobe');
                        Haptics.selectionAsync();
                    }}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {activeTab === 'identity' ? (
                    <>
                        {/* Name Input */}
                        <View style={styles.section}>
                            <Text style={styles.label}>NAME</Text>
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Pet Name"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    maxLength={20}
                                />
                            </View>
                        </View>

                        {/* Color Picker */}
                        <View style={styles.section}>
                            <Text style={styles.label}>COLOR</Text>
                            <ColorPicker
                                colors={COLORS}
                                selectedColor={selectedColor}
                                onColorSelect={setSelectedColor}
                                variant="scroll"
                            />
                        </View>
                    </>
                ) : (
                    /* Wardrobe (Owned Items) */
                    <View style={styles.section}>
                        <View style={styles.grid}>
                            {ownedHats.map((item) => {
                                const isEquipped = pet.hat === item.id || (item.id === 'none' && !pet.hat);

                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[styles.card, isEquipped && styles.cardEquipped]}
                                        onPress={() => handleEquip(item.id)}
                                        activeOpacity={0.8}
                                    >
                                        <HatIcon type={item.id} />
                                        <Text style={styles.itemName} numberOfLines={1}>
                                            {item.name}
                                        </Text>

                                        {isEquipped && (
                                            <View style={styles.badgeEquipped}>
                                                <Check size={10} color="#000" strokeWidth={3} />
                                                <Text style={styles.badgeText}>On</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    previewSection: {
        marginBottom: LiquidGlass.spacing.xl,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer: {
        paddingHorizontal: 20,
        marginBottom: LiquidGlass.spacing.xxl,
    },
    section: {
        marginBottom: LiquidGlass.spacing.xxl,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: LiquidGlass.spacing.md,
        marginLeft: LiquidGlass.spacing.xs,
    },
    inputRow: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 4,
        minHeight: 52,
    },
    input: {
        flex: 1,
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
        padding: LiquidGlass.spacing.md,
        textAlign: 'center',
    },
    // Wardrobe Grid
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    card: {
        width: Math.floor((width - 40 - 24) / 3),
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: LiquidGlass.spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        aspectRatio: 0.9,
        justifyContent: 'space-between',
    },
    cardEquipped: {
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
    },
    itemName: {
        fontSize: 11,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
        marginTop: LiquidGlass.spacing.sm,
        textAlign: 'center',
        marginBottom: LiquidGlass.spacing.xs,
    },
    badgeEquipped: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: LiquidGlass.colors.success,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#000',
    },
});
