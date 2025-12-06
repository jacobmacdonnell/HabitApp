import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, LayoutChangeEvent, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Check, Minus, Plus, Sparkles, Sunrise, Sun, Moon, LucideIcon } from 'lucide-react-native';
import { Habit } from '@habitapp/shared';
import * as Haptics from 'expo-haptics';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Trash2, Edit2, RotateCcw } from 'lucide-react-native';

interface HabitCardProps {
    habit: Habit;
    isCompleted: boolean;
    currentCount: number;
    streak: number;
    onToggle: () => void;
    onDecrement?: () => void;  // Long-press to decrement
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

export const HabitCard = ({ habit, isCompleted, currentCount, streak, onToggle, onDecrement, onPress, onDelete, onEdit }: HabitCardProps) => {
    const Icon = TimeIcons[habit.timeOfDay] || Sparkles;

    // Progress animation for multi-count habits
    const progressAnim = useRef(new Animated.Value(
        isCompleted ? 1 : Math.min(currentCount / habit.targetCount, 1)
    )).current;

    // Refs
    const checkButtonRef = useRef<View>(null);
    const swipeableRef = useRef<any>(null);
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
        // Prevent strictly incrementing if already completed (for multi-count)
        if (habit.targetCount > 1 && isCompleted) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

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
        onToggle();
    };

    // Undo handler
    const handleUndo = () => {
        // Only allow decrement if there's progress to undo
        if (currentCount <= 0) return;

        // Heavy haptic to signal "undo" action
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        // Subtle "shrink" animation to differentiate from increment
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.97, duration: 100, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 120, useNativeDriver: true })
        ]).start();

        // Call decrement handler
        onDecrement?.();
    };

    const renderRightActions = (progress: any, dragX: any) => {
        const trans = dragX.interpolate({
            inputRange: [-160, 0],
            outputRange: [0, 160],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={{ width: 160, flexDirection: 'row', transform: [{ translateX: trans }] }}>
                <BlurView
                    intensity={20}
                    tint="systemThickMaterialDark"
                    style={[styles.rightActionEdit, { backgroundColor: 'rgba(100, 116, 139, 0.25)' }]}
                >
                    <TouchableOpacity onPress={() => onEdit && onEdit()} style={styles.actionButtonContent}>
                        <Edit2 size={24} color="#fff" />
                    </TouchableOpacity>
                </BlurView>
                <BlurView
                    intensity={20}
                    tint="systemThickMaterialDark"
                    style={[styles.rightActionDelete, { backgroundColor: 'rgba(239, 68, 68, 0.25)' }]}
                >
                    <TouchableOpacity onPress={onDelete} style={styles.actionButtonContent}>
                        <Trash2 size={24} color="#f87171" />
                    </TouchableOpacity>
                </BlurView>
            </Animated.View>
        );
    };

    const onSwipeUndo = () => {
        handleUndo();
        swipeableRef.current?.close();
    };

    return (
        <Animated.View style={[
            styles.container,
            { transform: [{ scale: scaleAnim }] },
            isCompleted && { opacity: 0.55 } // Greyed out when completed
        ]}>
            <Swipeable
                ref={swipeableRef}
                renderRightActions={renderRightActions}
                // Only allow undo if there is progress > 0
                renderLeftActions={currentCount > 0 ? (progress, dragX) => (
                    <View style={{ width: 80 }} />
                ) : undefined}
                onSwipeableLeftOpen={onSwipeUndo}
                onSwipeableRightOpen={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                overshootRight={false}
                overshootLeft={true}
                friction={2}
                leftThreshold={80}
            >
                <TouchableOpacity activeOpacity={0.9} onPress={handleToggle}>
                    <BlurView
                        intensity={40}
                        tint="systemThickMaterialDark"
                        style={styles.blur}
                    >
                        {/* Subtle progress bar - consistent for all habits */}
                        <Animated.View
                            style={[
                                styles.progressBar,
                                isCompleted
                                    ? {
                                        // Complete: force full width
                                        right: 0,
                                        backgroundColor: 'rgba(52, 199, 89, 0.25)'
                                    }
                                    : {
                                        width: progressAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%']
                                        }),
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)'
                                    }
                            ]}
                        />

                        <View style={styles.content}>
                            <View style={styles.leftSection}>
                                <View style={[
                                    styles.iconContainer,
                                    { backgroundColor: habit.color } // Identity: Always colored
                                ]}>
                                    <Text style={{ fontSize: 24 }}>{habit.icon}</Text>
                                </View>

                                <View style={styles.textContainer}>
                                    {/* Time badge above title */}
                                    <View style={styles.badge}>
                                        <Icon size={10} color="rgba(255,255,255,0.5)" />
                                        <Text style={styles.badgeText}>{TimeLabels[habit.timeOfDay]}</Text>
                                    </View>

                                    {/* Habit title */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 4 }}>
                                        <Text style={[
                                            styles.title,
                                            isCompleted && { opacity: 0.7, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }
                                        ]} numberOfLines={1}>
                                            {habit.title}
                                        </Text>

                                        {/* Status Indicator: Check when done, Count when in progress */}
                                        {isCompleted ? (
                                            <Check size={20} color={habit.color} strokeWidth={3} />
                                        ) : (
                                            habit.targetCount > 1 && (
                                                <Text style={[
                                                    styles.statsText,
                                                    { color: 'rgba(255,255,255,0.5)' }
                                                ]}>
                                                    {currentCount}/{habit.targetCount}
                                                </Text>
                                            )
                                        )}
                                    </View>

                                    {/* Streak Badge (only show if active streak) */}
                                    {streak >= 2 && (
                                        <View style={[styles.statsRow, { marginTop: 4 }]}>
                                            <View style={styles.streakBadge}>
                                                <Text style={styles.streakText}>🔥 {streak}</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    </BlurView>
                </TouchableOpacity>
            </Swipeable>
        </Animated.View >
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        borderRadius: 26,
        borderCurve: 'continuous',
        overflow: 'hidden',
    },
    blur: {
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 26,
        borderCurve: 'continuous',
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.15)',
        overflow: 'hidden',
    },
    progressBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
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
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 999, // Circle
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        // Background color is inline
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
        marginVertical: 2,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start', // Don't stretch across the row
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 4,
        marginBottom: 2,
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
        marginTop: 2,
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
    rightActionUndo: {
        // backgroundColor: '#f97316', // Colors moved inline for opacity
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
    },
    rightActionEdit: {
        // backgroundColor: '#64748b',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
    },
    rightActionDelete: {
        // backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
    },
    actionButtonContent: {
        width: 80,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
