import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Settings, Sparkles, Sunrise, Sun, Moon, Clock } from 'lucide-react';
import { HabitProvider, useHabit } from './context/HabitContext.jsx';
import { HabitFormModal } from './components/HabitFormModal.jsx';
import { TrendsView } from './components/TrendsView.jsx';
import { Layout } from './components/Layout.jsx';
import { Pet } from './components/Pet.jsx';
import { SettingsView } from './components/SettingsView.jsx';
import { OnboardingView } from './components/OnboardingView.jsx';

const Dashboard = ({ viewMode, isModalOpen, setIsModalOpen, editingHabit, setEditingHabit, setModalDefaultTime }) => {
  const {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    logProgress,
    undoProgress,
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
  const [showCompleted, setShowCompleted] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleLogProgress = (habitId, isCompleted) => {
    if (isCompleted) {
      if (confirm('Undo completion for this habit?')) {
        undoProgress(habitId, today);
      }
    } else {
      logProgress(habitId, today);
    }
  };

  const openAddModal = () => {
    setEditingHabit(null);
    setModalDefaultTime(timeFilter === 'all' ? 'anytime' : timeFilter);
    setIsModalOpen(true);
  };

  const openEditModal = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleDeleteHabit = (habitId) => {
    if (confirm('Delete this habit?')) {
      deleteHabit(habitId);
    }
  };

  const filteredHabits = habits.filter(habit => {
    if (timeFilter === 'all') return true;
    return habit.timeOfDay === timeFilter || habit.timeOfDay === 'anytime';
  }).sort((a, b) => {
    const order = { anytime: 0, morning: 1, midday: 2, evening: 3 };
    return (order[a.timeOfDay] || 0) - (order[b.timeOfDay] || 0);
  });

  // ONBOARDING VIEW
  if (isOnboarding) {
    return <OnboardingView />;
  }

  // SETTINGS VIEW
  if (viewMode === 'settings') {
    return <SettingsView />;
  }

  // PET PAGE VIEW
  if (viewMode === 'pet') {
    return <Pet pet={pet} isFullView={true} onUpdate={updatePet} />;
  }

  // TRENDS/WEEKLY PAGE VIEW
  if (viewMode === 'weekly') {
    return <TrendsView habits={habits} progress={progress} />;
  }

  const renderHabit = (habit) => {
    const dayProgress = progress.find(p => p.habitId === habit.id && p.date === today);
    const current = dayProgress?.currentCount || 0;
    const isCompleted = current >= habit.targetCount;
    const streak = getStreak(habit.id);
    const progressPercent = Math.min((current / habit.targetCount) * 100, 100);

    const timeIcons = {
      anytime: <Sparkles size={12} />,
      morning: <Sunrise size={12} />,
      midday: <Sun size={12} />,
      evening: <Moon size={12} />
    };
    const timeLabels = {
      anytime: 'Anytime',
      morning: 'Morning',
      midday: 'Noon',
      evening: 'Evening'
    };

    return (
      <div
        key={habit.id}
        onClick={(e) => {
          if (e.target.closest('button')) return;
          openEditModal(habit);
        }}
        className={`glass-card p-4 rounded-[1.5rem] relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all duration-300 ${isCompleted ? 'opacity-80' : 'hover:bg-white/5'}`}
      >
        {/* Progress Background Fill */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 transition-all duration-700 ease-out pointer-events-none"
          style={{ width: `${progressPercent}%` }}
        />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="w-12 h-12 rounded-xl flex shrink-0 items-center justify-center text-2xl shadow-inner ring-1 ring-white/10 relative overflow-hidden bg-black/20"
              style={{ color: habit.color }}
            >
              <div className="absolute inset-0 opacity-20" style={{ backgroundColor: habit.color }} />
              {habit.icon}
              {isCompleted && (
                <div className="absolute inset-0 bg-white/20 animate-pulse-glow" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="font-bold text-lg leading-tight text-white group-hover:text-white/90 transition-colors truncate">{habit.title}</h4>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 text-[10px] font-medium text-white/40 uppercase tracking-wider shrink-0 h-fit my-auto">
                  {timeIcons[habit.timeOfDay]}
                  <span>{timeLabels[habit.timeOfDay]}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-white/50">
                {habit.targetCount > 1 && <span>{current} / {habit.targetCount}</span>}
                {streak >= 2 && (
                  <span className="flex items-center gap-1 text-orange-400 bg-orange-400/10 px-1.5 py-px rounded-full border border-orange-400/20">
                    🔥 {streak}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLogProgress(habit.id, isCompleted);
            }}
            className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-all duration-300 active:scale-90 ${isCompleted
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 ring-0'
              : 'bg-green-500 text-white shadow-lg shadow-green-500/30 ring-0 hover:scale-105'
              }`}
          >
            <Check size={20} strokeWidth={3.5} />
          </button>
        </div>
      </div>
    );
  };

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

      {/* Filter Bar */}
      {viewMode === 'today' && (
        <div className="w-full">
          <div className="glass-card p-1.5 rounded-[1.5rem] flex gap-1 border border-white/10 w-full overflow-x-auto scrollbar-hide">
            {[
              { id: 'all', label: 'All', Icon: Sparkles, activeColor: 'text-black' },
              { id: 'morning', label: 'Morning', Icon: Sunrise, activeColor: 'text-orange-500' },
              { id: 'midday', label: 'Noon', Icon: Sun, activeColor: 'text-yellow-500' },
              { id: 'evening', label: 'Evening', Icon: Moon, activeColor: 'text-indigo-500' }
            ].map(({ id, label, Icon, activeColor }) => {
              const isActive = timeFilter === id;
              return (
                <button
                  key={id}
                  onClick={() => setTimeFilter(id)}
                  className={`flex-1 min-w-[80px] py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 relative z-10 active:scale-95 ${isActive ? 'text-black' : 'text-white/50'
                    }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-white rounded-full -z-10 shadow-md" />
                  )}
                  <Icon size={14} className={isActive ? activeColor : 'text-white/50'} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Habits */}
      {filteredHabits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 glass-panel rounded-[2rem] border border-white/10 text-center space-y-6 mt-4 transition-transform duration-500">
          <div className="space-y-2 max-w-xs">
            <h3 className="text-xl font-bold text-white">
              {timeFilter === 'all' ? "No habits yet" : `No ${timeFilter} habits`}
            </h3>
            <p className="text-white/40 text-sm leading-relaxed">
              {timeFilter === 'all'
                ? "Your journey to a better you begins with a single step."
                : `You don't have any habits scheduled for the ${timeFilter} yet.`}
            </p >
          </div >
          <button
            onClick={openAddModal}
            className="px-8 py-4 bg-white text-black font-bold rounded-[2rem] shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={20} strokeWidth={3} />
            <span>Create New Habit</span>
          </button>
        </div >
      ) : (
        <>
          {(() => {
            const activeHabits = filteredHabits.filter(habit => {
              const dayProgress = progress.find(p => p.habitId === habit.id && p.date === today);
              const current = dayProgress?.currentCount || 0;
              return current < habit.targetCount;
            });

            const completedHabits = filteredHabits.filter(habit => {
              const dayProgress = progress.find(p => p.habitId === habit.id && p.date === today);
              const current = dayProgress?.currentCount || 0;
              return current >= habit.targetCount;
            });

            return (
              <>
                {activeHabits.map(renderHabit)}

                {completedHabits.length > 0 && (
                  <div className="mt-8">
                    <button
                      onClick={() => setShowCompleted(!showCompleted)}
                      className="w-full py-3 rounded-[1.5rem] bg-white/5 text-white/40 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <span>{showCompleted ? 'Hide' : 'Show'} Completed ({completedHabits.length})</span>
                      <Check size={14} />
                    </button>

                    {showCompleted && (
                      <div className="mt-4 space-y-4 opacity-70 scale-95 origin-top transition-all">
                        {completedHabits.map(renderHabit)}
                      </div>
                    )}
                  </div>
                )}

                {/* Add Button for Non-Empty List */}
                <button
                  onClick={openAddModal}
                  className="w-full py-5 rounded-[1.5rem] border-2 border-dashed border-white/10 text-white/30 active:text-white active:border-white/30 active:bg-white/5 transition-all flex items-center justify-center gap-2 font-bold text-lg active:scale-95 mt-8"
                >
                  <div className="p-1 rounded-full bg-white/10 transition-colors duration-300">
                    <Plus size={20} strokeWidth={3} />
                  </div>
                  <span>Add another habit</span>
                </button>
              </>
            );
          })()}
        </>
      )}
    </div>
  );
};

const MainApp = () => {
  const { isOnboarding } = useHabit();
  const [viewMode, setViewMode] = useState('today');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [modalDefaultTime, setModalDefaultTime] = useState('anytime');

  const modalElement = (
    <ModalPortal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      editingHabit={editingHabit}
      setEditingHabit={setEditingHabit}
      defaultTime={modalDefaultTime}
    />
  );

  return (
    <Layout
      currentView={viewMode}
      onNavigate={setViewMode}
      hideNav={isOnboarding}
      modal={modalElement}
    >
      <Dashboard
        viewMode={viewMode}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingHabit={editingHabit}
        setEditingHabit={setEditingHabit}
        setModalDefaultTime={setModalDefaultTime}
      />
    </Layout>
  );
};

function App() {
  return (
    <HabitProvider>
      <MainApp />
    </HabitProvider>
  );
}

// Separate component for modal to keep it clean
const ModalPortal = ({ isModalOpen, setIsModalOpen, editingHabit, setEditingHabit, defaultTime }) => {
  const { addHabit, updateHabit, deleteHabit } = useHabit();

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
      onClose={(action) => {
        if (action === 'delete' && editingHabit) {
          if (confirm('Permanently delete this habit?')) {
            deleteHabit(editingHabit.id);
            setIsModalOpen(false);
          }
        } else {
          setIsModalOpen(false);
        }
        setEditingHabit(null);
      }}
      onSubmit={handleHabitSubmit}
      initialData={editingHabit}
      defaultTime={defaultTime}
    />
  );
};

export default App;
