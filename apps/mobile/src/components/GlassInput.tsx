import { SafeLiquidGlassView as LiquidGlassView } from './SafeLiquidGlassView';
import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, StyleProp, ViewStyle, TextStyle } from 'react-native';

import { LiquidGlass } from '../theme/theme';

interface GlassInputProps extends TextInputProps {
    label?: string;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    error?: string;
}

export const GlassInput: React.FC<GlassInputProps> = ({
    label,
    containerStyle,
    inputStyle,
    error,
    style,
    ...props
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, style]}>
                <LiquidGlassView style={StyleSheet.absoluteFill} interactive />
                <TextInput
                    style={[styles.input, error ? styles.inputError : null]}
                    placeholderTextColor={LiquidGlass.text.tertiary}
                    selectionColor={LiquidGlass.colors.white}
                    accessibilityLabel={label}
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: LiquidGlass.spacing.lg,
    },
    label: {
        fontSize: LiquidGlass.typography.size.caption1,
        fontWeight: LiquidGlass.typography.weight.bold,
        color: LiquidGlass.text.label,
        marginBottom: LiquidGlass.spacing.sm,
        marginLeft: LiquidGlass.spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    inputContainer: {
        borderRadius: LiquidGlass.radius.lg,
        overflow: 'hidden',
        // @ts-ignore
        cornerCurve: 'continuous',
    },
    input: {
        padding: LiquidGlass.spacing.lg,
        fontSize: LiquidGlass.typography.size.body,
        fontWeight: LiquidGlass.typography.weight.semibold,
        color: LiquidGlass.colors.white,
        borderWidth: 1,
        borderColor: LiquidGlass.colors.glassBorder,
    },
    inputError: {
        borderColor: LiquidGlass.colors.danger,
    },
    errorText: {
        color: LiquidGlass.colors.danger,
        fontSize: LiquidGlass.typography.size.caption1,
        marginTop: LiquidGlass.spacing.xs,
        marginLeft: LiquidGlass.spacing.xs,
    },
});
