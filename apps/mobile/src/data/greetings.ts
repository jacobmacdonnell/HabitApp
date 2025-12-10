export const getGreeting = (): string => {
    const hour = new Date().getHours();

    const morning = [
        'Rise and shine!',
        'Good morning!',
        'Ready to conquer?',
        'Top of the morning!',
        "Let's get started!",
        'Hello, sunshine!',
        'New day, new habits!',
    ];

    const afternoon = [
        'Good afternoon!',
        'Keep it up!',
        "You're doing great!",
        'stay focused!',
        'Crushing it today?',
        "Don't stop now!",
        'Afternoon boost!',
    ];

    const evening = [
        'Good evening!',
        'Time to wind down.',
        'Reflect on today.',
        'Sleep well soon.',
        'Great work today!',
        'Night owl mode?',
        'Finish strong!',
    ];

    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    if (hour < 5) return 'Burning the midnight oil?';
    if (hour < 12) return pick(morning);
    if (hour < 17) return pick(afternoon);
    return pick(evening);
};
