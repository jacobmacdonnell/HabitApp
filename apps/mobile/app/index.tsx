import { Redirect } from 'expo-router';
import { useHabit } from '@habitapp/shared';

export default function Index() {
    const { isOnboarding } = useHabit();

    if (isOnboarding) {
        return <Redirect href="/onboarding" />;
    }

    return <Redirect href="/(tabs)" />;
}
