---
description: How to add a new screen to the mobile app
---

# Adding a New Screen

## 1. Create the Screen File

Create `apps/mobile/src/screens/[ScreenName]Screen.tsx`:

```tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LiquidGlass } from '../theme/theme';

export default function [ScreenName]Screen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Screen content */}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        padding: LiquidGlass.screenPadding,
    },
});
```

## 2. Add Navigation Route

Add to `apps/mobile/app/(tabs)/` or appropriate location.

## 3. Required Patterns

- Use `useSafeAreaInsets()` for safe area handling
- Use `LiquidGlass.spacing.*` for all padding/margin
- Use `LiquidGlass.typography.size.*` for font sizes
- Use `LiquidGlass.colors.*` for colors
- Add `accessibilityLabel` to all TouchableOpacity elements
