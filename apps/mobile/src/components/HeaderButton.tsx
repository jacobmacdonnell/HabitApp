import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

interface HeaderButtonProps extends TouchableOpacityProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'cancel';
    color?: string;
}

export const HeaderButton: React.FC<HeaderButtonProps> = ({
    title,
    onPress,
    variant = 'secondary',
    color = '#FFFFFF',
    style,
    ...props
}) => {
    const isPrimary = variant === 'primary';

    // Font weight mapping
    const fontWeight = isPrimary ? '700' : '500';

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.6}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={[styles.container, style]}
            {...props}
        >
            <Text style={[styles.text, { fontWeight, color }]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
    },
});
