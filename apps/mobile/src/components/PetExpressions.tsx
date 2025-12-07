import React from 'react';
import { Path, Circle, G, Rect } from 'react-native-svg';

/**
 * PetExpressions - Face rendering components extracted from Pet.tsx
 * Handles eyes, mouth, and hat rendering based on pet state
 */

interface PetEyesProps {
    isSleeping: boolean;
    isPeeking: boolean;
    isBlinking: boolean;
    pupilY: number;
}

export const PetEyes = ({ isSleeping, isPeeking, isBlinking, pupilY }: PetEyesProps) => {
    // Peeking - one eye open while sleeping (late night habit)
    if (isSleeping && isPeeking) return (
        <G>
            {/* Left eye - still closed */}
            <Path d="M 60 85 Q 70 95 80 85" stroke="rgba(0,0,0,0.8)" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Right eye - open, animates to look down at habits */}
            <Circle cx="130" cy="85" r="16" fill="white" />
            <Circle cx="130" cy={pupilY} r="6" fill="black" />
            <Circle cx="133" cy={pupilY - 4} r="2" fill="white" fillOpacity="0.8" />
        </G>
    );

    // Sleeping eyes - curved lines
    if (isSleeping) return (
        <G>
            <Path d="M 60 85 Q 70 95 80 85" stroke="rgba(0,0,0,0.8)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <Path d="M 120 85 Q 130 95 140 85" stroke="rgba(0,0,0,0.8)" strokeWidth="4" fill="none" strokeLinecap="round" />
        </G>
    );

    // Blinking - show curved lines briefly
    if (isBlinking) return (
        <G>
            <Path d="M 54 85 L 86 85" stroke="rgba(0,0,0,0.8)" strokeWidth="3" strokeLinecap="round" />
            <Path d="M 114 85 L 146 85" stroke="rgba(0,0,0,0.8)" strokeWidth="3" strokeLinecap="round" />
        </G>
    );

    // Normal open eyes
    return (
        <G>
            <Circle cx="70" cy="85" r="16" fill="white" />
            <Circle cx="70" cy="85" r="6" fill="black" />
            <Circle cx="130" cy="85" r="16" fill="white" />
            <Circle cx="130" cy="85" r="6" fill="black" />
            {/* Eye shine */}
            <Circle cx="76" cy="78" r="4" fill="white" fillOpacity="0.8" />
            <Circle cx="136" cy="78" r="4" fill="white" fillOpacity="0.8" />
        </G>
    );
};

interface PetMouthProps {
    isHappy: boolean;
    isSad: boolean;
    isSick: boolean;
}

export const PetMouth = ({ isHappy, isSad, isSick }: PetMouthProps) => {
    if (isHappy) return <Path d="M 70 120 Q 100 150 130 120" stroke="rgba(0,0,0,0.8)" strokeWidth="6" fill="none" strokeLinecap="round" />;
    if (isSad || isSick) return <Path d="M 70 140 Q 100 110 130 140" stroke="rgba(0,0,0,0.8)" strokeWidth="6" fill="none" strokeLinecap="round" />;
    return <Path d="M 70 130 L 130 130" stroke="rgba(0,0,0,0.8)" strokeWidth="6" fill="none" strokeLinecap="round" />;
};

interface PetHatProps {
    hat?: string;
}

export const PetHat = ({ hat }: PetHatProps) => {
    if (!hat || hat === 'none') return null;

    return (
        <G transform="translate(60, 10) scale(0.8)">
            {hat === 'party' && <Path d="M50 10 L80 70 L20 70 Z" fill="#facc15" stroke="white" strokeWidth="2" strokeLinejoin="round" />}
            {hat === 'cowboy' && (
                <G transform="translate(-10, -10)">
                    <Path d="M10 60 Q50 30 90 60" fill="#78350f" stroke="white" strokeWidth="2" />
                    <Path d="M30 60 L30 40 Q50 20 70 40 L70 60" fill="#78350f" stroke="white" strokeWidth="2" />
                </G>
            )}
            {hat === 'tophat' && (
                <G transform="translate(-10, -20)">
                    <Rect x="20" y="60" width="60" height="10" fill="#1f2937" stroke="white" strokeWidth="2" />
                    <Rect x="30" y="20" width="40" height="40" fill="#1f2937" stroke="white" strokeWidth="2" />
                    <Rect x="30" y="50" width="40" height="5" fill="#ef4444" />
                </G>
            )}
            {hat === 'crown' && (
                <G transform="translate(0, -10)">
                    <Path d="M20 60 L20 30 L35 50 L50 20 L65 50 L80 30 L80 60 Z" fill="#fbbf24" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                </G>
            )}
        </G>
    );
};
