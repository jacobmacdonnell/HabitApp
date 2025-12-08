import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, StyleProp, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LiquidGlass } from '../theme/theme';

interface ScreenWrapperProps {
    children: React.ReactNode;
    scrollable?: boolean;
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    footer?: React.ReactNode;
    keyboardAvoiding?: boolean;
    isModal?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    scrollable = true,
    style,
    contentContainerStyle,
    footer,
    keyboardAvoiding = false,
    isModal = false
}) => {
    const insets = useSafeAreaInsets();

    const containerStyles = [
        styles.container,
        { paddingTop: isModal ? 0 : insets.top },
        style
    ];

    const bottomPadding = isModal ? insets.bottom + 32 : 100;

    const Content = (
        <>
            {scrollable ? (
                <ScrollView
                    style={[containerStyles, { backgroundColor: LiquidGlass.backgroundColor }]}
                    contentContainerStyle={[
                        styles.scrollContent,
                        isModal && { paddingTop: 32 }, // Visual top padding for modals
                        { paddingBottom: isModal ? insets.bottom + 32 : 100 },
                        contentContainerStyle
                    ]}
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior={isModal ? 'never' : 'automatic'}
                >
                    {children}
                </ScrollView>
            ) : (
                <View style={containerStyles}>
                    {children}
                </View>
            )}
            {footer}
        </>
    );

    return (
        <View style={styles.wrapper}>


            {keyboardAvoiding ? (
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    {Content}
                </KeyboardAvoidingView>
            ) : (
                Content
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: LiquidGlass.backgroundColor, // Fallback
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: LiquidGlass.dock.horizontalPadding,
        paddingBottom: 100, // Space for dock
    }
});
