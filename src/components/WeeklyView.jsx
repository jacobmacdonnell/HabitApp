import React from 'react';
import { Check, X, Minus } from 'lucide-react';

export const WeeklyView = ({ habits, progress }) => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    const getDayLabel = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Header Row */}
            <div className="grid grid-cols-[1.5fr_repeat(7,1fr)] gap-2 items-end mb-2 px-4">
                <div className="text-xs font-bold text-white/30 uppercase tracking-wider pb-1">Habit</div>
                {last7Days.map(date => {
                    const isToday = date === today.toISOString().split('T')[0];
                    return (
                        <div key={date} className="flex flex-col items-center gap-1">
                            <div className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-indigo-400' : 'text-white/30'}`}>
                                {getDayLabel(date)}
                            </div>
                            <div className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full ${isToday ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'text-white/50'}`}>
                                {date.split('-')[2]}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="space-y-3">
                {habits.map(habit => (
                    <div key={habit.id} className="p-4 rounded-[1.5rem] glass-card flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shadow-inner ring-1 ring-white/10"
                                style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                            >
                                {habit.icon}
                            </div>
                            <h4 className="font-bold text-white/90 text-sm">{habit.title}</h4>
                        </div>

                        <div className="grid grid-cols-[1.5fr_repeat(7,1fr)] gap-2 items-center">
                            <div className="text-xs font-medium text-white/40 pl-1">
                                Progress
                            </div>
                            {last7Days.map(date => {
                                const dayProgress = progress.find(p => p.habitId === habit.id && p.date === date);
                                const isCompleted = dayProgress?.completed;
                                const isMissed = !isCompleted && new Date(date) < new Date(today.toISOString().split('T')[0]);
                                const isFuture = new Date(date) > new Date(today.toISOString().split('T')[0]);

                                return (
                                    <div key={date} className="flex justify-center">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20 scale-100'
                                                    : isMissed
                                                        ? 'bg-white/5 text-white/20'
                                                        : isFuture
                                                            ? 'opacity-0'
                                                            : 'bg-white/5 text-white/20'
                                                }`}
                                            title={`${date}: ${isCompleted ? 'Completed' : 'Incomplete'}`}
                                        >
                                            {isCompleted ? (
                                                <Check size={14} strokeWidth={4} />
                                            ) : isMissed ? (
                                                <Minus size={14} strokeWidth={3} />
                                            ) : (
                                                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
