import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, LayoutChangeEvent } from 'react-native';
import { BlurView } from 'expo-blur';
import { Check, Sparkles, Sunrise, Sun, Moon, LucideIcon } from 'lucide-react-native';
import { Habit } from '@habitapp/shared';
import * as Haptics from 'expo-haptics';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Trash2, Edit2 } from 'lucide-react-native';

interface HabitCardProps {
    habit: Habit;
    isCompleted: boolean;
    currentCount: number;
    streak: number;
    onToggle: () => void;

    onPress: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
}

const TimeIcons: Record<string, LucideIcon> = {
    anytime: Sparkles,
    morning: Sunrise,
    midday: Sun,
    evening: Moon,
};

const TimeLabels: Record<string, string> = {
    anytime: 'Anytime',
    morning: 'Morning',
    midday: 'Noon',
    evening: 'Evening',
};

export const HabitCard = ({ habit, isCompleted, currentCount, streak, onToggle, onPress, onDelete, onEdit }: HabitCardProps) => {
    const Icon = TimeIcons[habit.timeOfDay] || Sparkles;

    // Animate 0 -> 1 (percentage) - Purely visual, separate from logic
    const progressAnim = useRef(new Animated.Value(isCompleted ? 1 : Math.min(currentCount / habit.targetCount, 1))).current;

    // Refs
    const checkButtonRef = useRef<View>(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;


    // Sync progress bar with props
    useEffect(() => {
        const targetValue = isCompleted ? 1 : Math.min(currentCount / habit.targetCount, 1);

        Animated.spring(progressAnim, {
            toValue: targetValue,
            friction: 8,
            tension: 40,
            useNativeDriver: false,
        }).start();
    }, [currentCount, habit.targetCount, isCompleted]);

    const handleToggle = () => {
        // 1. Immediate Haptic
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // 2. Logic Step: Will this complete the habit?
        const willComplete = !isCompleted && (currentCount + 1 >= habit.targetCount);

        if (willComplete) {
            // 4A. COMPLETION: "Heavy Impact"
            // Cohesive "Stamping" feel: Whole card presses down deeply, then snaps back.
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
                Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 150, useNativeDriver: true })
            ]).start();
        } else {
            // 4B. UNDO: "Light Tap"
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 0.99, duration: 50, useNativeDriver: true }),
                Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 100, useNativeDriver: true })
            ]).start();
        }

        // 4. Data Step: Commit immediately
        // We do NOT wait. We trust the Global Layer to handle the celebration persistence.
        onToggle();
    };

    const renderRightActions = (progress: any, dragX: any) => {
        const trans = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <View style={styles.rightAction}>
                <Animated.View style={[styles.actionIcon, { transform: [{ scale: trans }] }]}>
                    <TouchableOpacity onPress={onEdit}>
                        <Edit2 size={24} color="#fff" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    };

    const renderLeftActions = (progress: any, dragX: any) => {
        const trans = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });

        return (
            <View style={styles.leftAction}>
                <Animated.View style={[styles.actionIcon, { transform: [{ scale: trans }] }]}>
                    <TouchableOpacity onPress={onDelete}>
                        <Trash2 size={24} color="#fff" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    };

    return (
        <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
            <Swipeable
                renderRightActions={renderRightActions}
                renderLeftActions={renderLeftActions}
                onSwipeableOpen={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
                <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
                    <BlurView
                        intensity={40}
                        tint="systemThickMaterialDark"
                        style={styles.blur}
                    >
                        {/* Progress Bar - Only for partial progress, remove on completion */}
                        {!isCompleted && (
                            <Animated.View
                                style={[
                                    styles.progressBar,
                                    {
                                        width: progressAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%']
                                        }),
                                        backgroundColor: `${habit.color}40`
                                    }
                                ]}
                            />
                        )}

                        <View style={styles.content}>
                            <View style={styles.leftSection}>
                                <View style={[
                                    styles.iconContainer,
                                    { backgroundColor: habit.color } // Identity: Always colored
                                ]}>
                                    <Text style={{ fontSize: 24 }}>{habit.icon}</Text>
                                </View>

                                <View style={styles.textContainer}>
                                    <View style={styles.titleRow}>
                                        <Text style={[
                                            styles.title,
                                            isCompleted && { opacity: 0.7 }
                                        ]} numberOfLines={1}>
                                            {habit.title}
                                        </Text>
                                        <View style={styles.badge}>
                                            <Icon size={10} color="rgba(255,255,255,0.5)" />
                                            <Text style={styles.badgeText}>{TimeLabels[habit.timeOfDay]}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.statsRow}>
                                        {habit.targetCount > 1 && (
                                            <Text style={[
                                                styles.statsText,
                                                isCompleted && { color: habit.color, fontWeight: '700' }
                                            ]}>
                                                {currentCount}/{habit.targetCount}
                                            </Text>
                                        )}
                                        {streak >= 2 && (
                                            <View style={styles.streakBadge}>
                                                <Text style={styles.streakText}>🔥 {streak}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>

                            <View style={{}}>
                                <View ref={checkButtonRef} collapsable={false}>
                                    <TouchableOpacity
                                        onPress={handleToggle}
                                        style={[
                                            styles.checkButton,
                                            isCompleted && {
                                                backgroundColor: '#34C759', // Universal Success Green
                                                borderColor: '#34C759'
                                            }
                                        ]}
                                        activeOpacity={0.7}
                                    >
                                        {isCompleted && (
                                            <Check
                                                size={22}
                                                color="#fff" // Always white check
                                                strokeWidth={4} // Thicker for emphasis
                                            />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </BlurView>
                </TouchableOpacity>
            </Swipeable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    blur: {
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    progressBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        borderRadius: 24,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14, // Rounded Square for "Identity"
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        // Background color is inline
    },
    textContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
        flexShrink: 1,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 4,
    },
    badgeText: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statsText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '500',
    },
    streakBadge: {
        backgroundColor: 'rgba(251, 146, 60, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 100,
    },
    streakText: {
        fontSize: 12,
        color: '#fb923c',
        fontWeight: '600',
    },
    checkButton: {
        width: 48,
        height: 48,
        borderRadius: 24, // Circle for "Action"
        backgroundColor: 'rgba(255,255,255,0.05)', // Subtle glass fill
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)', // Neutral border
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftAction: {
        backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
    },
    rightAction: {
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
    },
    actionIcon: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
