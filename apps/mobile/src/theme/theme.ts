import { Platform } from 'react-native';

export const LiquidGlass = {
    // Material Constants
    intensity: {
        heavy: 90,
        medium: 60,
        light: 40,
    },
    tint: {
        dark: 'systemThickMaterialDark',
        light: 'systemMaterialLight',
        default: 'default',
    },
    // Floating Dock Specs
    dock: {
        bottom: 20,
        horizontalPadding: 20,
        borderRadius: 34,
        height: 68,
        shadow: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 10,
            },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
        }
    },
    // Card Specs
    card: {
        borderRadius: 24,
        padding: 24,
        backgroundColor: 'rgba(255,255,255,0.08)', // Fallback / Overlay
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadow: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
        }
    },
    // Typography
    typography: {
        weights: {
            heavy: '800',
            bold: '700',
            semibold: '600',
            regular: '400',
        }
    }
} as const;
