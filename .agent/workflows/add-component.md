---
description: How to add a new reusable component
---

# Adding a New Component

## 1. Create the Component File

Create `apps/mobile/src/components/[ComponentName].tsx`:

```tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { LiquidGlass } from '../theme/theme';

interface [ComponentName]Props {
    // Define props
}

export function [ComponentName]({ ...props }: [ComponentName]Props) {
    return (
        <View style={styles.container}>
            {/* Component content */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // Use theme tokens
        padding: LiquidGlass.spacing.lg,
        borderRadius: LiquidGlass.radius.lg,
        backgroundColor: LiquidGlass.colors.card,
    },
});
```

## 2. Required Patterns

- Export as named export (not default)
- Define TypeScript interface for props
- Use `LiquidGlass` tokens for all styling
- Add `accessibilityLabel` to interactive elements
- Minimum touch target: 44pt (use `hitSlop` if needed)

## 3. Glass Components

For glass/blur effects, use:

```tsx
import { LiquidGlassView } from './SafeLiquidGlassView';

<LiquidGlassView style={styles.glass}>{/* Content */}</LiquidGlassView>;
```
