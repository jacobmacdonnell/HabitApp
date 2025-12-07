import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Home, User, TrendingUp, Settings } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';

const { width } = Dimensions.get('window');

// Interactive Tab Icon Component
const TabButton = ({ state, descriptors, navigation, route, index }: any) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const onPress = () => {
        const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
            // Haptic Feedback (Light, crisp)
            Haptics.selectionAsync();
            navigation.navigate(route.name);
        }
    };

    const onPressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.85, // Deep "retractive" press like Control Center
            useNativeDriver: true,
            speed: 50,
            bounciness: 0,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 6, // Gentle bounce back
        }).start();
    };

    const Icon = options.tabBarIcon;

    return (
        <TouchableOpacity
            activeOpacity={1} // Handled by animation
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={styles.tabButton}
        >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Icon
                    color={isFocused ? '#fff' : 'rgba(255,255,255,0.4)'}
                    focused={isFocused}
                />
            </Animated.View>
            {isFocused && (
                <Animated.View
                    style={[
                        styles.indicator,
                        { opacity: scaleAnim } // Fade indicator slightly on press
                    ]}
                />
            )}
        </TouchableOpacity>
    );
};

// Custom Tab Bar Container
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    return (
        <View style={styles.tabContainer}>
            {/* Floating Glass Background */}
            <BlurView
                intensity={80}
                tint="systemMaterialDark"
                style={styles.blurBackground}
            />

            <View style={styles.tabRow}>
                {state.routes.map((route: any, index: number) => (
                    <TabButton
                        key={route.key}
                        route={route}
                        index={index}
                        state={state}
                        navigation={navigation}
                        descriptors={descriptors}
                    />
                ))}
            </View>
        </View>
    );
};

export default function TabLayout() {
    return (
        <Tabs
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, focused }: any) => <Home size={24} color={color} strokeWidth={focused ? 3 : 2} />,
                }}
            />
            <Tabs.Screen
                name="pet"
                options={{
                    tabBarIcon: ({ color, focused }: any) => <User size={24} color={color} strokeWidth={focused ? 3 : 2} />,
                }}
            />
            <Tabs.Screen
                name="trends"
                options={{
                    tabBarIcon: ({ color, focused }: any) => <TrendingUp size={24} color={color} strokeWidth={focused ? 3 : 2} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    tabBarIcon: ({ color, focused }: any) => <Settings size={24} color={color} strokeWidth={focused ? 3 : 2} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        position: 'absolute',
        bottom: 34,
        left: 20,
        right: 20,
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    blurBackground: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    tabRow: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    indicator: {
        position: 'absolute',
        bottom: 8,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#fff',
    }
});
