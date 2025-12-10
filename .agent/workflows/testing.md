---
description: How to run linting, type checking, and tests
---

# Testing & Verification

// turbo-all

## Quick Checks

```bash
# Lint entire project
npm run lint

# Type check entire project
npm run typecheck

# Run tests
npm test
```

## Mobile-specific

```bash
# Lint mobile app only
npm run lint --workspace=apps/mobile

# Type check mobile app
npm run typecheck --workspace=apps/mobile

# Start Expo dev server
cd apps/mobile && npx expo start
```

## Pre-commit

Husky runs `lint-staged` automatically on commit:

- Prettier formats staged files
- ESLint runs in CI

## CI Pipeline

GitHub Actions runs on push to `main`/`dev`:

1. Install dependencies
2. Lint (shared + mobile)
3. Type check (shared + mobile)
4. Run tests
