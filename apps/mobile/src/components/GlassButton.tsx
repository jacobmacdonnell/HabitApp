import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator, StyleProp, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LiquidGlassView } from '@callstack/liquid-glass';
import { LiquidGlass } from '../theme/theme';

interface GlassButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    icon,
    style,
    textStyle
}) => {
    const handlePress = () => {
        if (disabled || loading) return;
        Haptics.selectionAsync();
        onPress();
    };



    const getTextStyle = () => {
        switch (variant) {
            case 'primary':
                return styles.primaryText;
            case 'danger':
                return styles.dangerText;
            default:
                return styles.secondaryText;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                // Apply layout/size styles to valid container
                variant === 'primary' && styles.primary,
                variant === 'danger' && styles.danger,
                variant === 'secondary' && styles.secondaryBorder,
                disabled && styles.disabled,
                style
            ]}
            onPress={handlePress}
            activeOpacity={0.8}
            disabled={disabled || loading}
            accessibilityRole="button"
            accessibilityLabel={title}
            accessibilityState={{ disabled: disabled || loading }}
        >
            {variant === 'secondary' && (
                <View style={[StyleSheet.absoluteFill, { borderRadius: LiquidGlass.radius.xxl, overflow: 'hidden' }]}>
                    <LiquidGlassView style={StyleSheet.absoluteFill} interactive={true} />
                </View>
            )}

            <View style={styles.contentContainer}>
                {loading ? (
                    <ActivityIndicator color={variant === 'primary' ? LiquidGlass.colors.black : LiquidGlass.colors.white} />
                ) : (
                    <>
                        {icon}
                        <Text style={[styles.text, getTextStyle(), textStyle, icon ? { marginLeft: 8 } : null]}>
                            {title}
                        </Text>
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: LiquidGlass.spacing.lg,
        paddingHorizontal: LiquidGlass.spacing.xxl,
        borderRadius: LiquidGlass.radius.xxl,
        minHeight: 56,
    },
    disabled: {
        opacity: 0.5,
    },
    primary: {
        backgroundColor: LiquidGlass.colors.white,
        shadowColor: LiquidGlass.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    secondaryBorder: {
        borderWidth: 1,
        borderColor: LiquidGlass.colors.glassBorder,
        borderRadius: LiquidGlass.radius.xxl,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    secondary: {
        // Background handled by LiquidGlassView
    },
    danger: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    text: {
        fontSize: LiquidGlass.typography.size.body,
        fontWeight: LiquidGlass.typography.weight.bold,
        textAlign: 'center',
    },
    primaryText: {
        color: LiquidGlass.colors.black,
    },
    secondaryText: {
        color: LiquidGlass.colors.white,
    },
    dangerText: {
        color: LiquidGlass.colors.danger,
    }
});
