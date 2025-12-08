# 🐾 Habit Companion

A gamified habit tracking app with a virtual pet companion. By caring for yourself, you care for your digital companion—creating a positive feedback loop that encourages consistency.

## ✨ Design Philosophy: "Liquid Glass"

Built on a futuristic **Modern iOS** aesthetic:
- **Glassmorphism**: Deep blur effects with multi-layered translucency
- **Vibrant Gradients**: Flowing Indigo/Purple/Pink color schemes
- **Fluid Motion**: Bouncy, physics-based animations
- **Clean Typography**: Modern spacing with high readability

## 🧩 Project Structure

This is a **monorepo** powered by npm workspaces:

```
habitapp/
├── apps/
│   ├── web/          # React + Vite web application
│   └── mobile/       # React Native + Expo mobile app
├── packages/
│   └── shared/       # Shared types, utils, and context
└── package.json      # Workspace configuration
```

## 🛠️ Tech Stack

### Mobile App (`apps/mobile`)
- **Framework**: React Native 0.81 + Expo SDK 54
- **Navigation**: Expo Router (File-based routing)
- **Database**: SQLite (via Drizzle ORM)
- **Styling**: Native components with blur effects
- **Animations**: React Native Reanimated + Confetti Cannon
- **Haptics**: Expo Haptics

### Web App (`apps/web`)
- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Canvas Confetti

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- (For mobile) Expo CLI / iOS Simulator

### Installation

```bash
# Clone and install dependencies
npm install
```

### Development

```bash
# Run web app
npm run web

# Run mobile app (Expo)
npm run mobile

# Run mobile on iOS simulator
npm run mobile:ios
```

## 📱 Core Features

### Smart Habit Management
- **Time of Day Buckets**: 🌅 Morning, ☀️ Mid-day, 🌙 Evening, 🕒 Anytime
- **Flexible Frequency**: Daily, specific days, or custom intervals
- **Counter-Based Habits**: Track progress with visual progress bars
- **Granular Stats**: View streaks and completion history

### Trends & Analytics
- **Monthly Heatmap**: GitHub-style calendar view of habit consistency
- **Weekly Progress**: Visualization of daily performance
- **Stats**: Track total completions and current streaks

### The Companion Pet
- **Living Companion**: Your pet's health reflects your habit consistency
- **Hatching Experience**: Unique onboarding flow to hatch and name your companion
- **Dynamic Reactions**: Pet reacts to your actions (sleeping, breathing, cheering)
- **Speech Bubbles**: Context-aware messages from your pet
- **Home Screen Widget**: Keep an eye on your companion from your home screen

## 📂 Key Files & Structure

### Mobile App (`apps/mobile/src`)
| File | Description |
|------|-------------|
| **Screens** | |
| `HomeScreen.tsx` | Main dashboard with daily habit list and widget integration |
| `PetScreen.tsx` | Full-screen pet interaction and status view |
| `TrendsScreen.tsx` | Analytics dashboard with monthly heatmap and stats |
| `SettingsScreen.tsx` | App configuration and preferences |
| `HabitFormScreen.tsx` | Create/Edit habit modal with rich inputs |
| `OnboardingScreen.tsx` | Initial user setup flow |
| `HatchingScreen.tsx` | Special pet hatching sequence |
| **Services** | |
| `DatabaseService.ts` | SQLite database layer using Drizzle ORM |

### Web App (`apps/web/src`)
| File | Description |
|------|-------------|
| `App.jsx` | Main dashboard with habit list and pet display |
| `Pet.jsx` | Animated companion implementation for web |
| `HabitFormModal.jsx` | Create/edit habits interface |

## 📋 Data Storage

- **Mobile**: Local SQLite database (Drizzle ORM) for robust offline-first persistence.
  - Supports complex queries for trends and stats.
  - Efficient migrations from legacy systems.
- **Web**: LocalStorage (MVP)

## 📄 License

Private project.
