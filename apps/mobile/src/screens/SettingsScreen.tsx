import { useHabit } from '@habitapp/shared';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Moon, Sun, Volume2, Bell, Shield, Trash2, ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NotificationService } from '../services/notifications';
import { LiquidGlass } from '../theme/theme';

export const SettingsScreen = () => {
    const { resetData, settings, updateSettings } = useHabit();

    const [notifications, setNotifications] = useState(settings.notifications ?? true);
    const [sound, setSound] = useState(settings.sound ?? true);

    const handleReset = () => {
        Alert.alert('Reset All Data', 'Are you sure? This will delete all your habits and pet progress.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: resetData },
        ]);
    };

    const onTimeChange = (type: 'bedtime' | 'wakeup', event: { type: string; nativeEvent: unknown }, date?: Date) => {
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

    const renderTimePicker = (
        label: string,
        time: string,
        type: 'bedtime' | 'wakeup',
        icon: React.ReactNode,
        color: string,
        bg: string
    ) => (
        <View style={styles.timeRow}>
            <View style={styles.iconLabel}>
                <View style={[styles.iconContainer, { backgroundColor: bg }]}>{icon}</View>
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
            <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.content]}
                contentInsetAdjustmentBehavior="automatic"
                bounces={true}
                alwaysBounceVertical={true}
            >
                {/* Custom Fixed Header */}
                <View style={[styles.headerRow, { marginTop: 20 }]}>
                    <Text style={styles.headerTitle}>Settings</Text>
                </View>

                {/* Preferences */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>PREFERENCES</Text>
                    <View style={[styles.card, { overflow: 'hidden' }]}>
                        <View style={{ position: 'relative', zIndex: 1 }}>
                            {/* Sound */}
                            <View style={styles.row}>
                                <View style={styles.iconLabel}>
                                    <View
                                        style={[
                                            styles.iconContainer,
                                            { backgroundColor: LiquidGlass.settings.soundLight },
                                        ]}
                                    >
                                        <Volume2 size={20} color={LiquidGlass.settings.sound} />
                                    </View>
                                    <Text style={styles.label}>Sound Effects</Text>
                                </View>
                                <Switch
                                    value={sound}
                                    onValueChange={handleSoundChange}
                                    trackColor={{ false: '#3e3e3e', true: LiquidGlass.settings.sound }}
                                    ios_backgroundColor="#3e3e3e"
                                    accessibilityLabel="Sound effects toggle"
                                    accessibilityRole="switch"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Notifications */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>NOTIFICATIONS</Text>
                    <View style={[styles.card, { overflow: 'hidden' }]}>
                        <View style={{ position: 'relative', zIndex: 1 }}>
                            {/* Master Toggle */}
                            <View style={styles.row}>
                                <View style={styles.iconLabel}>
                                    <View
                                        style={[
                                            styles.iconContainer,
                                            { backgroundColor: LiquidGlass.settings.notificationsLight },
                                        ]}
                                    >
                                        <Bell size={20} color={LiquidGlass.settings.notifications} />
                                    </View>
                                    <Text style={styles.label}>Enable Notifications</Text>
                                </View>
                                <Switch
                                    value={notifications}
                                    onValueChange={handleNotificationChange}
                                    trackColor={{ false: '#3e3e3e', true: LiquidGlass.settings.notifications }}
                                    ios_backgroundColor="#3e3e3e"
                                    accessibilityLabel="Notifications toggle"
                                    accessibilityRole="switch"
                                />
                            </View>

                            <View style={styles.separator} />

                            {/* Streak Reminders */}
                            <View style={[styles.row, !notifications && { opacity: 0.4 }]}>
                                <View style={styles.iconLabel}>
                                    <View
                                        style={[
                                            styles.iconContainer,
                                            { backgroundColor: LiquidGlass.settings.streakLight },
                                        ]}
                                    >
                                        <Text style={{ fontSize: 16 }}>🔥</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.label}>Streak Reminders</Text>
                                        <Text style={styles.sublabel}>Remind me if habits are incomplete</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={settings.streakReminders ?? false}
                                    onValueChange={(val) => updateSettings({ streakReminders: val })}
                                    trackColor={{ false: '#3e3e3e', true: LiquidGlass.settings.streak }}
                                    ios_backgroundColor="#3e3e3e"
                                    disabled={!notifications}
                                    accessibilityLabel="Streak reminders toggle"
                                    accessibilityRole="switch"
                                />
                            </View>

                            <View style={styles.separator} />

                            {/* Pet Alerts */}
                            <View style={[styles.row, !notifications && { opacity: 0.4 }]}>
                                <View style={styles.iconLabel}>
                                    <View
                                        style={[
                                            styles.iconContainer,
                                            { backgroundColor: LiquidGlass.settings.petLight },
                                        ]}
                                    >
                                        <Text style={{ fontSize: 16 }}>💔</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.label}>Pet Alerts</Text>
                                        <Text style={styles.sublabel}>Alert when pet needs attention</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={settings.petAlerts ?? false}
                                    onValueChange={(val) => updateSettings({ petAlerts: val })}
                                    trackColor={{ false: '#3e3e3e', true: LiquidGlass.settings.pet }}
                                    ios_backgroundColor="#3e3e3e"
                                    disabled={!notifications}
                                    accessibilityLabel="Pet alerts toggle"
                                    accessibilityRole="switch"
                                />
                            </View>

                            {/* Reminder Time - only show if streak reminders enabled */}
                            {notifications && settings.streakReminders && (
                                <>
                                    <View style={styles.separator} />
                                    <View style={styles.timeRow}>
                                        <View style={styles.iconLabel}>
                                            <View
                                                style={[
                                                    styles.iconContainer,
                                                    { backgroundColor: LiquidGlass.settings.timeLight },
                                                ]}
                                            >
                                                <Text style={{ fontSize: 16 }}>⏰</Text>
                                            </View>
                                            <Text style={styles.label}>Reminder Time</Text>
                                        </View>
                                        <DateTimePicker
                                            value={parseTime(settings.reminderTime || '20:00')}
                                            mode="time"
                                            display="compact"
                                            onChange={(e, d) => {
                                                if (d) {
                                                    const timeString = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
                                                    updateSettings({ reminderTime: timeString });
                                                }
                                            }}
                                            themeVariant="dark"
                                            style={{ height: 34 }}
                                        />
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </View>

                {/* Sleep Schedule */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>SLEEP SCHEDULE</Text>
                    <View style={[styles.card, { overflow: 'hidden' }]}>
                        <View style={{ position: 'relative', zIndex: 1 }}>
                            {renderTimePicker(
                                'Bedtime',
                                settings.sleepStart || '23:00',
                                'bedtime',
                                <Moon size={20} color={LiquidGlass.settings.sleep} />,
                                LiquidGlass.settings.sleep,
                                LiquidGlass.settings.sleepLight
                            )}
                            <View style={styles.separator} />
                            {renderTimePicker(
                                'Wake Up',
                                settings.sleepEnd || '07:00',
                                'wakeup',
                                <Sun size={20} color={LiquidGlass.settings.streak} />,
                                LiquidGlass.settings.streak,
                                LiquidGlass.settings.streakLight
                            )}
                        </View>
                    </View>
                </View>

                {/* Data & Privacy */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>DATA & PRIVACY</Text>
                    <View style={[styles.card, { overflow: 'hidden' }]}>
                        <View style={{ position: 'relative', zIndex: 1 }}>
                            <TouchableOpacity
                                style={styles.row}
                                accessibilityLabel="View privacy policy"
                                accessibilityRole="link"
                            >
                                <View style={styles.iconLabel}>
                                    <View
                                        style={[
                                            styles.iconContainer,
                                            { backgroundColor: LiquidGlass.settings.privacyLight },
                                        ]}
                                    >
                                        <Shield size={20} color={LiquidGlass.settings.privacy} />
                                    </View>
                                    <Text style={styles.label}>Privacy Policy</Text>
                                </View>
                                <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
                            </TouchableOpacity>

                            <View style={styles.separator} />

                            <TouchableOpacity
                                style={styles.row}
                                onPress={handleReset}
                                accessibilityLabel="Reset all data"
                                accessibilityRole="button"
                                accessibilityHint="Deletes all habits and pet progress"
                            >
                                <View style={styles.iconLabel}>
                                    <View
                                        style={[
                                            styles.iconContainer,
                                            { backgroundColor: LiquidGlass.settings.dangerLight },
                                        ]}
                                    >
                                        <Trash2 size={20} color={LiquidGlass.settings.danger} />
                                    </View>
                                    <Text style={[styles.label, { color: LiquidGlass.settings.danger }]}>
                                        Reset All Data
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <Text style={styles.footer}>Habit Companion v1.0.2 (iOS)</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: LiquidGlass.backgroundColor,
    },
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: LiquidGlass.screenPadding,
        paddingBottom: 40, // Reduced from 100 - just enough for footer
    },
    headerRow: {
        marginBottom: LiquidGlass.header.marginBottom,
    },
    headerTitle: {
        fontSize: LiquidGlass.header.titleSize,
        fontWeight: LiquidGlass.header.titleWeight,
        color: LiquidGlass.header.titleColor,
        letterSpacing: LiquidGlass.header.titleLetterSpacing,
    },
    section: {
        marginBottom: LiquidGlass.spacing.xxl,
    },
    sectionHeader: {
        fontSize: LiquidGlass.typography.size.caption1,
        fontWeight: LiquidGlass.typography.weight.bold,
        color: LiquidGlass.text.tertiary,
        marginBottom: LiquidGlass.spacing.sm,
        marginLeft: LiquidGlass.spacing.md,
    },
    card: {
        borderRadius: LiquidGlass.card.borderRadius,
        overflow: 'hidden',
        backgroundColor: LiquidGlass.colors.surface,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: LiquidGlass.spacing.lg,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: LiquidGlass.spacing.lg,
    },
    iconLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: LiquidGlass.spacing.md,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: LiquidGlass.radius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: LiquidGlass.typography.size.body,
        fontWeight: LiquidGlass.typography.weight.semibold,
        color: LiquidGlass.text.primary,
    },
    sublabel: {
        fontSize: LiquidGlass.typography.size.caption1,
        color: LiquidGlass.text.tertiary,
        marginTop: 2,
    },
    separator: {
        height: 1,
        backgroundColor: LiquidGlass.colors.border,
        marginLeft: 64,
    },
    footer: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.2)',
        fontSize: LiquidGlass.typography.size.footnote,
        fontWeight: '500',
        marginTop: LiquidGlass.spacing.xl,
    },
});
