import React from 'react';
import { View, ViewProps } from 'react-native';

let LiquidGlassView: any;

try {
    // Try to load the native module
    const lib = require('@callstack/liquid-glass');
    LiquidGlassView = lib.LiquidGlassView;
} catch (e) {
    console.log('SafeLiquidGlassView: Native module not found (Expo Go?), falling back to View.');
    // Fallback component
    LiquidGlassView = (props: ViewProps) => <View {...props} />;
}

interface SafeLiquidGlassViewProps extends ViewProps {
    interactive?: boolean;
    intensity?: number;
    // Add other known props from native module if needed
}

export const SafeLiquidGlassView = (props: SafeLiquidGlassViewProps) => {
    return <LiquidGlassView {...props} />;
};
