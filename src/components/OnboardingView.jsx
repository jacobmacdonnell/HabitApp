import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useHabit } from '../context/HabitContext.jsx';

export const OnboardingView = () => {
    const { resetPet, addHabit, setIsOnboarding } = useHabit();
    const [step, setStep] = useState(0);

    // Step 1: Pet Data
    const [petName, setPetName] = useState('');
    const [petColor, setPetColor] = useState('#FF6B6B');

    // Step 2: Habit Data
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [customHabit, setCustomHabit] = useState('');

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    // Override presets with Emojis to ensure storage compatibility
    const safePresets = [
        { id: 'water', title: 'Drink Water', icon: '💧', color: '#4ECDC4', targetCount: 3, timeOfDay: 'midday' },
        { id: 'read', title: 'Read 10 mins', icon: '📚', color: '#FFE66D', targetCount: 1, timeOfDay: 'evening' },
        { id: 'walk', title: 'Take a Walk', icon: '👣', color: '#FF6B6B', targetCount: 1, timeOfDay: 'morning' },
        { id: 'sleep', title: 'Sleep Early', icon: '😴', color: '#A06CD5', targetCount: 1, timeOfDay: 'evening' },
    ];

    const handleFinish = () => {
        // Create Pet
        resetPet(petName || 'Pet', petColor);

        // Create First Habit
        if (selectedPreset) {
            const preset = safePresets.find(p => p.id === selectedPreset);
            addHabit({
                title: preset.title,
                icon: preset.icon,
                color: preset.color,
                targetCount: preset.targetCount,
                timeOfDay: preset.timeOfDay,
                frequency: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            });
        } else if (customHabit) {
            addHabit({
                title: customHabit,
                icon: '⚡', // Default icon for custom
                color: '#FF8C42',
                targetCount: 1,
                timeOfDay: 'anytime',
                frequency: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            });
        }

        setIsOnboarding(false);
    };



    return (
        <div className="h-full flex flex-col relative overflow-hidden">
            {/* Progress Indicator */}
            <div className="flex gap-2 p-8 justify-center">
                {[0, 1, 2].map(i => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} />
                ))}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 animate-fade-in">

                {/* STEP 0: WELCOME */}
                {step === 0 && (
                    <div className="space-y-8 max-w-sm">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2.5rem] shadow-xl flex items-center justify-center rotate-3">
                            <span className="text-6xl">✨</span>
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-4xl font-black text-white tracking-tight">Habit Companion</h1>
                            <p className="text-white/60 text-lg leading-relaxed">
                                Build better habits, track your progress, and grow alongside your digital companion.
                            </p>
                        </div>
                        <button onClick={handleNext} className="w-full py-4 bg-white text-black font-bold rounded-[2rem] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
                            Get Started <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {/* STEP 1: PET SETUP */}
                {step === 1 && (
                    <div className="w-full max-w-sm space-y-8">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold text-white">Choose a Companion</h2>
                            <p className="text-white/60">This little friend will grow as you improve.</p>
                        </div>

                        <div className="glass-card p-8 rounded-[2rem] border border-white/10 space-y-8">
                            {/* Egg Preview */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 blur-2xl opacity-30 rounded-full" style={{ backgroundColor: petColor }} />
                                    <div className="w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-6xl shadow-inner relative z-10 transition-colors duration-500" style={{ backgroundColor: `${petColor}20`, border: `2px solid ${petColor}40` }}>
                                        🥚
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Name your pet..."
                                    className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-2xl text-center text-xl font-bold text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all"
                                    value={petName}
                                    onChange={(e) => setPetName(e.target.value)}
                                    autoFocus
                                />

                                <div className="flex justify-center gap-3">
                                    {['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8C42', '#A06CD5'].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setPetColor(color)}
                                            className={`w-10 h-10 rounded-full border-2 transition-transform active:scale-110 ${petColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleBack} className="px-6 py-4 bg-white/10 text-white font-bold rounded-[2rem] active:scale-95 transition-all">
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!petName}
                                className="flex-1 py-4 bg-white text-black font-bold rounded-[2rem] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: FIRST HABIT */}
                {step === 2 && (
                    <div className="w-full max-w-sm space-y-8">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold text-white">Set Your First Goal</h2>
                            <p className="text-white/60">Start small. Pick one habit to begin.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {safePresets.map(preset => (
                                <button
                                    key={preset.id}
                                    onClick={() => { setSelectedPreset(preset.id); setCustomHabit(''); }}
                                    className={`p-4 rounded-[2rem] border transition-all duration-300 flex flex-col items-center gap-3 text-center active:scale-95 ${selectedPreset === preset.id
                                        ? 'bg-white text-black border-white shadow-lg scale-[1.02]'
                                        : 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10'}`}
                                >
                                    <div className="text-2xl">{preset.icon}</div>
                                    <span className="font-bold text-sm leading-tight">{preset.title}</span>
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-transparent px-2 text-white/30 font-bold">Or Create Custom</span>
                            </div>
                        </div>

                        <input
                            type="text"
                            placeholder="e.g. Meditate for 5 mins"
                            className={`w-full px-5 py-4 bg-white/5 border rounded-2xl text-center text-base font-bold text-white placeholder-white/20 focus:outline-none transition-all ${customHabit ? 'border-white/50 bg-white/10' : 'border-white/10'}`}
                            value={customHabit}
                            onChange={(e) => { setCustomHabit(e.target.value); setSelectedPreset(null); }}
                        />

                        <div className="flex gap-3 pt-4">
                            <button onClick={handleBack} className="px-6 py-4 bg-white/10 text-white font-bold rounded-[2rem] active:scale-95 transition-all">
                                Back
                            </button>
                            <button
                                onClick={handleFinish}
                                disabled={!selectedPreset && !customHabit}
                                className="flex-1 py-4 bg-white text-black font-bold rounded-[2rem] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                            >
                                Start Journey
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
