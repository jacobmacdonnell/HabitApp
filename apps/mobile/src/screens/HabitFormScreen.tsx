import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Button } from 'react-native';
import { useHabit, Habit } from '@habitapp/shared';
import { HABIT_COLORS, HABIT_ICONS } from '@habitapp/shared/src/constants';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Trash2, Minus, Plus } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type ParamList = {
    HabitForm: { habit?: Habit };
};

export const HabitFormScreen = () => {
    const { addHabit, updateHabit, deleteHabit } = useHabit();
    const navigation = useNavigation();
    const route = useRoute<RouteProp<ParamList, 'HabitForm'>>();
    const editingHabit = route.params?.habit;

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
            timeOfDay: timeOfDay as any,
            frequency: { type: (frequencyIndex === 0 ? 'daily' : 'weekly') as 'daily' | 'weekly', days: [] },
            targetCount,
        };

        if (editingHabit) {
            updateHabit(editingHabit.id, habitData);
        } else {
            addHabit(habitData);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: editingHabit ? 'Edit Habit' : 'New Habit',
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ paddingHorizontal: 16 }}
                >
                    <Text style={{ color: '#fff', fontSize: 17, textAlign: 'center' }}>Cancel</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity
                    onPress={handleSave}
                    style={{ paddingHorizontal: 16 }}
                >
                    <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600', textAlign: 'center' }}>Save</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, editingHabit, title, color, icon, timeOfDay, frequencyIndex, targetCount]);

    const handleDelete = () => {
        if (!editingHabit) return;
        Alert.alert(
            'Delete Habit',
            'Are you sure you want to delete this habit?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteHabit(editingHabit.id);
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">

                    {/* Title Input */}
                    <View style={styles.section}>
                        <Text style={styles.label}>HABIT TITLE</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Drink Water"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    {/* Daily Target */}
                    <View style={styles.section}>
                        <Text style={styles.label}>DAILY TARGET</Text>
                        <View style={styles.inputRow}>
                            <TouchableOpacity
                                style={styles.stepperBtn}
                                onPress={() => setTargetCount(Math.max(1, targetCount - 1))}
                                activeOpacity={0.7}
                            >
                                <Minus size={24} color="#fff" strokeWidth={2.5} />
                            </TouchableOpacity>

                            <Text style={styles.targetValue}>{targetCount}</Text>

                            <TouchableOpacity
                                style={styles.stepperBtn}
                                onPress={() => setTargetCount(targetCount + 1)}
                                activeOpacity={0.7}
                            >
                                <Plus size={24} color="#fff" strokeWidth={2.5} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Time of Day */}
                    <View style={styles.section}>
                        <Text style={styles.label}>TIME OF DAY</Text>
                        <SegmentedControl
                            values={['Anytime', 'Morning', 'Noon', 'Evening']}
                            selectedIndex={['anytime', 'morning', 'midday', 'evening'].indexOf(timeOfDay)}
                            onChange={(event) => {
                                const index = event.nativeEvent.selectedSegmentIndex;
                                const times = ['anytime', 'morning', 'midday', 'evening'] as const;
                                setTimeOfDay(times[index]);
                            }}
                            appearance="dark"
                        />
                    </View>

                    {/* Icon Picker */}
                    <View style={styles.section}>
                        <Text style={styles.label}>ICON</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconRow}>
                            {HABIT_ICONS.map(i => (
                                <TouchableOpacity
                                    key={i}
                                    style={[
                                        styles.iconButton,
                                        icon === i && { backgroundColor: color },
                                        icon === i && styles.iconSelected
                                    ]}
                                    onPress={() => setIcon(i)}
                                >
                                    <Text style={styles.iconText}>{i}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Color Picker */}
                    <View style={styles.section}>
                        <Text style={styles.label}>COLOR</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorRow}>
                            {HABIT_COLORS.map(c => (
                                <TouchableOpacity
                                    key={c}
                                    style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorSelected]}
                                    onPress={() => setColor(c)}
                                />
                            ))}
                        </ScrollView>
                    </View>

                </ScrollView>
                {editingHabit && (
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                            <Trash2 size={20} color="#ef4444" />
                            <Text style={styles.deleteText}>Delete Habit</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c1e', // Modal background
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
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
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 18,
    },
    colorRow: {
        gap: 12,
        paddingVertical: 10,
    },
    colorDot: {
        width: 44,
        height: 44,
        borderRadius: 12, // Square to match icons
        borderWidth: 3,
        borderColor: 'transparent',
    },
    colorSelected: {
        borderColor: '#fff',
        // No scale to prevent clipping
    },
    iconRow: {
        gap: 12,
        paddingVertical: 4,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.1)', // Uniform background
        borderRadius: 12,
        padding: 4, // Tight padding for buttons
    },
    targetValue: {
        fontSize: 22,
        fontWeight: '600',
        color: '#fff',
        fontVariant: ['tabular-nums'],
    },
    stepperBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'transparent', // Blend into container
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 16,
        borderRadius: 16,
        gap: 8,
    },
    deleteText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: '600',
    },
});
