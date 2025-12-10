import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LiquidGlass } from '../theme/theme';

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
                            top: insets.top + 6, // Tighter to dynamic island area
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
        paddingVertical: 14,
        paddingHorizontal: 24,
        backgroundColor: '#000000', // Pure Black for max contrast
        borderRadius: 40,
        gap: 12,
        // Pro Shadow - subtle but sharp
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 20,
        zIndex: 9999,
        // Crisp Border
        borderWidth: 1.5, // Thicker border
        borderColor: 'rgba(255,255,255,0.2)', // Very visible rim
        minWidth: 180,
    },
    icon: {
        fontSize: 22, // Larger icon
    },
    message: {
        fontSize: 16,
        fontWeight: '700', // Bolder text
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: -0.3,
    },
});
