import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Animated, Easing, Platform } from 'react-native';
import Svg, { Path, Defs, RadialGradient, Stop, Circle, G, Text as SvgText, Rect } from 'react-native-svg';
import { Pet as PetType } from '@habitapp/shared';
import { BlurView } from 'expo-blur';
import { GlassView } from 'expo-glass-effect';
import { Heart, Zap, Smile, Palette } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ZParticle } from './ZParticle';
import { PetEyes } from './PetEyes';
import { PetMouth } from './PetMouth';
import { PetHat } from './PetHat';

const { width } = Dimensions.get('window');

interface PetProps {
    pet: PetType | null;
    isFullView?: boolean;
    hideStats?: boolean; // Hide the stats card (for onboarding hatching screen)
    disablePress?: boolean; // Disable tap interactions (for onboarding)
    initialSpeechText?: string; // Show a speech bubble with this text on mount
    onUpdate?: (updates: Partial<PetType>) => void;
    feedingBounce?: number; // Increment to trigger bounce animation
}

// ZParticle is now imported from './PetAnimations'

export const Pet = ({ pet, isFullView = false, hideStats = false, disablePress = false, initialSpeechText, onUpdate, feedingBounce }: PetProps) => {
    // State
    const navigation = useNavigation();
    const router = useRouter();
    const [xpDiff, setXpDiff] = useState(0);
    const [speechBubbleText, setSpeechBubbleText] = useState<string | null>(null);

    // Track previous values to trigger animations
    const prevXpRef = useRef(pet?.xp || 0);
    const prevLevelRef = useRef(pet?.level || 1);

    // Animation Values
    const breathVal = useRef(new Animated.Value(0)).current;
    const floatVal = useRef(new Animated.Value(0)).current;

    // Feedback Animations
    const xpFloatAnim = useRef(new Animated.Value(0)).current; // Y position
    const xpFadeAnim = useRef(new Animated.Value(0)).current;
    const speechFadeAnim = useRef(new Animated.Value(0)).current;
    const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Track hide timeout
    const levelScaleAnim = useRef(new Animated.Value(0)).current;
    const levelFadeAnim = useRef(new Animated.Value(0)).current;
    const interactionScale = useRef(new Animated.Value(1)).current;

    // Bounce animation when receiving food (feedingBounce changes)
    useEffect(() => {
        if (feedingBounce && feedingBounce > 0) {
            Animated.sequence([
                Animated.timing(interactionScale, { toValue: 1.15, duration: 100, useNativeDriver: true }),
                Animated.spring(interactionScale, { toValue: 1, friction: 3, tension: 300, useNativeDriver: true })
            ]).start();
        }
    }, [feedingBounce]);

    // Mood flags - needed early for handlers
    const isHappy = pet?.mood === 'happy';
    const isSad = pet?.mood === 'sad';
    const isSick = pet?.mood === 'sick';
    const isSleeping = pet?.mood === 'sleeping';

    // Blinking state for awake animations
    const [isBlinking, setIsBlinking] = useState(false);


    // Peeking state - one eye open when doing habits while sleeping
    const [isPeeking, setIsPeeking] = useState(false);
    const eyeLookAnim = useRef(new Animated.Value(0)).current; // 0 = center, 1 = looking down

    // Late night habit completion - pet peeks with one eye
    // Trigger on feedingBounce OR XP changes while sleeping
    const triggerPeek = () => {
        if (!isSleeping) return;

        setIsPeeking(true);
        eyeLookAnim.setValue(0); // Start centered

        // Animate eye to look down after opening
        Animated.sequence([
            Animated.delay(300), // Pause after opening
            Animated.timing(eyeLookAnim, {
                toValue: 1,
                duration: 400,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: false // Can't use native for interpolated values we read
            })
        ]).start();

        // Show a funny late-night message
        const lateNightPhrases = [
            "Up late, huh? 👀",
            "*one eye opens* ...nice.",
            "Couldn't sleep either?",
            "Midnight grinder! 🌙",
            "Shh... I won't tell.",
            "*peeks* ...productive!",
            "Night owl energy! 🦉",
        ];
        const randomPhrase = lateNightPhrases[Math.floor(Math.random() * lateNightPhrases.length)];
        setSpeechBubbleText(randomPhrase);

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.timing(speechFadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();

        // Clear any existing timeout
        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = setTimeout(() => {
            Animated.timing(speechFadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
                setSpeechBubbleText(null);
            });
        }, 3000);

        // Close eye after a moment
        setTimeout(() => setIsPeeking(false), 2500);
    };

    useEffect(() => {
        if (feedingBounce && feedingBounce > 0 && isSleeping) {
            triggerPeek();
        }
    }, [feedingBounce]);

    // Also trigger peek on XP gain while sleeping
    useEffect(() => {
        if (!pet) return;
        const xpGained = (pet.xp || 0) > prevXpRef.current;
        if (xpGained && isSleeping) {
            triggerPeek();
        }
    }, [pet?.xp]);

    // Random blink interval for awake pet
    useEffect(() => {
        if (!pet || pet.mood === 'sleeping') return;

        const scheduleBlink = () => {
            const delay = 2000 + Math.random() * 4000; // 2-6 seconds
            return setTimeout(() => {
                setIsBlinking(true);
                setTimeout(() => setIsBlinking(false), 150); // Blink duration
                scheduleBlink();
            }, delay);
        };

        const blinkTimer = scheduleBlink();
        return () => clearTimeout(blinkTimer);
    }, [pet?.mood]);

    const handlePetPress = () => {
        // Disable interactions if prop is set (e.g., during onboarding)
        if (disablePress) return;

        // Different haptics based on mood
        if (isSleeping) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Bounce animation
        Animated.sequence([
            Animated.timing(interactionScale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
            Animated.spring(interactionScale, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true })
        ]).start();

        // Mood-specific phrases
        let phrases: string[];

        if (isSleeping) {
            phrases = [
                "*yawn* ...five more minutes...",
                "Zzz... huh? ...zzz...",
                "*mumbles* ...so tired...",
                "Let me sleep... 😴",
                "*stretches* ...not yet...",
                "Shh... dreaming of XP...",
            ];
        } else if (isSad) {
            phrases = [
                "I miss you...",
                "Complete some habits?",
                "I'm kinda lonely...",
                "Need some attention...",
                "*sigh*",
            ];
        } else if (isSick) {
            phrases = [
                "Not feeling great...",
                "Need some care...",
                "*cough*",
                "Help me feel better?",
            ];
        } else {
            // Happy/Neutral - energetic phrases
            phrases = [
                "You're doing great!",
                "Let's get some XP!",
                "I'm hungry for habits!",
                "Did you drink water?",
                "Keep it up! 💪",
                "You got this!",
                "Time to focus!",
                "Shiny habits! ✨",
                "Level up time?",
                "I believe in you!",
                "Let's crush today!",
            ];
        }

        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        setSpeechBubbleText(randomPhrase);

        // Fade in bubble
        Animated.timing(speechFadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();

        // Clear any existing timeout and set new one
        if (speechTimeoutRef.current) {
            clearTimeout(speechTimeoutRef.current);
        }

        // Hide after appropriate time (longer for sleeping/groggy)
        const hideDelay = isSleeping ? 3000 : 2500;
        speechTimeoutRef.current = setTimeout(() => {
            Animated.timing(speechFadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
                setSpeechBubbleText(null);
            });
        }, hideDelay);
    };

    useEffect(() => {
        if (!pet) return;

        const breathing = Animated.loop(
            Animated.sequence([
                Animated.timing(breathVal, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(breathVal, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
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

    // Show initial speech text if provided (e.g., for onboarding)
    useEffect(() => {
        if (initialSpeechText && pet) {
            setSpeechBubbleText(initialSpeechText);
            // Fast pop-in for immediate feedback
            Animated.timing(speechFadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }).start();
        }
    }, [initialSpeechText, pet]);

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

    // Note: mood flags defined earlier for use in handlers

    // Face rendering now uses extracted components from PetExpressions.tsx

    // Compact View (Header) - with subtle animations
    if (!isFullView) {
        // Compact animations - consistent with full view but scaled
        const compactScale = breathVal.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] }); // Matching full view's subtler breathing
        const compactFloatY = floatVal.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }); // Scaled down float (full is -12)

        return (
            <View style={[styles.compactContainer]}>
                <Animated.View style={{ transform: [{ translateY: compactFloatY }, { scale: compactScale }] }}>
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
                            <PetEyes isSleeping={isSleeping} isPeeking={isPeeking} isBlinking={isBlinking} eyeLookAnim={eyeLookAnim} />
                            <PetMouth isHappy={isHappy} isSad={isSad} isSick={isSick} />
                            <PetHat hat={pet.hat} />
                        </G>
                    </Svg>
                </Animated.View>

                {/* Mini Z's for sleeping - subtle, slow */}
                {isSleeping && (
                    <View style={styles.miniZContainer}>
                        <ZParticle delay={0} xOffset={0} size={11} />
                        <ZParticle delay={2000} xOffset={6} size={14} />
                    </View>
                )}
            </View>
        );
    }

    // Full View Animations - more dramatic glow pulsing
    const glowScale = breathVal.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.25] });
    const glowOpacity = breathVal.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.8] });
    const petFloatY = floatVal.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
    const petScale = breathVal.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] });

    const currentLevel = pet.level || 1;
    const currentXp = pet.xp || 0;
    const xpToNextLevel = currentLevel * 100;
    const xpPercentage = Math.min((currentXp / xpToNextLevel) * 100, 100);

    return (
        <View style={styles.fullContainer}>


            <View style={styles.petDisplay}>
                {/* Glow Effect using RadialGradient for softness */}
                <Animated.View style={[styles.glowContainer, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]}>
                    <Svg height="500" width="500" viewBox="0 0 500 500">
                        <Defs>
                            <RadialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                                <Stop offset="0%" stopColor={pet.color} stopOpacity="0.7" />
                                <Stop offset="100%" stopColor={pet.color} stopOpacity="0" />
                            </RadialGradient>
                        </Defs>
                        <Circle cx="250" cy="250" r="250" fill="url(#glowGrad)" />
                    </Svg>
                </Animated.View>

                <View style={styles.petAnchor}>
                    <TouchableOpacity activeOpacity={1} onPress={handlePetPress}>
                        <Animated.View style={[styles.petSvgContainer, {
                            transform: [
                                { translateY: petFloatY },
                                { scale: petScale },
                                { scale: interactionScale }
                            ]
                        }]}>
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
                                    <PetEyes isSleeping={isSleeping} isPeeking={isPeeking} isBlinking={isBlinking} eyeLookAnim={eyeLookAnim} />
                                    <PetMouth isHappy={isHappy} isSad={isSad} isSick={isSick} />
                                    {!isSick && (
                                        <G>
                                            <Circle cx="60" cy="125" r="14" fill="#ff99cc" opacity="0.5" />
                                            <Circle cx="140" cy="125" r="14" fill="#ff99cc" opacity="0.5" />
                                        </G>
                                    )}
                                    <PetHat hat={pet.hat} />
                                </G>
                            </Svg>
                        </Animated.View>
                    </TouchableOpacity>

                    {/* Speech Bubble anchored to pet frame */}
                    {speechBubbleText && (
                        <Animated.View style={[
                            styles.speechBubble,
                            { opacity: speechFadeAnim },
                            hideStats && { top: -60 } // Override for hatching screen
                        ]}>
                            <Text style={styles.speechText}>{speechBubbleText}</Text>
                            <View style={styles.speechArrow} />
                        </Animated.View>
                    )}
                </View>

                {/* Shadow under pet */}
                <View style={styles.petShadow} />

                {isSleeping && (
                    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                        <ZParticle delay={0} xOffset={80} size={18} />
                        <ZParticle delay={2000} xOffset={95} size={24} />
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

            {/* Stats Card - hidden during onboarding hatching */}
            {!hideStats && (
                <GlassView glassEffectStyle="regular" style={styles.statsCard}>
                    {/* Level & Mood Header */}
                    <View style={styles.headerRow}>
                        <View style={styles.levelBadge}>
                            <Zap size={14} color="#facc15" />
                            <Text style={styles.levelBadgeText}>Level {currentLevel}</Text>
                        </View>
                        <View style={styles.moodPill}>
                            <Smile size={14} color={pet.mood === 'happy' ? '#22c55e' : pet.mood === 'sad' ? '#f87171' : '#a5b4fc'} />
                            <Text style={styles.moodText}>{pet.mood.charAt(0).toUpperCase() + pet.mood.slice(1)}</Text>
                        </View>
                    </View>

                    {/* Stats Bars */}
                    <View style={styles.barsContainer}>
                        {/* Health Bar */}
                        <View style={styles.statRow}>
                            <View style={styles.statInfo}>
                                <Heart size={14} color="#f87171" />
                                <Text style={styles.statLabel}>Health</Text>
                            </View>
                            <View style={styles.barWrapper}>
                                <View style={styles.barBg}>
                                    <View style={[styles.barFill, { width: `${pet.health}%`, backgroundColor: pet.health < 30 ? '#ef4444' : '#22c55e' }]} />
                                </View>
                                <Text style={styles.barValue}>{Math.round(pet.health)}%</Text>
                            </View>
                        </View>

                        {/* XP Bar */}
                        <View style={styles.statRow}>
                            <View style={styles.statInfo}>
                                <Zap size={14} color="#facc15" />
                                <Text style={styles.statLabel}>XP</Text>
                            </View>
                            <View style={styles.barWrapper}>
                                <View style={styles.barBg}>
                                    <View style={[styles.barFill, { width: `${xpPercentage}%`, backgroundColor: '#facc15' }]} />
                                </View>
                                <Text style={styles.barValue}>{currentXp}/{xpToNextLevel}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Customize Button */}
                    <TouchableOpacity style={styles.customizeButton} onPress={() => router.push('/pet-customize')}>
                        <Palette size={18} color="#fff" />
                        <Text style={styles.customizeText}>Customize</Text>
                    </TouchableOpacity>
                </GlassView>
            )}


        </View>
    );
};

