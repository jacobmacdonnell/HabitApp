import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useHabit } from '@habitapp/shared';
import { BlurView } from 'expo-blur';
import { TrendingUp, Calendar, Award } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const TrendsScreen = () => {
    const { habits, progress, getStreak } = useHabit();

    const weeklyData = useMemo(() => {
        const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d;
        });

        return days.map(date => {
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            // Get habits active on this day (simplified: all habits)
            // In a real app, check creation date or frequency
            const activeHabits = habits;
            const totalTarget = activeHabits.length;

            const dayProgress = progress.filter(p => p.date === dateStr);
            const completedCount = dayProgress.filter(p => p.completed).length;

            const percentage = totalTarget > 0 ? (completedCount / totalTarget) * 100 : 0;

            return { dayName, percentage, dateStr };
        });
    }, [habits, progress]);

    const bestStreak = useMemo(() => {
        if (habits.length === 0) return 0;
        return Math.max(...habits.map(h => getStreak(h.id)));
    }, [habits, getStreak]);

    const totalCompletions = useMemo(() => {
        return progress.filter(p => p.completed).length;
    }, [progress]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerTitle}>Trends</Text>

            {/* Weekly Chart */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>LAST 7 DAYS</Text>
                <BlurView intensity={20} tint="dark" style={styles.chartCard}>
                    <View style={styles.chartContainer}>
                        {weeklyData.map((day, index) => (
                            <View key={day.dateStr} style={styles.barColumn}>
                                <View style={styles.barTrack}>
                                    <View
                                        style={[
                                            styles.barFill,
                                            {
                                                height: `${Math.max(day.percentage, 5)}%`,
                                                backgroundColor: day.percentage >= 100 ? '#22c55e' : (day.percentage > 0 ? '#6366f1' : 'rgba(255,255,255,0.1)')
                                            }
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.dayLabel, index === 6 && styles.todayLabel]}>
                                    {day.dayName.charAt(0)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </BlurView>
            </View>

            {/* Stats Grid */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>OVERVIEW</Text>
                <View style={styles.grid}>
                    <BlurView intensity={20} tint="dark" style={styles.statCard}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(251, 146, 60, 0.2)' }]}>
                            <TrendingUp size={24} color="#fb923c" />
                        </View>
                        <Text style={styles.statValue}>{bestStreak}</Text>
                        <Text style={styles.statLabel}>Best Streak</Text>
                    </BlurView>

                    <BlurView intensity={20} tint="dark" style={styles.statCard}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                            <Award size={24} color="#34d399" />
                        </View>
                        <Text style={styles.statValue}>{totalCompletions}</Text>
                        <Text style={styles.statLabel}>Total Done</Text>
                    </BlurView>
                </View>
            </View>

            {/* Consistency (Placeholder for Heatmap) */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>CONSISTENCY</Text>
                <BlurView intensity={20} tint="dark" style={styles.consistencyCard}>
                    <View style={styles.row}>
                        <Calendar size={20} color="rgba(255,255,255,0.5)" />
                        <Text style={styles.consistencyText}>Keep your streaks alive to fill the grid!</Text>
                    </View>
                </BlurView>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 100,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 8,
        marginLeft: 12,
    },
    chartCard: {
        borderRadius: 24,
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 150,
        alignItems: 'flex-end',
    },
    barColumn: {
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    barTrack: {
        width: 8,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 4,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    barFill: {
        width: '100%',
        borderRadius: 4,
        minHeight: 8,
    },
    dayLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.3)',
    },
    todayLabel: {
        color: '#fff',
        fontWeight: '800',
    },
    grid: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        borderRadius: 24,
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.5)',
    },
    consistencyCard: {
        borderRadius: 20,
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    consistencyText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        fontWeight: '500',
    },
});
