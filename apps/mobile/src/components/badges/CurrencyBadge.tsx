import { Zap } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface CurrencyBadgeProps {
    amount: number;
    size?: 'sm' | 'md' | 'lg';
    style?: ViewStyle;
}

export const CurrencyBadge: React.FC<CurrencyBadgeProps> = ({ amount, size = 'md', style }) => {
    // Size Mapping
    const iconSize = size === 'sm' ? 14 : size === 'md' ? 16 : 20;
    const fontSize = size === 'sm' ? 14 : size === 'md' ? 16 : 20;

    return (
        <View style={[styles.container, style]}>
            <Zap size={iconSize} color="#facc15" fill="#facc15" />
            <Text style={[styles.text, { fontSize }]}>
                {amount.toLocaleString()}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    text: {
        fontWeight: '700',
        color: '#facc15',
    },
});
