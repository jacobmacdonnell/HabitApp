import SegmentedControl, { SegmentedControlProps } from '@react-native-segmented-control/segmented-control';
import React from 'react';

import { LiquidGlass } from '../theme/theme';

interface GlassSegmentedControlProps extends Omit<
    SegmentedControlProps,
    'appearance' | 'fontStyle' | 'activeFontStyle' | 'backgroundColor'
> {
    // We can add custom props here if needed in the future
}

export const GlassSegmentedControl: React.FC<GlassSegmentedControlProps> = (props) => {
    return (
        <SegmentedControl
            appearance="dark"
            backgroundColor={LiquidGlass.segmentedControl.backgroundColor}
            fontStyle={LiquidGlass.segmentedControl.fontStyle}
            activeFontStyle={LiquidGlass.segmentedControl.activeFontStyle}
            style={[{ height: LiquidGlass.segmentedControl.height }, props.style]}
            {...props}
        />
    );
};
