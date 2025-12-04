import React, { useState, useMemo } from 'react';
import { HabitProvider, useHabit } from './context/HabitContext.jsx';
import { Layout } from './components/Layout.jsx';
import { Pet } from './components/Pet.jsx';
import { HabitFormModal } from './components/HabitFormModal.jsx';
import { SettingsModal } from './components/SettingsModal.jsx';
import { WeeklyView } from './components/WeeklyView.jsx';
import { Plus, Check, Pencil, Trash2, Sun, Sunset, Clock, Settings } from 'lucide-react';
import confetti from 'canvas-confetti';

const Dashboard = () => {
  const { pet, resetPet, habits, logProgress, progress, updateHabit, deleteHabit, addHabit, getStreak } = useHabit();
  const [isOnboarding, setIsOnboarding] = useState(!pet);
  const [petName, setPetName] = useState('');
  const [petColor, setPetColor] = useState('#FF6B6B');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  // View State
  const [viewMode, setViewMode] = useState('today'); // 'today' | 'weekly'
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

  return (
    <div className="space-y-8 pb-8">
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 glass-button rounded-full text-white/70 hover:text-white"
        >
          <Settings size={20} />
        </button>
      </div>

      <Pet pet={pet} />

      <div className="space-y-6">
        {/* Header & Filter */}
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center px-1">
            <div className="flex gap-2 bg-white/10 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('today')}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'today' ? 'bg-white text-indigo-600 shadow-sm' : 'text-white/60 hover:text-white'}`}
              >
                Today
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'weekly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-white/60 hover:text-white'}`}
              >
                Weekly
              </button>
            </div>
            <button
              onClick={openAddModal}
              className="p-3 bg-white text-indigo-600 rounded-full hover:bg-white/90 transition-all shadow-lg hover:shadow-indigo-500/30 active:scale-95"
            >
              <Plus size={24} strokeWidth={3} />
            </button>
          </div>

          {/* Time Filters (Only show in Today view) */}
          {viewMode === 'today' && (
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mask-fade-right">
              {[
                { id: 'all', icon: <Clock size={16} />, label: 'All' },
                { id: 'morning', icon: <Sun size={16} />, label: 'Morning' },
                { id: 'midday', icon: <Sun size={16} />, label: 'Noon' },
                { id: 'evening', icon: <Sunset size={16} />, label: 'Evening' },
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setTimeFilter(filter.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${timeFilter === filter.id ? 'bg-white text-black border-white shadow-lg' : 'glass-button text-white/60 border-transparent hover:border-white/10'}`}
                >
                  {filter.icon}
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {viewMode === 'weekly' ? (
          <WeeklyView habits={habits} progress={progress} />
        ) : (
          <div className="space-y-4">
            {filteredHabits.length === 0 ? (
              <div className="text-center py-12 glass-panel rounded-[2rem] border-dashed border-white/20">
                <p className="text-white/50 text-lg">No habits found.</p>
                <p className="text-sm text-white/30 mt-2">Add a new one to get started.</p>
              </div>
            ) : (
              filteredHabits.map((habit) => {
                const dayProgress = progress.find(p => p.habitId === habit.id && p.date === today);
                const current = dayProgress?.currentCount || 0;
                const isCompleted = current >= habit.targetCount;
                const streak = getStreak(habit.id);
                const progressPercent = Math.min((current / habit.targetCount) * 100, 100);

                return (
                  <div
                    key={habit.id}
                    className={`glass-card p-5 rounded-[2rem] relative overflow-hidden group ${isCompleted ? 'opacity-60' : ''}`}
                  >
                    {/* Progress Background Fill */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 transition-all duration-700 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ring-1 ring-white/10"
                          style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                        >
                          {habit.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-xl tracking-tight">{habit.title}</h4>
                          <div className="flex items-center gap-3 text-sm font-medium text-white/60 mt-1">
                            <span>{current} / {habit.targetCount}</span>
                            {streak > 0 && (
                              <span className="flex items-center gap-1 text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
                                🔥 {streak}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleLogProgress(habit.id)}
                          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg active:scale-90 ${isCompleted ? 'bg-green-400 text-white' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}`}
                        >
                          <Check size={26} strokeWidth={3} />
                        </button>

                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-20 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-md p-1 rounded-xl">
                          <button
                            onClick={() => openEditModal(habit)}
                            className="p-2 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this habit?')) deleteHabit(habit.id);
                            }}
                            className="p-2 hover:bg-red-500/20 rounded-lg text-white/70 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
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
  return (
    <HabitProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </HabitProvider>
  );
}

export default App;
