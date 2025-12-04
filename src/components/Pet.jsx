import React from 'react';

export const Pet = ({ pet }) => {
    if (!pet) return null;

    // Mood Logic
    const isHappy = pet.mood === 'happy';
    const isSad = pet.mood === 'sad';
    const isSick = pet.mood === 'sick';
    const isSleeping = pet.mood === 'sleeping';

    // XP Calculation
    const currentLevel = pet.level || 1;
    const currentXp = pet.xp || 0;
    const xpToNextLevel = currentLevel * 100;
    const xpPercentage = Math.min((currentXp / xpToNextLevel) * 100, 100);

    // Dynamic Face Rendering
    const renderMouth = () => {
        if (isHappy) return <path d="M 70 120 Q 100 150 130 120" stroke="rgba(0,0,0,0.8)" strokeWidth="6" fill="transparent" strokeLinecap="round" />;
        if (isSad || isSick) return <path d="M 70 140 Q 100 110 130 140" stroke="rgba(0,0,0,0.8)" strokeWidth="6" fill="transparent" strokeLinecap="round" />;
        return <path d="M 70 130 L 130 130" stroke="rgba(0,0,0,0.8)" strokeWidth="6" fill="transparent" strokeLinecap="round" />;
    };

    const renderEyes = () => {
        if (isSleeping) return (
            <>
                <path d="M 60 85 Q 70 95 80 85" stroke="rgba(0,0,0,0.8)" strokeWidth="4" fill="transparent" strokeLinecap="round" />
                <path d="M 120 85 Q 130 95 140 85" stroke="rgba(0,0,0,0.8)" strokeWidth="4" fill="transparent" strokeLinecap="round" />
            </>
        );
        if (isSick) return (
            <>
                <text x="55" y="100" fontSize="24" fill="rgba(0,0,0,0.8)" fontWeight="bold">×</text>
                <text x="115" y="100" fontSize="24" fill="rgba(0,0,0,0.8)" fontWeight="bold">×</text>
            </>
        );
        return (
            <>
                <circle cx="70" cy="85" r="16" fill="white" />
                <circle cx="70" cy="85" r="6" fill="black" />
                <circle cx="130" cy="85" r="16" fill="white" />
                <circle cx="130" cy="85" r="6" fill="black" />

                {/* Shine */}
                <circle cx="76" cy="78" r="4" fill="white" fillOpacity="0.8" />
                <circle cx="136" cy="78" r="4" fill="white" fillOpacity="0.8" />
            </>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center py-6 relative z-10">
            {/* Soul Glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-40 pointer-events-none animate-pulse-glow"
                style={{ backgroundColor: pet.color }}
            />

            <div
                className={`relative w-56 h-56 transition-transform duration-500 ${isHappy ? 'animate-bounce' : 'animate-float'}`}
                style={{ filter: `drop-shadow(0 10px 30px ${pet.color}60)` }}
            >
                <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                    {/* Body Gradient Definition */}
                    <defs>
                        <radialGradient id="bodyGrad" cx="30%" cy="30%" r="70%">
                            <stop offset="0%" stopColor={pet.color} stopOpacity="1" />
                            <stop offset="100%" stopColor={pet.color} stopOpacity="0.8" />
                        </radialGradient>
                        <filter id="innerGlow">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="arithmetic" k2="-1" k3="1" />
                        </filter>
                    </defs>

                    <circle cx="100" cy="100" r="80" fill="url(#bodyGrad)" />

                    {/* Highlight/Reflection */}
                    <circle cx="70" cy="70" r="40" fill="white" fillOpacity="0.1" filter="url(#innerGlow)" />

                    {renderEyes()}
                    {renderMouth()}

                    {/* Cheeks */}
                    {!isSick && (
                        <>
                            <circle cx="50" cy="115" r="12" fill="#ff99cc" opacity="0.6" filter="blur(2px)" />
                            <circle cx="150" cy="115" r="12" fill="#ff99cc" opacity="0.6" filter="blur(2px)" />
                        </>
                    )}

                    {/* Sick Thermometer */}
                    {isSick && (
                        <g transform="rotate(45 145 100)">
                            <rect x="140" y="80" width="12" height="40" rx="6" fill="white" stroke="#ef4444" strokeWidth="2" />
                            <circle cx="146" cy="115" r="8" fill="#ef4444" />
                            <rect x="144" y="85" width="4" height="25" fill="#ef4444" />
                        </g>
                    )}
                </svg>
            </div>

            <div className="mt-2 text-center space-y-3 w-full max-w-[200px]">
                <h2 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg flex items-center justify-center gap-2">
                    {pet.name}
                </h2>

                <div className="glass-panel p-3 rounded-2xl space-y-2 backdrop-blur-md">
                    {/* Health Bar */}
                    <div className="flex items-center gap-3 text-xs font-bold text-white/90">
                        <span className="w-4">HP</span>
                        <div className="flex-1 h-2 bg-black/20 rounded-full overflow-hidden ring-1 ring-white/10">
                            <div
                                className={`h-full transition-all duration-700 ease-out ${pet.health < 30 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-green-400 shadow-[0_0_10px_#4ade80]'}`}
                                style={{ width: `${pet.health}%` }}
                            />
                        </div>
                    </div>

                    {/* XP Bar */}
                    <div className="flex items-center gap-3 text-xs font-bold text-white/90">
                        <span className="w-4">LV</span>
                        <div className="flex-1 h-2 bg-black/20 rounded-full overflow-hidden ring-1 ring-white/10">
                            <div
                                className="h-full bg-yellow-400 shadow-[0_0_10px_#facc15] transition-all duration-700 ease-out"
                                style={{ width: `${xpPercentage}%` }}
                            />
                        </div>
                        <span className="text-[10px] opacity-70">{currentLevel}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
