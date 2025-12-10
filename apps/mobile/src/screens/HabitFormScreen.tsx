import { useHabit, Habit } from '@habitapp/shared';
import { HABIT_COLORS, HABIT_ICONS, HABIT_PRESETS } from '@habitapp/shared/src/constants';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Trash2, Minus, Plus } from 'lucide-react-native';
import React, { useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Platform,
    NativeSyntheticEvent,
    TextInput,
} from 'react-native';

import { GlassButton } from '../components/GlassButton';
import { ColorPicker } from '../components/ColorPicker';
import { GlassSegmentedControl } from '../components/GlassSegmentedControl';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { RootStackParamList } from '../navigation/types';
import { LiquidGlass } from '../theme/theme';

export const HabitFormScreen = () => {
    const { addHabit, updateHabit, deleteHabit } = useHabit();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const router = useRouter();
    const route = useRoute<RouteProp<RootStackParamList, 'HabitForm'>>();
    // Parse the habit from JSON string (passed as JSON.stringify from HomeScreen)
    const editingHabit = route.params?.habit
        ? typeof route.params.habit === 'string'
            ? (JSON.parse(route.params.habit) as Habit)
            : route.params.habit
        : undefined;

    const [title, setTitle] = useState(editingHabit?.title || '');
    const [color, setColor] = useState(editingHabit?.color || HABIT_COLORS[0]);
    const [icon, setIcon] = useState(editingHabit?.icon || HABIT_ICONS[0]);
    const [timeOfDay, setTimeOfDay] = useState(editingHabit?.timeOfDay || 'anytime');
    const [frequencyIndex, setFrequencyIndex] = useState(editingHabit?.frequency?.type === 'weekly' ? 1 : 0);
    const [targetCount, setTargetCount] = useState(editingHabit?.targetCount || 1);

    const handleSave = () => {
        if (!title.trim()) {
            Alert.alert('Title Required', 'Please enter a habit title.');
            return;
        }

        const habitData = {
            title,
            color,
            icon,
            timeOfDay: timeOfDay as Habit['timeOfDay'],
            frequency: { type: (frequencyIndex === 0 ? 'daily' : 'weekly') as 'daily' | 'weekly', days: [] },
            targetCount,
        };

        if (editingHabit) {
            updateHabit(editingHabit.id, habitData);
        } else {
            addHabit(habitData);
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: editingHabit ? 'Edit Habit' : 'New Habit',
            headerLeft: () => (
                <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 16 }}>
                    <Text style={{ color: '#fff', fontSize: 17, textAlign: 'center' }}>Cancel</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={handleSave} style={{ paddingHorizontal: 16 }}>
                    <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600', textAlign: 'center' }}>Save</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, editingHabit, title, color, icon, timeOfDay, frequencyIndex, targetCount]);

    const handleDelete = () => {
        if (!editingHabit) return;
        Alert.alert('Delete Habit', 'Are you sure you want to delete this habit?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    deleteHabit(editingHabit.id);
                    router.back();
                },
            },
        ]);
    };

    const applyPreset = (preset: (typeof HABIT_PRESETS)[0]) => {
        Haptics.selectionAsync();
        setTitle(preset.title);
        setIcon(preset.icon);
        setColor(preset.color);
        setTimeOfDay(preset.defaultTime as Habit['timeOfDay']);
        setTargetCount(preset.defaultTarget);
    };

    return (
        <ScreenWrapper keyboardAvoiding isModal>
            {/* Preset Picker - Only show when creating new habit */}
            {!editingHabit && (
                <View style={styles.section}>
                    <Text style={styles.label}>QUICK START</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.presetRow}
                        style={{ marginHorizontal: -12 }}
                    >
                        {HABIT_PRESETS.map((preset) => (
                            <TouchableOpacity
                                key={preset.id}
                                style={[
                                    styles.presetChip,
                                    { backgroundColor: preset.color + '20', borderColor: preset.color },
                                ]}
                                onPress={() => applyPreset(preset)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.presetIcon}>{preset.icon}</Text>
                                <Text style={[styles.presetTitle, { color: preset.color }]} numberOfLines={1}>
                                    {preset.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Title Input */}
            <View style={styles.section}>
                <Text style={styles.label}>HABIT TITLE</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Drink Water"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>
            </View>

            {/* Daily Target */}
            <View style={styles.section}>
                <Text style={styles.label}>DAILY TARGET</Text>
                <View style={styles.counterRow}>
                    <TouchableOpacity
                        style={styles.counterButton}
                        onPress={() => {
                            setTargetCount(Math.max(1, targetCount - 1));
                            Haptics.selectionAsync();
                        }}
                        accessibilityLabel="Decrease daily target"
                        accessibilityRole="button"
                    >
                        <Minus size={20} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.counterCenter}>
                        <Text style={styles.counterValue}>{targetCount}</Text>
                        <Text style={styles.counterUnit}>times per day</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.counterButton}
                        onPress={() => {
                            setTargetCount(targetCount + 1);
                            Haptics.selectionAsync();
                        }}
                        accessibilityLabel="Increase daily target"
                        accessibilityRole="button"
                    >
                        <Plus size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Time of Day */}
            <View style={styles.section}>
                <Text style={styles.label}>TIME OF DAY</Text>
                <GlassSegmentedControl
                    values={['Anytime', 'Morning', 'Noon', 'Evening']}
                    selectedIndex={['anytime', 'morning', 'midday', 'evening'].indexOf(timeOfDay)}
                    onChange={(event: NativeSyntheticEvent<{ selectedSegmentIndex: number }>) => {
                        const index = event.nativeEvent.selectedSegmentIndex;
                        const times = ['anytime', 'morning', 'midday', 'evening'] as const;
                        setTimeOfDay(times[index]);
                        Haptics.selectionAsync();
                    }}
                />
            </View>

            {/* Icon Picker */}
            <View style={styles.section}>
                <Text style={styles.label}>ICON</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.iconRow}
                    style={{ marginHorizontal: -12 }}
                >
                    {HABIT_ICONS.map((i) => (
                        <TouchableOpacity
                            key={i}
                            style={[
                                styles.iconButton,
                                icon === i && { backgroundColor: color },
                                icon === i && styles.iconSelected,
                            ]}
                            onPress={() => {
                                setIcon(i);
                                Haptics.selectionAsync();
                            }}
                        >
                            <Text style={styles.iconText}>{i}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Color Picker */}
            <View style={styles.section}>
                <Text style={styles.label}>COLOR</Text>
                <ColorPicker colors={HABIT_COLORS} selectedColor={color} onColorSelect={setColor} variant="scroll" />
            </View>

            {editingHabit && (
                <View style={styles.footer}>
                    <GlassButton
                        title="Delete Habit"
                        variant="danger"
                        icon={<Trash2 size={20} color="#ef4444" />}
                        onPress={handleDelete}
                    />
                </View>
            )}
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 12,
        marginLeft: 4,
    },
    presetRow: {
        gap: 10,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    presetChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1.5,
        gap: 6,
    },
    presetIcon: {
        fontSize: 16,
    },
    presetTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    iconRow: {
        gap: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: LiquidGlass.radius.lg,
        // @ts-ignore
        cornerCurve: 'continuous',
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 24,
    },
    iconSelected: {
        borderWidth: 3,
        borderColor: '#fff',
    },
    inputRow: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: LiquidGlass.radius.lg,
        // @ts-ignore
        cornerCurve: 'continuous',
        padding: 4,
        minHeight: 52,
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: LiquidGlass.spacing.md,
        borderRadius: 20,
    },
    counterButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterCenter: {
        alignItems: 'center',
    },
    counterValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
    },
    counterUnit: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 2,
    },
    input: {
        flex: 1,
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
        padding: LiquidGlass.spacing.md,
    },
    footer: {
        marginTop: 20,
        marginBottom: 40,
    },
});
