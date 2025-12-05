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

    // Step 3: Habit Details
    const [targetCount, setTargetCount] = useState(1);
    const [timeOfDay, setTimeOfDay] = useState('anytime');

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    // Override presets with Emojis to ensure storage compatibility
    const safePresets = [
        { id: 'water', title: 'Drink Water', icon: '💧', color: '#4ECDC4', defaultTarget: 3, defaultTime: 'anytime' },
        { id: 'read', title: 'Read 10 mins', icon: '📚', color: '#FFE66D', defaultTarget: 1, defaultTime: 'evening' },
        { id: 'walk', title: 'Take a Walk', icon: '👣', color: '#FF6B6B', defaultTarget: 1, defaultTime: 'morning' },
        { id: 'meditate', title: 'Meditate', icon: '🧘', color: '#A06CD5', defaultTarget: 1, defaultTime: 'morning' },
        { id: 'journal', title: 'Journal', icon: '✍️', color: '#FF8C42', defaultTarget: 1, defaultTime: 'evening' },
        { id: 'exercise', title: 'Exercise', icon: '💪', color: '#FF6B6B', defaultTarget: 1, defaultTime: 'anytime' },
    ];

    const handleFinish = () => {
        // Create Pet
        resetPet(petName || 'Pet', petColor);

        // Create First Habit
        // Create First Habit
        if (selectedPreset) {
            const preset = safePresets.find(p => p.id === selectedPreset);
            addHabit({
                title: preset.title,
                icon: preset.icon,
                color: preset.color,
                targetCount: targetCount,
                timeOfDay: timeOfDay,
                frequency: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            });
        } else if (customHabit) {
            addHabit({
                title: customHabit,
                icon: '⚡', // Default icon for custom
                color: '#FF8C42',
                targetCount: targetCount,
                timeOfDay: timeOfDay,
                frequency: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            });
        }

        setIsOnboarding(false);
    };



    return (
        <div className="h-full flex flex-col relative overflow-hidden">
            {/* Progress Indicator */}
            <div className="flex gap-2 p-8 justify-center">

                {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} />
                ))}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-4 animate-fade-in overflow-y-auto scrollbar-hide">

                {/* STEP 0: WELCOME */}
                {step === 0 && (
                    <div className="space-y-6 max-w-sm">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2rem] shadow-xl flex items-center justify-center rotate-3">
                            <span className="text-4xl">✨</span>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-black text-white tracking-tight">Habit Companion</h1>
                            <p className="text-white/60 text-sm font-medium leading-relaxed">
                                Build better habits, track your progress, and grow alongside your digital companion.
                            </p>
                        </div>
                        <button onClick={handleNext} className="w-full py-3.5 bg-white text-black font-bold rounded-[2rem] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
                            Get Started <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {/* STEP 1: PET SETUP */}
                {step === 1 && (
                    <div className="w-full max-w-sm space-y-4">
                        <div className="text-center space-y-1">
                            <h2 className="text-2xl font-bold text-white">Choose a Companion</h2>
                            <p className="text-white/60 text-sm font-medium">This little friend will grow as you improve.</p>
                        </div>

                        <div className="glass-card p-6 rounded-[2rem] border border-white/10 space-y-6">
                            {/* Egg Preview */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 blur-2xl opacity-30 rounded-full" style={{ backgroundColor: petColor }} />
                                    <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner relative z-10 transition-colors duration-500" style={{ backgroundColor: `${petColor}20`, border: `2px solid ${petColor}40` }}>
                                        🥚
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Name your pet..."
                                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-center text-lg font-bold text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all"
                                    value={petName}
                                    onChange={(e) => setPetName(e.target.value)}
                                    autoFocus
                                />

                                <div className="flex justify-center gap-2">
                                    {['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8C42', '#A06CD5'].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setPetColor(color)}
                                            className={`w-8 h-8 rounded-full border-2 transition-transform active:scale-110 ${petColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleBack} className="px-5 py-3.5 bg-white/10 text-white font-bold rounded-[2rem] active:scale-95 transition-all">
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!petName}
                                className="flex-1 py-3.5 bg-white text-black font-bold rounded-[2rem] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: FIRST HABIT */}
                {step === 2 && (
                    <div className="w-full max-w-sm space-y-4 pb-4">
                        <div className="text-center space-y-1">
                            <h2 className="text-2xl font-bold text-white">Set Your First Goal</h2>
                            <p className="text-white/60 text-sm font-medium">Start small. Pick one habit to begin.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {safePresets.map(preset => (
                                <button
                                    key={preset.id}
                                    onClick={() => {
                                        setSelectedPreset(preset.id);
                                        setCustomHabit('');
                                        setTargetCount(preset.defaultTarget);
                                        setTimeOfDay(preset.defaultTime);
                                    }}
                                    className={`p-3 rounded-[1.5rem] border transition-all duration-300 flex flex-col items-center gap-2 text-center active:scale-95 ${selectedPreset === preset.id
                                        ? 'bg-white text-black border-white shadow-lg scale-[1.02]'
                                        : 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10'}`}
                                >
                                    <div className="text-xl">{preset.icon}</div>
                                    <span className="font-bold text-xs leading-tight">{preset.title}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 py-2">
                            <div className="h-px bg-white/10 flex-1" />
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Or Create Custom</span>
                            <div className="h-px bg-white/10 flex-1" />
                        </div>

                        <input
                            type="text"
                            placeholder="e.g. Meditate for 5 mins"
                            className={`w-full px-4 py-3 bg-white/5 border rounded-2xl text-center text-sm font-bold text-white placeholder-white/20 focus:outline-none transition-all ${customHabit ? 'border-white/50 bg-white/10' : 'border-white/10'}`}
                            value={customHabit}
                            onChange={(e) => {
                                setCustomHabit(e.target.value);
                                setSelectedPreset(null);
                                setTargetCount(1);
                                setTimeOfDay('anytime');
                            }}
                        />

                        <div className="flex gap-3 pt-2">
                            <button onClick={handleBack} className="px-5 py-3.5 bg-white/10 text-white font-bold rounded-[2rem] active:scale-95 transition-all">
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!selectedPreset && !customHabit}
                                className="flex-1 py-3.5 bg-white text-black font-bold rounded-[2rem] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: HABIT DETAILS */}
                {step === 3 && (
                    <div className="w-full max-w-sm space-y-6">
                        <div className="text-center space-y-1">
                            <h2 className="text-2xl font-bold text-white">Make it Specific</h2>
                            <p className="text-white/60 text-sm font-medium">When and how often?</p>
                        </div>

                        <div className="glass-card p-5 rounded-[2rem] border border-white/10 space-y-5">
                            {/* Target Count */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Daily Goal</label>
                                <div className="flex items-center justify-between bg-black/20 rounded-2xl p-1.5">
                                    <button
                                        onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
                                        className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg font-bold active:scale-95 transition-all hover:bg-white/20"
                                    >
                                        -
                                    </button>
                                    <span className="text-xl font-black font-mono">{targetCount}</span>
                                    <button
                                        onClick={() => setTargetCount(Math.min(99, targetCount + 1))}
                                        className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg font-bold active:scale-95 transition-all hover:bg-white/20"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="text-center text-[10px] text-white/40">times per day</p>
                            </div>

                            {/* Time of Day */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Time of Day</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['morning', 'midday', 'evening', 'anytime'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTimeOfDay(t)}
                                            className={`py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${timeOfDay === t
                                                ? 'bg-white text-black shadow-lg'
                                                : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleBack} className="px-5 py-3.5 bg-white/10 text-white font-bold rounded-[2rem] active:scale-95 transition-all">
                                Back
                            </button>
                            <button
                                onClick={handleFinish}
                                className="flex-1 py-3.5 bg-white text-black font-bold rounded-[2rem] shadow-xl active:scale-95 transition-all"
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
