import { Platform } from 'react-native';

export const LiquidGlass = {
    // Material Constants - Enhanced for iOS 26
    intensity: {
        heavy: 90,
        medium: 60,
        light: 40,
        ultraLight: 20,
    },
    tint: {
        dark: 'systemThickMaterialDark',
        light: 'systemMaterialLight',
        default: 'default',
    },
    // Global App Background
    backgroundColor: '#1c1c1e',
    // Floating Dock Specs - iOS 26 HIG aligned
    dock: {
        bottomOffset: 16, // Float 16pt above home indicator (iOS 26)
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
    // Card Specs - iOS 26 standard
    card: {
        borderRadius: 24,
        padding: 24,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)', // Slightly more visible in iOS 26
        shadow: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
        }
    },
    // Typography - iOS 26 SF Pro aligned
    typography: {
        weights: {
            heavy: '800',
            bold: '700',
            semibold: '600',
            regular: '400',
        }
    }
} as const;

// iOS 26 Specific - Glass Effect Styles
export const iOS26 = {
    // Glass effect styles for expo-glass-effect
    glass: {
        default: 'regular' as const,
        clear: 'clear' as const,
    },

    // Modal/Sheet presentation
    sheet: {
        cornerRadius: 24,
        grabberVisible: true,
    },

    // Blur intensities for BlurView fallback
    blur: {
        heavy: 80,
        medium: 50,
        light: 30,
    },

    // Minimum tap target (iOS HIG)
    minTapTarget: 44,

    // Separator inset for grouped lists
    separatorInset: 64,
} as const;
