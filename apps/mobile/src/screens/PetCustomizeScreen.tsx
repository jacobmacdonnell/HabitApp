import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Check, Lock } from 'lucide-react-native';
import { useHabit } from '@habitapp/shared';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Defs, RadialGradient, Stop, Circle, G, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

const COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#06b6d4',
    '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
    '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
];

const HATS = [
    { id: 'none', name: 'None', requiredLevel: 1 },
    { id: 'party', name: 'Party', requiredLevel: 2 },
    { id: 'cowboy', name: 'Cowboy', requiredLevel: 5 },
    { id: 'tophat', name: 'Gentleman', requiredLevel: 10 },
    { id: 'crown', name: 'Crown', requiredLevel: 20 },
];

// Live Pet Preview Component
const PetPreview = ({ color, hat, mood }: { color: string; hat: string; mood: string }) => {
    const isSleeping = mood === 'sleeping';
    const isHappy = mood === 'happy';
    const isSad = mood === 'sad';
    const isSick = mood === 'sick';

    const renderEyes = () => {
        if (isSleeping) return (
            <G>
                <Path d="M 60 85 Q 70 95 80 85" stroke="rgba(0,0,0,0.8)" strokeWidth="4" fill="none" strokeLinecap="round" />
                <Path d="M 120 85 Q 130 95 140 85" stroke="rgba(0,0,0,0.8)" strokeWidth="4" fill="none" strokeLinecap="round" />
            </G>
        );
        return (
            <G>
                <Circle cx="70" cy="85" r="16" fill="white" />
                <Circle cx="70" cy="85" r="6" fill="black" />
                <Circle cx="130" cy="85" r="16" fill="white" />
                <Circle cx="130" cy="85" r="6" fill="black" />
                <Circle cx="76" cy="78" r="4" fill="white" fillOpacity="0.8" />
                <Circle cx="136" cy="78" r="4" fill="white" fillOpacity="0.8" />
            </G>
        );
    };

    const renderMouth = () => {
        if (isHappy) return <Path d="M 70 120 Q 100 150 130 120" stroke="rgba(0,0,0,0.8)" strokeWidth="6" fill="none" strokeLinecap="round" />;
        if (isSad || isSick) return <Path d="M 70 140 Q 100 110 130 140" stroke="rgba(0,0,0,0.8)" strokeWidth="6" fill="none" strokeLinecap="round" />;
        return <Path d="M 70 130 L 130 130" stroke="rgba(0,0,0,0.8)" strokeWidth="6" fill="none" strokeLinecap="round" />;
    };

    const renderHat = () => {
        if (!hat || hat === 'none') return null;
        return (
            <G transform="translate(60, 10) scale(0.8)">
                {hat === 'party' && <Path d="M50 10 L80 70 L20 70 Z" fill="#facc15" stroke="white" strokeWidth="2" strokeLinejoin="round" />}
                {hat === 'cowboy' && (
                    <G transform="translate(-10, -10)">
                        <Path d="M10 60 Q50 30 90 60" fill="#78350f" stroke="white" strokeWidth="2" />
                        <Path d="M30 60 L30 40 Q50 20 70 40 L70 60" fill="#78350f" stroke="white" strokeWidth="2" />
                    </G>
                )}
                {hat === 'tophat' && (
                    <G transform="translate(-10, -20)">
                        <Rect x="20" y="60" width="60" height="10" fill="#1f2937" stroke="white" strokeWidth="2" />
                        <Rect x="30" y="20" width="40" height="40" fill="#1f2937" stroke="white" strokeWidth="2" />
                        <Rect x="30" y="50" width="40" height="5" fill="#ef4444" />
                    </G>
                )}
                {hat === 'crown' && (
                    <G transform="translate(0, -10)">
                        <Path d="M20 60 L20 30 L35 50 L50 20 L65 50 L80 30 L80 60 Z" fill="#fbbf24" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                    </G>
                )}
            </G>
        );
    };

    return (
        <View style={styles.previewContainer}>
            {/* Glow behind pet */}
            <View style={styles.glowWrapper}>
                <Svg height="180" width="180" viewBox="0 0 180 180">
                    <Defs>
                        <RadialGradient id="previewGlow" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor={color} stopOpacity="0.4" />
                            <Stop offset="100%" stopColor={color} stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Circle cx="90" cy="90" r="90" fill="url(#previewGlow)" />
                </Svg>
            </View>

            {/* Pet */}
            <Svg viewBox="0 0 200 200" style={styles.petSvg}>
                <Defs>
                    <RadialGradient id="previewBodyGrad" cx="30%" cy="30%" r="80%">
                        <Stop offset="0%" stopColor={color} stopOpacity="1" />
                        <Stop offset="100%" stopColor={color} stopOpacity="0.8" />
                    </RadialGradient>
                </Defs>
                <Path d="M100,180 C60,180 30,150 30,110 C30,80 50,55 75,50 C80,30 100,20 120,30 C140,20 160,35 165,60 C185,70 190,100 180,125 C190,150 170,180 130,180 Z" fill="url(#previewBodyGrad)" stroke={color} strokeWidth="2" />
                <Path d="M90,50 Q100,10 115,45 Q125,15 135,50" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
                <G transform="translate(0, 10)">
                    {renderEyes()}
                    {renderMouth()}
                    {!isSick && (
                        <G>
                            <Circle cx="60" cy="125" r="14" fill="#ff99cc" opacity="0.5" />
                            <Circle cx="140" cy="125" r="14" fill="#ff99cc" opacity="0.5" />
                        </G>
                    )}
                    {renderHat()}
                </G>
            </Svg>
        </View>
    );
};

