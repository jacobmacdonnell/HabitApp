import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Animated, Easing, Platform } from 'react-native';
import Svg, { Path, Defs, RadialGradient, Stop, Circle, G, Text as SvgText, Rect } from 'react-native-svg';
import { Pet as PetType } from '@habitapp/shared';
import { BlurView } from 'expo-blur';
import { Heart, Zap, Smile, Star, Palette, Shirt } from 'lucide-react-native';
import { PetStyleModal } from './PetStyleModal';
import { PetWardrobeModal } from './PetWardrobeModal';

const { width } = Dimensions.get('window');

interface PetProps {
    pet: PetType | null;
    isFullView?: boolean;
    onUpdate?: (updates: Partial<PetType>) => void;
}

// Z-Particle Component using standard Animated
const ZParticle = ({ delay, xOffset }: { delay: number, xOffset: number }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const liftAnim = useRef(new Animated.Value(0)).current;
    const wiggledAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = () => {
            fadeAnim.setValue(0);
            liftAnim.setValue(0);
            wiggledAnim.setValue(0);

            Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                    Animated.sequence([
                        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                        Animated.timing(fadeAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
                    ]),
                    Animated.timing(liftAnim, {
                        toValue: -40,
                        duration: 1500,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.sequence([
                        Animated.timing(wiggledAnim, { toValue: 10, duration: 750, useNativeDriver: true }),
                        Animated.timing(wiggledAnim, { toValue: -10, duration: 750, useNativeDriver: true }),
                    ])
                ])
            ]).start(() => animate());
        };
        animate();
    }, []);

    return (
        <Animated.View style={{
            position: 'absolute',
            left: xOffset,
            top: 40,
            opacity: fadeAnim,
            transform: [{ translateY: liftAnim }, { translateX: wiggledAnim }]
        }}>
            <Text style={styles.zText}>Z</Text>
        </Animated.View>
    );
};

