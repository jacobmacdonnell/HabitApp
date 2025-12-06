import React, { useState, useMemo, useLayoutEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation, Platform, Alert, Dimensions } from 'react-native';
import { useHabit, Habit } from '@habitapp/shared';
import { HabitCard } from '../components/HabitCard';
import { Pet } from '../components/Pet';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Plus } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useNavigation, useIsFocused, CompositeNavigationProp } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LiquidGlass } from '../theme/theme';
import { GlassView } from 'expo-glass-effect';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from '../navigation/types';

type HomeScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList>,
    NativeStackNavigationProp<RootStackParamList>
>;

const { width } = Dimensions.get('window');

export const HomeScreen = () => {
    const { habits, progress, logProgress, undoProgress, getStreak, pet, deleteHabit } = useHabit();
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [timeFilter, setTimeFilter] = useState('all');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [petBounce, setPetBounce] = useState(0);

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
            // 1. Sort by Completion (Active first, Completed last)
            const isACompleted = (progress.find(p => p.habitId === a.id && p.date === today)?.currentCount || 0) >= a.targetCount;
            const isBCompleted = (progress.find(p => p.habitId === b.id && p.date === today)?.currentCount || 0) >= b.targetCount;

            if (isACompleted !== isBCompleted) return isACompleted ? 1 : -1;

            // 2. Sort by Time of Day precedence
            const order: Record<string, number> = { anytime: 0, morning: 1, midday: 2, evening: 3 };
            return (order[a.timeOfDay] || 0) - (order[b.timeOfDay] || 0);
        });
    }, [habits, timeFilter, progress, today]);

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
                onDecrement={() => undoProgress(item.id, today)}
                onPress={() => { }} // No action on tap - only swipe to edit
                onEdit={() => navigation.navigate('HabitForm', { habit: item })}
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
                    onPress={() => navigation.navigate('Pet')}
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

    // iOS 26: FAB positioned above floating dock
    // Dock top = insets.bottom + 16 (offset) + 68 (height) = insets.bottom + 84
    // FAB should be ~20pt above dock top
    const fabBottom = Platform.OS === 'ios'
        ? insets.bottom + LiquidGlass.dock.bottomOffset + LiquidGlass.dock.height + 20
        : 100;

    return (
        <View style={styles.container}>
            {/* Ambient Background - Clean Dark Theme */}
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} pointerEvents="none" />

            <FlatList
                data={filteredHabits}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={[styles.listContent, { paddingBottom: 150 }]}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={ListHeader}
                contentInsetAdjustmentBehavior="automatic"
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No habits found for {timeFilter}</Text>
                    </View>
                }
            />

            {/* iOS 26 Floating Action Button */}
            <TouchableOpacity
                style={[styles.fab, { bottom: fabBottom }]}
                activeOpacity={0.8}
                onPress={() => (navigation as any).navigate('HabitForm')}
            >
                <GlassView
                    style={styles.fabGlass}
                    glassEffectStyle="regular"
                >
                    <Plus size={28} color="#fff" strokeWidth={2.5} />
                </GlassView>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c1e',
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
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    fabGlass: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        overflow: 'hidden',
    },
});
