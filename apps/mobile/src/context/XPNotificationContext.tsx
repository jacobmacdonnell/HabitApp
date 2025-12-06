import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Zap } from 'lucide-react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useHabit } from '@habitapp/shared';

interface XPNotification {
    id: string;
    amount: number;
    opacity: Animated.Value;
    translateY: Animated.Value;
    scale: Animated.Value;
}

interface XPNotificationContextType {
    showXP: (amount: number) => void;
}

const XPNotificationContext = createContext<XPNotificationContextType | null>(null);

export const useXPNotification = () => {
    const context = useContext(XPNotificationContext);
    if (!context) {
        throw new Error('useXPNotification must be used within XPNotificationProvider');
    }
    return context;
};

const { width, height } = Dimensions.get('window');

export const XPNotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<XPNotification[]>([]);
    const idCounter = useRef(0);
    const { settings } = useHabit();

    // Play XP sound effect (respects settings)
    const playXPSound = async () => {
        // Check if sound is enabled in settings
        if (!settings.sound) return;

        try {
            const { sound } = await Audio.Sound.createAsync(
                { uri: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3' },
                { shouldPlay: true, volume: 0.5 }
            );
            // Unload after playing
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.log('Sound playback error:', error);
        }
    };

    const showXP = useCallback((amount: number) => {
        // Play sound and double haptic for extra satisfaction
        playXPSound();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 100);

        const id = `xp-${idCounter.current++}`;
        const opacity = new Animated.Value(0);
        const translateY = new Animated.Value(30);
        const scale = new Animated.Value(0.5); // Start smaller for bigger pop

        const notification: XPNotification = { id, amount, opacity, translateY, scale };

        setNotifications(prev => [...prev, notification]);

        // Animate in with overshoot bounce
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                friction: 6,
                tension: 120,
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1.1, // Overshoot then settle
                friction: 4,
                tension: 180,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Settle back to 1.0
            Animated.spring(scale, {
                toValue: 1,
                friction: 6,
                tension: 100,
                useNativeDriver: true,
            }).start();
        });

        // Animate out quickly
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: -20,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 0.8,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            });
        }, 700);
    }, []);

    return (
        <XPNotificationContext.Provider value={{ showXP }}>
            {children}

            {/* Global XP Notification Overlay - Centered */}
            <View style={styles.overlay} pointerEvents="none">
                {notifications.map((notification) => (
                    <Animated.View
                        key={notification.id}
                        style={[
                            styles.notification,
                            {
                                opacity: notification.opacity,
                                transform: [
                                    { translateY: notification.translateY },
                                    { scale: notification.scale },
                                ],
                            },
                        ]}
                    >
                        <Zap size={22} color="#1a1a1a" fill="#1a1a1a" />
                        <Text style={styles.xpText}>+{notification.amount} XP</Text>
                    </Animated.View>
                ))}
            </View>
        </XPNotificationContext.Provider>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    notification: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#facc15',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 28,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    xpText: {
        fontSize: 22,
        color: '#1a1a1a',
        fontWeight: '800',
    },
});
