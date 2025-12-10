import { useHabit } from '@habitapp/shared';
import { Redirect } from 'expo-router';

export default function Index() {
    const { isOnboarding } = useHabit();

    if (isOnboarding) {
        return <Redirect href="/onboarding" />;
    }

    return <Redirect href="/home" />;
}
