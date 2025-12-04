import React, { useState, useMemo } from 'react';
import { HabitProvider, useHabit } from './context/HabitContext.jsx';
import { Layout } from './components/Layout.jsx';
import { Pet } from './components/Pet.jsx';
import { HabitFormModal } from './components/HabitFormModal.jsx';
import { Plus, Check, Pencil, Trash2, Sun, Moon, Sunset, Clock } from 'lucide-react';

const Dashboard = () => {
  const { pet, resetPet, habits, logProgress, progress, updateHabit, deleteHabit, addHabit } = useHabit();
  const [isOnboarding, setIsOnboarding] = useState(!pet);
  const [petName, setPetName] = useState('');
  const [petColor, setPetColor] = useState('#FF6B6B');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  // Filter State
  const [timeFilter, setTimeFilter] = useState('all'); // all, morning, midday, evening

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
  };

  const openAddModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
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

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8">
      <Pet pet={pet} />

      <div className="space-y-4">
        {/* Header & Filter */}
        <div className="flex flex-col gap-4 px-2">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white/90">Today's Habits</h3>
            <button
              onClick={openAddModal}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <Plus size={24} />
            </button>
          </div>

          {/* Time Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'all', icon: <Clock size={16} />, label: 'All' },
              { id: 'morning', icon: <Sun size={16} />, label: 'Morning' },
              { id: 'midday', icon: <Sun size={16} />, label: 'Noon' },
              { id: 'evening', icon: <Sunset size={16} />, label: 'Evening' },
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setTimeFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${timeFilter === filter.id ? 'bg-white text-indigo-600 shadow-lg' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
              >
                {filter.icon}
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredHabits.length === 0 ? (
            <div className="text-center py-8 text-white/60 bg-white/5 rounded-3xl border border-white/10">
              <p>No habits found.</p>
              <p className="text-sm mt-2">Try changing filters or add a new one.</p>
            </div>
          ) : (
            filteredHabits.map((habit) => {
              const dayProgress = progress.find(p => p.habitId === habit.id && p.date === today);
              const current = dayProgress?.currentCount || 0;
              const isCompleted = current >= habit.targetCount;

              return (
                <div
                  key={habit.id}
                  className={`p-4 rounded-3xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-between transition-all ${isCompleted ? 'opacity-50' : ''}`}
                  style={{ borderLeft: `4px solid ${habit.color}` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                      {habit.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{habit.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <span>{current} / {habit.targetCount}</span>
                        {habit.timeOfDay !== 'anytime' && (
                          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs capitalize">
                            {habit.timeOfDay}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => logProgress(habit.id, today)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCompleted ? 'bg-green-400 text-white' : 'bg-white/20 hover:bg-white/30'}`}
                    >
                      <Check size={24} />
                    </button>

                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => openEditModal(habit)}
                        className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this habit?')) deleteHabit(habit.id);
                        }}
                        className="p-2 bg-white/5 rounded-full hover:bg-red-500/20 text-white/50 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
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
  return (
    <HabitProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </HabitProvider>
  );
}

export default App;
