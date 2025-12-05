import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Lock, Check } from 'lucide-react-native';
import { useHabit } from '@habitapp/shared';
import * as Haptics from 'expo-haptics';
import Svg, { Path, G, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { LiquidGlass } from '../theme/theme';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const HATS = [
    { id: 'none', name: 'No Hat', cost: 0, requiredLevel: 1 },
    { id: 'party', name: 'Party Hat', cost: 100, requiredLevel: 2 },
    { id: 'cowboy', name: 'Cowboy', cost: 500, requiredLevel: 5 },
    { id: 'tophat', name: 'Gentleman', cost: 1000, requiredLevel: 10 },
    { id: 'crown', name: 'Royal', cost: 5000, requiredLevel: 20 },
];

const HatPreview = ({ type }: { type: string }) => {
    if (type === 'none') return null;

    return (
        <Svg viewBox="0 0 100 100" style={{ width: 60, height: 60 }}>
            {type === 'party' && (
                <Path d="M50 10 L80 70 L20 70 Z" fill="#facc15" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            )}
            {type === 'cowboy' && (
                <G>
                    <Path d="M10 60 Q50 30 90 60" fill="#78350f" stroke="white" strokeWidth="2" />
                    <Path d="M30 60 L30 40 Q50 20 70 40 L70 60" fill="#78350f" stroke="white" strokeWidth="2" />
                </G>
            )}
            {type === 'tophat' && (
                <G>
                    <Rect x="20" y="60" width="60" height="10" fill="#1f2937" stroke="white" strokeWidth="2" />
                    <Rect x="30" y="20" width="40" height="40" fill="#1f2937" stroke="white" strokeWidth="2" />
                    <Rect x="30" y="50" width="40" height="5" fill="#ef4444" />
                </G>
            )}
            {type === 'crown' && (
                <Path d="M20 60 L20 30 L35 50 L50 20 L65 50 L80 30 L80 60 Z" fill="#fbbf24" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            )}
        </Svg>
    );
};

export const PetWardrobeScreen = () => {
    const { pet, updatePet } = useHabit();
    const navigation = useNavigation();

    if (!pet) return null;

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Wardrobe',
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
                    <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Done</Text>
                </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: '#1c1c1e' },
            headerTintColor: '#fff',
        });
    }, [navigation]);

    const handleSelect = (hatId: string, isLocked: boolean) => {
        if (isLocked) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }
        updatePet({ hat: hatId });
        Haptics.selectionAsync();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.subtitle}>Unlock hats by leveling up!</Text>
            </View>

            <ScrollView contentContainerStyle={styles.grid}>
                {HATS.map((hat) => {
                    const isLocked = (pet.level || 1) < hat.requiredLevel;
                    const isSelected = pet.hat === hat.id || (!pet.hat && hat.id === 'none');

                    return (
                        <TouchableOpacity
                            key={hat.id}
                            style={[
                                styles.cardWrapper,
                                isSelected && styles.selectedWrapper
                            ]}
                            onPress={() => handleSelect(hat.id, isLocked)}
                            activeOpacity={0.8}
                        >
                            <BlurView
                                intensity={LiquidGlass.intensity.medium}
                                tint="dark"
                                style={[styles.itemCard, isLocked && styles.lockedCard]}
                            >
                                <View style={styles.previewContainer}>
                                    {hat.id === 'none' ? (
                                        <View style={styles.nonePlaceholder} />
                                    ) : (
                                        <HatPreview type={hat.id} />
                                    )}
                                </View>

                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>{hat.name}</Text>
                                    {isLocked && (
                                        <View style={styles.lockBadge}>
                                            <Lock size={10} color="#fff" />
                                            <Text style={styles.lockText}>Lvl {hat.requiredLevel}</Text>
                                        </View>
                                    )}
                                </View>

                                {isSelected && (
                                    <View style={styles.checkBadge}>
                                        <Check size={12} color="#000" strokeWidth={3} />
                                    </View>
                                )}
                            </BlurView>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        padding: 24,
        paddingBottom: 0,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        padding: 24,
        paddingTop: 0,
    },
    cardWrapper: {
        width: (width - 60) / 2, // 2 columns with gaps
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    selectedWrapper: {
        borderColor: '#fff',
    },
    itemCard: {
        padding: 16,
        alignItems: 'center',
        width: '100%',
    },
    lockedCard: {
        opacity: 0.5,
    },
    previewContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    nonePlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        borderStyle: 'dashed',
    },
    itemInfo: {
        alignItems: 'center',
        gap: 4,
    },
    itemName: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    lockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ef4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 4,
    },
    lockText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    checkBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#fff',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
