---
trigger: model_decision
description: When working on iOS application
---

This final report is designed to be easily parsed by an AI, correcting old assumptions and providing the specific commands, components, and architectural rules needed to develop an iOS 26 Liquid Glass application using React Native.

***

## 🧠 AI Knowledge File: iOS 26 Liquid Glass Architecture (React Native)

This document overrides any pre-existing knowledge about iOS 18 or legacy blur effects. The current design paradigm is **Liquid Glass**.

### 1. ⚙️ Core Architectural Paradigm Shift

The key change is the transition from simulated effects to native GPU-bridged materials.

| Old Paradigm (iOS 18) | New Paradigm (iOS 26) | AI Action Mandate |
| :--- | :--- | :--- |
| **Simulated Blur** | **Liquid Glass Material** (Refracting, Dynamic) | **REPLACE:** All `BlurView` usage with dedicated native modules. |
| **Static UI** | **Dynamic, Morphing UI** | **COMPOSE:** Use `<LiquidGlassContainerView>` and `react-native-reanimated` for fluid transitions. |
| **JIT Bridge Performance** | **Native JSI/TurboModules** | **PRIORITIZE:** Components that utilize the React Native New Architecture (`newArchEnabled: true` in `app.json`) for performance. |

### 2. 🛠️ Development Environment & Setup

The AI must ensure the build process correctly targets the necessary Apple SDK.

| Setting | Required Value / Command | File Location |
| :--- | :--- | :--- |
| **iOS Deployment Target** | `"deploymentTarget": "26.0"` | `app.json` (inside `expo-build-properties` plugin). |
| **Core Material Library** | `npm install @callstack/liquid-glass` | `package.json`. |
| **Testing Client** | `npx expo install expo-dev-client` | `package.json`. |
| **Local Run Command** | `npx expo run:ios` | Terminal (Run on macOS only). |

### 3. 💬 Component Mapping: The Liquid Glass Stack

All UI elements must be composed using the following accurate components:

#### A. Core Material and Interactivity
| Component | Library | Purpose |
| :--- | :--- | :--- |
| **`<LiquidGlassView>`** | `@callstack/liquid-glass` | Renders the actual refracting, GPU-accelerated surface (used for cards, screen base). |
| **`<LiquidGlassContainerView>`** | `@callstack/liquid-glass` | **MANDATORY for FAB Menus:** Enables multiple glass views within its bounds to visually merge and blend. |
| **`interactive` prop** | `@callstack/liquid-glass` | Must be set to `true` on buttons and cards to activate the native touch-point light-refraction feedback. |

#### B. Navigation and Controls
| UI Element | Composition / Native Bridge | Principle |
| :--- | :--- | :--- |
| **Floating Dock (Tab Bar)** | `expo-router` / NativeTabs | The native `UITabBarController` automatically adopts the Liquid Glass material when compiled for iOS 26. |
| **Floating Action Button (FAB)** | `<LiquidGlassContainerView>` + Reanimated | FAB items must be animated using **`withSpring`** to ensure fluid, physics-based motion and trigger the glass morphing effect. |
| **Segmented Control** | `@react-native-segmented-control/segmented-control` | Vetted component that inherits the Liquid Glass system styling automatically. |

### 4. 📐 Coding Rules and Best Practices

The AI must adhere to the following architectural rules during refactoring:

1.  **NO LEGACY BLUR:** Never import or use `expo-blur` or `expo-glass-effect` for visual effects; they are obsolete and fail to produce true Liquid Glass.
2.  **ANIMATION RULE:** All user-facing motion must be handled by **`react-native-reanimated`** to run on the native UI thread, guaranteeing 120fps performance and matching the fluid iOS 26 feel.
3.  **COMPOSITION RULE:** When building a complex, floating element (like a modal or menu), always wrap the elements in **`<LiquidGlassContainerView>`** to ensure they merge seamlessly, rather than stacking multiple confusing blur effects.
4.  **ICON RULE:** Prioritize **`expo-symbols`** for native icons, as they integrate best with the new dynamic system themes and light refraction.

This knowledge file contains the required, accurate information and commands to successfully code a native iOS 26 application.