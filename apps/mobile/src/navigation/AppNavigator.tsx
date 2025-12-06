import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { PetScreen } from '../screens/PetScreen';
import { TrendsScreen } from '../screens/TrendsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { HabitFormScreen } from '../screens/HabitFormScreen';
import { PetCustomizeScreen } from '../screens/PetCustomizeScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { useHabit, Habit } from '@habitapp/shared';
import { GlassView } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import { StyleSheet, Animated, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { LiquidGlass } from '../theme/theme';

import { Home, User, TrendingUp, Settings, Plus } from 'lucide-react-native';

import { RootStackParamList, TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Native Stacks for Tabs - These are internal to the tabs so we can keep them simple or type them if needed
const HomeStack = createNativeStackNavigator();
const PetStack = createNativeStackNavigator();
const TrendsStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

const HomeStackScreen = () => (
    <HomeStack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
);

const PetStackScreen = () => (
    <PetStack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <PetStack.Screen name="PetScreen" component={PetScreen} />
    </PetStack.Navigator>
);

const TrendsStackScreen = () => (
    <TrendsStack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <TrendsStack.Screen name="TrendsScreen" component={TrendsScreen} />
    </TrendsStack.Navigator>
);

const SettingsStackScreen = () => (
    <SettingsStack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <SettingsStack.Screen name="SettingsScreen" component={SettingsScreen} />
    </SettingsStack.Navigator>
);

const BouncyIcon = ({ focused, icon: Icon, color, size }: { focused: boolean; icon: any; color: string; size: number }) => {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scale, {
            toValue: focused ? 1.2 : 1,
            friction: 4,
            useNativeDriver: true,
        }).start();
    }, [focused]);

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Icon size={size} color={color} strokeWidth={focused ? 3 : 2.5} />
        </Animated.View>
    );
};

// Custom Tab Bar with Sliding Glass Indicator
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    const insets = useSafeAreaInsets();
    const bottomPosition = Platform.OS === 'ios' ? insets.bottom + 16 : 16;
    const toolbarHeight = 68;
    const tabCount = state.routes.length;

    // Animated value for sliding indicator
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: state.index,
            friction: 8,
            tension: 100,
            useNativeDriver: true,
        }).start();
    }, [state.index]);

    return (
        <View style={{
            position: 'absolute',
            bottom: bottomPosition,
            left: 20,
            right: 20,
            height: toolbarHeight,
            borderRadius: 34,
        }}>
            {/* Glass Background */}
            <GlassView
                style={[
                    StyleSheet.absoluteFill,
                    {
                        borderRadius: 34,
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.1)'
                    }
                ]}
                glassEffectStyle="regular"
            />

            {/* Sliding Indicator */}
            <Animated.View
                style={{
                    position: 'absolute',
                    width: `${100 / tabCount}%`,
                    height: 52,
                    top: 8,
                    left: 8,
                    transform: [{
                        translateX: slideAnim.interpolate({
                            inputRange: Array.from({ length: tabCount }, (_, i) => i),
                            outputRange: Array.from({ length: tabCount }, (_, i) =>
                                i * ((Dimensions.get('window').width - 40 - 16) / tabCount)
                            ),
                        })
                    }],
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderRadius: 26,
                }}
            />

            {/* Tab Items */}
            <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                paddingHorizontal: 8,
            }}>
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const IconComponent = ({
                        Today: Home,
                        Pet: User,
                        Trends: TrendingUp,
                        Settings: Settings,
                    } as Record<string, any>)[route.name] || Home;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            onPress={onPress}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: toolbarHeight,
                            }}
                        >
                            <BouncyIcon
                                focused={isFocused}
                                icon={IconComponent}
                                color={isFocused ? '#fff' : 'rgba(255,255,255,0.4)'}
                                size={24}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const TabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="Today" component={HomeStackScreen} />
            <Tab.Screen name="Pet" component={PetStackScreen} />
            <Tab.Screen name="Trends" component={TrendsStackScreen} />
            <Tab.Screen name="Settings" component={SettingsStackScreen} />
        </Tab.Navigator>
    );
};


export const AppNavigator = () => {
    const { isOnboarding } = useHabit();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isOnboarding ? (
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                ) : (
                    <>
                        <Stack.Screen name="Main" component={TabNavigator} />
                        <Stack.Screen
                            name="HabitForm"
                            component={HabitFormScreen}
                            options={{
                                presentation: 'modal',
                                headerShown: true,
                                headerStyle: { backgroundColor: '#1c1c1e' },
                                headerTintColor: '#fff',
                                headerShadowVisible: false, // Remove dark line
                                contentStyle: { backgroundColor: '#1c1c1e' },
                            }}
                        />
                        <Stack.Screen
                            name="PetCustomize"
                            component={PetCustomizeScreen}
                            options={{
                                presentation: 'modal',
                                headerShown: true,
                                headerStyle: { backgroundColor: '#1c1c1e' },
                                headerTintColor: '#fff',
                                headerShadowVisible: false, // Remove dark line
                                contentStyle: { backgroundColor: '#1c1c1e' },
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
