import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Check, Sparkles, Sunrise, Sun, Moon, LucideIcon, Trash2, Edit2, Undo2, Zap } from 'lucide-react-native';
import { Habit } from '@habitapp/shared';
import * as Haptics from 'expo-haptics';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import type { Swipeable as SwipeableType } from 'react-native-gesture-handler';
import { useXPNotification } from '../context/XPNotificationContext';

interface HabitCardProps {
    habit: Habit;
    isCompleted: boolean;
    currentCount: number;
    streak: number;
    onToggle: () => void;
    onDecrement?: () => void;
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

export const HabitCard = ({ habit, isCompleted, currentCount, streak, onToggle, onDecrement, onDelete, onEdit }: HabitCardProps) => {
    const Icon = TimeIcons[habit.timeOfDay] || Sparkles;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const checkboxScaleAnim = useRef(new Animated.Value(1)).current;
    const swipeableRef = useRef<SwipeableType>(null);
    const { showXP } = useXPNotification();

    // --- INTERACTION HANDLERS ---

    const handleCheckboxTap = () => {
        // Prevent tapping if already complete - use swipe undo instead
        if (isCompleted) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Animate card + checkbox bounce together
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 200, useNativeDriver: true })
        ]).start();
        Animated.sequence([
            Animated.timing(checkboxScaleAnim, { toValue: 0.8, duration: 80, useNativeDriver: true }),
            Animated.spring(checkboxScaleAnim, { toValue: 1, friction: 4, tension: 200, useNativeDriver: true })
        ]).start();

        // Check if this will complete the habit (show XP popup)
        const willComplete = (habit.targetCount === 1 && !isCompleted) ||
            (habit.targetCount > 1 && currentCount + 1 >= habit.targetCount);

        if (willComplete) {
            showXP(20);
        }

        onToggle();
    };

    const handleUndo = () => {
        if (currentCount <= 0) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // If this will be the last undo (going to 0), close the swipe menu
        if (currentCount === 1) {
            swipeableRef.current?.close();
        }

        onDecrement?.();
    };

    // --- SWIPE ACTIONS ---

    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
        // Fade in the actions as the swipe progresses
        const opacity = progress.interpolate({
            inputRange: [0, 0.2, 1],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[styles.actionsContainer, { opacity }]}>
                {/* Undo - only show if there's progress to undo */}
                {currentCount > 0 && (
                    <TouchableOpacity
                        onPress={handleUndo}
                        style={styles.actionButton}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.actionIconCircle, styles.undoCircle]}>
                            <Undo2 size={18} color="#fff" />
                        </View>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={() => {
                        swipeableRef.current?.close();
                        onEdit && onEdit();
                    }}
                    style={styles.actionButton}
                    activeOpacity={0.7}
                >
                    <View style={styles.actionIconCircle}>
                        <Edit2 size={18} color="#fff" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        swipeableRef.current?.close();
                        onDelete && onDelete();
                    }}
                    style={styles.actionButton}
                    activeOpacity={0.7}
                >
                    <View style={[styles.actionIconCircle, styles.deleteCircle]}>
                        <Trash2 size={18} color="#fff" />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <Animated.View style={[
            styles.container,
            { transform: [{ scale: scaleAnim }] }
        ]}>
            <Swipeable
                ref={swipeableRef}
                renderRightActions={renderRightActions}
                overshootRight={false}
                friction={1}
                rightThreshold={40}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                >
                    <BlurView
                        intensity={40}
                        tint="systemThickMaterialDark"
                        style={[styles.blur, isCompleted && styles.completedCard]}
                    >
                        <View style={styles.content}>
                            {/* Left: Icon */}
                            <View style={[
                                styles.iconContainer,
                                { backgroundColor: habit.color }
                            ]}>
                                <Text style={{ fontSize: 26 }}>{habit.icon}</Text>
                            </View>

                            {/* Center: Info */}
                            <View style={styles.textContainer}>
                                {/* Title Row */}
                                <Text style={styles.title} numberOfLines={1}>
                                    {habit.title}
                                </Text>

                                {/* Meta Row */}
                                <View style={styles.metaRow}>
                                    <View style={styles.badge}>
                                        <Icon size={10} color="rgba(255,255,255,0.5)" />
                                        <Text style={styles.badgeText}>{TimeLabels[habit.timeOfDay]}</Text>
                                    </View>
                                    {streak >= 1 && (
                                        <View style={styles.streakBadge}>
                                            <Text style={styles.streakText}>🔥 {streak}</Text>
                                        </View>
                                    )}
                                    {/* XP Badge - only show when not completed */}
                                    {!isCompleted && (
                                        <View style={styles.xpBadge}>
                                            <Zap size={10} color="#facc15" fill="#facc15" />
                                            <Text style={styles.xpText}>+20 XP</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Right: Counter (for multi-step) or Checkbox */}
                            <View style={styles.rightSection}>
                                {/* Counter for multi-step habits */}
                                {habit.targetCount > 1 && !isCompleted && (
                                    <Text style={styles.countText}>
                                        {currentCount}/{habit.targetCount}
                                    </Text>
                                )}

                                {/* Checkbox */}
                                <TouchableOpacity
                                    onPress={handleCheckboxTap}
                                    activeOpacity={0.7}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Animated.View style={[
                                        styles.checkbox,
                                        { transform: [{ scale: checkboxScaleAnim }] }
                                    ]}>
                                        <Check size={24} color="#fff" strokeWidth={3.5} />
                                    </Animated.View>
                                </TouchableOpacity>
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
    },
    blur: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#2c2c2e', // Solid dark background so swipe doesn't show through
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 6,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
        gap: 4,
    },
    badgeText: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    streakBadge: {
        backgroundColor: 'rgba(251, 146, 60, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
    },
    streakText: {
        fontSize: 10,
        color: '#fb923c',
        fontWeight: '700',
    },
    completedCard: {
        opacity: 0.6,
    },
    xpBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(250, 204, 21, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
        gap: 3,
    },
    xpText: {
        fontSize: 10,
        color: '#facc15',
        fontWeight: '700',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginLeft: 8,
    },
    countText: {
        fontSize: 16,
        color: '#34C759',
        fontWeight: '600',
        fontVariant: ['tabular-nums'],
    },
    checkbox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#34C759',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxCompleted: {
        backgroundColor: '#34C759',
        borderColor: '#34C759',
    },
    // Actions - Clean integrated swipe design
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 12,
        paddingLeft: 8,
        gap: 8,
        backgroundColor: '#1c1c1e', // Match app background so buttons don't peek through
    },
    actionButton: {
        padding: 4,
    },
    actionIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(142, 142, 147, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteCircle: {
        backgroundColor: 'rgba(255, 59, 48, 0.8)',
    },
    undoCircle: {
        backgroundColor: 'rgba(251, 146, 60, 0.8)',
    },
});
