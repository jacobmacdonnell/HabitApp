import { FlashList } from '@shopify/flash-list';
import { useHabit, Habit, getLocalDateString } from '@habitapp/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState, useMemo, useLayoutEffect, useCallback, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    LayoutAnimation,
    Animated,
    Platform,
    Alert,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '../components/EmptyState';

const DEV_MODE = true; // Toggle this to test Achievement Toasts
import { GlassSegmentedControl } from '../components/GlassSegmentedControl';
import { HabitCard } from '../components/HabitCard';
import { LiquidFab } from '../components/LiquidFab';
import { Pet } from '../components/Pet/Pet';
import { SwipeTutorial } from '../components/SwipeTutorial';
import { useToast } from '../components/Toast';
import { getGreeting } from '../data/greetings';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { LiquidGlass } from '../theme/theme';

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
    const [hasSeenSwipeHint, setHasSeenSwipeHint] = useState(true); // Default true to not show until loaded
    const [hasEverCompleted, setHasEverCompleted] = useState(true); // Default true until we check
    const [hasRequestedReview, setHasRequestedReview] = useState(true); // Default true to avoid prompt on load
    const { showToast } = useToast();

    const today = getLocalDateString();

    // Load preferences
    useEffect(() => {
        AsyncStorage.getItem('hasSeenSwipeHint').then((value) => {
            setHasSeenSwipeHint(value === 'true');
        });
        AsyncStorage.getItem('hasEverCompletedHabit').then((value) => {
            setHasEverCompleted(value === 'true');
        });
        AsyncStorage.getItem('hasRequestedReview').then((value) => {
            setHasRequestedReview(value === 'true');
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
        return habits
            .filter((habit) => {
                // Time filter
                if (timeFilter !== 'all' && habit.timeOfDay !== timeFilter) {
                    return false;
                }

                // Completed filter
                if (!showCompleted) {
                    const dayProgress = progress.find((p) => p.habitId === habit.id && p.date === today);
                    const current = dayProgress?.currentCount || 0;
                    const isCompleted = current >= habit.targetCount;
                    if (isCompleted) return false;
                }

                return true;
            })
            .sort((a, b) => {
                // Sort by Time of Day precedence
                const order: Record<string, number> = { anytime: 0, morning: 1, midday: 2, evening: 3 };
                return (order[a.timeOfDay] || 0) - (order[b.timeOfDay] || 0);
            });
    }, [habits, timeFilter, showCompleted, progress]); // Removed 'today' if it's constant, but it's likely fine. Ensure 'progress' isn't a new array every render.

    // Check if there are any completed habits today
    const hasCompletedHabits = useMemo(() => {
        return habits.some((habit) => {
            const dayProgress = progress.find((p) => p.habitId === habit.id && p.date === today);
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
                }),
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
                }),
            ]).start(({ finished }) => {
                if (finished) {
                    setShowCompleted(false);
                }
            });
        }
    }, [hasCompletedHabits]);

    const handleToggle = useCallback(
        (habit: Habit) => {
            const dayProgress = progress.find((p) => p.habitId === habit.id && p.date === today);
            const current = dayProgress?.currentCount || 0;
            const isCompleted = current >= habit.targetCount;

            if (isCompleted) {
                undoProgress(habit.id, today);
            } else {
                // Check if this is user's first-ever completion
                const isFirstEverCompletion = !hasEverCompleted;

                // Calculate if this toggle WILL complete the habit
                const currentCount =
                    progress.find((p) => p.habitId === habit.id && p.date === today)?.currentCount || 0;
                const willComplete =
                    habit.targetCount === 1 || (habit.targetCount > 1 && currentCount + 1 >= habit.targetCount);

                if (willComplete) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    setTimeout(() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    }, 150);

                    // Bounce the pet widget
                    setPetBounce((prev) => prev + 1);

                    // Mark as completed forever if first time
                    if (isFirstEverCompletion) {
                        setHasEverCompleted(true);
                        AsyncStorage.setItem('hasEverCompletedHabit', 'true');
                    }

                    // --- ACHIEVEMENT TOAST LOGIC ---
                    // Show toast with optimized delay (2.5s) to let XP/Confetti settle
                    setTimeout(() => {
                        // Achievement Haptics: "Grand Celebration" Sequence
                        // Pattern: Ta-da-da-DUM
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

                        setTimeout(() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }, 100);
                        setTimeout(() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        }, 200);
                        setTimeout(() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        }, 300);

                        // 1. Calculate Milestones
                        const currentStreak = getStreak(habit.id);
                        // Note: currentStreak allows for "New Streak" calculation.
                        // If logic allows, assume currentStreak is the *new* value after this completion.
                        // For safety, let's treat currentStreak as valid "now".

                        const isPerfectDay = habits.every((h) => {
                            if (h.id === habit.id) return true; // This one is now done
                            // Check others
                            const p = progress.find((p) => p.habitId === h.id && p.date === today);
                            return (p?.currentCount || 0) >= h.targetCount;
                        });

                        let message = '';
                        let icon = '';

                        // 2. Select Message Priority
                        if (isFirstEverCompletion) {
                            message = 'You did it! Your first habit!';
                            icon = '🎉';
                        } else if (currentStreak === 3) {
                            message = '3 Day Streak! Heating up!';
                            icon = '🔥';
                        } else if (currentStreak === 7) {
                            message = '7 Day Streak! Unstoppable!';
                            icon = '⚡';
                        } else if (currentStreak === 30) {
                            message = '30 Days! Legend status!';
                            icon = '🏆';
                        } else if (isPerfectDay) {
                            message = 'Perfect Day! All done.';
                            icon = '🌟';
                        }

                        // 3. DEV MODE OVERRIDE (Randomizer to see all)
                        if (DEV_MODE) {
                            const demos = [
                                { msg: 'Dev: First Ever Habit!', icon: '🎉' },
                                { msg: 'Dev: 3 Day Streak!', icon: '🔥' },
                                { msg: 'Dev: 7 Day Streak!', icon: '⚡' },
                                { msg: 'Dev: 30 Day Streak!', icon: '�' },
                                { msg: 'Dev: Perfect Day!', icon: '🌟' },
                            ];
                            const randomDemo = demos[Math.floor(Math.random() * demos.length)];
                            message = randomDemo.msg;
                            icon = randomDemo.icon;
                        }

                        // 4. Show Toast if we have a message
                        if (message) {
                            showToast({
                                message,
                                icon,
                                type: 'success',
                                duration: 4000,
                            });
                        }
                    }, 2500); // Delayed until AFTER XP notification settles
                } else {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }

                logProgress(habit.id, today);

                // --- REVIEW PROMPT LOGIC ---
                // Trigger if:
                // 1. Not asked yet
                // 2. New streak will be exactly 3 (current streak + 1)
                const currentStreak = getStreak(habit.id);
                // Note: getStreak might already include today if logProgress fired synchronously,
                // but usually we calculate "will become". Let's assume safe check:
                // If they are hitting streak 3 right now.
                // Simple logic: if streak is 2 going on 3.
                if (!hasRequestedReview && currentStreak === 2) {
                    setTimeout(async () => {
                        const isAvailable = await StoreReview.isAvailableAsync();
                        if (isAvailable) {
                            await StoreReview.requestReview();
                            AsyncStorage.setItem('hasRequestedReview', 'true');
                            setHasRequestedReview(true);
                        }
                    }, 2000); // Delay to let the celebration finish
                }
            }
        },
        [progress, today, logProgress, undoProgress, habits, hasEverCompleted, showToast]
    );

    const handleDelete = (habit: Habit) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert('Delete Habit', `Are you sure you want to delete "${habit.title}"?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                    deleteHabit(habit.id);
                },
            },
        ]);
    };

    const handleSwipeHintDismiss = useCallback(() => {
        setHasSeenSwipeHint(true);
        AsyncStorage.setItem('hasSeenSwipeHint', 'true');
    }, []);

    const renderItem = ({ item, index }: { item: Habit; index: number }) => {
        const streak = getStreak(item.id);
        const dayProgress = progress.find((p) => p.habitId === item.id && p.date === today);
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

    const fabBottom =
        Platform.OS === 'ios'
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
            {/* Custom Fixed Header */}
            <View
                style={{
                    paddingTop: insets.top + (LiquidGlass.header.contentTopPadding || 20),
                    paddingHorizontal: LiquidGlass.screenPadding,
                }}
            >
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
                        accessibilityLabel={`View ${pet?.name || 'your pet'}`}
                        accessibilityRole="button"
                        accessibilityHint="Opens pet details screen"
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
                                values={['All', 'Morning', 'Afternoon', 'Evening']}
                                selectedIndex={selectedIndex}
                                onChange={handleSegmentChange}
                            />
                        </View>

                        {/* Animated Eye Toggle */}
                        <Animated.View
                            style={{
                                width: animWidth,
                                marginLeft: animMargin,
                                opacity: animOpacity,
                                transform: [{ scale: animScale }],
                                overflow: 'hidden',
                                zIndex: 0,
                                alignItems: 'flex-end',
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.selectionAsync();
                                    setShowCompleted(!showCompleted);
                                }}
                                style={styles.completedToggle}
                                activeOpacity={0.7}
                                disabled={!hasCompletedHabits}
                                accessibilityLabel={showCompleted ? 'Hide completed habits' : 'Show completed habits'}
                                accessibilityRole="button"
                            >
                                {showCompleted ? (
                                    <Eye size={18} color={LiquidGlass.colors.primary} />
                                ) : (
                                    <EyeOff size={18} color={LiquidGlass.text.tertiary} />
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
            </View>

            <FlashList<Habit>
                data={filteredHabits}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                // @ts-ignore - estimatedItemSize is required by FlashList but types are stale
                estimatedItemSize={100}
                contentContainerStyle={[styles.listContent, { paddingBottom: 150 }]}
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="never" // Disable native adjustment since we have a fixed header view
                ListEmptyComponent={() => {
                    // Determine why it's empty
                    // Check if there ARE habits for this filter that are just hidden because completed
                    const hasHiddenCompleted = habits.some((h) => {
                        // Time match
                        if (timeFilter !== 'all' && h.timeOfDay !== timeFilter) return false;
                        // Is it completed?
                        const dayProgress = progress.find((p) => p.habitId === h.id && p.date === today);
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
                <SwipeTutorial onDismiss={handleSwipeHintDismiss} cardTop={insets.top + 325} />
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
        color: LiquidGlass.text.secondary,
        fontSize: LiquidGlass.typography.size.footnote,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginTop: LiquidGlass.spacing.xs,
    },
    petHeaderContainer: {
        marginBottom: LiquidGlass.spacing.xs,
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
        marginBottom: LiquidGlass.spacing.lg,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    completedToggle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: LiquidGlass.card.backgroundColor,
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
