import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation, Platform, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabit, Habit } from '@habitapp/shared';
import { HabitCard } from '../components/HabitCard';
import { Pet } from '../components/Pet';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Plus } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export const HomeScreen = () => {
    const { habits, progress, logProgress, undoProgress, getStreak, pet, deleteHabit } = useHabit();
    const navigation = useNavigation();
    const [timeFilter, setTimeFilter] = useState('all');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const today = new Date().toISOString().split('T')[0];

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

    const handleToggle = (habit: Habit) => {
        const dayProgress = progress.find(p => p.habitId === habit.id && p.date === today);
        const current = dayProgress?.currentCount || 0;
        const isCompleted = current >= habit.targetCount;

        if (isCompleted) {
            undoProgress(habit.id, today);
        } else {
            logProgress(habit.id, today);
        }
    };

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
                onPress={() => navigation.navigate('HabitForm' as never, { habit: item } as never)}
                onEdit={() => navigation.navigate('HabitForm' as never, { habit: item } as never)}
                onDelete={() => handleDelete(item)}
            />
        );
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <View style={styles.container}>
            {/* Ambient Background Blobs */}
            <View style={[styles.blob, { backgroundColor: '#6366f1', top: -100, left: -100 }]} />
            <View style={[styles.blob, { backgroundColor: '#FF6B6B', bottom: -100, right: -100, opacity: 0.2 }]} />
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.date}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </Text>
                        <Text style={styles.greeting}>{getGreeting()}</Text>
                    </View>
                    {/* Pet Widget */}
                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Pet' as never)}>
                        <Pet pet={pet} isFullView={false} />
                    </TouchableOpacity>
                </View>

                <View style={styles.filterContainer}>
                    <SegmentedControl
                        values={['All', 'Morning', 'Noon', 'Evening']}
                        selectedIndex={selectedIndex}
                        onChange={handleSegmentChange}
                        appearance="dark"
                        backgroundColor="rgba(255,255,255,0.1)"
                        fontStyle={{ color: 'rgba(255,255,255,0.5)', fontWeight: '600', fontSize: 12 }}
                        activeFontStyle={{ color: '#fff', fontWeight: '700', fontSize: 12 }}
                    />
                </View>

                <FlatList
                    data={filteredHabits}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No habits found for {timeFilter}</Text>
                        </View>
                    }
                />
            </SafeAreaView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('HabitForm' as never)}
            >
                <BlurView intensity={40} tint="light" style={styles.fabBlur}>
                    <Plus size={24} color="#000" strokeWidth={3} />
                </BlurView>
            </TouchableOpacity>
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
    safeArea: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    greeting: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '800',
    },
    filterContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100, // Space for FAB and TabBar
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
        bottom: 100, // Above tab bar
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
    },
    fabBlur: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Fallback/Tint
    },
});
