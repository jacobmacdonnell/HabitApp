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
            <TextInput
                style={[styles.input, error ? styles.inputError : null, style]}
                placeholderTextColor={LiquidGlass.text.tertiary}
                selectionColor={LiquidGlass.colors.white}
                accessibilityLabel={label}
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: LiquidGlass.text.label,
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)', // Keep specific opacity or use glassBackground? glassBackground is 0.1. 0.05 is lighter.
        // Let's keep 0.05 as it was specific design. Or make a new token 'glassInput'.
        // For now, I'll stick to 0.05 manually or check if I should align it. 
        // User said "No visual changes", so 0.05 is safer if that was the look.
        // However, standardizing is Phase 3.
        // I'll keep 0.05 hardcoded for now or add to theme.
        // Let's use hardcoded for now to effectively "guarantee no visual change" where token doesn't match perfectly.
        borderRadius: 16,
        padding: 16,
        fontSize: 18,
        fontWeight: '600',
        color: LiquidGlass.colors.white,
        borderWidth: 1,
        borderColor: LiquidGlass.colors.glassBorder,
    },
    inputError: {
        borderColor: LiquidGlass.colors.danger,
    },
    errorText: {
        color: LiquidGlass.colors.danger,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    }
});
