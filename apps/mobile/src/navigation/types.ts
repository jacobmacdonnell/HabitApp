import { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Habit } from '@habitapp/shared';

// --- Root Stack ---
export type RootStackParamList = {
    Onboarding: undefined;
    Main: NavigatorScreenParams<TabParamList>;
    HabitForm: { habit?: Habit };
    PetCustomize: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
    RootStackParamList,
    T
>;

// --- Main Tab ---
export type TabParamList = {
    Today: undefined;
    Pet: undefined;
    Trends: undefined;
    Settings: undefined;
};

export type RootTabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
    BottomTabScreenProps<TabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
>;

// --- Helper for useNavigation ---
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
