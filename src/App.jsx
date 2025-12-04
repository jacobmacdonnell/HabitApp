import React, { useState, useMemo } from 'react';
import { HabitProvider, useHabit } from './context/HabitContext.jsx';
import { Layout } from './components/Layout.jsx';
import { Pet } from './components/Pet.jsx';
import { HabitFormModal } from './components/HabitFormModal.jsx';
import { SettingsModal } from './components/SettingsModal.jsx';
import { TrendsView } from './components/TrendsView.jsx';
import { Plus, Check, Pencil, Trash2, Sun, Sunset, Clock, Settings } from 'lucide-react';
import confetti from 'canvas-confetti';

const Dashboard = ({ viewMode }) => {
  const { pet, resetPet, habits, logProgress, progress, updateHabit, deleteHabit, addHabit, getStreak } = useHabit();
  const [isOnboarding, setIsOnboarding] = useState(!pet);
  const [petName, setPetName] = useState('');
  const [petColor, setPetColor] = useState('#FF6B6B');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  // View State

  // Filter State
  const [timeFilter, setTimeFilter] = useState('all');

  const filteredHabits = useMemo(() => {
    if (timeFilter === 'all') return habits;
    return habits.filter(h => h.timeOfDay === timeFilter || h.timeOfDay === 'anytime');
  }, [habits, timeFilter]);

  const handleHabitSubmit = (formData) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, formData);
    } else {
      addHabit(formData);
    }
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  const openAddModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const today = new Date().toISOString().split('T')[0];

  const handleLogProgress = (habitId) => {
    logProgress(habitId, today);

    const habit = habits.find(h => h.id === habitId);
    const dayProgress = progress.find(p => p.habitId === habitId && p.date === today);
    const current = dayProgress?.currentCount || 0;

    if (habit && current + 1 >= habit.targetCount) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [habit.color, '#ffffff']
      });
    }
  };

  if (isOnboarding || !pet) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-center">Meet Your Companion</h1>
        <div className="w-48 h-48 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
          <div className="w-32 h-32 rounded-full" style={{ backgroundColor: petColor }} />
        </div>

        <div className="space-y-4 w-full max-w-xs">
          <input
            type="text"
            placeholder="Name your pet..."
            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-center text-xl"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
          />

          <div className="flex justify-center gap-4">
            {['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8C42', '#A06CD5'].map((color) => (
              <button
                key={color}
                onClick={() => setPetColor(color)}
                className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${petColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (petName) {
                resetPet(petName, petColor);
                setIsOnboarding(false);
              }
            }}
            disabled={!petName}
            className="w-full py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            Adopt {petName || 'Pet'}
          </button>
        </div>
      </div>
    );
  }

  // PET PAGE VIEW
  if (viewMode === 'pet') {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-8 animate-fade-in">
        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 glass-button rounded-full text-white/70 hover:text-white hover:rotate-90 transition-transform duration-500"
          >
            <Settings size={20} strokeWidth={2.5} />
          </button>
        </div>
        <Pet pet={pet} />
        <div className="text-center space-y-2 max-w-xs">
          <h3 className="text-xl font-bold text-white">Companion Status</h3>
          <p className="text-white/50 text-sm">Keep up your habits to keep {pet.name} happy and healthy!</p>
        </div>
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 relative">
      {/* Settings Button - Top Right Absolute (Global) */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-0 right-0 p-3 glass-button rounded-full text-white/70 hover:text-white hover:rotate-90 transition-transform duration-500 z-50"
      >
        <Settings size={20} strokeWidth={2.5} />
      </button>

      {/* Show Pet ONLY on Today View */}
      {viewMode === 'today' && <Pet pet={pet} />}

      <div className="space-y-6">
        {/* Header & Filter */}
        <div className="flex flex-col gap-5 relative">

          {/* Time Filters (Only show in Today view) */}
          {viewMode === 'today' && (
            <div className="bg-white/5 p-1.5 rounded-[2rem] flex justify-between items-center backdrop-blur-md border border-white/5 relative shadow-lg">
              {[
                { id: 'all', label: 'All' },
                { id: 'morning', label: 'Morning' },
                { id: 'midday', label: 'Noon' },
                { id: 'evening', label: 'Evening' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTimeFilter(filter.id)}
                  className={`flex-1 py-4 rounded-[1.5rem] text-sm font-bold transition-all duration-300 relative z-10 ${timeFilter === filter.id
                    ? 'text-black scale-105'
                    : 'text-white/40 hover:text-white/80 hover:scale-105'
                    }`}
                >
                  {filter.label}
                  {timeFilter === filter.id && (
                    <div className="absolute inset-0 bg-white rounded-[1.5rem] -z-10 animate-fade-in shadow-md" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {viewMode === 'weekly' ? (
          <TrendsView habits={habits} progress={progress} />
        ) : (
          <div className="space-y-4">
            {filteredHabits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 glass-panel rounded-[2.5rem] border border-white/10 text-center space-y-6 mt-4 hover:scale-[1.02] transition-transform duration-500">
                <div className="space-y-2 max-w-xs">
                  <h3 className="text-xl font-bold text-white">
                    {timeFilter === 'all' ? "No habits yet" : `No ${timeFilter} habits`}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {timeFilter === 'all'
                      ? "Your journey to a better you begins with a single step."
                      : `You don't have any habits scheduled for the ${timeFilter} yet.`}
                  </p>
                </div>
                <button
                  onClick={openAddModal}
                  className="px-8 py-4 bg-white text-black font-bold rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Plus size={20} strokeWidth={3} />
                  <span>Create New Habit</span>
                </button>
              </div>
            ) : (
              <>
                {filteredHabits.map((habit) => {
                  const dayProgress = progress.find(p => p.habitId === habit.id && p.date === today);
                  const current = dayProgress?.currentCount || 0;
                  const isCompleted = current >= habit.targetCount;
                  const streak = getStreak(habit.id);
                  const progressPercent = Math.min((current / habit.targetCount) * 100, 100);

                  return (
                    <div
                      key={habit.id}
                      className={`glass-card p-5 rounded-[2.5rem] relative overflow-hidden group ${isCompleted ? 'opacity-80' : ''}`}
                    >
                      {/* Progress Background Fill */}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 transition-all duration-700 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />

                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div
                            className="w-16 h-16 rounded-[1.2rem] flex items-center justify-center text-3xl shadow-inner ring-1 ring-white/10 relative overflow-hidden transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                            style={{ backgroundColor: `${habit.color}25`, color: habit.color }}
                          >
                            {habit.icon}
                            {isCompleted && (
                              <div className="absolute inset-0 bg-white/20 animate-pulse-glow" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-xl tracking-tight text-white group-hover:text-indigo-200 transition-colors">{habit.title}</h4>
                            <div className="flex items-center gap-3 text-sm font-medium text-white/50 mt-1">
                              <span>{current} / {habit.targetCount}</span>
                              {streak > 0 && (
                                <span className="flex items-center gap-1 text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full border border-orange-400/20 animate-pulse">
                                  🔥 {streak}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleLogProgress(habit.id)}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg active:scale-90 hover:scale-110 ${isCompleted ? 'bg-green-500 text-white shadow-green-500/40' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}`}
                          >
                            <Check size={28} strokeWidth={3.5} />
                          </button>

                          <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute right-24 top-1/2 -translate-y-1/2 bg-[#1c1c1e]/90 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-2xl translate-x-8 group-hover:translate-x-0">
                            <button
                              onClick={() => openEditModal(habit)}
                              className="p-2.5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors hover:scale-110"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Delete this habit?')) deleteHabit(habit.id);
                              }}
                              className="p-2.5 hover:bg-red-500/20 rounded-xl text-white/70 hover:text-red-400 transition-colors hover:scale-110"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add Button for Non-Empty List */}
                <button
                  onClick={openAddModal}
                  className="w-full py-5 rounded-[2.5rem] border-2 border-dashed border-white/10 text-white/30 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-bold text-lg group"
                >
                  <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors group-hover:scale-110 duration-300">
                    <Plus size={20} strokeWidth={3} />
                  </div>
                  <span>Add another habit</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <HabitFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleHabitSubmit}
        initialData={editingHabit}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

function App() {
  const [viewMode, setViewMode] = useState('today');

  return (
    <HabitProvider>
      <Layout currentView={viewMode} onNavigate={setViewMode}>
        <Dashboard viewMode={viewMode} />
      </Layout>
    </HabitProvider>
  );
}

export default App;
