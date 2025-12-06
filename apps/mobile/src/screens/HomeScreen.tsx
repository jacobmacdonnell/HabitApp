import React, { useState, useMemo, useLayoutEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation, Animated, Platform, Alert, Dimensions } from 'react-native';
import { useHabit, Habit } from '@habitapp/shared';
import { HabitCard } from '../components/HabitCard';
import { Pet } from '../components/Pet';
import { GlassSegmentedControl } from '../components/GlassSegmentedControl';
import { Plus, Eye, EyeOff } from 'lucide-react-native';
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
    const [showCompleted, setShowCompleted] = useState(false);

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
            // Time filter
            if (timeFilter !== 'all' && habit.timeOfDay !== timeFilter && habit.timeOfDay !== 'anytime') {
                return false;
            }

            // Completed filter
            if (!showCompleted) {
                const dayProgress = progress.find(p => p.habitId === habit.id && p.date === today);
                const current = dayProgress?.currentCount || 0;
                const isCompleted = current >= habit.targetCount;
                if (isCompleted) return false;
            }

            return true;
        }).sort((a, b) => {
            // Sort by Time of Day precedence
            const order: Record<string, number> = { anytime: 0, morning: 1, midday: 2, evening: 3 };
            return (order[a.timeOfDay] || 0) - (order[b.timeOfDay] || 0);
        });
    }, [habits, timeFilter, progress, today, showCompleted]);

    // Check if there are any completed habits today
    const hasCompletedHabits = useMemo(() => {
        return habits.some(habit => {
            const dayProgress = progress.find(p => p.habitId === habit.id && p.date === today);
            const current = dayProgress?.currentCount || 0;
            return current >= habit.targetCount;
        });
    }, [habits, progress, today]);

    const [animWidth] = useState(new Animated.Value(0));
    const [animOpacity] = useState(new Animated.Value(0));
    const [animMargin] = useState(new Animated.Value(0));
    const [animScale] = useState(new Animated.Value(0));

    // Animate the eye toggle when availability changes
    React.useEffect(() => {
        if (hasCompletedHabits) {
            // Show
            Animated.parallel([
                Animated.timing(animWidth, {
                    toValue: 40,
                    duration: 300,
                    useNativeDriver: false,
                    easing: (value) => 1 - Math.pow(1 - value, 3), // cubicOut
                }),
                Animated.timing(animMargin, {
                    toValue: 12,
                    duration: 300,
                    useNativeDriver: false,
                    easing: (value) => 1 - Math.pow(1 - value, 3),
                }),
                Animated.timing(animOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.spring(animScale, {
                    toValue: 1,
                    useNativeDriver: false,
                    tension: 50,
                    friction: 7,
                })
            ]).start();
        } else {
            // Hide
            Animated.parallel([
                Animated.timing(animWidth, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                    easing: (value) => 1 - Math.pow(1 - value, 3),
                }),
                Animated.timing(animMargin, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                    easing: (value) => 1 - Math.pow(1 - value, 3),
                }),
                Animated.timing(animOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(animScale, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: false,
                })
            ]).start(({ finished }) => {
                if (finished) {
                    setShowCompleted(false);
                }
            });
        }
    }, [hasCompletedHabits]);

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
                onEdit={() => navigation.navigate('HabitForm', { habit: item })}
                onDelete={() => handleDelete(item)}
            />
        );
    };

    const insets = useSafeAreaInsets();

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

            {/* Fixed Header - outside FlatList to prevent re-renders */}
            <View style={{ paddingTop: insets.top + LiquidGlass.header.contentTopPadding, paddingHorizontal: LiquidGlass.screenPadding }}>
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
                    <View style={styles.filterRow}>
                        {/* Time Selector - ZIndex 1 to slide OVER the eye */}
                        <View style={{ flex: 1, zIndex: 1 }}>
                            <GlassSegmentedControl
                                values={['All', 'Morning', 'Noon', 'Evening']}
                                selectedIndex={selectedIndex}
                                onChange={handleSegmentChange}
                            />
                        </View>

                        {/* Animated Eye Toggle */}
                        <Animated.View style={{
                            width: animWidth,
                            marginLeft: animMargin,
                            opacity: animOpacity,
                            transform: [{ scale: animScale }],
                            overflow: 'hidden', // Clip content to prevent overlap
                            zIndex: 0,
                            alignItems: 'flex-end', // Keep content anchored right
                        }}>
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.selectionAsync();
                                    setShowCompleted(!showCompleted);
                                }}
                                style={styles.completedToggle}
                                activeOpacity={0.7}
                                disabled={!hasCompletedHabits}
                            >
                                {showCompleted ? (
                                    <Eye size={18} color="#34C759" />
                                ) : (
                                    <EyeOff size={18} color="rgba(255,255,255,0.4)" />
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
            </View>

            <FlatList
                data={filteredHabits}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={[styles.listContent, { paddingBottom: 150 }]}
                showsVerticalScrollIndicator={false}
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
        paddingHorizontal: LiquidGlass.screenPadding,
        paddingTop: 10,
        paddingBottom: 10,
    },
    date: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
        marginLeft: 2, // Optical alignment with large title
    },
    greeting: {
        fontSize: LiquidGlass.header.titleSize,
        fontWeight: LiquidGlass.header.titleWeight,
        color: LiquidGlass.header.titleColor,
        letterSpacing: LiquidGlass.header.titleLetterSpacing,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: LiquidGlass.header.marginBottom,
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
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        // gap: 12, // Removing gap to manage via animation
    },
    completedToggle: {
        width: 40, // Matched to SegmentedControl height
        height: 40, // Matched to SegmentedControl height
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: LiquidGlass.screenPadding,
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
        right: LiquidGlass.screenPadding,
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
