import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Check, Sparkles, Sunrise, Sun, Moon } from 'lucide-react-native';
import { Habit } from '@habitapp/shared';
// import Animated, { useAnimatedStyle, withSpring, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface HabitCardProps {
    habit: Habit;
    isCompleted: boolean;
    currentCount: number;
    streak: number;
    onToggle: () => void;
    onPress: () => void;
}

const TimeIcons = {
    anytime: Sparkles,
    morning: Sunrise,
    midday: Sun,
    evening: Moon,
};

const TimeLabels = {
    anytime: 'Anytime',
    morning: 'Morning',
    midday: 'Noon',
    evening: 'Evening',
};

export const HabitCard = ({ habit, isCompleted, currentCount, streak, onToggle, onPress }: HabitCardProps) => {
    const Icon = TimeIcons[habit.timeOfDay] || Sparkles;
    //     const scale = useSharedValue(1);

    const handlePress = () => {
        // scale.value = withSequence(withTiming(0.95, { duration: 100 }), withTiming(1, { duration: 100 }));
        onToggle();
    };

    // const animatedStyle = useAnimatedStyle(() => ({
    //     transform: [{ scale: scale.value }],
    // }));

    return (
        <View style={[styles.container]}>
            <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.touchable}>
                <BlurView intensity={20} tint="dark" style={[styles.blur, isCompleted && styles.completedBlur]}>
                    {/* Progress Bar Background */}
                    <View style={[styles.progressBar, { width: `${Math.min((currentCount / habit.targetCount) * 100, 100)}%` }]} />

                    <View style={styles.content}>
                        <View style={styles.leftSection}>
                            <View style={[styles.iconContainer, { backgroundColor: habit.color + '33' }]}>
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

                        <TouchableOpacity onPress={handlePress} style={[styles.checkButton, isCompleted && styles.checkButtonCompleted]}>
                            <Check size={20} color="#fff" strokeWidth={3} />
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </TouchableOpacity>
        </View>
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
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
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
});
