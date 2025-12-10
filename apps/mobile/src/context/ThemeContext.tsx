import { useHabit } from '@habitapp/shared';
import React, { createContext, useContext, useMemo } from 'react';

import { LiquidGlass } from '../theme/theme';

/**
 * Theme context that provides dynamic colors based on the pet's color.
 * Only Settings and Tab Bar should use this for accent colors.
 * Habit cards should keep their own individual colors.
 */

interface ThemeColors {
    accent: string;
    accentLight: string;
}

interface ThemeContextType {
    colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default accent if no pet exists
const DEFAULT_ACCENT = LiquidGlass.colors.primary;

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { pet } = useHabit();

    const colors = useMemo<ThemeColors>(() => {
        const accent = pet?.color || DEFAULT_ACCENT;
        // Create a lighter version for hover states, etc.
        const accentLight = accent + '40'; // 25% opacity version

        return {
            accent,
            accentLight,
        };
    }, [pet?.color]);

    return <ThemeContext.Provider value={{ colors }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        // Fallback if used outside provider (shouldn't happen in prod)
        return { colors: { accent: DEFAULT_ACCENT, accentLight: DEFAULT_ACCENT + '40' } };
    }
    return context;
};
