import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import Svg, { Path, Defs, RadialGradient, Stop, Circle, G, Rect, Text as SvgText } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence } from 'react-native-reanimated';
import { Pet as PetType } from '@habitapp/shared';
import { BlurView } from 'expo-blur';
import { Heart, Zap, Smile, Star, Palette, Shirt, Lock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface PetProps {
    pet: PetType | null;
    isFullView?: boolean;
    onUpdate?: (updates: Partial<PetType>) => void;
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedView = Animated.createAnimatedComponent(View);

export const Pet = ({ pet, isFullView = false, onUpdate }: PetProps) => {
    if (!pet) return null;

    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);

    useEffect(() => {
        if (pet.mood === 'sleeping') {
            scale.value = withRepeat(withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
        } else {
            scale.value = withTiming(1);
            // Gentle bounce/float
            translateY.value = withRepeat(withSequence(
                withTiming(-5, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
                withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.quad) })
            ), -1, true);
        }
    }, [pet.mood]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }, { translateY: translateY.value }],
    }));

    const isHappy = pet.mood === 'happy';
    const isSad = pet.mood === 'sad';
    const isSick = pet.mood === 'sick';
    const isSleeping = pet.mood === 'sleeping';

    const renderEyes = () => {
        if (isSleeping) return (
            <G>
                <Path d="M 60 85 Q 70 95 80 85" stroke="rgba(0,0,0,0.8)" strokeWidth="4" fill="none" strokeLinecap="round" />
                <Path d="M 120 85 Q 130 95 140 85" stroke="rgba(0,0,0,0.8)" strokeWidth="4" fill="none" strokeLinecap="round" />
            </G>
        );
        // Simplified eyes for now
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

    // Compact View (Header)
    if (!isFullView) {
        return (
            <AnimatedView style={[styles.compactContainer, animatedStyle]}>
                <Svg viewBox="0 0 200 200" style={styles.svg}>
                    <Defs>
                        <RadialGradient id="bodyGrad" cx="30%" cy="30%" r="80%">
                            <Stop offset="0%" stopColor={pet.color} stopOpacity="1" />
                            <Stop offset="100%" stopColor={pet.color} stopOpacity="0.8" />
                        </RadialGradient>
                    </Defs>
                    <Path d="M100,180 C60,180 30,150 30,110 C30,80 50,55 75,50 C80,30 100,20 120,30 C140,20 160,35 165,60 C185,70 190,100 180,125 C190,150 170,180 130,180 Z" fill="url(#bodyGrad)" stroke={pet.color} strokeWidth="2" />
                    <Path d="M90,50 Q100,10 115,45 Q125,15 135,50" fill="none" stroke={pet.color} strokeWidth="8" strokeLinecap="round" />
                    <G transform="translate(0, 10)">
                        {renderEyes()}
                        {renderMouth()}
                    </G>
                </Svg>
            </AnimatedView>
        );
    }

    // Full View
    const currentLevel = pet.level || 1;
    const currentXp = pet.xp || 0;
    const xpToNextLevel = currentLevel * 100;
    const xpPercentage = Math.min((currentXp / xpToNextLevel) * 100, 100);

    return (
        <View style={styles.fullContainer}>
            <Text style={styles.pageTitle}>Pet</Text>

            <View style={styles.petDisplay}>
                {/* Glow */}
                <View style={[styles.glow, { backgroundColor: pet.color }]} />

                <AnimatedView style={[styles.petSvgContainer, animatedStyle]}>
                    <Svg viewBox="0 0 200 200" style={styles.svg}>
                        <Defs>
                            <RadialGradient id="bodyGradFull" cx="30%" cy="30%" r="80%">
                                <Stop offset="0%" stopColor={pet.color} stopOpacity="1" />
                                <Stop offset="100%" stopColor={pet.color} stopOpacity="0.8" />
                            </RadialGradient>
                        </Defs>
                        <Path d="M100,180 C60,180 30,150 30,110 C30,80 50,55 75,50 C80,30 100,20 120,30 C140,20 160,35 165,60 C185,70 190,100 180,125 C190,150 170,180 130,180 Z" fill="url(#bodyGradFull)" stroke={pet.color} strokeWidth="2" />
                        <Path d="M90,50 Q100,10 115,45 Q125,15 135,50" fill="none" stroke={pet.color} strokeWidth="8" strokeLinecap="round" />
                        <G transform="translate(0, 10)">
                            {renderEyes()}
                            {renderMouth()}
                            {!isSick && (
                                <G>
                                    <Circle cx="60" cy="125" r="14" fill="#ff99cc" opacity="0.5" />
                                    <Circle cx="140" cy="125" r="14" fill="#ff99cc" opacity="0.5" />
                                </G>
                            )}
                        </G>
                    </Svg>
                </AnimatedView>
            </View>

            {/* Stats Card */}
            <BlurView intensity={20} tint="dark" style={styles.statsCard}>
                <View style={styles.nameRow}>
                    <Text style={styles.label}>NAME</Text>
                    <Text style={styles.name}>{pet.name}</Text>
                </View>

                <View style={styles.statsGrid}>
                    {/* Health */}
                    <View style={styles.statFullRow}>
                        <View style={styles.statHeader}>
                            <View style={styles.iconLabel}>
                                <Heart size={14} color="#f87171" />
                                <Text style={styles.statLabel}>Health</Text>
                            </View>
                            <Text style={styles.statValue}>{Math.round(pet.health)}%</Text>
                        </View>
                        <View style={styles.barBg}>
                            <View style={[styles.barFill, { width: `${pet.health}%`, backgroundColor: pet.health < 30 ? '#ef4444' : '#22c55e' }]} />
                        </View>
                    </View>

                    {/* XP */}
                    <View style={styles.statFullRow}>
                        <View style={styles.statHeader}>
                            <View style={styles.iconLabel}>
                                <Zap size={14} color="#facc15" />
                                <Text style={styles.statLabel}>XP</Text>
                            </View>
                            <Text style={styles.statValue}>Lvl {currentLevel}</Text>
                        </View>
                        <View style={styles.barBg}>
                            <View style={[styles.barFill, { width: `${xpPercentage}%`, backgroundColor: '#eab308' }]} />
                        </View>
                    </View>

                    {/* Mood & Level */}
                    <View style={styles.miniStat}>
                        <View style={[styles.miniIcon, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
                            <Smile size={18} color="#a5b4fc" />
                        </View>
                        <Text style={styles.miniLabel}>MOOD</Text>
                        <Text style={styles.miniValue}>{pet.mood.charAt(0).toUpperCase() + pet.mood.slice(1)}</Text>
                    </View>

                    <View style={styles.miniStat}>
                        <View style={[styles.miniIcon, { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}>
                            <Star size={18} color="#d8b4fe" />
                        </View>
                        <Text style={styles.miniLabel}>LEVEL</Text>
                        <Text style={styles.miniValue}>{currentLevel}</Text>
                    </View>

                    {/* Buttons */}
                    <TouchableOpacity style={styles.actionButton}>
                        <Palette size={16} color="#fff" />
                        <Text style={styles.actionText}>Style</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Shirt size={16} color="#fff" />
                        <Text style={styles.actionText}>Wardrobe</Text>
                    </TouchableOpacity>
                </View>
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    compactContainer: {
        width: 60,
        height: 60,
    },
    svg: {
        width: '100%',
        height: '100%',
    },
    fullContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 60,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    petDisplay: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    glow: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        opacity: 0.3,
        transform: [{ scale: 1.5 }],
    },
    petSvgContainer: {
        width: 200,
        height: 200,
    },
    statsCard: {
        width: width - 40,
        borderRadius: 24,
        padding: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    nameRow: {
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingBottom: 10,
    },
    label: {
        fontSize: 10,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 4,
    },
    name: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statFullRow: {
        width: '100%',
        marginBottom: 8,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    iconLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.7)',
        textTransform: 'uppercase',
    },
    statValue: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    barBg: {
        height: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 6,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    barFill: {
        height: '100%',
        borderRadius: 6,
    },
    miniStat: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    miniIcon: {
        padding: 6,
        borderRadius: 20,
        marginBottom: 4,
    },
    miniLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 2,
    },
    miniValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
    actionButton: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    actionText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
    },
});
