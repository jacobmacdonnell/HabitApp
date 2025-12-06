import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { GlassView } from 'expo-glass-effect';
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
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
    };

    const isPrimary = variant === 'primary';
    const isDanger = variant === 'danger';

    // Primary uses solid white, secondary/danger use glass effect
    if (isPrimary) {
        return (
            <View style={[styles.buttonContainer, disabled && styles.disabled, style]}>
                <RectButton
                    onPress={handlePress}
                    enabled={!disabled && !loading}
                    style={[styles.button, styles.primary]}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={title}
                >
                    {loading ? (
                        <ActivityIndicator color={LiquidGlass.colors.black} />
                    ) : (
                        <View style={styles.content}>
                            {icon}
                            <Text style={[styles.text, styles.primaryText, textStyle, icon ? { marginLeft: 8 } : null]}>
                                {title}
                            </Text>
                        </View>
                    )}
                </RectButton>
            </View>
        );
    }

    // Secondary and Danger variants use native glass effect
    return (
        <View style={[styles.buttonContainer, disabled && styles.disabled, style]}>
            <RectButton
                onPress={handlePress}
                enabled={!disabled && !loading}
                style={styles.rectButton}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={title}
            >
                <GlassView
                    glassEffectStyle="regular"
                    style={[
                        styles.button,
                        isDanger ? styles.danger : styles.secondary
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color={LiquidGlass.colors.white} />
                    ) : (
                        <View style={styles.content}>
                            {icon}
                            <Text style={[
                                styles.text,
                                isDanger ? styles.dangerText : styles.secondaryText,
                                textStyle,
                                icon ? { marginLeft: 8 } : null
                            ]}>
                                {title}
                            </Text>
                        </View>
                    )}
                </GlassView>
            </RectButton>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: LiquidGlass.radius.xxl,
        overflow: 'hidden',
    },
    rectButton: {
        borderRadius: LiquidGlass.radius.xxl,
        overflow: 'hidden',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: LiquidGlass.spacing.lg,
        paddingHorizontal: LiquidGlass.spacing.xxl,
        borderRadius: LiquidGlass.radius.xxl,
        minHeight: 56,
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        borderWidth: 1,
        borderColor: LiquidGlass.colors.glassBorder,
    },
    danger: {
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
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

