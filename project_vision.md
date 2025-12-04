# Project Vision: Habit Companion

## 1. Executive Summary
**Habit Companion** is a gamified habit tracking application designed for **iOS 26**. It merges the utility of a robust habit tracker with the emotional engagement of a virtual pet simulator. By caring for themselves, users care for their digital companion, creating a positive feedback loop that encourages consistency.

## 2. Design Philosophy: "Liquid Glass"
The app is built on a futuristic **iOS 26** aesthetic, characterized by:
- **Deep Depth**: Heavy use of `backdrop-filter: blur()`, multi-layered translucency, and glassmorphism.
- **Vibrant Energy**: Rich, flowing gradients (Indigo/Purple/Pink) that feel alive.
- **Fluid Motion**: Bouncy, physics-based animations for the pet and UI elements.
- **Clean Typography**: San Francisco (System) font with high readability and modern spacing.

## 3. Core Features

### A. Smart Habit Management
Habits are not just checkboxes; they are flexible goals.
- **Time of Day Buckets**:
  - 🌅 **Morning**: Start the day right.
  - ☀️ **Mid-day**: Keep the momentum.
  - 🌙 **Evening**: Wind down.
  - 🕒 **Anytime**: Flexible tasks.
- **Granular Frequency**:
  - **Every Day**: For daily routines.
  - **Specific Days**: E.g., "Gym on Mon/Wed/Fri".
  - **Intervals**: E.g., "Every 3 days".
- **Counter-Based Habits**:
  - Instead of a simple toggle, users can set a target count (e.g., "Drink Water: 0/5").
  - Visual progress bars for partial completion.

### B. The Companion (Pet)
Inspired by *Finch* and *Club Penguin Puffles*.
- **Customization**:
  - Users name their pet during onboarding.
  - Users choose an initial color (Red, Blue, Yellow, Purple, etc.).
- **The "Tamagotchi" Mechanic**:
  - **Health Link**: The pet's health is directly tied to the user's habit completion rate.
  - **Sickness**: If habits are ignored for extended periods, the pet becomes visibly "sick" (sluggish animation, color desaturation, sad expression).
  - **Recovery**: Completing habits heals the pet, restoring its bounce and vibrant color.
  - **Evolution (Future)**: Potential for the pet to grow or gain accessories as streaks continue.

## 4. User Flow

1.  **Onboarding**:
    - "Meet Your Companion": User names pet and picks color.
    - "First Promise": User adds their first simple habit.
2.  **Dashboard (Home)**:
    - **Top**: The Pet lives here, reacting to user actions.
    - **Middle**: "Today's Habits" filtered by current time of day (with easy toggles for other times).
    - **Bottom**: Navigation (Home, Calendar, Settings).
3.  **Action**:
    - User taps a habit -> Pet jumps/cheers.
    - User completes a counter (1/5 -> 2/5) -> Mini-celebration.
4.  **Consequence**:
    - User opens app after 3 days of inactivity -> Pet is sick/sleeping.
    - User must complete tasks to "nurse" it back to health.

## 5. Technical Stack
- **Framework**: React 19 + Vite
- **Language**: JavaScript (JSX)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Data**: LocalStorage (MVP) -> Supabase (Future Sync)
