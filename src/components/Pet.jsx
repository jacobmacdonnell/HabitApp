import React from 'react';
import { Heart, Zap } from 'lucide-react';

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

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    return (
        <div className="flex flex-col items-center justify-center py-4 relative z-10 gap-6">
            {/* Name at Top - Standardized */}
            <h2 className="text-2xl font-semibold text-white tracking-tight drop-shadow-md flex items-center justify-center gap-2">
                {capitalize(pet.name)}
            </h2>

            {/* Pet Container - Smaller */}
            <div className="relative">
                {/* Soul Glow */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none animate-pulse-glow"
                    style={{ backgroundColor: pet.color }}
                />

                <div
                    className={`relative w-40 h-40 transition-transform duration-500 hover:scale-105`}
                    style={{ filter: `drop-shadow(0 10px 30px ${pet.color}50)` }}
                >
                    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                        {/* Body Gradient Definition */}
                        <defs>
                            <radialGradient id="bodyGrad" cx="30%" cy="30%" r="80%">
                                <stop offset="0%" stopColor={pet.color} stopOpacity="1" />
                                <stop offset="100%" stopColor={pet.color} stopOpacity="0.8" />
                            </radialGradient>
                            <filter id="fluffGlow">
                                <feGaussianBlur stdDeviation="1.5" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        {/* Fluffy Body - "Puffle" Shape */}
                        <path
                            d="M100,180 C60,180 30,150 30,110 C30,80 50,55 75,50 C80,30 100,20 120,30 C140,20 160,35 165,60 C185,70 190,100 180,125 C190,150 170,180 130,180 Z"
                            fill="url(#bodyGrad)"
                            stroke={pet.color}
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />

                        {/* Hair Tuft */}
                        <path
                            d="M90,50 Q100,10 115,45 Q125,15 135,50"
                            fill="none"
                            stroke={pet.color}
                            strokeWidth="8"
                            strokeLinecap="round"
                        />

                        {/* Face Container */}
                        <g transform="translate(0, 10)">
                            {renderEyes()}
                            {renderMouth()}

                            {/* Cheeks */}
                            {!isSick && (
                                <>
                                    <circle cx="60" cy="125" r="14" fill="#ff99cc" opacity="0.5" filter="blur(4px)" />
                                    <circle cx="140" cy="125" r="14" fill="#ff99cc" opacity="0.5" filter="blur(4px)" />
                                </>
                            )}
                        </g>

                        {/* Sick Thermometer */}
                        {isSick && (
                            <g transform="rotate(45 155 110)">
                                <rect x="150" y="90" width="12" height="40" rx="6" fill="white" stroke="#ef4444" strokeWidth="2" />
                                <circle cx="156" cy="125" r="8" fill="#ef4444" />
                                <rect x="154" y="95" width="4" height="25" fill="#ef4444" />
                            </g>
                        )}
                    </svg>
                </div>
            </div>

            {/* Stats Panel - Unified Style */}
            <div className="w-full max-w-[280px] glass-card p-5 rounded-[2rem] space-y-4 border border-white/10 shadow-lg">
                {/* Health Bar */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-white/60 uppercase tracking-wider px-1">
                        <span className="flex items-center gap-1.5"><Heart size={12} className="text-red-400 fill-red-400/20" /> Health</span>
                        <span>{Math.round(pet.health)}%</span>
                    </div>
                    <div className="h-2.5 bg-black/20 rounded-full overflow-hidden ring-1 ring-white/5 p-[1px]">
                        <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${pet.health < 30 ? 'bg-gradient-to-r from-red-500 to-red-400' : 'bg-gradient-to-r from-green-400 to-emerald-500'}`}
                            style={{ width: `${pet.health}%` }}
                        />
                    </div>
                </div>

                {/* XP Bar */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-white/60 uppercase tracking-wider px-1">
                        <span className="flex items-center gap-1.5"><Zap size={12} className="text-yellow-400 fill-yellow-400/20" /> Level {currentLevel}</span>
                        <span>{Math.round(xpPercentage)}%</span>
                    </div>
                    <div className="h-2.5 bg-black/20 rounded-full overflow-hidden ring-1 ring-white/5 p-[1px]">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-700 ease-out"
                            style={{ width: `${xpPercentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
