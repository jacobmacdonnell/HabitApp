export const HABIT_COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#FFE66D', // Yellow
    '#FF8C42', // Orange
    '#A06CD5', // Purple
    '#FF99CC', // Pink
    '#3B82F6', // Blue
    '#10B981', // Green
    '#6366f1', // Indigo (Web default)
    '#8b5cf6', // Violet
    '#d946ef', // Fuchsia
    '#f43f5e', // Rose
];

export const HABIT_ICONS = [
    '✨',
    '💪',
    '📚',
    '🧘',
    '💧',
    '🏃',
    '🎯',
    '💤',
    '🥗',
    '📝',
    '💊',
    '🧹',
    '🎨',
    '🎸',
    '💰', // Additional from mobile
];

export const HAT_ITEMS = [
    { id: 'none', name: 'No Hat', price: 0, icon: '🚫' },
    { id: 'party', name: 'Party Hat', price: 50, icon: '🎉' },
    { id: 'cowboy', name: 'Cowboy Hat', price: 150, icon: '🤠' },
    { id: 'tophat', name: 'Gentleman', price: 300, icon: '🎩' },
    { id: 'crown', name: 'Royal Crown', price: 1000, icon: '👑' },
];

export const HABIT_PRESETS = [
    { id: 'water', title: 'Drink Water', icon: '💧', color: '#4ECDC4', defaultTarget: 8, defaultTime: 'anytime' },
    { id: 'exercise', title: 'Exercise', icon: '💪', color: '#FF6B6B', defaultTarget: 1, defaultTime: 'morning' },
    { id: 'read', title: 'Read', icon: '📚', color: '#FFE66D', defaultTarget: 1, defaultTime: 'evening' },
    { id: 'meditate', title: 'Meditate', icon: '🧘', color: '#A06CD5', defaultTarget: 1, defaultTime: 'morning' },
    { id: 'sleep', title: 'Sleep 8 hours', icon: '😴', color: '#6366f1', defaultTarget: 1, defaultTime: 'evening' },
    { id: 'vitamins', title: 'Take Vitamins', icon: '💊', color: '#10B981', defaultTarget: 1, defaultTime: 'morning' },
    { id: 'walk', title: 'Take a Walk', icon: '👣', color: '#FF8C42', defaultTarget: 1, defaultTime: 'anytime' },
    { id: 'journal', title: 'Journal', icon: '✍️', color: '#FF99CC', defaultTarget: 1, defaultTime: 'evening' },
    { id: 'stretch', title: 'Stretch', icon: '🤸', color: '#3B82F6', defaultTarget: 1, defaultTime: 'morning' },
    { id: 'learn', title: 'Learn Something', icon: '🧠', color: '#8b5cf6', defaultTarget: 1, defaultTime: 'anytime' },
    { id: 'practice', title: 'Practice Skill', icon: '🎯', color: '#d946ef', defaultTarget: 1, defaultTime: 'anytime' },
    { id: 'tidy', title: 'Tidy Up', icon: '🧹', color: '#f43f5e', defaultTarget: 1, defaultTime: 'evening' },
];

// Navigation Routes (for expo-router)
export const ROUTES = {
    // Tabs
    HOME: '/(tabs)',
    TRENDS: '/(tabs)/trends',
    PET: '/(tabs)/pet',
    SETTINGS: '/(tabs)/settings',
    // Modals/Screens
    HABIT_FORM: '/habit-form',
    SHOP: '/shop',
    ONBOARDING: '/onboarding',
    HATCHING: '/hatching',
    PET_CUSTOMIZE: '/pet-customize',
} as const;

// User-facing messages
export const MESSAGES = {
    // Validation
    PROFANITY_ERROR: 'Please choose a different name',
    NAME_TOO_LONG: 'Name must be 12 characters or less',
    NAME_REQUIRED: 'Please enter a name',
    // Success
    HABIT_CREATED: 'Habit created!',
    HABIT_DELETED: 'Habit deleted',
    PET_HATCHED: 'Welcome to the world!',
    // Confirmations
    DELETE_HABIT_TITLE: 'Delete Habit?',
    DELETE_HABIT_MESSAGE: 'This action cannot be undone.',
    RESET_DATA_TITLE: 'Reset All Data?',
    RESET_DATA_MESSAGE: 'This will delete all habits, progress, and your pet. This cannot be undone.',
    // Errors
    GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const;
