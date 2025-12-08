import React, { useState, useMemo, useLayoutEffect, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation, Animated, Platform, Alert, Dimensions } from 'react-native';
import { useHabit, Habit, getLocalDateString } from '@habitapp/shared';
import { HabitCard } from '../components/HabitCard';
import { Pet } from '../components/Pet/Pet';
import { GlassSegmentedControl } from '../components/GlassSegmentedControl';
import { EmptyState } from '../components/EmptyState';
import { SwipeTutorial } from '../components/SwipeTutorial';
import { Plus, Eye, EyeOff } from 'lucide-react-native';
import { LiquidGlassView } from '@callstack/liquid-glass';
import { LiquidFab } from '../components/LiquidFab';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LiquidGlass } from '../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { getGreeting } from '../data/greetings';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList>,
    NativeStackNavigationProp<RootStackParamList>
>;

const { width } = Dimensions.get('window');

export const HomeScreen = () => {
    const { habits, progress, logProgress, undoProgress, getStreak, pet, deleteHabit } = useHabit();
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const router = useRouter(); // Use Expo Router
    const [timeFilter, setTimeFilter] = useState('all');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showCompleted, setShowCompleted] = useState(false);

    const [petBounce, setPetBounce] = useState(0);
    const confettiRef = useRef<any>(null);
    const [hasSeenSwipeHint, setHasSeenSwipeHint] = useState(true); // Default true to not show until loaded

    const today = getLocalDateString();

    // Load swipe hint preference
    useEffect(() => {
        AsyncStorage.getItem('hasSeenSwipeHint').then(value => {
            setHasSeenSwipeHint(value === 'true');
        });
    }, []);

    useLayoutEffect(() => {
        // Clear native options since we are using a custom header
        navigation.setOptions({});
    }, [navigation]);

    // Use useState for greeting to ensure it is stable across renders
    // It will only update when the component remounts or we explicitly update it
    const [greeting, setGreeting] = useState(() => getGreeting());

    // Optional: Update greeting if the app comes to foreground or time significantly changes
    React.useEffect(() => {
        const interval = setInterval(() => {
            const newGreeting = getGreeting();
            // Only update if the "time bucket" has actually changed conceptually to avoid random shuffling
            // For now, we'll keep it stable for the session to prevent "changing way too much"
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleSegmentChange = (event: { nativeEvent: { selectedSegmentIndex: number } }) => {
        Haptics.selectionAsync();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const index = event.nativeEvent.selectedSegmentIndex;
        setSelectedIndex(index);
        const filters = ['all', 'morning', 'midday', 'evening'];
        setTimeFilter(filters[index]);
    };

    // ... (filteredHabits, hasCompletedHabits logic remains same) ...

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
    }, [habits, timeFilter, showCompleted, progress]); // Removed 'today' if it's constant, but it's likely fine. Ensure 'progress' isn't a new array every render.

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
                    easing: (value) => 1 - Math.pow(1 - value, 3),
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
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            logProgress(habit.id, today);

            // Check if this completion finishes the entire day
            const willBeCompleted = current + 1 >= habit.targetCount;

            if (willBeCompleted) {
                const otherHabits = habits.filter(h => h.id !== habit.id);
                // Check if all other habits (filtered by time or global?)
                // Ideally check global, but for visual celebration, global makes sense.
                const allOthersDone = otherHabits.every(h => {
                    const p = progress.find(prog => prog.habitId === h.id && prog.date === today);
                    return (p?.currentCount || 0) >= h.targetCount;
                });

                if (allOthersDone) {
                    confettiRef.current?.start();
                }
            }
        }
    }, [progress, today, logProgress, undoProgress, habits]);

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

    const handleSwipeHintDismiss = useCallback(() => {
        setHasSeenSwipeHint(true);
        AsyncStorage.setItem('hasSeenSwipeHint', 'true');
    }, []);

    const renderItem = ({ item, index }: { item: Habit; index: number }) => {
        const streak = getStreak(item.id);
        const dayProgress = progress.find(p => p.habitId === item.id && p.date === today);
        const current = dayProgress?.currentCount || 0;
        const isCompleted = !!dayProgress?.completed;

        // Auto swipe demo only on first card for new users
        const showDemo = index === 0 && !hasSeenSwipeHint;

        return (
            <HabitCard
                habit={item}
                isCompleted={isCompleted}
                currentCount={current}
                streak={streak}
                onToggle={() => handleToggle(item)}
                onDecrement={() => undoProgress(item.id, today)}
                onEdit={() => router.push({ pathname: '/habit-form', params: { habit: JSON.stringify(item) } })}
                onDelete={() => handleDelete(item)}
                autoSwipeDemo={showDemo}
                onSwipeDemoComplete={handleSwipeHintDismiss}
            />
        );
    };

    const insets = useSafeAreaInsets(); // Used for header padding

    const fabBottom = Platform.OS === 'ios'
        ? insets.bottom + 49 + 16 // Align approx 16pt above standard Native Tab Bar (49pt)
        : 80;

    const fabScale = useRef(new Animated.Value(1)).current;

    const handleFabPressIn = () => {
        Animated.spring(fabScale, {
            toValue: 0.92,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleFabPressOut = () => {
        Animated.spring(fabScale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    return (
        <View style={styles.container}>
            {/* Ambient Background - Clean Dark Theme */}
            <LiquidGlassView interactive={true} style={StyleSheet.absoluteFill} pointerEvents="none" />

            {/* Custom Fixed Header */}
            <View style={{ paddingTop: insets.top + (LiquidGlass.header.contentTopPadding || 20), paddingHorizontal: LiquidGlass.screenPadding }}>
                <View style={styles.headerRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.greeting}>{greeting}</Text>
                        <Text style={styles.date}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => router.push('/(tabs)/pet')}
                        style={styles.petHeaderContainer}
                    >
                        <View style={styles.petGlass}>
                            <Pet pet={pet} isFullView={false} feedingBounce={petBounce} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Filter Row */}
                <View style={styles.filterContainer}>
                    <View style={styles.filterRow}>
                        {/* Time Selector */}
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
                            overflow: 'hidden',
                            zIndex: 0,
                            alignItems: 'flex-end',
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
                contentInsetAdjustmentBehavior="never" // Disable native adjustment since we have a fixed header view
                ListEmptyComponent={() => {
                    // Determine why it's empty
                    // Check if there ARE habits for this filter that are just hidden because completed
                    const hasHiddenCompleted = habits.some(h => {
                        // Time match
                        if (timeFilter !== 'all' && h.timeOfDay !== timeFilter && h.timeOfDay !== 'anytime') return false;
                        // Is it completed?
                        const dayProgress = progress.find(p => p.habitId === h.id && p.date === today);
                        const current = dayProgress?.currentCount || 0;
                        return current >= h.targetCount;
                    });

                    // If filteredHabits is empty...
                    // 1. If we have hidden completed items -> "All Done!"
                    // 2. Otherwise -> "No habits set"

                    if (hasHiddenCompleted && !showCompleted) {
                        return <EmptyState type="all-done" />;
                    }

                    return <EmptyState type="empty" message={`No habits found for ${timeFilter}`} />;
                }}
            />


            {/* iOS 26 Floating Action Button - Liquid Glass Interaction */}
            <LiquidFab />


            {/* Swipe Tutorial tooltip - appears with card auto-swipe */}
            {!hasSeenSwipeHint && filteredHabits.length > 0 && (
                <SwipeTutorial
                    onDismiss={handleSwipeHintDismiss}
                    cardTop={insets.top + 325}
                />
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LiquidGlass.backgroundColor,
    },
    // Custom Header Styles
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: LiquidGlass.header.marginBottom,
    },
    greeting: {
        fontSize: LiquidGlass.header.titleSize,
        fontWeight: LiquidGlass.header.titleWeight,
        color: LiquidGlass.header.titleColor,
        letterSpacing: LiquidGlass.header.titleLetterSpacing,
    },
    date: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginTop: 4,
    },
    petHeaderContainer: {
        marginBottom: 4,
    },
    petGlass: {
        width: 130,
        height: 130,
        marginTop: -20, // Pull it up into the header space more
        marginRight: -10, // Pull it to the right edge
        overflow: 'visible',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterContainer: {
        marginBottom: 16,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    completedToggle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: LiquidGlass.screenPadding,
        paddingBottom: 100,
    },

    fab: {
        position: 'absolute',
        right: LiquidGlass.screenPadding,
        width: 56,
        height: 56,
        borderRadius: 28,
        borderCurve: 'continuous',
        zIndex: 100, // Ensure it sits above list content
    },
    fabGlass: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderCurve: 'continuous',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
});
