import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Pencil, Settings } from 'lucide-react';
import { HabitProvider, useHabit } from './context/HabitContext.jsx';
import { HabitFormModal } from './components/HabitFormModal.jsx';
import { WeeklyView } from './components/WeeklyView.jsx';
import { TrendsView } from './components/TrendsView.jsx';
import { Layout } from './components/Layout.jsx';
import { Pet } from './components/Pet.jsx';
import { SettingsView } from './components/SettingsView.jsx';

const Dashboard = ({ viewMode }) => {
  const {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    logProgress,
    progress,
    getStreak,
    pet,
    isOnboarding,
    resetPet,
    updatePet,
    setIsOnboarding
  } = useHabit();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'morning', 'midday', 'evening'
  const [petName, setPetName] = useState('');
  const [petColor, setPetColor] = useState('#FF6B6B');

  const today = new Date().toISOString().split('T')[0];

  const handleHabitSubmit = (habitData) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
    } else {
      addHabit(habitData);
    }
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  const handleLogProgress = (habitId) => {
    logProgress(habitId, today);
  };

  const openAddModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const filteredHabits = habits.filter(habit => {
    if (timeFilter === 'all') return true;
    return habit.timeOfDay === timeFilter || habit.timeOfDay === 'anytime';
  });

  // ONBOARDING VIEW
  if (isOnboarding) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-white tracking-tight">Welcome!</h1>
          <p className="text-white/60 text-lg">Let's meet your new companion.</p>
        </div>

        <div className="bg-white/5 p-8 rounded-[2.5rem] backdrop-blur-md border border-white/10 w-full max-w-xs space-y-6">
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center text-6xl animate-bounce">
              🥚
            </div>
          </div>

          <input
            type="text"
            placeholder="Name your pet..."
            className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-2xl text-center text-xl font-bold text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-all"
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

  // SETTINGS VIEW
  if (viewMode === 'settings') {
    return <SettingsView />;
  }

  // PET PAGE VIEW
  if (viewMode === 'pet') {
    return (
      <div className="h-full flex flex-col pt-24 px-4 animate-fade-in relative">
        <div className="absolute top-6 left-6">
          <h2 className="text-3xl font-black text-white tracking-tight">Companion</h2>
        </div>
        <Pet pet={pet} isFullView={true} onUpdate={updatePet} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 relative">
      {/* Show Pet ONLY on Today View */}
      {viewMode === 'today' && <Pet pet={pet} />}

      <div className="space-y-6">
        {/* Header & Filter */}
        <div className="flex flex-col gap-5 relative">
          {viewMode === 'today' && (
            <div className="px-2">
              <h2 className="text-3xl font-black text-white tracking-tight">Today</h2>
            </div>
          )}

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
                      className={`glass-card p-5 rounded-[2.5rem] relative overflow-hidden ${isCompleted ? 'opacity-80' : ''}`}
                    >
                      {/* Progress Background Fill */}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 transition-all duration-700 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />

                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div
                            className="w-16 h-16 rounded-[1.2rem] flex items-center justify-center text-3xl shadow-inner ring-1 ring-white/10 relative overflow-hidden"
                            style={{ backgroundColor: `${habit.color}25`, color: habit.color }}
                          >
                            {habit.icon}
                            {isCompleted && (
                              <div className="absolute inset-0 bg-white/20 animate-pulse-glow" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-xl tracking-tight text-white">{habit.title}</h4>
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
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg active:scale-90 ${isCompleted ? 'bg-green-500 text-white shadow-green-500/40' : 'bg-white/10 text-white border border-white/10'}`}
                          >
                            <Check size={28} strokeWidth={3.5} />
                          </button>

                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => openEditModal(habit)}
                              className="p-2 rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                            >
                              <Settings size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteHabit(habit.id)}
                              className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 size={16} />
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
