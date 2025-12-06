import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useHabit } from '@habitapp/shared';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Moon, Sun, Volume2, Bell, Shield, Trash2, ChevronRight } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { GlassView } from 'expo-glass-effect';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NotificationService } from '../services/notifications';

export const SettingsScreen = () => {
    const { resetData, settings, updateSettings } = useHabit();
    const [notifications, setNotifications] = useState(settings.notifications ?? true);
    const [sound, setSound] = useState(settings.sound ?? true);

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
        if (!timeString) return new Date();
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
    };

    const handleNotificationChange = async (val: boolean) => {
        if (val) {
            const granted = await NotificationService.registerForPushNotificationsAsync();
            if (!granted) {
                Alert.alert(
                    'Permissions Required',
                    'Please enable notifications in your phone settings to receive updates.',
                    [{ text: 'OK' }]
                );
                setNotifications(false);
                updateSettings({ notifications: false });
                return;
            }
        } else {
            // Optional: Cancel all notifications if turned off
            await NotificationService.cancelAllNotifications();
        }

        setNotifications(val);
        updateSettings({ notifications: val });
    };

    const handleSoundChange = (val: boolean) => {
        setSound(val);
        updateSettings({ sound: val });
    };

    const insets = useSafeAreaInsets();

    const renderTimePicker = (label: string, time: string, type: 'bedtime' | 'wakeup', icon: any, color: string, bg: string) => (
        <View style={styles.timeRow}>
            <View style={styles.iconLabel}>
                <View style={[styles.iconContainer, { backgroundColor: bg }]}>
                    {icon}
                </View>
                <Text style={styles.label}>{label}</Text>
            </View>
            <DateTimePicker
                value={parseTime(time)}
                mode="time"
                display="compact"
                onChange={(e, d) => onTimeChange(type, e, d)}
                themeVariant="dark"
                style={{ height: 34 }}
            />
        </View>
    );

    return (
        <View style={styles.wrapper}>
            {/* Ambient Background */}
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

            <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.content, { paddingTop: insets.top }]}
                contentInsetAdjustmentBehavior="automatic"
            >
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>Settings</Text>
                </View>

                {/* Preferences */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>PREFERENCES</Text>
                    <GlassView glassEffectStyle="regular" style={styles.card}>
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
                    </GlassView>
                </View>

                {/* Sleep Schedule */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>SLEEP SCHEDULE</Text>
                    <GlassView glassEffectStyle="regular" style={styles.card}>
                        {renderTimePicker('Bedtime', settings.sleepStart || '23:00', 'bedtime', <Moon size={20} color="#c084fc" />, '#c084fc', 'rgba(168, 85, 247, 0.2)')}
                        <View style={styles.separator} />
                        {renderTimePicker('Wake Up', settings.sleepEnd || '07:00', 'wakeup', <Sun size={20} color="#fbbf24" />, '#fbbf24', 'rgba(251, 191, 36, 0.2)')}
                    </GlassView>
                </View>

                {/* Data & Privacy */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>DATA & PRIVACY</Text>
                    <GlassView glassEffectStyle="regular" style={styles.card}>
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
                    </GlassView>
                </View>

                <Text style={styles.footer}>Habit Companion v1.0.2 (iOS)</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#1c1c1e',
    },
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    headerRow: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5,
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
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    timeRow: {
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
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginLeft: 64,
    },
    footer: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.2)',
        fontSize: 13,
        fontWeight: '500',
        marginTop: 20,
    },
});
