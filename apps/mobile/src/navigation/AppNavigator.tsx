import React, { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { PetScreen } from '../screens/PetScreen';
import { TrendsScreen } from '../screens/TrendsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { HabitFormScreen } from '../screens/HabitFormScreen';
import { PetStyleScreen } from '../screens/PetStyleScreen';
import { PetWardrobeScreen } from '../screens/PetWardrobeScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { useHabit, Habit } from '@habitapp/shared';
import { BlurView } from 'expo-blur';
import { StyleSheet, Animated, Platform } from 'react-native';
import { LiquidGlass } from '../theme/theme';

import { Home, User, TrendingUp, Settings } from 'lucide-react-native';

export type RootStackParamList = {
    Onboarding: undefined;
    Main: undefined;
    HabitForm: { habit?: Habit };
    PetStyle: undefined;
    PetWardrobe: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Native Stacks for Tabs
const HomeStack = createNativeStackNavigator();
const PetStack = createNativeStackNavigator();
const TrendsStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

const HomeStackScreen = () => (
    <HomeStack.Navigator
        screenOptions={{
            headerLargeTitle: false,
            headerTransparent: true,
            headerStyle: { backgroundColor: 'transparent' },
            headerTitleStyle: { color: 'transparent' }, // Hide native title
            headerLargeTitleStyle: { color: 'transparent' }, // Hide native large title
        }}
    >
        <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
    </HomeStack.Navigator>
);

const PetStackScreen = () => (
    <PetStack.Navigator
        screenOptions={{
            headerTransparent: true,
            headerStyle: { backgroundColor: 'transparent' },
            headerTitleStyle: { color: 'transparent' }, // Hide title initially? Or keep it.
            // For PetScreen "Hero" layout, we might want to hide the standard large title or handle it carefully.
            headerLargeTitle: false,
            headerTintColor: '#fff',
        }}
    >
        <PetStack.Screen name="PetScreen" component={PetScreen} options={{ title: 'Companion' }} />
    </PetStack.Navigator>
);

const TrendsStackScreen = () => (
    <TrendsStack.Navigator
        screenOptions={{
            headerLargeTitle: false,
            headerTransparent: true,
            headerStyle: { backgroundColor: 'transparent' },
            headerTitleStyle: { color: 'transparent' },
            headerLargeTitleStyle: { color: 'transparent' },
        }}
    >
        <TrendsStack.Screen name="TrendsScreen" component={TrendsScreen} options={{ title: 'Trends' }} />
    </TrendsStack.Navigator>
);

const SettingsStackScreen = () => (
    <SettingsStack.Navigator
        screenOptions={{
            headerLargeTitle: false,
            headerTransparent: true,
            headerStyle: { backgroundColor: 'transparent' },
            headerTitleStyle: { color: 'transparent' },
            headerLargeTitleStyle: { color: 'transparent' },
        }}
    >
        <SettingsStack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings' }} />
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

const TabNavigator = () => {
    const insets = useSafeAreaInsets();

    // Calculate dynamic bottom position - float slightly above home indicator
    const bottomPosition = Platform.OS === 'ios' ? insets.bottom + 20 : 20;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: bottomPosition,
                    left: LiquidGlass.dock.horizontalPadding,
                    right: LiquidGlass.dock.horizontalPadding,
                    height: LiquidGlass.dock.height,
                    borderRadius: LiquidGlass.dock.borderRadius,
                    borderTopWidth: 0,
                    backgroundColor: 'transparent',
                    elevation: LiquidGlass.dock.shadow.elevation,
                    shadowColor: LiquidGlass.dock.shadow.shadowColor,
                    shadowOffset: LiquidGlass.dock.shadow.shadowOffset,
                    shadowOpacity: LiquidGlass.dock.shadow.shadowOpacity,
                    shadowRadius: LiquidGlass.dock.shadow.shadowRadius,
                },
                tabBarBackground: () => (
                    <BlurView
                        tint="systemThickMaterialDark"
                        intensity={LiquidGlass.intensity.heavy}
                        style={[StyleSheet.absoluteFill, { borderRadius: LiquidGlass.dock.borderRadius, overflow: 'hidden' }]}
                    />
                ),
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    // Center icons perfectly in the dock
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 10,
                }
            }}
        >
            <Tab.Screen
                name="Today"
                component={HomeStackScreen}
                options={{
                    tabBarIcon: ({ focused, color }) => <BouncyIcon focused={focused} icon={Home} color={color} size={24} />
                }}
            />
            <Tab.Screen
                name="Pet"
                component={PetStackScreen}
                options={{
                    tabBarIcon: ({ focused, color }) => <BouncyIcon focused={focused} icon={User} color={color} size={24} />
                }}
            />
            <Tab.Screen
                name="Trends"
                component={TrendsStackScreen}
                options={{
                    tabBarIcon: ({ focused, color }) => <BouncyIcon focused={focused} icon={TrendingUp} color={color} size={24} />
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsStackScreen}
                options={{
                    tabBarIcon: ({ focused, color }) => <BouncyIcon focused={focused} icon={Settings} color={color} size={24} />
                }}
            />
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
                                headerShown: true
                            }}
                        />
                        <Stack.Screen
                            name="PetStyle"
                            component={PetStyleScreen}
                            options={{
                                presentation: 'modal',
                                headerShown: true
                            }}
                        />
                        <Stack.Screen
                            name="PetWardrobe"
                            component={PetWardrobeScreen}
                            options={{
                                presentation: 'modal',
                                headerShown: true
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
