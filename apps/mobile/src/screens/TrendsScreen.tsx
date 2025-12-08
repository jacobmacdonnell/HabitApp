import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useHabit, getLocalDateString } from '@habitapp/shared';
import { LiquidGlassView } from '@callstack/liquid-glass';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LiquidGlass } from '../theme/theme';
import { GlassSegmentedControl } from '../components/GlassSegmentedControl';

const { width } = Dimensions.get('window');

type ViewMode = 'weekly' | 'monthly';

export const TrendsScreen = () => {
    const { habits, progress, getStreak } = useHabit();
    const [viewMode, setViewMode] = useState<ViewMode>('weekly');
    const [currentDate, setCurrentDate] = useState(new Date());

    // --- Data Processing: Weekly ---
    const last7Days = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return {
                dateStr: getLocalDateString(d),
                dayName: d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
                isToday: i === 6
            };
        });
    }, []);

    const habitWeeklyStatus = useMemo(() => {
        return habits.map(habit => {
            const history = last7Days.map(day => {
                const entry = progress.find(p => p.date === day.dateStr && p.habitId === habit.id);
                // Handle both boolean true and old string/number values if any exist, though types say boolean
                const isCompleted = !!entry?.completed;
                const isPartiallyDone = (entry?.currentCount || 0) > 0;
                return { ...day, isCompleted, isPartiallyDone };
            });
            return { ...habit, history };
        });
    }, [habits, progress, last7Days]);

    // --- Data Processing: Monthly (Calendar) ---
    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // 0 = Sunday, 1 = Monday ... 6 = Saturday
        // We want Monday start: 0 = Mon ... 6 = Sun
        let startDay = firstDayOfMonth.getDay();
        startDay = startDay === 0 ? 6 : startDay - 1; // Adjust for Monday start

        const days = [];
        // Empty slots for start padding
        for (let i = 0; i < startDay; i++) {
            days.push({ id: `pad-${i}`, isEmpty: true });
        }

        // Actual days
        const todayStr = getLocalDateString();

        for (let i = 1; i <= daysInMonth; i++) {
            // Construct local date string carefully
            // Using a new Date(year, month, i) and getFullYear/Month/Date ensures local time usage
            const d = new Date(year, month, i);
            const dateStr = [
                d.getFullYear(),
                String(d.getMonth() + 1).padStart(2, '0'),
                String(d.getDate()).padStart(2, '0')
            ].join('-');

            // Get stats for this day
            const dayProgress = progress.filter(p => p.date === dateStr);
            const totalHabits = habits.length || 1;

            // Count distinct habits completed
            const completedCount = dayProgress.filter(p => p.completed).length;
            const intensity = completedCount / totalHabits;

            days.push({
                id: dateStr,
                dayNum: i,
                intensity,
                completedCount,
                isToday: dateStr === todayStr,
                isEmpty: false
            });
        }

        return days;
    }, [currentDate, progress, habits]);

    const changeMonth = (increment: number) => {
        Haptics.selectionAsync();
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + increment);
            return newDate;
        });
    };

    // --- Stats ---
    const bestStreak = useMemo(() => {
        if (habits.length === 0) return 0;
        return Math.max(...habits.map(h => getStreak(h.id)));
    }, [habits, getStreak]);

    const totalCompletions = useMemo(() => {
        return progress.filter(p => p.completed).length;
    }, [progress]);

    const consistencyScore = useMemo(() => {
        if (habits.length === 0) return 0;
        // Consistency across the currently viewed month
        const filledDays = calendarData.filter(d => !d.isEmpty);
        if (filledDays.length === 0) return 0;

        const now = new Date();
        const viewingFutureMonth = currentDate.getFullYear() > now.getFullYear() ||
            (currentDate.getFullYear() === now.getFullYear() && currentDate.getMonth() > now.getMonth());

        if (viewingFutureMonth) return 0;

        let daysToCount = filledDays.length;
        // If viewing current month, only count up to today
        if (currentDate.getMonth() === now.getMonth() && currentDate.getFullYear() === now.getFullYear()) {
            daysToCount = now.getDate();
        }

        const validDays = filledDays.slice(0, daysToCount);
        if (validDays.length === 0) return 0;

        const sumIntensity = validDays.reduce((acc, curr) => acc + (curr.intensity || 0), 0);
        return Math.round((sumIntensity / daysToCount) * 100);
    }, [calendarData, habits.length, currentDate]);


    // --- Render Views ---

    const renderWeeklyView = () => (
        <View style={styles.listContainer}>
            {habits.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>📊</Text>
                    <Text style={styles.emptyTitle}>No habits yet</Text>
                    <Text style={styles.emptyText}>Create your first habit to start tracking</Text>
                </View>
            ) : (
                <>
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
                        <LiquidGlassView key={habit.id} interactive={true} style={styles.habitRowCard}>
                            <View style={styles.habitInfo}>
                                <Text style={styles.habitTitle} numberOfLines={1}>{habit.title}</Text>
                                <Text style={styles.streakLabel}>{getStreak(habit.id)} day streak</Text>
                            </View>
                            <View style={styles.daysRow}>
                                {habit.history.map((day, i) => (
                                    <View key={i} style={styles.statusBubbleContainer}>
                                        {day.isCompleted ? (
                                            <View style={[styles.statusBubble, { backgroundColor: LiquidGlass.colors.primary }]}>
                                                <Check size={10} color="#fff" strokeWidth={4} />
                                            </View>
                                        ) : day.isPartiallyDone ? (
                                            <View style={[styles.statusBubble, styles.partialBubble, { borderColor: LiquidGlass.colors.primary }]}>
                                                <Text style={{ fontSize: 8, color: LiquidGlass.colors.primary }}>•</Text>
                                            </View>
                                        ) : (
                                            <View style={[styles.statusBubble, styles.emptyBubble]} />
                                        )}
                                    </View>
                                ))}
                            </View>
                        </LiquidGlassView>
                    ))}
                </>
            )}
        </View>
    );

    const renderMonthlyView = () => (
        <View>
            {/* Stats Overview - Compact Row */}
            <View style={styles.statsRow}>
                <View style={styles.compactStat}>
                    <Text style={styles.compactStatLabel}>Consistency</Text>
                    <Text style={styles.compactStatValue}>{consistencyScore}%</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.compactStat}>
                    <Text style={styles.compactStatLabel}>Best Streak</Text>
                    <Text style={styles.compactStatValue}>{bestStreak}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.compactStat}>
                    <Text style={styles.compactStatLabel}>Total Done</Text>
                    <Text style={styles.compactStatValue}>{totalCompletions}</Text>
                </View>
            </View>

            {/* Calendar Card */}
            <View style={styles.calendarContainer}>

                {/* Month Navigation Header */}
                <View style={styles.monthNavRow}>
                    <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <ChevronLeft size={24} color={LiquidGlass.text.secondary} />
                    </TouchableOpacity>
                    <Text style={styles.monthTitle}>
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </Text>
                    <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <ChevronRight size={24} color={LiquidGlass.text.secondary} />
                    </TouchableOpacity>
                </View>

                {/* Weekday Headers */}
                <View style={styles.weekDaysGrid}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <Text key={i} style={styles.calendarDayHeader}>{day}</Text>
                    ))}
                </View>

                {/* Days Grid */}
                <View style={styles.daysGrid}>
                    {calendarData.map((day, i) => (
                        <View key={day.id ?? i} style={styles.dayCell}>
                            {!day.isEmpty && (
                                <View style={styles.dayContent}>
                                    <View style={[
                                        styles.intensityCircle,
                                        {
                                            backgroundColor: (day.intensity ?? 0) > 0
                                                ? LiquidGlass.colors.primary
                                                : 'rgba(255,255,255,0.03)',
                                            opacity: (day.intensity ?? 0) > 0 ? Math.max(0.4, day.intensity ?? 0) : 1
                                        }
                                    ]}>
                                        <Text style={[
                                            styles.dayNum,
                                            (day.intensity ?? 0) > 0.6 && { color: '#000', fontWeight: '700' }, // Dark text on bright backgrounds
                                            day.isToday && styles.todayNum
                                        ]}>
                                            {day.dayNum}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            {/* Ambient Background - Clean Dark Theme */}
            <LiquidGlassView interactive={true} style={StyleSheet.absoluteFill} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.content]}
                contentInsetAdjustmentBehavior="automatic"
            >
                {/* Custom Fixed Header */}
                <View style={[styles.headerRow, { marginTop: 20 }]}>
                    <Text style={styles.headerTitle}>Streaks</Text>
                </View>

                <View style={styles.toggleContainer}>
                    <GlassSegmentedControl
                        values={['Weekly', 'Monthly']}
                        selectedIndex={viewMode === 'weekly' ? 0 : 1}
                        onChange={(event) => {
                            Haptics.selectionAsync();
                            const index = event.nativeEvent.selectedSegmentIndex;
                            setViewMode(index === 0 ? 'weekly' : 'monthly');
                        }}
                    />
                </View>

                {viewMode === 'weekly' ? renderWeeklyView() : renderMonthlyView()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c1e',
    },
    content: {
        paddingHorizontal: LiquidGlass.screenPadding,
        paddingBottom: 100,
    },
    headerRow: {
        marginBottom: LiquidGlass.header.marginBottom,
    },
    headerTitle: {
        fontSize: LiquidGlass.header.titleSize,
        fontWeight: LiquidGlass.header.titleWeight,
        color: LiquidGlass.header.titleColor,
        letterSpacing: LiquidGlass.header.titleLetterSpacing,
    },

    // Toggle
    toggleContainer: {
        marginBottom: 24,
        marginHorizontal: 16, // Use standard margin
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
        borderRadius: 24,
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

    // Monthly Calendar Styles
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 24,
        paddingVertical: 20,
        paddingHorizontal: 12,
        marginBottom: 24,
    },
    compactStat: {
        alignItems: 'center',
        flex: 1,
    },
    compactStatLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 6, // More breathing room
        fontWeight: '600',
    },
    compactStatValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        fontVariant: ['tabular-nums'],
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },

    calendarContainer: {
        borderRadius: 24,
        overflow: 'hidden',
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.04)',
    },
    monthNavRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    navButton: {
        padding: 8,
    },
    monthTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
    },
    weekDaysGrid: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    calendarDayHeader: {
        flex: 1,
        textAlign: 'center',
        fontSize: 11,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.3)',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: `${100 / 7}%`, // Exact 7 columns
        aspectRatio: 1,
        padding: 4,
    },
    dayContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    intensityCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayNum: {
        fontSize: 13,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.5)',
    },
    todayNum: {
        color: '#fff',
        fontWeight: '700',
    },

    // Legend
    legendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 12,
        opacity: 0.6,
    },
    legendText: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '500',
    },
    legendGradient: {
        flexDirection: 'row',
        gap: 4,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    scrollView: {
        flex: 1,
    },
    // Empty State
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
    },
});
