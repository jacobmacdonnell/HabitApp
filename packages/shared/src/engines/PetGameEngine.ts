import { Pet, PetMood } from '../types';

export const PetGameEngine = {
    calculateXPGain: (currentPet: Pet) => {
        const xpGain = 20;
        let newXp = (currentPet.xp || 0) + xpGain;
        let newLevel = currentPet.level || 1;
        let newHealth = Math.min((currentPet.health || 0) + 10, currentPet.maxHealth || 100);

        // Level Up Logic (Threshold: Level * 100)
        const xpThreshold = newLevel * 100;
        if (newXp >= xpThreshold) {
            newLevel += 1;
            newXp -= xpThreshold;
            newHealth = currentPet.maxHealth || 100; // Full heal on level up
        }

        return { xp: newXp, level: newLevel, health: newHealth };
    },

    calculateDecay: (lastInteraction: string, currentHealth: number) => {
        const lastLogin = new Date(lastInteraction);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 1) {
            const healthLoss = (diffDays - 1) * 10;
            return Math.max(0, currentHealth - healthLoss);
        }
        return currentHealth;
    },

    determineMood: (health: number, isSleeping: boolean): PetMood => {
        if (isSleeping) return 'sleeping';
        if (health < 30) return 'sick';
        if (health < 60) return 'sad';
        return 'happy';
    },

    recoverHealth: (currentHealth: number, maxHealth: number = 100) => {
        return Math.min(currentHealth + 2, maxHealth);
    }
};
