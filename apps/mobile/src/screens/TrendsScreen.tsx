import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useHabit } from '@habitapp/shared';
import { BlurView } from 'expo-blur';
import { TrendingUp, Award, Calendar, Check, X, Grid, List as ListIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type ViewMode = 'weekly' | 'monthly';

export const TrendsScreen = () => {
    const { habits, progress, getStreak } = useHabit();
    const [viewMode, setViewMode] = useState<ViewMode>('weekly');

    // --- Data Processing ---

    // 1. Weekly History (Last 7 Days) for EACH habit
    const last7Days = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return {
                dateStr: d.toISOString().split('T')[0],
                dayName: d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
                isToday: i === 6
            };
        });
    }, []);

    const habitWeeklyStatus = useMemo(() => {
        return habits.map(habit => {
            const history = last7Days.map(day => {
                const entry = progress.find(p => p.date === day.dateStr && p.habitId === habit.id);
                const isCompleted = entry?.completed || false;
                const isPartiallyDone = (entry?.currentCount || 0) > 0;
                return { ...day, isCompleted, isPartiallyDone };
            });
            return { ...habit, history };
        });
    }, [habits, progress, last7Days]);

    // 2. Monthly Heatmap (Last 30 Days) - Aggregate
    const last30Days = useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            return d.toISOString().split('T')[0];
        });
    }, []);

    const heatmapData = useMemo(() => {
        return last30Days.map(dateStr => {
            const dayProgress = progress.filter(p => p.date === dateStr);
            const totalTarget = habits.length; // Simplified: usually check if habit existed
            const completedCount = dayProgress.filter(p => p.completed).length;

            // Opacity calculation
            const intensity = totalTarget > 0 ? completedCount / totalTarget : 0;
            return { dateStr, intensity, completedCount };
        });
    }, [progress, habits, last30Days]);

    // 3. Stats
    const bestStreak = useMemo(() => {
        if (habits.length === 0) return 0;
        return Math.max(...habits.map(h => getStreak(h.id)));
    }, [habits, getStreak]);

    const totalCompletions = useMemo(() => {
        return progress.filter(p => p.completed).length;
    }, [progress]);

    const consistencyScore = useMemo(() => {
        if (heatmapData.length === 0) return 0;
        const sumIntensity = heatmapData.reduce((acc, curr) => acc + curr.intensity, 0);
        return Math.round((sumIntensity / heatmapData.length) * 100);
    }, [heatmapData]);


    // --- Render Components ---

    const renderToggle = () => (
        <View style={styles.toggleContainer}>
            <View style={styles.toggleTrack}>
                <TouchableOpacity
                    style={[styles.toggleOption, viewMode === 'weekly' && styles.toggleActive]}
                    onPress={() => setViewMode('weekly')}
                >
                    <ListIcon size={16} color={viewMode === 'weekly' ? '#fff' : 'rgba(255,255,255,0.5)'} />
                    <Text style={[styles.toggleText, viewMode === 'weekly' && styles.toggleTextActive]}>Weekly</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleOption, viewMode === 'monthly' && styles.toggleActive]}
                    onPress={() => setViewMode('monthly')}
                >
                    <Grid size={16} color={viewMode === 'monthly' ? '#fff' : 'rgba(255,255,255,0.5)'} />
                    <Text style={[styles.toggleText, viewMode === 'monthly' && styles.toggleTextActive]}>Monthly</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderWeeklyView = () => (
        <View style={styles.listContainer}>
            <View style={styles.weekHeaderRow}>
                <View style={{ flex: 1 }} />
                <View style={styles.daysRow}>
                    {last7Days.map((day, i) => (
                        <Text key={i} style={[styles.columnLabel, day.isToday && styles.todayLabel]}>
                            {day.dayName}
                        </Text>
                    ))}
                </View>
            </View>

            {habitWeeklyStatus.map(habit => (
                <BlurView key={habit.id} intensity={40} tint="systemThickMaterialDark" style={styles.habitRowCard}>
                    <View style={styles.habitInfo}>
                        <Text style={styles.habitTitle} numberOfLines={1}>{habit.title}</Text>
                        <Text style={styles.streakLabel}>{getStreak(habit.id)} day streak</Text>
                    </View>
                    <View style={styles.daysRow}>
                        {habit.history.map((day, i) => (
                            <View key={i} style={styles.statusBubbleContainer}>
                                {day.isCompleted ? (
                                    <View style={[styles.statusBubble, { backgroundColor: habit.color }]}>
                                        <Check size={10} color="#fff" strokeWidth={4} />
                                    </View>
                                ) : day.isPartiallyDone ? (
                                    <View style={[styles.statusBubble, styles.partialBubble, { borderColor: habit.color }]}>
                                        <Text style={{ fontSize: 8, color: habit.color }}>•</Text>
                                    </View>
                                ) : (
                                    <View style={[styles.statusBubble, styles.emptyBubble]} />
                                )}
                            </View>
                        ))}
                    </View>
                </BlurView>
            ))}
        </View>
    );

    const renderMonthlyView = () => (
        <View>
            {/* Stats Overview */}
            <View style={styles.statsGrid}>
                <BlurView intensity={40} tint="systemThickMaterialDark" style={styles.statCard}>
                    <Text style={styles.statLabel}>Consistency</Text>
                    <Text style={styles.statBigValue}>{consistencyScore}%</Text>
                </BlurView>
                <BlurView intensity={20} tint="dark" style={styles.statCard}>
                    <Text style={styles.statLabel}>Best Streak</Text>
                    <Text style={styles.statBigValue}>{bestStreak}</Text>
                </BlurView>
            </View>

            <View style={styles.statsGrid}>
                <BlurView intensity={20} tint="dark" style={[styles.statCard, { flex: 2 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Award size={16} color="#fbbf24" />
                        <Text style={styles.statLabel}>Total Completions</Text>
                    </View>
                    <Text style={styles.statBigValue}>{totalCompletions}</Text>
                </BlurView>
            </View>

            {/* Heatmap */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>30 DAY HEATMAP</Text>
                <BlurView intensity={20} tint="dark" style={styles.heatmapCard}>
                    <View style={styles.heatmapGrid}>
                        {heatmapData.map((day, i) => (
                            <View
                                key={day.dateStr}
                                style={[
                                    styles.heatmapSquare,
                                    {
                                        backgroundColor: day.intensity > 0 ? '#22c55e' : 'rgba(255,255,255,0.05)',
                                        opacity: day.intensity > 0 ? Math.max(0.3, day.intensity) : 1
                                    }
                                ]}
                            />
                        ))}
                    </View>
                    <View style={styles.heatmapLegend}>
                        <Text style={styles.legendText}>Less</Text>
                        <View style={styles.legendGradient} />
                        <Text style={styles.legendText}>More</Text>
                    </View>
                </BlurView>
            </View>
        </View>
    );

    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            {/* Ambient Background - iOS 26 style */}
            <View style={[styles.blob, { backgroundColor: '#22c55e', top: -100, left: -100 }]} />
            <View style={[styles.blob, { backgroundColor: '#6366f1', bottom: -100, right: -100 }]} />
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.content, { paddingTop: insets.top }]}
                contentInsetAdjustmentBehavior="automatic"
            >
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>Trends</Text>
                </View>

                {renderToggle()}

                {viewMode === 'weekly' ? renderWeeklyView() : renderMonthlyView()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    headerRow: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5,
    },

    // Toggle
    toggleContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    toggleTrack: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 30,
        padding: 4,
        width: 240,
    },
    toggleOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 8,
        borderRadius: 26,
    },
    toggleActive: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    toggleText: {
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '600',
        fontSize: 14,
    },
    toggleTextActive: {
        color: '#fff',
        fontWeight: '700',
    },
    // Weekly
    listContainer: {
        gap: 12,
    },
    weekHeaderRow: {
        flexDirection: 'row',
        paddingRight: 16,
        marginBottom: 4,
    },
    daysRow: {
        flexDirection: 'row',
        gap: 8,
        width: 190, // Fixed width for bubbles aligned right
        justifyContent: 'flex-end',
    },
    columnLabel: {
        width: 20,
        textAlign: 'center',
        fontSize: 10,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.3)',
    },
    todayLabel: {
        color: '#fff',
    },
    habitRowCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    habitInfo: {
        flex: 1,
        marginRight: 12,
    },
    habitTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    streakLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '500',
    },
    statusBubbleContainer: {
        width: 20,
        alignItems: 'center',
    },
    statusBubble: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    partialBubble: {
        backgroundColor: 'transparent',
        borderWidth: 2,
    },
    emptyBubble: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    // Monthly
    section: {
        marginTop: 24,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 8,
        marginLeft: 12,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 20,
        borderRadius: 24,
        overflow: 'hidden',
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 8,
    },
    statBigValue: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
    },
    heatmapCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 20,
        borderRadius: 24,
        overflow: 'hidden',
    },
    heatmapGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        justifyContent: 'center',
    },
    heatmapSquare: {
        width: (width - 40 - 40 - 36) / 7, // Card padding, gaps
        aspectRatio: 1,
        borderRadius: 4,
    },
    heatmapLegend: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        gap: 8,
    },
    legendGradient: {
        width: 100,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    legendText: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '600',
    },
    // iOS 26 ambient background
    blob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.3,
    },
    scrollView: {
        flex: 1,
    },
});
