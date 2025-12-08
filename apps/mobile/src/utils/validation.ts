export const validatePetName = (name: string): { isValid: boolean; error?: string } => {
    const trimmedName = name.trim();
    if (!trimmedName) {
        return { isValid: false, error: 'Please name your pet!' };
    }

    if (trimmedName.length > 12) {
        return { isValid: false, error: 'Please keep the name under 12 characters.' };
    }

    // Basic profanity filter
    const FORBIDDEN = ['fuck', 'shit', 'bitch', 'ass', 'cunt', 'dick', 'cock', 'pussy', 'whore', 'slut', 'nigger', 'faggot', 'bastard', 'prick'];
    const lowerName = trimmedName.toLowerCase();

    // Check for whole words or obvious substrings
    const hasProfanity = FORBIDDEN.some(word => lowerName.includes(word));

    if (hasProfanity) {
        return { isValid: false, error: 'Let\'s keep the name friendly for everyone.' };
    }

    return { isValid: true };
};
