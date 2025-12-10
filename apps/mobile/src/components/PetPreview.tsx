import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, RadialGradient, Stop, Circle, G, Rect } from 'react-native-svg';

interface PetPreviewProps {
    color: string;
    hat: string;
    mood: string;
}

export const PetPreview = ({ color, hat, mood }: PetPreviewProps) => {
    const isSleeping = mood === 'sleeping';
    const isHappy = mood === 'happy';
    const isSad = mood === 'sad';
    const isSick = mood === 'sick';

    const renderEyes = () => {
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

    const renderMouth = () => {
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
        return (
            <Path d="M 70 130 L 130 130" stroke="rgba(0,0,0,0.8)" strokeWidth="6" fill="none" strokeLinecap="round" />
        );
    };

    const renderHat = () => {
        if (!hat || hat === 'none') return null;
        return (
            <G transform="translate(60, 10) scale(0.8)">
                {hat === 'party' && (
                    <Path
                        d="M50 10 L80 70 L20 70 Z"
                        fill="#facc15"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
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
                {/* Fallback for new hats if not yet implemented in SVG */}
            </G>
        );
    };

    return (
        <View style={styles.previewContainer}>
            {/* Glow behind pet */}
            <View style={styles.glowWrapper}>
                <Svg height="180" width="180" viewBox="0 0 180 180">
                    <Defs>
                        <RadialGradient id="previewGlow" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor={color} stopOpacity="0.4" />
                            <Stop offset="100%" stopColor={color} stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Circle cx="90" cy="90" r="90" fill="url(#previewGlow)" />
                </Svg>
            </View>

            {/* Pet */}
            <Svg viewBox="0 0 200 200" style={styles.petSvg}>
                <Defs>
                    <RadialGradient id="previewBodyGrad" cx="30%" cy="30%" r="80%">
                        <Stop offset="0%" stopColor={color} stopOpacity="1" />
                        <Stop offset="100%" stopColor={color} stopOpacity="0.8" />
                    </RadialGradient>
                </Defs>
                <Path
                    d="M100,180 C60,180 30,150 30,110 C30,80 50,55 75,50 C80,30 100,20 120,30 C140,20 160,35 165,60 C185,70 190,100 180,125 C190,150 170,180 130,180 Z"
                    fill="url(#previewBodyGrad)"
                    stroke={color}
                    strokeWidth="2"
                />
                <Path
                    d="M90,50 Q100,10 115,45 Q125,15 135,50"
                    fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                <G transform="translate(0, 10)">
                    {renderEyes()}
                    {renderMouth()}
                    {!isSick && (
                        <G>
                            <Circle cx="60" cy="125" r="14" fill="#ff99cc" opacity="0.5" />
                            <Circle cx="140" cy="125" r="14" fill="#ff99cc" opacity="0.5" />
                        </G>
                    )}
                    {renderHat()}
                </G>
            </Svg>
        </View>
    );
};

// Hat preview icon for grid
export const HatIcon = ({ type }: { type: string }) => {
    if (type === 'none') return <View style={styles.noneIcon} />;

    return (
        <Svg viewBox="0 0 100 100" style={{ width: 36, height: 36 }}>
            {type === 'party' && (
                <Path d="M50 10 L80 70 L20 70 Z" fill="#facc15" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            )}
            {type === 'cowboy' && (
                <G>
                    <Path d="M10 60 Q50 30 90 60" fill="#78350f" stroke="white" strokeWidth="2" />
                    <Path d="M30 60 L30 40 Q50 20 70 40 L70 60" fill="#78350f" stroke="white" strokeWidth="2" />
                </G>
            )}
            {type === 'tophat' && (
                <G>
                    <Rect x="20" y="60" width="60" height="10" fill="#1f2937" stroke="white" strokeWidth="2" />
                    <Rect x="30" y="20" width="40" height="40" fill="#1f2937" stroke="white" strokeWidth="2" />
                    <Rect x="30" y="50" width="40" height="5" fill="#ef4444" />
                </G>
            )}
            {type === 'crown' && (
                <Path
                    d="M20 60 L20 30 L35 50 L50 20 L65 50 L80 30 L80 60 Z"
                    fill="#fbbf24"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
            )}
        </Svg>
    );
};

const styles = StyleSheet.create({
    previewContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 180,
        marginBottom: 24,
    },
    glowWrapper: {
        position: 'absolute',
    },
    petSvg: {
        width: 140,
        height: 140,
    },
    noneIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        borderStyle: 'dashed',
    },
});
