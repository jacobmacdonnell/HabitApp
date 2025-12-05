import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Pencil, Settings } from 'lucide-react';
import { HabitProvider, useHabit } from './context/HabitContext.jsx';
import { HabitFormModal } from './components/HabitFormModal.jsx';
import { WeeklyView } from './components/WeeklyView.jsx';
import { TrendsView } from './components/TrendsView.jsx';
import { Layout } from './components/Layout.jsx';
import { Pet } from './components/Pet.jsx';
import { SettingsView } from './components/SettingsView.jsx';

const Dashboard = ({ viewMode, isModalOpen, setIsModalOpen, editingHabit, setEditingHabit }) => {
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

  const [timeFilter, setTimeFilter] = useState('all');
  const [petName, setPetName] = useState('');
  const [petColor, setPetColor] = useState('#FF6B6B');

  const today = new Date().toISOString().split('T')[0];

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
      <div className="h-full flex flex-col items-center justify-center space-y-8">
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
                className={`w-10 h-10 rounded-full border-2 transition-transform active:scale-95 ${petColor === color ? 'border-white scale-110' : 'border-transparent'}`}
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
      <div className="h-full flex flex-col justify-center pt-12 px-4 relative">
        <Pet pet={pet} isFullView={true} onUpdate={updatePet} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 relative">
      {/* Header Row - Date + Pet */}
      {viewMode === 'today' && (
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-white/40 text-sm font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-2xl font-bold text-white">
              {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'}
            </h1>
          </div>
          <Pet pet={pet} />
        </div>
      )}

      <div className="space-y-4">
        {/* Header & Filter */}
        <div className="flex flex-col gap-4 relative">


          {/* Time Filters (Only show in Today view) */}
          {viewMode === 'today' && (
            <div className="bg-white/5 p-1.5 rounded-[2rem] flex justify-between backdrop-blur-md border border-white/5 shadow-lg">
              {[
                { id: 'all', label: 'All', icon: '✦' },
                { id: 'morning', label: 'Morning', icon: '🌅' },
                { id: 'midday', label: 'Noon', icon: '☀️' },
                { id: 'evening', label: 'Evening', icon: '🌙' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTimeFilter(filter.id)}
                  className={`flex-1 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1 relative z-10 active:scale-95 transition-transform ${timeFilter === filter.id
                    ? 'text-black'
                    : 'text-white/50'
                    }`}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.label}</span>
                  {timeFilter === filter.id && (
                    <div className="absolute inset-0 bg-white rounded-full -z-10 shadow-md" />
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
              <div className="flex flex-col items-center justify-center py-16 px-6 glass-panel rounded-[2.5rem] border border-white/10 text-center space-y-6 mt-4 transition-transform duration-500">
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
                  className="px-8 py-4 bg-white text-black font-bold rounded-[2.5rem] shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95 transition-all flex items-center gap-2"
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
                              className="p-2 rounded-xl bg-white/5 text-white/50 active:bg-white/10 active:text-white transition-colors"
                            >
                              <Settings size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteHabit(habit.id)}
                              className="p-2 rounded-xl bg-red-500/10 text-red-400 active:bg-red-500/20 transition-colors"
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
                  className="w-full py-5 rounded-[2.5rem] border-2 border-dashed border-white/10 text-white/30 active:text-white active:border-white/30 active:bg-white/5 transition-all flex items-center justify-center gap-2 font-bold text-lg active:scale-95"
                >
                  <div className="p-1 rounded-full bg-white/10 transition-colors duration-300">
                    <Plus size={20} strokeWidth={3} />
                  </div>
                  <span>Add another habit</span>
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

function App() {
  const [viewMode, setViewMode] = useState('today');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const modalElement = (
    <ModalPortal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      editingHabit={editingHabit}
      setEditingHabit={setEditingHabit}
    />
  );

  return (
    <HabitProvider>
      <Layout
        currentView={viewMode}
        onNavigate={setViewMode}
        hideNav={isModalOpen}
        modal={modalElement}
      >
        <Dashboard
          viewMode={viewMode}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          editingHabit={editingHabit}
          setEditingHabit={setEditingHabit}
        />
      </Layout>
    </HabitProvider>
  );
}

// Separate component for modal to keep it clean
const ModalPortal = ({ isModalOpen, setIsModalOpen, editingHabit, setEditingHabit }) => {
  const { addHabit, updateHabit } = useHabit();

  const handleHabitSubmit = (habitData) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
    } else {
      addHabit(habitData);
    }
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  return (
    <HabitFormModal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setEditingHabit(null);
      }}
      onSubmit={handleHabitSubmit}
      initialData={editingHabit}
    />
  );
};

export default App;
