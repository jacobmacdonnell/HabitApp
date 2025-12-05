import React, { useState } from 'react';
import { Heart, Zap, Star, Smile, Edit2, Save, X } from 'lucide-react';

export const Pet = ({ pet, isFullView = false, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(pet?.name || '');
    const [editColor, setEditColor] = useState(pet?.color || '#FF6B6B');

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

    const handleSave = () => {
        if (onUpdate) {
            onUpdate({ name: editName, color: editColor });
        }
        setIsEditing(false);
    };

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
        <div className={`flex flex-col items-center justify-center relative z-10 ${isFullView ? 'gap-6 w-full' : 'gap-6 py-4'}`}>

            {/* Header / Name Section */}
            <div className="relative flex items-center justify-center w-full">
                {isEditing ? (
                    <div className="flex items-center gap-2 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/10 animate-fade-in">
                        <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-transparent text-2xl font-bold text-white text-center w-40 focus:outline-none border-b-2 border-white/20 focus:border-white"
                            autoFocus
                        />
                        <button onClick={handleSave} className="p-2 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors">
                            <Save size={20} />
                        </button>
                        <button onClick={() => setIsEditing(false)} className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                ) : (
                    <h2 className={`font-semibold text-white tracking-tight drop-shadow-md flex items-center justify-center gap-3 ${isFullView ? 'text-3xl' : 'text-2xl'}`}>
                        {capitalize(pet.name)}
                        {isFullView && (
                            <button
                                onClick={() => {
                                    setEditName(pet.name);
                                    setEditColor(pet.color);
                                    setIsEditing(true);
                                }}
                                className="p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all"
                            >
                                <Edit2 size={16} />
                            </button>
                        )}
                    </h2>
                )}
            </div>

            {/* Pet Container */}
            <div className="relative flex flex-col items-center gap-6">
                {/* Soul Glow */}
                <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30 pointer-events-none animate-pulse-glow ${isFullView ? 'w-64 h-64' : 'w-48 h-48'}`}
                    style={{ backgroundColor: isEditing ? editColor : pet.color }}
                />

                <div
                    className={`relative transition-all duration-500 ${isFullView ? 'w-48 h-48' : 'w-40 h-40'}`}
                    style={{ filter: `drop-shadow(0 10px 30px ${isEditing ? editColor : pet.color}50)` }}
                >
                    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                        {/* Body Gradient Definition */}
                        <defs>
                            <radialGradient id="bodyGrad" cx="30%" cy="30%" r="80%">
                                <stop offset="0%" stopColor={isEditing ? editColor : pet.color} stopOpacity="1" />
                                <stop offset="100%" stopColor={isEditing ? editColor : pet.color} stopOpacity="0.8" />
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
                            stroke={isEditing ? editColor : pet.color}
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />

                        {/* Hair Tuft */}
                        <path
                            d="M90,50 Q100,10 115,45 Q125,15 135,50"
                            fill="none"
                            stroke={isEditing ? editColor : pet.color}
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

                {/* Color Picker (Only in Edit Mode) */}
                {isEditing && (
                    <div className="flex gap-3 bg-black/20 p-2 rounded-full backdrop-blur-md animate-slide-up">
                        {['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8C42', '#A06CD5', '#FF99CC'].map((color) => (
                            <button
                                key={color}
                                onClick={() => setEditColor(color)}
                                className={`w-8 h-8 rounded-full border-2 transition-transform active:scale-95 ${editColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Stats Panel */}
            <div className={`glass-card rounded-[2.5rem] border border-white/10 shadow-lg transition-all duration-500 ${isFullView ? 'w-full p-5 grid grid-cols-2 gap-3' : 'w-full max-w-[280px] p-5 space-y-4'}`}>

                {/* Health Bar */}
                <div className={`${isFullView ? 'col-span-2 space-y-2' : 'space-y-1.5'}`}>
                    <div className="flex justify-between text-xs font-bold text-white/60 uppercase tracking-wider px-1">
                        <span className="flex items-center gap-1.5"><Heart size={14} className="text-red-400 fill-red-400/20" /> Health</span>
                        <span>{Math.round(pet.health)}%</span>
                    </div>
                    <div className={`bg-black/20 rounded-full overflow-hidden ring-1 ring-white/5 p-[1px] ${isFullView ? 'h-3' : 'h-2.5'}`}>
                        <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${pet.health < 30 ? 'bg-gradient-to-r from-red-500 to-red-400' : 'bg-gradient-to-r from-green-400 to-emerald-500'}`}
                            style={{ width: `${pet.health}%` }}
                        />
                    </div>
                </div>

                {/* XP Bar */}
                <div className={`${isFullView ? 'col-span-2 space-y-2' : 'space-y-1.5'}`}>
                    <div className="flex justify-between text-xs font-bold text-white/60 uppercase tracking-wider px-1">
                        <span className="flex items-center gap-1.5"><Zap size={14} className="text-yellow-400 fill-yellow-400/20" /> XP</span>
                        <span>Lvl {currentLevel}</span>
                    </div>
                    <div className={`bg-black/20 rounded-full overflow-hidden ring-1 ring-white/5 p-[1px] ${isFullView ? 'h-3' : 'h-2.5'}`}>
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-700 ease-out"
                            style={{ width: `${xpPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Extra Stats (Full View Only) */}
                {isFullView && (
                    <>
                        <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-white/5">
                            <div className="p-1.5 bg-indigo-500/20 rounded-full text-indigo-300 mb-0.5">
                                <Smile size={18} />
                            </div>
                            <span className="text-[10px] font-bold text-white/40 uppercase">Mood</span>
                            <span className="text-base font-bold text-white">{capitalize(pet.mood)}</span>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-white/5">
                            <div className="p-1.5 bg-purple-500/20 rounded-full text-purple-300 mb-0.5">
                                <Star size={18} />
                            </div>
                            <span className="text-[10px] font-bold text-white/40 uppercase">Level</span>
                            <span className="text-base font-bold text-white">{currentLevel}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
