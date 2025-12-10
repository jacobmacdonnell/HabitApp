import { Pet } from '../../types';
import { PetGameEngine } from '../PetGameEngine';

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
                lastInteraction: '',
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
                lastInteraction: '',
            };

            const result = PetGameEngine.calculateXPGain(pet);
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
            expect(result).toBe(90);
        });

        it('should not go below 0', () => {
            const longAgo = new Date('2020-01-01').toISOString();
            const result = PetGameEngine.calculateDecay(longAgo, 50);
            expect(result).toBe(0);
        });
    });

    // Economy Logic
    describe('purchaseItem', () => {
        const basePet: Pet = {
            name: 'Test',
            xp: 100,
            level: 1,
            health: 100,
            maxHealth: 100,
            mood: 'happy',
            inventory: ['hat-1'],
            history: [],
            color: '#fff',
            lastInteraction: ''
        };

        it('should purchase item successfully if XP sufficient', () => {
            const result = PetGameEngine.purchaseItem(basePet, 'hat-2', 50);
            expect(result.success).toBe(true);
            expect(result.pet?.xp).toBe(50);
            expect(result.pet?.inventory).toContain('hat-2');
            expect(result.pet?.inventory).toHaveLength(2);
        });

        it('should fail if XP is insufficient', () => {
            const result = PetGameEngine.purchaseItem(basePet, 'hat-2', 150);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Not enough XP');
        });

        it('should fail if item already owned', () => {
            const result = PetGameEngine.purchaseItem(basePet, 'hat-1', 10);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Item already owned');
        });
    });
});
