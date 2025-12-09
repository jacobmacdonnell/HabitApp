# 🐾 Habit Companion

A gamified habit tracking app with a virtual pet companion. By caring for your own habits, you care for your digital companion—creating a positive feedback loop that encourages consistency.

## 🏗️ Architectural Overview

### 🌌 "Liquid Glass" Design System (iOS 26 Hybrid)
This project implements a futuristic design language native to **iOS 26**, blending real-time refraction with physics-based interactivity. To balance bleeding-edge aesthetics with 60fps performance, we utilize a **Hybrid Architecture**:

1.  **Native Glass (`@callstack/liquid-glass`)**:
    *   Used for high-fidelity interactive elements like the **Floating Action Button (FAB)** and **GlassButtons**.
    *   **Why**: Supports native iOS 26 "morphing" transitions where glass elements merge fluidly.
    *   **Tech**: Bridges directly to SwiftUI `Material` and `UIVisualEffectView` APIs.

2.  **Simulated Glass (Optimized `rgba`)**:
    *   Used for high-frequency list items like **Habit Cards** and **Onboarding panels**.
    *   **Why**: Prevents frame drops in long lists. The simulated `rgba(255,255,255,0.08)` overlay provides 98% visual parity with zero performance cost.
    *   **Theme Tokens**: Centralized in `src/theme/theme.ts` under `LiquidGlass.colors`.

### 💾 Offline-First Data Layer
The app utilizes a privacy-centric **Local-First** architecture.

*   **Engine**: `expo-sqlite` (new architecture enabled).
*   **ORM**: Drizzle ORM for type-safe SQL.
*   **Performance**: Uses a **Composite Key Upsert** strategy to minimize storage writes and battery impact, performing atomic updates via `onConflictDoUpdate`.

### 🤖 The "Pet" System
The virtual companion is a state machine driven by user behavior (`src/components/Pet.tsx`).
*   **State**: Experience (XP), Health, and Mood are derived from the `daily_progress` table.
*   **Interactivity**: Uses `react-native-reanimated` for breathing cycles and `expo-haptics` for tactile feedback.

## 🧩 Project Structure
This is a **monorepo** powered by npm workspaces:

```
habitapp/
├── apps/
│   ├── web/          # React + Vite web application
│   └── mobile/       # React Native + Expo mobile app (iOS 26 Target)
├── packages/
│   └── shared/       # Shared types, utils, and context
└── package.json      # Workspace configuration
```

## 🛠️ Tech Stack

### Mobile App (`apps/mobile`)
- **Framework**: React Native 0.81 + Expo SDK 54
- **Target**: iOS 26.0 (Managed Workflow)
- **Database**: SQLite (via Drizzle ORM)
- **Styling**: Hybrid Liquid Glass (Native + Simulated)
- **Animations**: Reanimated + Confetti Cannon

### Web App (`apps/web`)
- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS v4

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Xcode 26 (for iOS simulator)

### Installation
```bash
npm install
```

### Development
```bash
# Run mobile app (Expo)
npm run mobile:ios

# Run web app
npm run web
```

## 📱 Core Features
- **Smart Habits**: Time-of-day buckets, flexible frequency, and streaks.
- **Trends**: GitHub-style monthly heatmaps.
- **Companion Pet**: A living entity that reacts to your consistency.

## 📄 License
Private project.
