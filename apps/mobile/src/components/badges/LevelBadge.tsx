import { Star } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface LevelBadgeProps {
    level: number;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'minimal' | 'filled'; // minimal = icon+text, filled = pill bg
    style?: ViewStyle;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
    level,
    size = 'md',
    variant = 'minimal',
    style
}) => {
    const iconSize = size === 'sm' ? 14 : size === 'md' ? 16 : 20;
    const fontSize = size === 'sm' ? 14 : size === 'md' ? 16 : 20;

    return (
        <View style={[
            styles.container,
            variant === 'filled' && styles.filledContainer,
            style
        ]}>
            <Star size={iconSize} color="#d8b4fe" fill="#d8b4fe" />
            <Text style={[styles.text, { fontSize }]}>
                {variant === 'filled' ? `LEVEL ${level}` : `Lvl ${level}`}
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
    filledContainer: {
        backgroundColor: 'rgba(216, 180, 254, 0.15)', // Lighter purple tint
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    text: {
        fontWeight: '700',
        color: '#d8b4fe', // Lighter purple text
    },
});
