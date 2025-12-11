import { useHabit, getLocalDateString, DailyProgress } from '@habitapp/shared';
import * as Haptics from 'expo-haptics';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '../components/EmptyState';
import { GlassSegmentedControl } from '../components/GlassSegmentedControl';
import { LiquidGlass } from '../theme/theme';

const { width } = Dimensions.get('window');

type ViewMode = 'weekly' | 'monthly';

export const TrendsScreen = () => {
    const { habits, progress, getStreak, getHistoricalProgress } = useHabit();
    const [viewMode, setViewMode] = useState<ViewMode>('weekly');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [historicalProgress, setHistoricalProgress] = useState<DailyProgress[]>([]);

    useEffect(() => {
        const loadMonthData = async () => {
            const now = new Date();
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(now.getDate() - 89); // Safety margin

            // If we are viewing a month that is entirely safely inside the 90 day window, rely on Context
            // The window moves, so "currentDate" (which is usually 1st of month by default or just some date in month)
            // We need to check the END of the viewed month.
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const endOfMonth = new Date(year, month + 1, 0);

            if (endOfMonth < ninetyDaysAgo) {
                // Fetch!
                const startStr = getLocalDateString(new Date(year, month, 1));
                const endStr = getLocalDateString(endOfMonth);
                try {
                    const data = await getHistoricalProgress(startStr, endStr);
                    setHistoricalProgress(data);
                } catch (e) {
                    console.error('Failed to load history', e);
                }
            } else {
                setHistoricalProgress([]); // Clear to use global
            }
        };
        loadMonthData();
    }, [currentDate, getHistoricalProgress]);

    // Merge logic: If historicalProgress is present, use it. But wait, what if we are at the boundary?
    // Safest: Use global 'progress' for recent days, 'historical' for older.
    // Or simpler: If we decided to fetch, USE the fetched data.
    // The if (endOfMonth < ninetyDaysAgo) check implies we ONLY fetch if we are deep in the past.
    // So 'historicalProgress' will be populated ONLY when we are deep in the past.
    // When populated, use IT. When empty, use 'progress'.

    const activeProgress = useMemo(() => {
        return historicalProgress.length > 0 ? historicalProgress : progress;
    }, [historicalProgress, progress]);

    // --- Data Processing: Weekly ---
    const last7Days = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return {
                dateStr: getLocalDateString(d),
                dayName: d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
                isToday: i === 6,
            };
        });
    }, []);

    const habitWeeklyStatus = useMemo(() => {
        return habits.map((habit) => {
            const history = last7Days.map((day) => {
                // Weekly view always uses global progress (recent)
                const entry = progress.find((p) => p.date === day.dateStr && p.habitId === habit.id);
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
                String(d.getDate()).padStart(2, '0'),
            ].join('-');

            // Get stats for this day
            const dayProgress = activeProgress.filter((p) => p.date === dateStr);
            const totalHabits = habits.length || 1;

            // Count distinct habits completed
            const completedCount = dayProgress.filter((p) => p.completed).length;
            const intensity = completedCount / totalHabits;

            days.push({
                id: dateStr,
                dayNum: i,
                intensity,
                completedCount,
                isToday: dateStr === todayStr,
                isEmpty: false,
            });
        }

        return days;
    }, [currentDate, activeProgress, habits]);

    const changeMonth = (increment: number) => {
        Haptics.selectionAsync();
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + increment);
            return newDate;
        });
    };

    // --- Stats ---
    const bestStreak = useMemo(() => {
        if (habits.length === 0) return 0;
        return Math.max(...habits.map((h) => getStreak(h.id)));
    }, [habits, getStreak]);

    const totalCompletions = useMemo(() => {
        // Total stats should probably respect the view... BUT 'totalCompletions' usually implies ALL TIME.
        // The previous code filtered 'progress' which was just 90 days.
        // The stats on the monthly view usually refer to the month?
        // Let's look at UI... "Total Done".
        // If it's "Total Done", strictly speaking it should be from DB stats.
        // But for now, let's keep it consistent with the View context or revert to global?
        // Actually, if we use 'activeProgress', it will correct "Total Done" to be "Total Done This Month" if we viewed a past month?
        // No, 'progress' was 90 days list. 'activeProgress' is 1 month list (if historical).
        // So this metric changes meaning dynamically.
        // Let's assume it means "Total Done (Visible)".
        return activeProgress.filter((p) => p.completed).length;
    }, [activeProgress]);

    const consistencyScore = useMemo(() => {
        if (habits.length === 0) return 0;
        // Consistency across the currently viewed month
        const filledDays = calendarData.filter((d) => !d.isEmpty);
        if (filledDays.length === 0) return 0;

        const now = new Date();
        const viewingFutureMonth =
            currentDate.getFullYear() > now.getFullYear() ||
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
                <EmptyState type="empty" message="Create your first habit to start tracking" />
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

                    {habitWeeklyStatus.map((habit) => (
                        <View key={habit.id} style={styles.habitRowCard}>
                            <View style={styles.habitInfo}>
                                <Text style={styles.habitTitle} numberOfLines={1}>
                                    {habit.title}
                                </Text>
                                <Text style={styles.streakLabel}>{getStreak(habit.id)} day streak</Text>
                            </View>
                            <View style={styles.daysRow}>
                                {habit.history.map((day, i) => (
                                    <View key={i} style={styles.statusBubbleContainer}>
                                        {day.isCompleted ? (
                                            <View
                                                style={[
                                                    styles.statusBubble,
                                                    { backgroundColor: LiquidGlass.colors.primary },
                                                ]}
                                            >
                                                <Check size={10} color="#fff" strokeWidth={4} />
                                            </View>
                                        ) : day.isPartiallyDone ? (
                                            <View
                                                style={[
                                                    styles.statusBubble,
                                                    styles.partialBubble,
                                                    { borderColor: LiquidGlass.colors.primary },
                                                ]}
                                            >
                                                <Text style={{ fontSize: 8, color: LiquidGlass.colors.primary }}>
                                                    •
                                                </Text>
                                            </View>
                                        ) : (
                                            <View style={[styles.statusBubble, styles.emptyBubble]} />
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>
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
                    <TouchableOpacity
                        onPress={() => changeMonth(-1)}
                        style={styles.navButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        accessibilityLabel="Previous month"
                        accessibilityRole="button"
                    >
                        <ChevronLeft size={24} color={LiquidGlass.text.secondary} />
                    </TouchableOpacity>
                    <Text style={styles.monthTitle}>
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </Text>
                    <TouchableOpacity
                        onPress={() => changeMonth(1)}
                        style={styles.navButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        accessibilityLabel="Next month"
                        accessibilityRole="button"
                    >
                        <ChevronRight size={24} color={LiquidGlass.text.secondary} />
                    </TouchableOpacity>
                </View>

                {/* Weekday Headers */}
                <View style={styles.weekDaysGrid}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <Text key={i} style={styles.calendarDayHeader}>
                            {day}
                        </Text>
                    ))}
                </View>

                {/* Days Grid */}
                <View style={styles.daysGrid}>
                    {calendarData.map((day, i) => (
                        <View key={day.id ?? i} style={styles.dayCell}>
                            {!day.isEmpty && (
                                <View style={styles.dayContent}>
                                    <View
                                        style={[
                                            styles.intensityCircle,
                                            {
                                                backgroundColor:
                                                    (day.intensity ?? 0) > 0
                                                        ? LiquidGlass.colors.primary
                                                        : LiquidGlass.colors.surface,
                                                opacity:
                                                    (day.intensity ?? 0) > 0 ? Math.max(0.4, day.intensity ?? 0) : 1,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.dayNum,
                                                (day.intensity ?? 0) > 0.6 && {
                                                    color: LiquidGlass.colors.black,
                                                    fontWeight: '700',
                                                }, // Dark text on bright backgrounds
                                                day.isToday && styles.todayNum,
                                            ]}
                                        >
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
        backgroundColor: LiquidGlass.backgroundColor,
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
        marginBottom: LiquidGlass.spacing.xxl,
        marginHorizontal: LiquidGlass.spacing.lg,
    },
    // Weekly
    listContainer: {
        gap: 12,
    },
    weekHeaderRow: {
        flexDirection: 'row',
        paddingRight: 16,
        marginBottom: LiquidGlass.spacing.xs,
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
        fontSize: LiquidGlass.typography.size.micro,
        fontWeight: '600',
        color: LiquidGlass.text.tertiary,
    },
    todayLabel: {
        color: LiquidGlass.text.primary,
    },
    habitRowCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: LiquidGlass.spacing.lg,
        borderRadius: 24,
        backgroundColor: LiquidGlass.colors.surface,
        overflow: 'hidden',
    },
    habitInfo: {
        flex: 1,
        marginRight: LiquidGlass.spacing.md,
    },
    habitTitle: {
        fontSize: LiquidGlass.typography.size.body,
        fontWeight: '700',
        color: LiquidGlass.text.primary,
        marginBottom: LiquidGlass.spacing.xs,
    },
    streakLabel: {
        fontSize: LiquidGlass.typography.size.caption1,
        color: LiquidGlass.text.label,
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
        backgroundColor: LiquidGlass.colors.surfaceHighlight,
    },

    // Monthly Calendar Styles
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: LiquidGlass.colors.card,
        borderRadius: 24,
        paddingVertical: 20,
        paddingHorizontal: 12,
        marginBottom: LiquidGlass.spacing.xxl,
    },
    compactStat: {
        alignItems: 'center',
        flex: 1,
    },
    compactStatLabel: {
        fontSize: LiquidGlass.typography.size.caption1,
        color: LiquidGlass.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 6, // More breathing room
        fontWeight: '600',
    },
    compactStatValue: {
        fontSize: LiquidGlass.typography.size.title3,
        fontWeight: '700',
        color: LiquidGlass.text.primary,
        fontVariant: ['tabular-nums'],
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: LiquidGlass.colors.glassBorder,
    },

    calendarContainer: {
        borderRadius: 24,
        overflow: 'hidden',
        padding: LiquidGlass.spacing.lg,
        backgroundColor: LiquidGlass.colors.card,
    },
    monthNavRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: LiquidGlass.spacing.lg,
        paddingHorizontal: 8,
    },
    navButton: {
        padding: 8,
    },
    monthTitle: {
        fontSize: LiquidGlass.typography.size.headline,
        fontWeight: '600',
        color: LiquidGlass.text.primary,
    },
    weekDaysGrid: {
        flexDirection: 'row',
        marginBottom: LiquidGlass.spacing.sm,
    },
    calendarDayHeader: {
        flex: 1,
        textAlign: 'center',
        fontSize: LiquidGlass.typography.size.caption2,
        fontWeight: '600',
        color: LiquidGlass.text.tertiary,
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
        fontSize: LiquidGlass.typography.size.footnote,
        fontWeight: '500',
        color: LiquidGlass.text.tertiary, // Was 0.5, using tertiary (0.45) or label (0.6)? 0.5 is closer to tertiary in visual weight usually for disabled/inactive
    },
    todayNum: {
        color: LiquidGlass.text.primary,
        fontWeight: '700',
    },

    // Legend
    legendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: LiquidGlass.spacing.xl,
        gap: 12,
        opacity: 0.6,
    },
    legendText: {
        fontSize: 10,
        color: LiquidGlass.text.label,
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
});
