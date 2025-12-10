import { PetGameEngine } from '../PetGameEngine';
import { Pet } from '../../types';

describe('PetGameEngine', () => {

    // XP Logic
    describe('calculateXPGain', () => {
        it('should add 20 XP and not level up if below threshold', () => {
            const pet: Pet = {
                name: 'Test',
                xp: 0,
                level: 1,
                health: 50,
                maxHealth: 100,
                mood: 'happy',
                inventory: [],
                history: [],
                color: '#fff',
                lastInteraction: ''
            };

            const result = PetGameEngine.calculateXPGain(pet);
            expect(result.xp).toBe(20);
            expect(result.level).toBe(1);
            expect(result.health).toBe(60); // +10 health
        });

        it('should level up when XP crosses threshold (100 * level)', () => {
            const pet: Pet = {
                name: 'Test',
                xp: 90, // Need 10 more for 100 (Level 1 threshold)
                level: 1,
                health: 50,
                maxHealth: 100,
                mood: 'happy',
                inventory: [],
                history: [],
                color: '#fff',
                lastInteraction: ''
            };

            const result = PetGameEngine.calculateXPGain(pet);
            // 90 + 20 = 110. Threshold 100.
            // New Level = 2.
            // New XP = 110 - 100 = 10.
            expect(result.level).toBe(2);
            expect(result.xp).toBe(10);
            expect(result.health).toBe(100); // Full heal
        });
    });

    // Decay Logic
    describe('calculateDecay', () => {
        it('should not decay if logged in today', () => {
            const now = new Date();
            const result = PetGameEngine.calculateDecay(now.toISOString(), 100);
            expect(result).toBe(100);
        });

        it('should decay 10 health for 1 day missed (2 days diff)', () => {
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

            const result = PetGameEngine.calculateDecay(twoDaysAgo.toISOString(), 100);
            // Diff days = 2. Missed = 1. Decay = 10.
            expect(result).toBe(90);
        });

        it('should not go below 0', () => {
            const longAgo = new Date('2020-01-01').toISOString();
            const result = PetGameEngine.calculateDecay(longAgo, 50);
            expect(result).toBe(0);
        });
    });
});
