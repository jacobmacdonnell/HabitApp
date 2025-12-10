import React from 'react';
import { Path } from 'react-native-svg';

interface PetMouthProps {
    isHappy: boolean;
    isSad: boolean;
    isSick: boolean;
}

export const PetMouth = ({ isHappy, isSad, isSick }: PetMouthProps) => {
    if (isHappy)
        return (
            <Path
                d="M 70 120 Q 100 150 130 120"
                stroke="rgba(0,0,0,0.8)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
            />
        );
    if (isSad || isSick)
        return (
            <Path
                d="M 70 140 Q 100 110 130 140"
                stroke="rgba(0,0,0,0.8)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
            />
        );
    return <Path d="M 70 130 L 130 130" stroke="rgba(0,0,0,0.8)" strokeWidth="6" fill="none" strokeLinecap="round" />;
};
