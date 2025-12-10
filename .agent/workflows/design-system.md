---
description: Theme tokens and design system reference
---

# Design System Reference

## Spacing Tokens

```
LiquidGlass.spacing.xs   = 4
LiquidGlass.spacing.sm   = 8
LiquidGlass.spacing.md   = 12
LiquidGlass.spacing.lg   = 16
LiquidGlass.spacing.xl   = 20
LiquidGlass.spacing.xxl  = 24
LiquidGlass.spacing.xxxl = 32

LiquidGlass.screenPadding = 20
```

## Typography

```
LiquidGlass.typography.size.largeTitle = 34
LiquidGlass.typography.size.title1     = 28
LiquidGlass.typography.size.title2     = 22
LiquidGlass.typography.size.title3     = 20
LiquidGlass.typography.size.headline   = 17
LiquidGlass.typography.size.body       = 16
LiquidGlass.typography.size.callout    = 15
LiquidGlass.typography.size.subheadline = 14
LiquidGlass.typography.size.footnote   = 13
LiquidGlass.typography.size.caption1   = 12
LiquidGlass.typography.size.caption2   = 11
LiquidGlass.typography.size.micro      = 10
```

## Key Colors

```
LiquidGlass.colors.primary     - Main accent
LiquidGlass.colors.secondary   - Secondary accent
LiquidGlass.colors.success     - Green
LiquidGlass.colors.danger      - Red
LiquidGlass.colors.currency    - XP/gold color
LiquidGlass.colors.card        - Card backgrounds
LiquidGlass.colors.surface     - Surface backgrounds
LiquidGlass.colors.border      - Border color
```

> **Full color list:** see [`theme.ts`](file:///apps/mobile/src/theme/theme.ts)

## Touch Targets

- Minimum: 44pt × 44pt
- If element is smaller, add: `hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}`

## Accessibility

Always add to TouchableOpacity:

```tsx
accessibilityLabel = 'Description of action';
accessibilityRole = 'button';
```
