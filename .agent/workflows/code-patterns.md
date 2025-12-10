---
description: Code patterns and conventions for this codebase
---

# Code Patterns

## Screen Structure

```tsx
// 1. Imports (React, RN, third-party, local)
import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LiquidGlass } from '../theme/theme';
import { useHabits } from '../context/HabitContext';

// 2. Component
export default function ScreenName() {
    const insets = useSafeAreaInsets();
    const { habits } = useHabits();

    // 3. State
    const [state, setState] = useState();

    // 4. Memoized values
    const computed = useMemo(() => {}, [deps]);

    // 5. Callbacks
    const handleAction = useCallback(() => {}, [deps]);

    // 6. Render
    return <View>...</View>;
}

// 7. Styles at bottom
const styles = StyleSheet.create({});
```

## Context Usage

```tsx
import { useHabits } from '../context/HabitContext';
const { habits, pet, toggleHabit, addHabit } = useHabits();
```

## Navigation

```tsx
import { useRouter } from 'expo-router';
const router = useRouter();
router.push('/screen-name');
router.back();
```

## Glass Components

```tsx
// SafeLiquidGlassView - use for glass effects
import { LiquidGlassView } from '../components/SafeLiquidGlassView';
```

## Lists

```tsx
// Use FlatList for dynamic lists (not ScrollView with .map())
<FlatList data={items} keyExtractor={(item) => item.id} renderItem={({ item }) => <ItemComponent item={item} />} />
```
