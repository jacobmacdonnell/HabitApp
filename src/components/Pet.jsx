import React from 'react';

export const Pet = ({ pet }) => {
    if (!pet) return null;
    const isHappy = pet.mood === 'happy';

    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div
                className={`relative w-48 h-48 transition-transform duration-500 ${isHappy ? 'animate-bounce' : ''}`}
                style={{ filter: `drop-shadow(0 0 20px ${pet.color}80)` }}
            >
                {/* Simple "Puffle" Style SVG Body */}
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle cx="100" cy="100" r="80" fill={pet.color} />
                    {/* Eyes */}
                    <circle cx="70" cy="85" r="15" fill="white" />
                    <circle cx="70" cy="85" r="5" fill="black" />
                    <circle cx="130" cy="85" r="15" fill="white" />
                    <circle cx="130" cy="85" r="5" fill="black" />

                    {/* Mouth */}
                    <path
                        d="M 70 120 Q 100 150 130 120"
                        stroke="black"
                        strokeWidth="5"
                        fill="transparent"
                        strokeLinecap="round"
                    />

                    {/* Cheeks */}
                    <circle cx="50" cy="110" r="10" fill="pink" opacity="0.6" />
                    <circle cx="150" cy="110" r="10" fill="pink" opacity="0.6" />
                </svg>
            </div>

            <div className="mt-4 text-center">
                <h2 className="text-3xl font-bold text-white drop-shadow-md">{pet.name}</h2>
                <div className="mt-2 w-32 h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                        className="h-full bg-green-400 transition-all duration-500"
                        style={{ width: `${pet.health}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
