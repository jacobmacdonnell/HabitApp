import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
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

    const getVariantStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.secondary;
            case 'danger':
                return styles.danger;
            default:
                return styles.primary;
        }
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
                getVariantStyle(),
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
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 24,
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
    secondary: {
        backgroundColor: LiquidGlass.colors.glassBackground,
        borderWidth: 1,
        borderColor: LiquidGlass.colors.glassBorder,
    },
    danger: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)', // Custom opacity for danger bg, keep or add token?
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
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
