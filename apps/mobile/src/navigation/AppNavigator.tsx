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
import { StyleSheet, Animated, Platform } from 'react-native';
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

const TabNavigator = () => {
    const insets = useSafeAreaInsets();

    // iOS 26 Toolbar Specs
    // Height: 68pt
    // Bottom Float: 16pt above home indicator
    // Horizontal Padding: 20pt for floating look
    const bottomPosition = Platform.OS === 'ios' ? insets.bottom + 16 : 16;
    const toolbarHeight = 68;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: bottomPosition,
                    left: 20,
                    right: 20,
                    height: toolbarHeight,
                    borderRadius: 34, // Fully rounded pill (half of 68)
                    borderTopWidth: 0,
                    backgroundColor: 'transparent',
                    elevation: 0, // Remove default elevation, handled by container shadow
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.25,
                    shadowRadius: 20,
                },
                tabBarBackground: () => (
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
                ),
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 0, // remove potential padding affecting centering
                    height: toolbarHeight,
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

            {/* Integrated "Add" Button - iOS 26 Style */}
            <Tab.Screen
                name="Add"
                component={View} // Dummy component
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        (navigation as any).navigate('HabitForm');
                    },
                })}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            width: 52,
                            height: 52,
                            borderRadius: 26,
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.2)',
                            shadowColor: '#000',
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            shadowOffset: { width: 0, height: 2 }
                        }}>
                            <Plus size={28} color="#fff" strokeWidth={3} />
                        </View>
                    ),
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
