import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from '../screens/HomeScreen';
import { PetScreen } from '../screens/PetScreen';
import { TrendsScreen } from '../screens/TrendsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { HabitFormScreen } from '../screens/HabitFormScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { useHabit } from '@habitapp/shared';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { Home, User, TrendingUp, Settings } from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => (
    <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarStyle: {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                elevation: 0,
                borderTopWidth: 0,
                backgroundColor: 'transparent',
                height: 85,
            },
            tabBarBackground: () => (
                <BlurView tint="dark" intensity={80} style={StyleSheet.absoluteFill} />
            ),
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
            tabBarShowLabel: false,
        }}
    >
        <Tab.Screen
            name="Today"
            component={HomeScreen}
            options={{
                tabBarIcon: ({ color }) => <Home size={24} color={color} />
            }}
        />
        <Tab.Screen
            name="Pet"
            component={PetScreen}
            options={{
                tabBarIcon: ({ color }) => <User size={24} color={color} />
            }}
        />
        <Tab.Screen
            name="Trends"
            component={TrendsScreen}
            options={{
                tabBarIcon: ({ color }) => <TrendingUp size={24} color={color} />
            }}
        />
        <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
                tabBarIcon: ({ color }) => <Settings size={24} color={color} />
            }}
        />
    </Tab.Navigator>
);

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
                            options={{ presentation: 'modal' }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
