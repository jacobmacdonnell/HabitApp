import React from 'react';
import { Animated } from 'react-native';
import { Path, Circle, G } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface PetEyesProps {
    isSleeping: boolean;
    isPeeking: boolean;
    isBlinking: boolean;
    eyeLookAnim: Animated.Value;
}

export const PetEyes = ({ isSleeping, isPeeking, isBlinking, eyeLookAnim }: PetEyesProps) => {
    // Interpolate pupil position
    // 0 = center (85), 1 = looking down (92)
    const pupilY = eyeLookAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [85, 92],
    });

    const glintY = eyeLookAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [81, 88], // 85-4=81, 92-4=88
    });

    // Peeking - one eye open while sleeping (late night habit)
    if (isSleeping && isPeeking)
        return (
            <G>
                <Path
                    d="M 60 85 Q 70 95 80 85"
                    stroke="rgba(0,0,0,0.8)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                />
                <Circle cx="130" cy="85" r="16" fill="white" />
                <AnimatedCircle cx="130" cy={pupilY} r="6" fill="black" />
                <AnimatedCircle cx="133" cy={glintY} r="2" fill="white" fillOpacity="0.8" />
            </G>
        );

    // Sleeping eyes
    if (isSleeping)
        return (
            <G>
                <Path
                    d="M 60 85 Q 70 95 80 85"
                    stroke="rgba(0,0,0,0.8)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                />
                <Path
                    d="M 120 85 Q 130 95 140 85"
                    stroke="rgba(0,0,0,0.8)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                />
            </G>
        );

    // Blinking
    if (isBlinking)
        return (
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
            <Circle cx="76" cy="78" r="4" fill="white" fillOpacity="0.8" />
            <Circle cx="136" cy="78" r="4" fill="white" fillOpacity="0.8" />
        </G>
    );
};
