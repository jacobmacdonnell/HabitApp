import React, { useState, useEffect, useRef } from 'react';
import { Heart, Zap, Star, Smile, Edit2, Lock, Palette, Shirt } from 'lucide-react';

const HATS = {
    none: { id: 'none', name: 'None', level: 0, render: null },
    party: {
        id: 'party', name: 'Party Hat', level: 2,
        render: <path d="M 85 60 L 100 20 L 115 60 Q 100 65 85 60 Z" fill="#FFD700" stroke="white" strokeWidth="2" />
    },
    crown: {
        id: 'crown', name: 'Crown', level: 5,
        render: <path d="M 75 60 L 75 40 L 90 50 L 100 30 L 110 50 L 125 40 L 125 60 Q 100 65 75 60 Z" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
    },
    astronaut: {
        id: 'astronaut', name: 'Astro Helm', level: 10,
        render: <path d="M 60 60 A 40 40 0 1 1 140 60" fill="rgba(200, 230, 255, 0.3)" stroke="white" strokeWidth="2" />
    }
};

export const Pet = ({ pet, isFullView = false, onUpdate }) => {
    const [editMode, setEditMode] = useState(null); // null, 'style', or 'wardrobe'
    const [editName, setEditName] = useState(pet?.name || '');
    const [editColor, setEditColor] = useState(pet?.color || '#FF6B6B');
    const [selectedHat, setSelectedHat] = useState(pet?.hat || 'none');

    // Gamification State
    const [xpPopups, setXpPopups] = useState([]);
    const [levelUpData, setLevelUpData] = useState(null); // { level, unlockedHat }
    const [confetti, setConfetti] = useState([]);
    const prevXpRef = useRef(pet?.xp);
    const prevLevelRef = useRef(pet?.level);

    // Idle Animations State
    const [isBlinking, setIsBlinking] = useState(false);
    const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (pet?.mood === 'sleeping') return;

        // Blinking Logic
        const blinkInterval = setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance to blink every interval
                setIsBlinking(true);
                setTimeout(() => setIsBlinking(false), 150);
            }
        }, 3000);

        // Looking Around Logic
        const lookInterval = setInterval(() => {
            if (Math.random() > 0.6) {
                const x = (Math.random() - 0.5) * 6; // -3 to 3
                const y = (Math.random() - 0.5) * 4; // -2 to 2
                setPupilOffset({ x, y });
                setTimeout(() => setPupilOffset({ x: 0, y: 0 }), 2000);
            }
        }, 4000);

        return () => {
            clearInterval(blinkInterval);
            clearInterval(lookInterval);
        };
    }, [pet?.mood]);

    // XP Gain Detection
    useEffect(() => {
        if (pet && prevXpRef.current !== undefined && pet.xp > prevXpRef.current) {
            const gained = pet.xp - prevXpRef.current;
            const id = Date.now();
            setXpPopups(prev => [...prev, { id, amount: gained }]);
            setTimeout(() => setXpPopups(prev => prev.filter(p => p.id !== id)), 1500);
        }
        prevXpRef.current = pet?.xp;
    }, [pet?.xp]);

    // Level Up Detection
    useEffect(() => {
        if (pet && prevLevelRef.current !== undefined && pet.level > prevLevelRef.current) {
            const newLevel = pet.level;
            const unlockedHat = Object.values(HATS).find(h => h.level === newLevel);
            setLevelUpData({ level: newLevel, unlockedHat: unlockedHat?.name || null });

            // Spawn confetti
            const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#A06CD5', '#FF99CC'];
            const pieces = Array.from({ length: 30 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 0.5,
            }));
            setConfetti(pieces);
            setTimeout(() => setConfetti([]), 3500);
        }
        prevLevelRef.current = pet?.level;
    }, [pet?.level]);

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
            onUpdate({ name: editName, color: editColor, hat: selectedHat });
        }
        setEditMode(null);
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
        if (isBlinking) return (
            <>
                <path d="M 60 85 Q 70 95 80 85" stroke="rgba(0,0,0,0.8)" strokeWidth="4" fill="transparent" strokeLinecap="round" />
                <path d="M 120 85 Q 130 95 140 85" stroke="rgba(0,0,0,0.8)" strokeWidth="4" fill="transparent" strokeLinecap="round" />
            </>
        );

        return (
            <>
                <circle cx="70" cy="85" r="16" fill="white" />
                <circle cx={70 + pupilOffset.x} cy={85 + pupilOffset.y} r="6" fill="black" className="transition-all duration-500" />
                <circle cx="130" cy="85" r="16" fill="white" />
                <circle cx={130 + pupilOffset.x} cy={85 + pupilOffset.y} r="6" fill="black" className="transition-all duration-500" />
                <circle cx={76 + pupilOffset.x} cy={78 + pupilOffset.y} r="4" fill="white" fillOpacity="0.8" className="transition-all duration-500" />
                <circle cx={136 + pupilOffset.x} cy={78 + pupilOffset.y} r="4" fill="white" fillOpacity="0.8" className="transition-all duration-500" />
            </>
        );
    };

    const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

    // COMPACT HOME VIEW - Pet icon for header
    if (!isFullView) {
        return (
            <div className={`relative w-20 h-20 flex-shrink-0 ${isSleeping ? 'animate-breathe' : ''}`} style={{ filter: `drop-shadow(0 4px 10px ${pet.color}40)` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-lg opacity-15 pointer-events-none" style={{ backgroundColor: pet.color }} />

                {/* Compact Sleep Zzz - spawns from behind head */}
                {isSleeping && (
                    <div key="compact-zzz" className="absolute top-4 left-10 pointer-events-none z-50">
                        <span className="absolute text-xs font-black text-white animate-zzz-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Z</span>
                        <span className="absolute text-xs font-black text-white/80 animate-zzz-2" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Z</span>
                        <span className="absolute text-xs font-black text-white/60 animate-zzz-3" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Z</span>
                    </div>
                )}

                <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                    <defs>
                        <radialGradient id="bodyGradSmall" cx="30%" cy="30%" r="80%">
                            <stop offset="0%" stopColor={pet.color} stopOpacity="1" />
                            <stop offset="100%" stopColor={pet.color} stopOpacity="0.8" />
                        </radialGradient>
                    </defs>
                    <path d="M100,180 C60,180 30,150 30,110 C30,80 50,55 75,50 C80,30 100,20 120,30 C140,20 160,35 165,60 C185,70 190,100 180,125 C190,150 170,180 130,180 Z" fill="url(#bodyGradSmall)" stroke={pet.color} strokeWidth="2" />
                    <path d="M90,50 Q100,10 115,45 Q125,15 135,50" fill="none" stroke={pet.color} strokeWidth="8" strokeLinecap="round" />
                    {/* Hat Rendering (Compact) */}
                    {pet.hat && HATS[pet.hat] && (
                        <g transform="translate(0, -5) scale(0.9)">
                            {HATS[pet.hat].render}
                        </g>
                    )}
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
        <div className="space-y-6 pb-8 relative">
            {/* Level Up Overlay */}
            {levelUpData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 animate-fade-in" onClick={() => setLevelUpData(null)}>
                    <div className="glass-card rounded-[2rem] p-8 text-center animate-level-up-pop border border-yellow-400/50" onClick={e => e.stopPropagation()}>
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-3xl font-black text-yellow-400 mb-2">Level Up!</h2>
                        <p className="text-xl text-white">You reached <span className="font-bold">Level {levelUpData.level}</span></p>
                        {levelUpData.unlockedHat && (
                            <div className="mt-4 p-3 bg-white/10 rounded-2xl">
                                <p className="text-sm text-white/70">New Unlock:</p>
                                <p className="text-lg font-bold text-white">{levelUpData.unlockedHat} 🎩</p>
                            </div>
                        )}
                        <button onClick={() => setLevelUpData(null)} className="mt-6 px-6 py-3 bg-white text-black font-bold rounded-2xl active:scale-95 transition-all">Awesome!</button>
                    </div>
                </div>
            )}

            {/* Confetti */}
            {confetti.map(p => (
                <div
                    key={p.id}
                    className="confetti-piece rounded-sm"
                    style={{ left: `${p.left}%`, backgroundColor: p.color, animationDelay: `${p.delay}s`, top: 0 }}
                />
            ))}

            {/* Page Title */}
            <h1 className="text-2xl font-bold text-white">Pet</h1>

            {/* Pet Display */}
            <div className="flex flex-col items-center gap-6">

                {/* Pet - no scaling animation */}
                <div className="relative flex flex-col items-center">
                    {/* Bloom glow behind pet - opacity synced with breathing, but doesn't move */}
                    <div
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none ${isSleeping ? 'animate-bloom-breathe' : 'opacity-30'}`}
                        style={{ backgroundColor: editMode ? editColor : pet.color }}
                    />

                    {/* Zzz Animations - larger for pet page, spawns behind head */}
                    {isSleeping && (
                        <div key="pet-zzz" className="absolute top-7 left-15 pointer-events-none z-50">
                            <span className="absolute text-lg font-black text-white animate-zzz-lg-1" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Z</span>
                            <span className="absolute text-lg font-black text-white/80 animate-zzz-lg-2" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Z</span>
                            <span className="absolute text-lg font-black text-white/60 animate-zzz-lg-3" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Z</span>
                        </div>
                    )}

                    <div className={`relative w-48 h-48 
                        ${isSleeping ? 'animate-breathe' : ''} 
                        ${!isSleeping && pet.health > 80 ? 'animate-bounce-gentle' : ''}
                        ${!isSleeping && pet.health <= 80 && pet.health >= 30 ? 'animate-sway' : ''}
                        ${!isSleeping && pet.health < 30 ? 'animate-shiver' : ''}
                    `} style={{ filter: `drop-shadow(0 10px 30px ${editMode ? editColor : pet.color}50)` }}>
                        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                            <defs>
                                <radialGradient id="bodyGrad" cx="30%" cy="30%" r="80%">
                                    <stop offset="0%" stopColor={editMode ? editColor : pet.color} stopOpacity="1" />
                                    <stop offset="100%" stopColor={editMode ? editColor : pet.color} stopOpacity="0.8" />
                                </radialGradient>
                            </defs>
                            <path d="M100,180 C60,180 30,150 30,110 C30,80 50,55 75,50 C80,30 100,20 120,30 C140,20 160,35 165,60 C185,70 190,100 180,125 C190,150 170,180 130,180 Z" fill="url(#bodyGrad)" stroke={editMode ? editColor : pet.color} strokeWidth="2" strokeLinejoin="round" />
                            <path d="M90,50 Q100,10 115,45 Q125,15 135,50" fill="none" stroke={editMode ? editColor : pet.color} strokeWidth="8" strokeLinecap="round" />

                            {/* Hat Rendering (Full) */}
                            {(editMode ? selectedHat : pet.hat) && HATS[editMode ? selectedHat : pet.hat] && (
                                <g transform="translate(0, -5)">
                                    {HATS[editMode ? selectedHat : pet.hat].render}
                                </g>
                            )}

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

                {/* XP Popups */}
                {xpPopups.map(p => (
                    <div key={p.id} className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-50">
                        <span className="text-xl font-black text-yellow-300 animate-xp-pop" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>+{p.amount} XP</span>
                    </div>
                ))}

                <div className="w-full relative">
                    {editMode === 'style' && (
                        <div className="glass-card rounded-[2rem] p-6 w-full space-y-6 border border-white/20 shadow-2xl animate-fade-in">
                            <div className="text-center space-y-1">
                                <h3 className="text-lg font-bold text-white">Style</h3>
                                <p className="text-white/50 text-xs">Personalize your buddy</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Name</label>
                                <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-center text-xl font-bold text-white focus:outline-none focus:border-white/30 transition-all" placeholder="Pet Name" autoFocus />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Color</label>
                                <div className="flex justify-between bg-black/20 p-2 rounded-2xl">
                                    {['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8C42', '#A06CD5', '#FF99CC'].map((color) => (
                                        <button key={color} onClick={() => setEditColor(color)} className={`w-10 h-10 rounded-full border-2 transition-transform active:scale-95 ${editColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70'}`} style={{ backgroundColor: color }} />
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button onClick={() => setEditMode(null)} className="py-3 rounded-2xl bg-white/10 text-white/70 font-bold text-sm active:scale-95 transition-all">Cancel</button>
                                <button onClick={handleSave} className="py-3 rounded-2xl bg-white text-black font-bold text-sm shadow-lg active:scale-95 transition-all">Save</button>
                            </div>
                        </div>
                    )}

                    {editMode === 'wardrobe' && (
                        <div className="glass-card rounded-[2rem] p-6 w-full space-y-6 border border-white/20 shadow-2xl animate-fade-in">
                            <div className="text-center space-y-1">
                                <h3 className="text-lg font-bold text-white">Wardrobe</h3>
                                <p className="text-white/50 text-xs">Unlock hats by leveling up</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Headwear</label>
                                <div className="grid grid-cols-4 gap-2 bg-black/20 p-2 rounded-2xl">
                                    {Object.values(HATS).map((hat) => {
                                        const isLocked = currentLevel < hat.level;
                                        return (
                                            <button
                                                key={hat.id}
                                                onClick={() => !isLocked && setSelectedHat(hat.id)}
                                                className={`relative aspect-square rounded-xl border-2 transition-all ${selectedHat === hat.id ? 'border-white bg-white/10' : 'border-transparent hover:bg-white/5'} ${isLocked ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                                            >
                                                {isLocked && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-xl z-10">
                                                        <Lock size={14} className="text-white/70 mb-0.5" />
                                                        <span className="text-[9px] font-bold text-white/70">Lvl {hat.level}</span>
                                                    </div>
                                                )}
                                                <svg viewBox="0 0 200 200" className="w-full h-full">
                                                    <g transform="translate(0, 50)">
                                                        {hat.render}
                                                    </g>
                                                </svg>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button onClick={() => setEditMode(null)} className="py-3 rounded-2xl bg-white/10 text-white/70 font-bold text-sm active:scale-95 transition-all">Cancel</button>
                                <button onClick={handleSave} className="py-3 rounded-2xl bg-white text-black font-bold text-sm shadow-lg active:scale-95 transition-all">Save</button>
                            </div>
                        </div>
                    )}

                    {!editMode && (
                        <div className="glass-card rounded-[2rem] border border-white/10 shadow-lg w-full p-5 space-y-4">
                            {/* Pet Name Row */}
                            <div className="text-center pb-2 border-b border-white/10">
                                <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Name</p>
                                <h2 className="text-2xl font-bold text-white">{capitalize(pet.name)}</h2>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Health Bar */}
                                <div className="col-span-2 space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-white/70 uppercase tracking-wider px-1">
                                        <span className="flex items-center gap-1.5"><Heart size={14} className="text-red-400" /> Health</span>
                                        <span className="text-white">{Math.round(pet.health)}%</span>
                                    </div>
                                    <div className="h-3 bg-black/20 rounded-full overflow-hidden ring-1 ring-white/5">
                                        <div className={`h-full rounded-full ${pet.health < 30 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${pet.health}%` }} />
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-white/70 uppercase tracking-wider px-1">
                                        <span className="flex items-center gap-1.5"><Zap size={14} className="text-yellow-400" /> XP</span>
                                        <span className="text-white">Lvl {currentLevel}</span>
                                    </div>
                                    <div className="h-3 bg-black/20 rounded-full overflow-hidden ring-1 ring-white/5">
                                        <div className="h-full rounded-full bg-yellow-500" style={{ width: `${xpPercentage}%` }} />
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-white/5">
                                    <div className="p-1.5 bg-indigo-500/20 rounded-full text-indigo-300 mb-0.5"><Smile size={18} /></div>
                                    <span className="text-[10px] font-bold text-white/70 uppercase">Mood</span>
                                    <span className="text-base font-bold text-white">{capitalize(pet.mood)}</span>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-white/5">
                                    <div className="p-1.5 bg-purple-500/20 rounded-full text-purple-300 mb-0.5"><Star size={18} /></div>
                                    <span className="text-[10px] font-bold text-white/70 uppercase">Level</span>
                                    <span className="text-base font-bold text-white">{currentLevel}</span>
                                </div>
                                <button onClick={() => { setEditName(pet.name); setEditColor(pet.color); setEditMode('style'); }} className="py-3 rounded-2xl bg-white/10 border border-white/10 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
                                    <Palette size={16} />
                                    <span>Style</span>
                                </button>
                                <button onClick={() => { setSelectedHat(pet.hat || 'none'); setEditMode('wardrobe'); }} className="py-3 rounded-2xl bg-white/10 border border-white/10 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
                                    <Shirt size={16} />
                                    <span>Wardrobe</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