export const Pet = ({ pet, isFullView = false, onUpdate }: PetProps) => {
    // State
    const [isStyleOpen, setStyleOpen] = useState(false);
    const [isWardrobeOpen, setWardrobeOpen] = useState(false);
    const [xpDiff, setXpDiff] = useState(0);

    // Track previous values to trigger animations
    const prevXpRef = useRef(pet?.xp || 0);
    const prevLevelRef = useRef(pet?.level || 1);

    // Animation Values
    const breathVal = useRef(new Animated.Value(0)).current;
    const floatVal = useRef(new Animated.Value(0)).current;

    // Feedback Animations
    const xpFloatAnim = useRef(new Animated.Value(0)).current; // Y position
    const xpFadeAnim = useRef(new Animated.Value(0)).current;
    const levelScaleAnim = useRef(new Animated.Value(0)).current;
    const levelFadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!pet) return;

        const breathing = Animated.loop(
            Animated.sequence([
                Animated.timing(breathVal, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(breathVal, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        );

        const floating = Animated.loop(
            Animated.sequence([
                Animated.timing(floatVal, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(floatVal, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
            ])
        );

        breathing.start();
        floating.start();

        return () => {
            breathing.stop();
            floating.stop();
        };
    }, [pet]);

    // Handle XP / Level Changes
    useEffect(() => {
        if (!pet) return;

        // XP Animation
        if (pet.xp > prevXpRef.current) {
            const diff = pet.xp - prevXpRef.current;
            setXpDiff(diff);

            // Reset
            xpFloatAnim.setValue(0);
            xpFadeAnim.setValue(0);

            Animated.parallel([
                Animated.timing(xpFloatAnim, { toValue: -50, duration: 1500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
                Animated.sequence([
                    Animated.timing(xpFadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
                    Animated.delay(800),
                    Animated.timing(xpFadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
                ])
            ]).start();
        }

        // Level Up Animation
        if ((pet.level || 1) > prevLevelRef.current) {
            levelScaleAnim.setValue(0);
            levelFadeAnim.setValue(0);

            Animated.sequence([
                Animated.delay(300), // Wait slightly
                Animated.parallel([
                    Animated.spring(levelScaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
                    Animated.timing(levelFadeAnim, { toValue: 1, duration: 300, useNativeDriver: true })
                ]),
                Animated.delay(2000),
                Animated.timing(levelFadeAnim, { toValue: 0, duration: 500, useNativeDriver: true })
            ]).start();
        }

        prevXpRef.current = pet.xp || 0;
        prevLevelRef.current = pet.level || 1;

    }, [pet?.xp, pet?.level]);

    if (!pet) return null;

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
        if (!pet.hat || pet.hat === 'none') return null;
        return (
            <G transform="translate(60, 10) scale(0.8)">
                {pet.hat === 'party' && <Path d="M50 10 L80 70 L20 70 Z" fill="#facc15" stroke="white" strokeWidth="2" strokeLinejoin="round" />}
                {pet.hat === 'cowboy' && (
                    <G transform="translate(-10, -10)">
                        <Path d="M10 60 Q50 30 90 60" fill="#78350f" stroke="white" strokeWidth="2" />
                        <Path d="M30 60 L30 40 Q50 20 70 40 L70 60" fill="#78350f" stroke="white" strokeWidth="2" />
                    </G>
                )}
                {pet.hat === 'tophat' && (
                    <G transform="translate(-10, -20)">
                        <Rect x="20" y="60" width="60" height="10" fill="#1f2937" stroke="white" strokeWidth="2" />
                        <Rect x="30" y="20" width="40" height="40" fill="#1f2937" stroke="white" strokeWidth="2" />
                        <Rect x="30" y="50" width="40" height="5" fill="#ef4444" />
                    </G>
                )}
                {pet.hat === 'crown' && (
                    <G transform="translate(0, -10)">
                        <Path d="M20 60 L20 30 L35 50 L50 20 L65 50 L80 30 L80 60 Z" fill="#fbbf24" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                    </G>
                )}
            </G>
        );
    };

    // Compact View (Header)
    if (!isFullView) {
        return (
            <View style={[styles.compactContainer]}>
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
                        {renderHat()}
                    </G>
                </Svg>
            </View>
        );
    }

    // Full View Animations
    const glowScale = breathVal.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] });
    const glowOpacity = breathVal.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.6] });
    const petFloatY = floatVal.interpolate({ inputRange: [0, 1], outputRange: [0, -15] });
    const petScale = breathVal.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] });

    const currentLevel = pet.level || 1;
    const currentXp = pet.xp || 0;
    const xpToNextLevel = currentLevel * 100;
    const xpPercentage = Math.min((currentXp / xpToNextLevel) * 100, 100);

    return (
        <View style={styles.fullContainer}>
            <Text style={styles.pageTitle}>Pet</Text>

            <View style={styles.petDisplay}>
                {/* Glow Effect using RadialGradient for softness */}
                <Animated.View style={[styles.glowContainer, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]}>
                    <Svg height="300" width="300" viewBox="0 0 300 300">
                        <Defs>
                            <RadialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                                <Stop offset="0%" stopColor={pet.color} stopOpacity="0.6" />
                                <Stop offset="100%" stopColor={pet.color} stopOpacity="0" />
                            </RadialGradient>
                        </Defs>
                        <Circle cx="150" cy="150" r="150" fill="url(#glowGrad)" />
                    </Svg>
                </Animated.View>

                <Animated.View style={[styles.petSvgContainer, { transform: [{ translateY: petFloatY }, { scale: petScale }] }]}>
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
                            {renderHat()}
                        </G>
                    </Svg>
                </Animated.View>

                {isSleeping && (
                    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                        <ZParticle delay={0} xOffset={160} />
                        <ZParticle delay={1500} xOffset={190} />
                        <ZParticle delay={3000} xOffset={170} />
                    </View>
                )}

                {/* +XP Popup */}
                <Animated.View style={[styles.xpPopup, {
                    opacity: xpFadeAnim,
                    transform: [{ translateY: xpFloatAnim }]
                }]}>
                    <Text style={styles.xpText}>+{xpDiff} XP</Text>
                </Animated.View>

                {/* Level Up Popup */}
                <Animated.View style={[styles.levelPopup, {
                    opacity: levelFadeAnim,
                    transform: [{ scale: levelScaleAnim }]
                }]}>
                    <Text style={styles.levelText}>LEVEL UP!</Text>
                    <Text style={styles.levelSubText}>Lvl {pet.level}</Text>
                </Animated.View>
            </View>

            <BlurView intensity={20} tint="dark" style={styles.statsCard}>
                <View style={styles.nameRow}>
                    <Text style={styles.label}>NAME</Text>
                    <Text style={styles.name}>{pet.name}</Text>
                </View>

                <View style={styles.statsGrid}>
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

                    {/* Grid Items - Forced to 2 columns */}
                    <View style={styles.halfWidth}>
                        <View style={styles.miniStat}>
                            <View style={[styles.miniIcon, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
                                <Smile size={18} color="#a5b4fc" />
                            </View>
                            <Text style={styles.miniLabel} numberOfLines={1}>MOOD</Text>
                            <Text style={styles.miniValue} numberOfLines={1}>{pet.mood.charAt(0).toUpperCase() + pet.mood.slice(1)}</Text>
                        </View>
                    </View>

                    <View style={styles.halfWidth}>
                        <View style={styles.miniStat}>
                            <View style={[styles.miniIcon, { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}>
                                <Star size={18} color="#d8b4fe" />
                            </View>
                            <Text style={styles.miniLabel} numberOfLines={1}>LEVEL</Text>
                            <Text style={styles.miniValue}>{currentLevel}</Text>
                        </View>
                    </View>

                    <View style={styles.halfWidth}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => setStyleOpen(true)}>
                            <Palette size={16} color="#fff" />
                            <Text style={styles.actionText} numberOfLines={1}>Style</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.halfWidth}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => setWardrobeOpen(true)}>
                            <Shirt size={16} color="#fff" />
                            <Text style={styles.actionText} numberOfLines={1}>Wardrobe</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>

            {onUpdate && (
                <>
                    <PetStyleModal
                        visible={isStyleOpen}
                        onClose={() => setStyleOpen(false)}
                        pet={pet}
                        onUpdate={onUpdate}
                    />
                    <PetWardrobeModal
                        visible={isWardrobeOpen}
                        onClose={() => setWardrobeOpen(false)}
                        pet={pet}
                        onUpdate={onUpdate}
                    />
                </>
            )}
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
    glowContainer: {
        position: 'absolute',
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    xpPopup: {
        position: 'absolute',
        top: 60, // Above pet head
        alignSelf: 'center',
        zIndex: 50,
    },
    xpText: {
        fontSize: 24,
        fontWeight: '900',
        color: '#facc15',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    levelPopup: {
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
        backgroundColor: 'rgba(168, 85, 247, 0.9)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
        zIndex: 100,
    },
    levelText: {
        fontSize: 20,
        fontWeight: '900',
        color: '#fff',
        textTransform: 'uppercase',
    },
    levelSubText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
    },
    zText: {
        fontSize: 24,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.6)',
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
        marginBottom: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    statFullRow: {
        width: '100%',
        marginBottom: 8,
    },
    halfWidth: {
        width: '47%', // Slightly less than 50% to account for gap
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
        width: '100%',
        height: 100,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
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
        width: '100%',
        height: 60,
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
