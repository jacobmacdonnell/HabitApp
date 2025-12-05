import React, { useState } from 'react';
import { Heart, Zap, Star, Smile, Edit2 } from 'lucide-react';

export const Pet = ({ pet, isFullView = false, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(pet?.name || '');
    const [editColor, setEditColor] = useState(pet?.color || '#FF6B6B');

    if (!pet) return null;

    const isHappy = pet.mood === 'happy';
    const isSad = pet.mood === 'sad';
    const isSick = pet.mood === 'sick';
    const isSleeping = pet.mood === 'sleeping';

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
                <circle cx="76" cy="78" r="4" fill="white" fillOpacity="0.8" />
                <circle cx="136" cy="78" r="4" fill="white" fillOpacity="0.8" />
            </>
        );
    };

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    // COMPACT HOME VIEW - Pet icon for header
    if (!isFullView) {
        return (
            <div className="relative w-20 h-20 flex-shrink-0" style={{ filter: `drop-shadow(0 4px 20px ${pet.color}70)` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-xl opacity-50 pointer-events-none" style={{ backgroundColor: pet.color }} />
                <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                    <defs>
                        <radialGradient id="bodyGradSmall" cx="30%" cy="30%" r="80%">
                            <stop offset="0%" stopColor={pet.color} stopOpacity="1" />
                            <stop offset="100%" stopColor={pet.color} stopOpacity="0.8" />
                        </radialGradient>
                    </defs>
                    <path d="M100,180 C60,180 30,150 30,110 C30,80 50,55 75,50 C80,30 100,20 120,30 C140,20 160,35 165,60 C185,70 190,100 180,125 C190,150 170,180 130,180 Z" fill="url(#bodyGradSmall)" stroke={pet.color} strokeWidth="2" />
                    <path d="M90,50 Q100,10 115,45 Q125,15 135,50" fill="none" stroke={pet.color} strokeWidth="8" strokeLinecap="round" />
                    <g transform="translate(0, 10)">
                        {renderEyes()}
                        {renderMouth()}
                        {!isSick && (
                            <>
                                <circle cx="60" cy="125" r="14" fill="#ff99cc" opacity="0.5" />
                                <circle cx="140" cy="125" r="14" fill="#ff99cc" opacity="0.5" />
                            </>
                        )}
                    </g>
                </svg>
            </div>
        );
    }

    // FULL PET PAGE VIEW
    return (
        <div className="flex flex-col items-center justify-center relative z-10 gap-6 w-full">
            {/* Title - always visible */}
            <h2 className="text-3xl font-semibold text-white tracking-tight drop-shadow-md">
                {isEditing ? editName || pet.name : capitalize(pet.name)}
            </h2>

            {/* Pet - no scaling animation */}
            <div className="relative flex flex-col items-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none animate-pulse-glow" style={{ backgroundColor: isEditing ? editColor : pet.color }} />
                <div className="relative w-48 h-48" style={{ filter: `drop-shadow(0 10px 30px ${isEditing ? editColor : pet.color}50)` }}>
                    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                        <defs>
                            <radialGradient id="bodyGrad" cx="30%" cy="30%" r="80%">
                                <stop offset="0%" stopColor={isEditing ? editColor : pet.color} stopOpacity="1" />
                                <stop offset="100%" stopColor={isEditing ? editColor : pet.color} stopOpacity="0.8" />
                            </radialGradient>
                        </defs>
                        <path d="M100,180 C60,180 30,150 30,110 C30,80 50,55 75,50 C80,30 100,20 120,30 C140,20 160,35 165,60 C185,70 190,100 180,125 C190,150 170,180 130,180 Z" fill="url(#bodyGrad)" stroke={isEditing ? editColor : pet.color} strokeWidth="2" strokeLinejoin="round" />
                        <path d="M90,50 Q100,10 115,45 Q125,15 135,50" fill="none" stroke={isEditing ? editColor : pet.color} strokeWidth="8" strokeLinecap="round" />
                        <g transform="translate(0, 10)">
                            {renderEyes()}
                            {renderMouth()}
                            {!isSick && (
                                <>
                                    <circle cx="60" cy="125" r="14" fill="#ff99cc" opacity="0.5" />
                                    <circle cx="140" cy="125" r="14" fill="#ff99cc" opacity="0.5" />
                                </>
                            )}
                        </g>
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

            <div className="w-full relative">
                {isEditing ? (
                    <div className="glass-card rounded-[2.5rem] p-6 w-full space-y-6 border border-white/20 shadow-2xl">
                        <div className="text-center space-y-1">
                            <h3 className="text-lg font-bold text-white">Customize</h3>
                            <p className="text-white/40 text-xs">Make it yours</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Name</label>
                            <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-center text-xl font-bold text-white focus:outline-none focus:border-white/30 transition-all" placeholder="Pet Name" autoFocus />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Color</label>
                            <div className="flex justify-between bg-black/20 p-2 rounded-2xl">
                                {['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8C42', '#A06CD5', '#FF99CC'].map((color) => (
                                    <button key={color} onClick={() => setEditColor(color)} className={`w-8 h-8 rounded-full border-2 transition-transform active:scale-95 ${editColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70'}`} style={{ backgroundColor: color }} />
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button onClick={() => setIsEditing(false)} className="py-3 rounded-2xl bg-white/5 text-white/60 font-bold text-sm active:scale-95 transition-all">Cancel</button>
                            <button onClick={handleSave} className="py-3 rounded-2xl bg-white text-black font-bold text-sm shadow-lg active:scale-95 transition-all">Save Changes</button>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card rounded-[2.5rem] border border-white/10 shadow-lg w-full p-5 grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-2">
                            <div className="flex justify-between text-xs font-bold text-white/60 uppercase tracking-wider px-1">
                                <span className="flex items-center gap-1.5"><Heart size={14} className="text-red-400" /> Health</span>
                                <span>{Math.round(pet.health)}%</span>
                            </div>
                            <div className="h-3 bg-black/20 rounded-full overflow-hidden ring-1 ring-white/5">
                                <div className={`h-full rounded-full ${pet.health < 30 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${pet.health}%` }} />
                            </div>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <div className="flex justify-between text-xs font-bold text-white/60 uppercase tracking-wider px-1">
                                <span className="flex items-center gap-1.5"><Zap size={14} className="text-yellow-400" /> XP</span>
                                <span>Lvl {currentLevel}</span>
                            </div>
                            <div className="h-3 bg-black/20 rounded-full overflow-hidden ring-1 ring-white/5">
                                <div className="h-full rounded-full bg-yellow-500" style={{ width: `${xpPercentage}%` }} />
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-white/5">
                            <div className="p-1.5 bg-indigo-500/20 rounded-full text-indigo-300 mb-0.5"><Smile size={18} /></div>
                            <span className="text-[10px] font-bold text-white/40 uppercase">Mood</span>
                            <span className="text-base font-bold text-white">{capitalize(pet.mood)}</span>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-white/5">
                            <div className="p-1.5 bg-purple-500/20 rounded-full text-purple-300 mb-0.5"><Star size={18} /></div>
                            <span className="text-[10px] font-bold text-white/40 uppercase">Level</span>
                            <span className="text-base font-bold text-white">{currentLevel}</span>
                        </div>
                        <button onClick={() => { setEditName(pet.name); setEditColor(pet.color); setIsEditing(true); }} className="col-span-2 py-3 mt-1 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
                            <Edit2 size={16} />
                            <span>Customize Pet</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
