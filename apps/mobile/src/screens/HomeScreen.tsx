import React, { useState, useMemo, useLayoutEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, LayoutAnimation, Platform, Alert, Dimensions } from 'react-native';
import { useHabit, Habit } from '@habitapp/shared';
import { HabitCard } from '../components/HabitCard';
import { Pet } from '../components/Pet';
import { ConfettiManager, useConfetti } from '../components/ConfettiManager';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Plus } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LiquidGlass } from '../theme/theme';

const { width } = Dimensions.get('window');

export const HomeScreen = () => {
    const { habits, progress, logProgress, undoProgress, getStreak, pet, deleteHabit } = useHabit();
    const navigation = useNavigation();
    const [timeFilter, setTimeFilter] = useState('all');
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Confetti system
    const { bursts, triggerConfetti } = useConfetti();

    // Pet reaction when confetti reaches it
    const [petBounce, setPetBounce] = useState(0);
    const handlePetFed = useCallback(() => {
        setPetBounce(prev => prev + 1);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, []);

    const today = new Date().toISOString().split('T')[0];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            title: '',
            headerRight: () => null,
            headerTransparent: true,
        });
    }, [navigation]);

    const handleSegmentChange = (event: any) => {
        Haptics.selectionAsync();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const index = event.nativeEvent.selectedSegmentIndex;
        setSelectedIndex(index);
        const filters = ['all', 'morning', 'midday', 'evening'];
        setTimeFilter(filters[index]);
    };

    const filteredHabits = useMemo(() => {
        return habits.filter(habit => {
            if (timeFilter === 'all') return true;
            return habit.timeOfDay === timeFilter || habit.timeOfDay === 'anytime';
        }).sort((a, b) => {
            const order: Record<string, number> = { anytime: 0, morning: 1, midday: 2, evening: 3 };
            return (order[a.timeOfDay] || 0) - (order[b.timeOfDay] || 0);
        });
    }, [habits, timeFilter]);

    // Separate into pending and completed
    const { pendingHabits, completedHabits } = useMemo(() => {
        const pending: Habit[] = [];
        const completed: Habit[] = [];

        filteredHabits.forEach(habit => {
            const dayProgress = progress.find(p => p.habitId === habit.id && p.date === today);
            const current = dayProgress?.currentCount || 0;
            const isCompleted = current >= habit.targetCount;

            if (isCompleted) {
                completed.push(habit);
            } else {
                pending.push(habit);
            }
        });

        return { pendingHabits: pending, completedHabits: completed };
    }, [filteredHabits, progress, today]);

    const sections = useMemo(() => {
        const result = [];
        if (pendingHabits.length > 0) {
            result.push({ title: 'To Do', data: pendingHabits });
        }
        if (completedHabits.length > 0) {
            result.push({ title: 'Completed', data: completedHabits });
        }
        return result;
    }, [pendingHabits, completedHabits]);

    const handleToggle = useCallback((habit: Habit) => {
        const dayProgress = progress.find(p => p.habitId === habit.id && p.date === today);
        const current = dayProgress?.currentCount || 0;
        const isCompleted = current >= habit.targetCount;

        if (isCompleted) {
            undoProgress(habit.id, today);
        } else {
            logProgress(habit.id, today);
        }
    }, [progress, today, logProgress, undoProgress]);

    // Called by HabitCard when a habit completes with checkbox position
    const handleComplete = useCallback((x: number, y: number, color: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        triggerConfetti(x, y, color);
    }, [triggerConfetti]);

    const handleDelete = (habit: Habit) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
            'Delete Habit',
            `Are you sure you want to delete "${habit.title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                        deleteHabit(habit.id);
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: Habit }) => {
        const dayProgress = progress.find(p => p.habitId === item.id && p.date === today);
        const current = dayProgress?.currentCount || 0;
        const isCompleted = current >= item.targetCount;
        const streak = getStreak(item.id);

        return (
            <HabitCard
                habit={item}
                isCompleted={isCompleted}
                currentCount={current}
                streak={streak}
                onToggle={() => handleToggle(item)}
                onComplete={handleComplete}
                onPress={() => navigation.navigate('HabitForm' as never, { habit: item } as never)}
                onEdit={() => navigation.navigate('HabitForm' as never, { habit: item } as never)}
                onDelete={() => handleDelete(item)}
            />
        );
    };

    const insets = useSafeAreaInsets();

    const ListHeader = () => (
        <View style={{ paddingTop: insets.top }}>
            {/* Unified Header Row */}
            <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.date}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </Text>
                    <Text style={styles.greeting}>{getGreeting()}</Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Pet' as never)}
                    style={styles.petHeaderContainer}
                >
                    <BlurView intensity={20} tint="light" style={styles.petGlass}>
                        <Pet pet={pet} isFullView={false} feedingBounce={petBounce} />
                    </BlurView>
                </TouchableOpacity>
            </View>

            <View style={styles.filterContainer}>
                <SegmentedControl
                    values={['All', 'Morning', 'Noon', 'Evening']}
                    selectedIndex={selectedIndex}
                    onChange={handleSegmentChange}
                    appearance="dark"
                    fontStyle={{ color: 'rgba(255,255,255,0.5)', fontWeight: '600', fontSize: 12 }}
                    activeFontStyle={{ color: '#fff', fontWeight: '700', fontSize: 12 }}
                />
            </View>
        </View>
    );

    // const insets = useSafeAreaInsets(); // Moved up

    // iOS 26: FAB positioned above floating dock
    // Dock top = insets.bottom + 16 (offset) + 68 (height) = insets.bottom + 84
    // FAB should be ~20pt above dock top
    const fabBottom = Platform.OS === 'ios'
        ? insets.bottom + LiquidGlass.dock.bottomOffset + LiquidGlass.dock.height + 20
        : 100;

    return (
        <View style={styles.container}>
            {/* Ambient Background Blobs */}
            <View style={[styles.blob, { backgroundColor: '#6366f1', top: -100, left: -100 }]} />
            <View style={[styles.blob, { backgroundColor: '#FF6B6B', bottom: -100, right: -100, opacity: 0.2 }]} />
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

            <SectionList
                sections={sections}
                renderItem={renderItem}
                renderSectionHeader={({ section }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={styles.sectionCount}>{section.data.length}</Text>
                    </View>
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={[styles.listContent, { paddingBottom: 150 }]}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={ListHeader}
                contentInsetAdjustmentBehavior="automatic"
                stickySectionHeadersEnabled={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No habits found for {timeFilter}</Text>
                    </View>
                }
            />

            {/* FAB */}
            <TouchableOpacity
                style={[styles.fab, { bottom: fabBottom }]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('HabitForm' as never)}
            >
                <BlurView intensity={40} tint="light" style={styles.fabBlur}>
                    <Plus size={24} color="#000" strokeWidth={3} />
                </BlurView>
            </TouchableOpacity>

            {/* Confetti Manager - renders confetti at checkbox positions */}
            <ConfettiManager bursts={bursts} onParticleReachPet={handlePetFed} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    blob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.3,
    },
    dateHeader: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    date: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    greeting: {
        fontSize: 34,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    petHeaderContainer: {
        marginBottom: 4,
    },
    petGlass: {
        width: 64,
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    filterContainer: {
        marginBottom: 16,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        // Dynamic bottom to clear the TabBar which is at (insets.bottom + 10) + 85 height
        // We want it slightly above that. Let's say + 20 spacing.
        // But since we can't use dynamic insets in stylesheet, we'll use inline styles or a memoized style.
        // For now, let's just set a safe default high enough or handle it in the component.
        // Actually, best practice is to pass it via style prop.
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 100, // Ensure it's above everything
    },
    fabBlur: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Fallback/Tint
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        paddingVertical: 12,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.6)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sectionCount: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.4)',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
});
