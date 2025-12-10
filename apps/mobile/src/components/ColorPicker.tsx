import { Check } from 'lucide-react-native';
import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

import { ScalePressable } from './ScalePressable';
import { LiquidGlass } from '../theme/theme';

interface ColorPickerProps {
    /** Array of hex color strings to display */
    colors: string[];
    /** Currently selected color */
    selectedColor: string;
    /** Callback when a color is selected */
    onColorSelect: (color: string) => void;
    /** Whether to use horizontal scroll (for many colors) or wrap (for few colors) */
    variant?: 'scroll' | 'wrap';
    /** Show a glow effect on selected color (use for onboarding) */
    showGlow?: boolean;
}

/**
 * A reusable color picker component with consistent styling across the app.
 *
 * Features:
 * - White checkmark indicator on selected color
 * - Optional glow effect for special contexts (onboarding)
 * - Two variants: scroll (horizontal) or wrap (grid layout)
 * - Haptic feedback on selection
 * - Scale animation on press
 */
export const ColorPicker = ({
    colors,
    selectedColor,
    onColorSelect,
    variant = 'scroll',
    showGlow = false,
}: ColorPickerProps) => {
    const handleSelect = (color: string) => {
        Haptics.selectionAsync();
        onColorSelect(color);
    };

    const renderColorDots = () => (
        <>
            {colors.map((color) => (
                <ScalePressable
                    key={color}
                    style={[
                        styles.colorDot,
                        { backgroundColor: color },
                        selectedColor === color && styles.colorSelected,
                        selectedColor === color && showGlow && styles.colorGlow,
                    ]}
                    onPress={() => handleSelect(color)}
                    accessibilityLabel={`Select color ${color}`}
                    accessibilityRole="radio"
                    scaleOnPress={0.9}
                >
                    {selectedColor === color && <Check size={18} color="#fff" strokeWidth={3} />}
                </ScalePressable>
            ))}
        </>
    );

    if (variant === 'scroll') {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                style={styles.scrollContainer}
            >
                {renderColorDots()}
            </ScrollView>
        );
    }

    return <View style={styles.wrapContainer}>{renderColorDots()}</View>;
};

const styles = StyleSheet.create({
    scrollContainer: {
        marginHorizontal: -12,
    },
    scrollContent: {
        gap: LiquidGlass.spacing.md,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    wrapContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: LiquidGlass.spacing.sm,
    },
    colorDot: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 3,
        borderColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorSelected: {
        borderColor: '#fff',
    },
    colorGlow: {
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
    },
});
