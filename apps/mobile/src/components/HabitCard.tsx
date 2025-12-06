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
    onComplete?: (x: number, y: number, color: string) => void;
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

export const HabitCard = ({ habit, isCompleted, currentCount, streak, onToggle, onComplete, onPress, onDelete, onEdit }: HabitCardProps) => {
    const Icon = TimeIcons[habit.timeOfDay] || Sparkles;

    // State
    const [containerWidth, setContainerWidth] = useState(0);

    // Refs
    const checkButtonRef = useRef<View>(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const checkScaleAnim = useRef(new Animated.Value(1)).current;
    const progressWidthAnim = useRef(new Animated.Value(0)).current;
    const lastSeenCount = useRef(currentCount);

    // Measure container width
    const onLayout = useCallback((event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    }, []);

    // Animate progress bar when count changes AND trigger celebration after bar fills
    useEffect(() => {
        if (containerWidth > 0) {
            const targetWidth = (currentCount / habit.targetCount) * containerWidth;
            const wasIncrement = currentCount > lastSeenCount.current;
            const willComplete = currentCount >= habit.targetCount && lastSeenCount.current < habit.targetCount;

            if (wasIncrement) {
                // Animate progress bar FIRST
                Animated.spring(progressWidthAnim, {
                    toValue: Math.min(targetWidth, containerWidth),
                    friction: 6,
                    tension: 80,
                    useNativeDriver: false,
                }).start(() => {
                    // AFTER progress bar fills, trigger celebration
                    if (willComplete) {
                        // Success haptic when bar finishes filling
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

                        // Measure checkbox position and trigger confetti
                        if (onComplete && checkButtonRef.current) {
                            checkButtonRef.current.measureInWindow((x, y, width, height) => {
                                onComplete(x + width / 2, y + height / 2, habit.color);
                            });
                        }

                        // Checkmark celebration animation
                        Animated.sequence([
                            Animated.timing(checkScaleAnim, { toValue: 1.4, duration: 150, useNativeDriver: true }),
                            Animated.spring(checkScaleAnim, { toValue: 1, friction: 3, tension: 200, useNativeDriver: true })
                        ]).start();

                        // Card pulse
                        Animated.sequence([
                            Animated.timing(scaleAnim, { toValue: 1.02, duration: 100, useNativeDriver: true }),
                            Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true })
                        ]).start();
                    }
                });
            } else {
                // Initial load
                progressWidthAnim.setValue(Math.min(targetWidth, containerWidth));
            }

            lastSeenCount.current = currentCount;
        }
    }, [currentCount, containerWidth]);

    const handleToggle = () => {
        // Simple haptic for the tap
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
                        onLayout={onLayout}
                    >
                        {/* Progress Bar */}
                        <Animated.View
                            style={[
                                styles.progressBar,
                                {
                                    width: progressWidthAnim,
                                    backgroundColor: isCompleted ? habit.color : `${habit.color}40`
                                }
                            ]}
                        />

                        <View style={styles.content}>
                            <View style={styles.leftSection}>
                                <View style={[
                                    styles.iconContainer,
                                    isCompleted && { backgroundColor: `${habit.color}25` }
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

                            <Animated.View style={{ transform: [{ scale: checkScaleAnim }] }}>
                                <View ref={checkButtonRef} collapsable={false}>
                                    <TouchableOpacity
                                        onPress={handleToggle}
                                        style={[
                                            styles.checkButton,
                                            { borderColor: habit.color },
                                            isCompleted && { backgroundColor: habit.color, borderColor: habit.color }
                                        ]}
                                        activeOpacity={0.7}
                                    >
                                        <Check
                                            size={22}
                                            color={isCompleted ? "#fff" : habit.color}
                                            strokeWidth={3}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
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
        backgroundColor: 'rgba(0,0,0,0.3)',
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
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
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
        borderRadius: 14,
        backgroundColor: 'transparent',
        borderWidth: 2.5,
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
