import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Check, Sparkles, Sunrise, Sun, Moon, LucideIcon, Trash2, Edit2 } from 'lucide-react-native';
import { Habit } from '@habitapp/shared';
import * as Haptics from 'expo-haptics';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface HabitCardProps {
    habit: Habit;
    isCompleted: boolean;
    currentCount: number;
    streak: number;
    onToggle: () => void;
    onDecrement?: () => void;
    onPress: () => void; // Kept for API compatibility, but primary interaction is now on the card itself
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

    // 1. Progress Animation: 0 -> 100%
    const progressAnim = useRef(new Animated.Value(
        isCompleted ? 1 : Math.min(currentCount / habit.targetCount, 1)
    )).current;

    // 2. Scale Animation: Click feedback
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Sync progress bar
    useEffect(() => {
        const targetValue = isCompleted ? 1 : Math.min(currentCount / habit.targetCount, 1);

        Animated.spring(progressAnim, {
            toValue: targetValue,
            friction: 8,
            tension: 40,
            useNativeDriver: false,
        }).start();
    }, [currentCount, habit.targetCount, isCompleted]);

    // --- INTERACTION HANDLERS ---

    const handleTap = () => {
        // Prevent incrementing if already complete (for multi-count habits)
        if (habit.targetCount > 1 && isCompleted) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Animate: Press down
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 150, useNativeDriver: true })
        ]).start();

        onToggle();
    };

    const handleLongPress = () => {
        if (currentCount <= 0) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        // Animate: Subtle shrink to indicate "backing off"
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.97, duration: 100, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 120, useNativeDriver: true })
        ]).start();

        onDecrement?.();
    };

    // --- SWIPE ACTIONS ---

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
                    style={styles.rightActionEdit}
                >
                    <TouchableOpacity onPress={() => onEdit && onEdit()} style={styles.actionButtonContent}>
                        <Edit2 size={22} color="#fff" />
                        <Text style={styles.actionLabel}>Edit</Text>
                    </TouchableOpacity>
                </BlurView>
                <BlurView
                    intensity={20}
                    tint="systemThickMaterialDark"
                    style={styles.rightActionDelete}
                >
                    <TouchableOpacity onPress={onDelete} style={styles.actionButtonContent}>
                        <Trash2 size={22} color="#ff3b30" />
                        <Text style={styles.actionLabel}>Delete</Text>
                    </TouchableOpacity>
                </BlurView>
            </Animated.View>
        );
    };

    return (
        <Animated.View style={[
            styles.container,
            { transform: [{ scale: scaleAnim }] },
            isCompleted && { opacity: 0.8 } // Slight opacity when complete, but keep readable
        ]}>
            <Swipeable
                renderRightActions={renderRightActions}
                overshootRight={false}
                friction={2}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={handleTap}
                    onLongPress={handleLongPress}
                    delayLongPress={500}
                >
                    <BlurView
                        intensity={40}
                        tint="systemThickMaterialDark"
                        style={styles.blur}
                    >
                        {/* 1. Progress Bar Background */}
                        <Animated.View
                            style={[
                                styles.progressBar,
                                {
                                    width: progressAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%']
                                    }),
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)' // Always white/subtle
                                }
                            ]}
                        />

                        <View style={styles.content}>
                            {/* Icon Identity */}
                            <View style={[
                                styles.iconContainer,
                                { backgroundColor: habit.color, opacity: isCompleted ? 0.5 : 1 }
                            ]}>
                                <Text style={{ fontSize: 24 }}>{habit.icon}</Text>
                            </View>

                            {/* Main Info */}
                            <View style={styles.textContainer}>
                                <View style={styles.headerRow}>
                                    <View style={styles.badge}>
                                        <Icon size={10} color="rgba(255,255,255,0.5)" />
                                        <Text style={styles.badgeText}>{TimeLabels[habit.timeOfDay]}</Text>
                                    </View>
                                    {streak >= 2 && (
                                        <View style={styles.streakBadge}>
                                            <Text style={styles.streakText}>🔥 {streak}</Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.titleRow}>
                                    <Text style={[
                                        styles.title,
                                        isCompleted && { opacity: 0.5 }
                                    ]} numberOfLines={1}>
                                        {habit.title}
                                    </Text>

                                    {/* Status: Solid Green Check or Count */}
                                    {isCompleted ? (
                                        <View style={{
                                            backgroundColor: '#34C759',
                                            borderRadius: 20,
                                            width: 28,
                                            height: 28,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Check size={16} color="#fff" strokeWidth={4} />
                                        </View>
                                    ) : (
                                        habit.targetCount > 1 && (
                                            <Text style={styles.countText}>
                                                {currentCount}/{habit.targetCount}
                                            </Text>
                                        )
                                    )}
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
        // No external border, let BlurView handle it cleanly
    },
    blur: {
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    progressBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        // No border radius needed on container as parent clips it
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24, // Circle
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
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
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
        flex: 1,
        marginRight: 8,
    },
    countText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '600',
        fontVariant: ['tabular-nums'],
    },
    // Actions
    rightActionEdit: {
        backgroundColor: 'rgba(142, 142, 147, 0.3)', // System Gray
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
    },
    rightActionDelete: {
        backgroundColor: 'rgba(255, 59, 48, 0.3)', // System Red
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
    },
    actionLabel: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    actionButtonContent: {
        width: 80,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
