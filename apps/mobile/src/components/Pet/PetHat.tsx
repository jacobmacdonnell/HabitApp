import React from 'react';
import { Path, G, Rect } from 'react-native-svg';

interface PetHatProps {
    hat?: string;
}

export const PetHat = ({ hat }: PetHatProps) => {
    if (!hat || hat === 'none') return null;

    return (
        <G transform="translate(60, 10) scale(0.8)">
            {hat === 'party' && (
                <Path d="M50 10 L80 70 L20 70 Z" fill="#facc15" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            )}
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
                    <Path
                        d="M20 60 L20 30 L35 50 L50 20 L65 50 L80 30 L80 60 Z"
                        fill="#fbbf24"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
                </G>
            )}
        </G>
    );
};
