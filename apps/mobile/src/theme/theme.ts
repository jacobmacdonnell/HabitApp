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
        bottomOffset: 8, // Float 8pt above home indicator (iOS 26)
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
        },
    },

    // Border Radius Scale - iOS 26 Standard
    radius: {
        xs: 4, // Progress bars, tiny elements
        sm: 8, // Small chips
        md: 12, // Buttons
        lg: 16, // Inputs, small cards
        xl: 20, // Pills, badges
        xxl: 24, // Cards, sheets
        pill: 28, // FAB (half of 56pt)
        dock: 34, // Navbar (half of 68pt)
        full: 9999, // Circular
    },

    // Card Specs - iOS 26 standard
    card: {
        borderRadius: 24,
        padding: 24,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        shadow: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
        },
    },

    // Typography Scale - iOS SF Pro aligned
    typography: {
        // Sizes
        size: {
            largeTitle: 34,
            title1: 28,
            title2: 22,
            title3: 20,
            headline: 17,
            body: 16,
            callout: 15,
            subheadline: 14,
            footnote: 13,
            caption1: 12,
            caption2: 11,
            micro: 10,
        },
        // Weights
        weight: {
            heavy: '800' as const,
            bold: '700' as const,
            semibold: '600' as const,
            medium: '500' as const,
            regular: '400' as const,
        },
    },

    // Spacing Scale
    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        xxl: 24,
        xxxl: 32,
    },

    // Screen padding (unified across all screens)
    screenPadding: 20,

    // Header constants (unified across all screens)
    header: {
        marginBottom: 24, // Space below header title
        titleSize: 34, // Header title font size
        titleWeight: '800' as const,
        titleColor: '#fff',
        titleLetterSpacing: -0.5,
        contentTopPadding: 24, // Extra padding above content after safe area (increased for more breathability)
    },

    // Text Colors
    text: {
        primary: '#fff',
        secondary: 'rgba(255,255,255,0.7)', // Boosted from 0.6
        tertiary: 'rgba(255,255,255,0.45)', // Boosted from 0.3 (was too faint)
        label: 'rgba(255,255,255,0.6)', // Boosted from 0.5
    },

    // Colors
    colors: {
        // Semantic Palette - Playful Theme
        primary: '#34C759', // Verified Green (Navbar, Complete)
        secondary: '#AF52DE', // Playful Purple (Accents, Toggles)
        tertiary: '#FF9500', // Playful Orange (Highlights)

        // System Colors
        white: '#ffffff',
        black: '#000000',
        danger: '#ef4444',
        success: '#34C759', // Match primary green
        warning: '#f59e0b',
        info: '#3b82f6',

        // UI Colors
        glassBorder: 'rgba(255,255,255,0.1)',
        glassBackground: 'rgba(255,255,255,0.1)',

        // Domain Specific
        xp: '#facc15', // Deprecated: Use currency
        levelUp: '#a855f7', // Purple for level up animations
        currency: '#facc15', // Sparks (Gold)
        growth: '#d8b4fe', // Level/XP (Lavender)
        sleep: '#c084fc', // Light purple for sleep
        health: '#f87171', // Health red
        achievement: '#facc15', // Major Milestone (Gold) - distinct from mere currency

        // Components
        card: 'rgba(255,255,255,0.08)',
        cardBorder: 'rgba(255,255,255,0.15)',
        surface: 'rgba(255,255,255,0.05)',
        surfaceHighlight: 'rgba(255,255,255,0.1)',
        border: 'rgba(255,255,255,0.1)',
    },

    // Settings Screen - Semantic Colors
    settings: {
        sound: '#6366f1', // Indigo - audio
        soundLight: 'rgba(99, 102, 241, 0.15)',
        notifications: '#3b82f6', // Blue - communication
        notificationsLight: 'rgba(59, 130, 246, 0.15)',
        streak: '#fb923c', // Orange - fire/urgency
        streakLight: 'rgba(251, 146, 60, 0.15)',
        pet: '#ef4444', // Red - attention
        petLight: 'rgba(239, 68, 68, 0.15)',
        time: '#8b5cf6', // Violet - schedule
        timeLight: 'rgba(139, 92, 246, 0.15)',
        sleep: '#c084fc', // Light purple - rest
        sleepLight: 'rgba(192, 132, 252, 0.15)',
        privacy: '#60a5fa', // Light blue - trust
        privacyLight: 'rgba(96, 165, 250, 0.15)',
        danger: '#ef4444', // Red - destructive
        dangerLight: 'rgba(239, 68, 68, 0.1)',
    },

    segmentedControl: {
        backgroundColor: 'transparent', // Fully invisible track
        height: 40,
        fontStyle: {
            color: 'rgba(255,255,255,0.5)',
            fontWeight: '600' as const,
            fontSize: 15,
        },
        activeFontStyle: {
            color: '#fff',
            fontWeight: '700' as const,
            fontSize: 15,
        },
    },
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
