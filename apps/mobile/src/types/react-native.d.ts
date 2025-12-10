import 'react-native';

// Extend ViewStyle to include iOS-specific cornerCurve property
declare module 'react-native' {
    interface ViewStyle {
        /**
         * iOS 13+ corner curve style for continuous (squircle) corners
         * @platform ios
         */
        cornerCurve?: 'circular' | 'continuous';
    }
}