const styles = StyleSheet.create({
    compactContainer: {
        width: 120,
        height: 120,
        position: 'relative',
        overflow: 'visible',
    },
    compactGlow: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        top: 5,
        left: 5,
    },
    miniZContainer: {
        position: 'absolute',
        top: -10,
        right: 35,
        width: 25,
        height: 30,
    },
    svg: {
        width: '100%',
        height: '100%',
    },
    fullContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between', // Distribute content vertically
        paddingVertical: 20, // Add some safe padding
        width: '100%',
    },

    petDisplay: {
        flex: 1, // Allow pet display to take available space
        width: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24, // Add spacing between pet and stats card
    },
    petAnchor: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'rgba(255,0,0,0.1)', // Debug
    },
    glowContainer: {
        position: 'absolute',
        width: 500,
        height: 500,
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
        fontWeight: '800',
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
        fontWeight: '800',
        color: '#fff',
        textTransform: 'uppercase',
    },
    levelSubText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
    },
    // Speech Bubble
    speechBubble: {
        position: 'absolute',
        top: -40, // Default position
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        maxWidth: 200,
        zIndex: 60,
    },
    speechText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
    },
    speechArrow: {
        position: 'absolute',
        bottom: -6,
        left: '50%',
        marginLeft: -6,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#fff',
    },
    zText: {
        fontSize: 24,
        fontWeight: '700',
        fontStyle: 'italic',
        color: 'rgba(255,255,255,0.7)',
        textShadowColor: 'rgba(255,255,255,0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    petSvgContainer: {
        width: 200,
        height: 200,
    },
    petShadow: {
        width: 120,
        height: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 60,
        marginTop: -10,
    },
    statsCard: {
        width: width - 40,
        borderRadius: 24,
        padding: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
        marginTop: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(250, 204, 21, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    levelBadgeText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#facc15',
    },
    moodPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    moodText: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.8)',
    },
    barsContainer: {
        gap: 12,
        marginBottom: 16,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        width: 70,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.6)',
    },
    barWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    barBg: {
        flex: 1,
        height: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 4,
    },
    barValue: {
        fontSize: 11,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
        width: 55,
        textAlign: 'right',
    },
    customizeButton: {
        width: '100%',
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    customizeText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
});
