import { AlertTriangle, RefreshCw } from 'lucide-react-native';
import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { LiquidGlass } from '../theme/theme';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to console in development
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // In production, you would send this to an error tracking service
        // e.g., Sentry.captureException(error);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.iconContainer}>
                            <AlertTriangle size={48} color={LiquidGlass.colors.warning} />
                        </View>

                        <Text style={styles.title}>Something went wrong</Text>
                        <Text style={styles.message}>
                            We're sorry, but something unexpected happened. Please try again.
                        </Text>

                        {__DEV__ && this.state.error && (
                            <View style={styles.errorDetails}>
                                <Text style={styles.errorText}>{this.state.error.message}</Text>
                            </View>
                        )}

                        <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry} activeOpacity={0.8}>
                            <RefreshCw size={20} color={LiquidGlass.colors.black} />
                            <Text style={styles.retryText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LiquidGlass.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: LiquidGlass.spacing.xl,
    },
    content: {
        alignItems: 'center',
        maxWidth: 300,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: LiquidGlass.radius.xxl,
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: LiquidGlass.spacing.xxl,
    },
    title: {
        fontSize: LiquidGlass.typography.size.title2,
        fontWeight: LiquidGlass.typography.weight.bold,
        color: LiquidGlass.text.primary,
        marginBottom: LiquidGlass.spacing.md,
        textAlign: 'center',
    },
    message: {
        fontSize: LiquidGlass.typography.size.body,
        fontWeight: LiquidGlass.typography.weight.regular,
        color: LiquidGlass.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: LiquidGlass.spacing.xxl,
    },
    errorDetails: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: LiquidGlass.radius.md,
        padding: LiquidGlass.spacing.md,
        marginBottom: LiquidGlass.spacing.xxl,
        width: '100%',
    },
    errorText: {
        fontSize: LiquidGlass.typography.size.caption1,
        fontWeight: LiquidGlass.typography.weight.medium,
        color: LiquidGlass.colors.danger,
        fontFamily: 'monospace',
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: LiquidGlass.colors.white,
        paddingVertical: LiquidGlass.spacing.lg,
        paddingHorizontal: LiquidGlass.spacing.xxl,
        borderRadius: LiquidGlass.radius.xxl,
        gap: LiquidGlass.spacing.sm,
    },
    retryText: {
        fontSize: LiquidGlass.typography.size.body,
        fontWeight: LiquidGlass.typography.weight.semibold,
        color: LiquidGlass.colors.black,
    },
});
