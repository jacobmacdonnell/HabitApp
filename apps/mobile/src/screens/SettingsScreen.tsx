import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useHabit } from '@habitapp/shared';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Moon, Sun, Volume2, Bell, Shield, Trash2, ChevronRight, Smartphone } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

export const SettingsScreen = () => {
    const { resetData, settings, updateSettings } = useHabit();
    const [notifications, setNotifications] = useState(settings.notifications ?? true);
    const [sound, setSound] = useState(settings.sound ?? true);
    const [theme, setTheme] = useState<'auto' | 'light' | 'dark'>(settings.theme || 'auto');

    const handleReset = () => {
        Alert.alert(
            'Reset All Data',
            'Are you sure? This will delete all your habits and pet progress.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: resetData },
            ]
        );
    };

    const onTimeChange = (type: 'bedtime' | 'wakeup', event: any, date?: Date) => {
        if (date) {
            const timeString = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            if (type === 'bedtime') {
                updateSettings({ sleepStart: timeString });
            } else {
                updateSettings({ sleepEnd: timeString });
            }
        }
    };

    const parseTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
    };

    const handleThemeChange = (newTheme: 'auto' | 'light' | 'dark') => {
        setTheme(newTheme);
        updateSettings({ theme: newTheme });
    };

    const handleNotificationChange = (val: boolean) => {
        setNotifications(val);
        updateSettings({ notifications: val });
    };

    const handleSoundChange = (val: boolean) => {
        setSound(val);
        updateSettings({ sound: val });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerTitle}>Settings</Text>

            {/* Preferences */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>PREFERENCES</Text>
                <BlurView intensity={20} tint="dark" style={styles.card}>
                    {/* Theme Selector */}
                    <View style={styles.row}>
                        <View style={styles.iconLabel}>
                            <View style={[styles.iconContainer, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
                                <Moon size={20} color="#818cf8" />
                            </View>
                            <Text style={styles.label}>Appearance</Text>
                        </View>
                    </View>

                    <View style={styles.segmentContainer}>
                        {/* Custom Segmented Control for Theme */}
                        {['auto', 'light', 'dark'].map((t) => (
                            <TouchableOpacity
                                key={t}
                                onPress={() => handleThemeChange(t as any)}
                                style={[styles.segmentButton, theme === t && styles.segmentActive]}
                            >
                                {t === 'auto' && <Smartphone size={16} color={theme === t ? '#fff' : 'rgba(255,255,255,0.5)'} />}
                                {t === 'light' && <Sun size={16} color={theme === t ? '#fff' : 'rgba(255,255,255,0.5)'} />}
                                {t === 'dark' && <Moon size={16} color={theme === t ? '#fff' : 'rgba(255,255,255,0.5)'} />}
                                <Text style={[styles.segmentText, theme === t && styles.segmentTextActive]}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.separator} />

                    {/* Sound */}
                    <View style={styles.row}>
                        <View style={styles.iconLabel}>
                            <View style={[styles.iconContainer, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
                                <Volume2 size={20} color="#f472b6" />
                            </View>
                            <Text style={styles.label}>Sound Effects</Text>
                        </View>
                        <Switch
                            value={sound}
                            onValueChange={handleSoundChange}
                            trackColor={{ false: '#3e3e3e', true: '#6366f1' }}
                            ios_backgroundColor="#3e3e3e"
                        />
                    </View>

                    <View style={styles.separator} />

                    {/* Notifications */}
                    <View style={styles.row}>
                        <View style={styles.iconLabel}>
                            <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                                <Bell size={20} color="#34d399" />
                            </View>
                            <Text style={styles.label}>Notifications</Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={handleNotificationChange}
                            trackColor={{ false: '#3e3e3e', true: '#6366f1' }}
                            ios_backgroundColor="#3e3e3e"
                        />
                    </View>
                </BlurView>
            </View>

            {/* Sleep Schedule */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>SLEEP SCHEDULE</Text>
                <BlurView intensity={20} tint="dark" style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.iconLabel}>
                            <View style={[styles.iconContainer, { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}>
                                <Moon size={20} color="#c084fc" />
                            </View>
                            <View>
                                <Text style={styles.label}>Pet Sleep Schedule</Text>
                                <Text style={styles.subLabel}>Your pet will sleep during these hours</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.pickerRow}>
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerLabel}>BEDTIME</Text>
                            <DateTimePicker
                                value={parseTime(settings.sleepStart)}
                                mode="time"
                                display="compact"
                                onChange={(e, date) => onTimeChange('bedtime', e, date)}
                                themeVariant="dark"
                                style={{ width: 100 }}
                            />
                        </View>
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerLabel}>WAKE UP</Text>
                            <DateTimePicker
                                value={parseTime(settings.sleepEnd)}
                                mode="time"
                                display="compact"
                                onChange={(e, date) => onTimeChange('wakeup', e, date)}
                                themeVariant="dark"
                                style={{ width: 100 }}
                            />
                        </View>
                    </View>
                </BlurView>
            </View>

            {/* Data & Privacy */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>DATA & PRIVACY</Text>
                <BlurView intensity={20} tint="dark" style={styles.card}>
                    <TouchableOpacity style={styles.row}>
                        <View style={styles.iconLabel}>
                            <View style={[styles.iconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                                <Shield size={20} color="#60a5fa" />
                            </View>
                            <Text style={styles.label}>Privacy Policy</Text>
                        </View>
                        <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    <TouchableOpacity style={styles.row} onPress={handleReset}>
                        <View style={styles.iconLabel}>
                            <View style={[styles.iconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                                <Trash2 size={20} color="#ef4444" />
                            </View>
                            <Text style={[styles.label, { color: '#ef4444' }]}>Reset All Data</Text>
                        </View>
                    </TouchableOpacity>
                </BlurView>
            </View>

            <Text style={styles.footer}>Habit Companion v1.0.2 (iOS)</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 100,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 8,
        marginLeft: 12,
    },
    card: {
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    iconLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    subLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginLeft: 64,
    },
    segmentContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.3)',
        margin: 16,
        padding: 4,
        borderRadius: 12,
    },
    segmentButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    segmentActive: {
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    segmentText: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.5)',
    },
    segmentTextActive: {
        color: '#fff',
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: 0,
    },
    pickerContainer: {
        alignItems: 'center',
        gap: 8,
    },
    pickerLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
    },
    footer: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.2)',
        fontSize: 13,
        fontWeight: '500',
        marginTop: 20,
    },
});
