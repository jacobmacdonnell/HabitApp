import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LiquidGlass } from '../theme/theme';
import { SafeLiquidGlassView } from './SafeLiquidGlassView';

const { width } = Dimensions.get('window');

interface ToastConfig {
    message: string;
    icon?: string; // Emoji icon
    duration?: number; // ms, default 4000
    type?: 'success' | 'info' | 'warning' | 'error';
}

interface ToastContextType {
    showToast: (config: ToastConfig) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const insets = useSafeAreaInsets();
    const [toast, setToast] = useState<ToastConfig | null>(null);
    const translateY = useRef(new Animated.Value(-60)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.9)).current;
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showToast = useCallback((config: ToastConfig) => {
        // Clear any existing timeout
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }

        // Reset position
        translateY.setValue(-60);
        opacity.setValue(0);
        scale.setValue(0.9);

        // Set toast content
        setToast(config);

        // Animate in - Snappy, mechanical entry (Pro feel)
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 110, // Faster entry
                friction: 14, // No bounce, precise stop
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 150, // Fast fade
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
                tension: 120,
                friction: 14,
            }),
        ]).start();

        // Schedule hide
        const duration = config.duration ?? 4000;
        hideTimeoutRef.current = setTimeout(() => {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: -60,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => setToast(null));
        }, duration);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <Animated.View
                    style={[
                        styles.container,
                        {
                            top: insets.top + 12, // More breathing room
                            opacity,
                            transform: [{ translateY }, { scale }],
                        },
                    ]}
                    pointerEvents="none"
                >
                    {toast.icon && <Text style={styles.icon}>{toast.icon}</Text>}
                    <Text style={styles.message}>{toast.message}</Text>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        backgroundColor: '#2C2C2E', // Solid Elevated Dark (No transparency)
        borderRadius: LiquidGlass.radius.pill,
        gap: 12,
        zIndex: 9999,
        minWidth: 200,

        // Neon Glow Shadow (Outer Glow)
        shadowColor: LiquidGlass.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5, // Slightly softer to match blend
        shadowRadius: 20, // Wider dispersion
        elevation: 12,

        // Soft Border (Blends with glow)
        borderWidth: 1, // Thinner
        borderColor: 'rgba(52, 199, 89, 0.5)', // 50% Opacity Primary Green (Blends into glow)
    },
    icon: {
        fontSize: 24,
        color: LiquidGlass.colors.primary,
    },
    message: {
        fontSize: 17,
        fontWeight: '700',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: -0.3,
    },
});
