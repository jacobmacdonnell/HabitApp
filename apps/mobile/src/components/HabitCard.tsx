import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { Check, Sparkles, Sunrise, Sun, Moon, LucideIcon } from 'lucide-react-native';
import { Habit } from '@habitapp/shared';
import * as Haptics from 'expo-haptics';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Trash2, Edit2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

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
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const animateScale = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();
    };

    const handleToggle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        animateScale();
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
                <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.touchable}>
                    <BlurView intensity={40} tint="systemThickMaterialDark" style={[styles.blur, isCompleted && styles.completedBlur]}>
                        {/* Progress Bar Background */}
                        <View style={[styles.progressBar, { width: `${Math.min((currentCount / habit.targetCount) * 100, 100)}%` }]} />

                        <View style={styles.content}>
                            <View style={styles.leftSection}>
                                <View style={styles.iconContainer}>
                                    {/* Lucide icons need color and size props */}
                                    {/* We can render a text emoji or use a map if habit.icon is a string name */}
                                    <Text style={{ fontSize: 24 }}>{habit.icon}</Text>
                                </View>

                                <View style={styles.textContainer}>
                                    <View style={styles.titleRow}>
                                        <Text style={styles.title} numberOfLines={1}>{habit.title}</Text>
                                        <View style={styles.badge}>
                                            <Icon size={10} color="rgba(255,255,255,0.5)" />
                                            <Text style={styles.badgeText}>{TimeLabels[habit.timeOfDay]}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.statsRow}>
                                        {habit.targetCount > 1 && (
                                            <Text style={styles.statsText}>{currentCount} / {habit.targetCount}</Text>
                                        )}
                                        {streak >= 2 && (
                                            <View style={styles.streakBadge}>
                                                <Text style={styles.streakText}>🔥 {streak}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity onPress={handleToggle} style={[styles.checkButton, isCompleted && styles.checkButtonCompleted]}>
                                <Check size={20} color="#fff" strokeWidth={3} />
                            </TouchableOpacity>
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
    touchable: {
        flex: 1,
    },
    blur: {
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    completedBlur: {
        opacity: 0.8,
    },
    progressBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.05)',
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
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: 'rgba(255,255,255,0.05)', // Subtle background instead of color tint
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
        fontWeight: '700',
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
        textTransform: 'uppercase',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statsText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '500',
    },
    streakBadge: {
        backgroundColor: 'rgba(251, 146, 60, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(251, 146, 60, 0.3)',
    },
    streakText: {
        fontSize: 12,
        color: '#fb923c',
        fontWeight: '600',
    },
    checkButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(34, 197, 94, 1)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    checkButtonCompleted: {
        backgroundColor: '#22c55e',
    },
    leftAction: {
        backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
    },
    rightAction: {
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
    },
    actionIcon: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
