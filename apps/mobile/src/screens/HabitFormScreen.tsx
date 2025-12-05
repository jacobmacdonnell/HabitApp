import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useHabit, Habit } from '@habitapp/shared';
import { HABIT_COLORS, HABIT_ICONS } from '@habitapp/shared/src/constants';
import { BlurView } from 'expo-blur';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { X, Check, Trash2 } from 'lucide-react-native';
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

        navigation.goBack();
    };

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
            <BlurView intensity={80} tint="dark" style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <X size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{editingHabit ? 'Edit Habit' : 'New Habit'}</Text>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Check size={24} color="#000" />
                </TouchableOpacity>
            </BlurView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>

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

                    {/* Icon Picker */}
                    <View style={styles.section}>
                        <Text style={styles.label}>ICON</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconRow}>
                            {HABIT_ICONS.map(i => (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.iconButton, icon === i && { backgroundColor: color }]}
                                    onPress={() => setIcon(i)}
                                >
                                    <Text style={styles.iconText}>{i}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
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
                            backgroundColor="rgba(255,255,255,0.1)"
                        />
                    </View>

                    {/* Target Count */}
                    <View style={styles.section}>
                        <Text style={styles.label}>DAILY TARGET: {targetCount}</Text>
                        <View style={styles.stepperContainer}>
                            <TouchableOpacity
                                style={styles.stepperButton}
                                onPress={() => setTargetCount(Math.max(1, targetCount - 1))}
                            >
                                <Text style={styles.stepperText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.targetValue}>{targetCount}</Text>
                            <TouchableOpacity
                                style={styles.stepperButton}
                                onPress={() => setTargetCount(targetCount + 1)}
                            >
                                <Text style={styles.stepperText}>+</Text>
                            </TouchableOpacity>
                        </View>
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
    header: {
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    saveButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
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
        paddingRight: 20,
    },
    colorDot: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 3,
        borderColor: 'transparent',
    },
    colorSelected: {
        borderColor: '#fff',
        transform: [{ scale: 1.1 }],
    },
    iconRow: {
        gap: 12,
        paddingRight: 20,
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
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 8,
    },
    stepperButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepperText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: '600',
    },
    targetValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        width: 40,
        textAlign: 'center',
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