// Hat preview icon for grid
const HatIcon = ({ type }: { type: string }) => {
    if (type === 'none') return <View style={styles.noneIcon} />;

    return (
        <Svg viewBox="0 0 100 100" style={{ width: 36, height: 36 }}>
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

export const PetCustomizeScreen = () => {
    const { pet, updatePet } = useHabit();
    const navigation = useNavigation();

    if (!pet) return null;

    const [name, setName] = useState(pet.name);
    const [selectedColor, setSelectedColor] = useState(pet.color);
    const [selectedHat, setSelectedHat] = useState(pet.hat || 'none');

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Customize Pet',
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ paddingHorizontal: 16 }}
                >
                    <Text style={{ color: '#fff', fontSize: 17, textAlign: 'center' }}>Cancel</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity
                    onPress={handleSave}
                    style={{ paddingHorizontal: 16 }}
                >
                    <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600', textAlign: 'center' }}>Save</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, name, selectedColor, selectedHat]);

    const handleSave = () => {
        updatePet({ name, color: selectedColor, hat: selectedHat });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.goBack();
    };

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        Haptics.selectionAsync();
    };

    const handleHatSelect = (hatId: string, isLocked: boolean) => {
        if (isLocked) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }
        setSelectedHat(hatId);
        Haptics.selectionAsync();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Live Pet Preview */}
                <PetPreview color={selectedColor} hat={selectedHat} mood={pet.mood} />

                {/* Name Input */}
                <View style={styles.section}>
                    <Text style={styles.label}>NAME</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Pet Name"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        maxLength={20}
                    />
                </View>

                {/* Color Picker */}
                <View style={styles.section}>
                    <Text style={styles.label}>COLOR</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorRow}>
                        {COLORS.map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.colorDot,
                                    { backgroundColor: color },
                                    selectedColor === color && styles.colorSelected
                                ]}
                                onPress={() => handleColorSelect(color)}
                            >
                                {selectedColor === color && <Check size={16} color="#fff" strokeWidth={3} />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Hat/Wardrobe Picker */}
                <View style={styles.section}>
                    <Text style={styles.label}>ACCESSORIES</Text>
                    <View style={styles.hatGrid}>
                        {HATS.map((hat) => {
                            const isLocked = (pet.level || 1) < hat.requiredLevel;
                            const isSelected = selectedHat === hat.id;

                            return (
                                <TouchableOpacity
                                    key={hat.id}
                                    style={[
                                        styles.hatCard,
                                        isSelected && styles.hatSelected,
                                        isLocked && styles.hatLocked
                                    ]}
                                    onPress={() => handleHatSelect(hat.id, isLocked)}
                                    activeOpacity={0.8}
                                >
                                    <HatIcon type={hat.id} />
                                    <Text style={styles.hatName}>{hat.name}</Text>
                                    {isLocked && (
                                        <View style={styles.lockBadge}>
                                            <Lock size={8} color="#fff" />
                                            <Text style={styles.lockText}>Lvl {hat.requiredLevel}</Text>
                                        </View>
                                    )}
                                    {isSelected && !isLocked && (
                                        <View style={styles.checkBadge}>
                                            <Check size={10} color="#000" strokeWidth={3} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c1e',
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    previewContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 180,
        marginBottom: 24,
    },
    glowWrapper: {
        position: 'absolute',
    },
    petSvg: {
        width: 140,
        height: 140,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 12,
        marginLeft: 4,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 18,
    },
    colorRow: {
        gap: 12,
        paddingHorizontal: 4,
        paddingVertical: 10,
    },
    colorDot: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'transparent',
    },
    colorSelected: {
        borderColor: '#fff',
        transform: [{ scale: 1.1 }],
    },
    hatGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    hatCard: {
        width: (width - 60) / 3,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    hatSelected: {
        borderColor: '#fff',
    },
    hatLocked: {
        opacity: 0.5,
    },
    hatName: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 6,
    },
    noneIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        borderStyle: 'dashed',
    },
    lockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ef4444',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 3,
        marginTop: 4,
    },
    lockText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '700',
    },
    checkBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: '#fff',
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
