import { Coffee, Trophy, Sparkles } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { LiquidGlass } from '../theme/theme';

interface EmptyStateProps {
    type: 'empty' | 'all-done';
    message?: string;
}

export const EmptyState = ({ type, message }: EmptyStateProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconCircle}>
                {type === 'all-done' ? (
                    <Trophy size={32} color={LiquidGlass.colors.primary} />
                ) : (
                    <Coffee size={32} color={LiquidGlass.colors.secondary} />
                )}
            </View>
            <Text style={styles.title}>{type === 'all-done' ? 'All Wrapped Up!' : 'Nothing Here'}</Text>
            <Text style={styles.subtitle}>
                {message ||
                    (type === 'all-done'
                        ? "You've crushed all your habits for now. Time to relax!"
                        : 'No habits scheduled for this time. Enjoy the quiet.')}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 40,
        gap: 12,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        lineHeight: 20,
    },
});
