# 🐾 Habit Companion

A gamified habit tracking app with a virtual pet companion. By caring for yourself, you care for your digital companion—creating a positive feedback loop that encourages consistency.

## ✨ Design Philosophy: "Liquid Glass"

Built on a futuristic **iOS 26** aesthetic:
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

### Web App (`apps/web`)
- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Canvas Confetti

### Mobile App (`apps/mobile`)
- **Framework**: React Native 0.81 + Expo SDK 54
- **Navigation**: React Navigation 7
- **Animations**: React Native Reanimated
- **Storage**: Async Storage

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

### The Companion Pet
- **Health Link**: Pet's health tied directly to habit completion
- **Visual Feedback**: Pet becomes sick if habits are ignored, recovers when you're consistent
- **Customization**: Name your pet and choose its color during onboarding

## 📂 Key Files

### Web App Components
| File | Description |
|------|-------------|
| `App.jsx` | Main dashboard with habit list and pet display |
| `Pet.jsx` | Animated companion with breathing/sleeping states |
| `HabitFormModal.jsx` | Create/edit habits with color and icon pickers |
| `OnboardingView.jsx` | Welcome flow for naming pet and first habit |
| `SettingsView.jsx` | Sleep schedule and app preferences |
| `TrendsView.jsx` | Weekly progress visualization |
| `Layout.jsx` | Glass container with dock-style navigation |

## 📋 Data Storage

- **MVP**: LocalStorage for persistence
- **Future**: Supabase integration for cloud sync

## 📄 License

Private project.
