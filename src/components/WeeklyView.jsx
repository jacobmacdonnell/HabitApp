import React from 'react';
import { Check, X } from 'lucide-react';

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
            <div className="grid grid-cols-[1fr_repeat(7,minmax(0,1fr))] gap-2 items-center mb-2 px-4">
                <div className="text-xs font-bold text-white/40">HABIT</div>
                {last7Days.map(date => (
                    <div key={date} className="text-center">
                        <div className="text-[10px] font-bold text-white/40 uppercase">{getDayLabel(date)}</div>
                        <div className="text-[10px] text-white/20">{date.split('-')[2]}</div>
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                {habits.map(habit => (
                    <div key={habit.id} className="p-4 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                                {habit.icon}
                            </div>
                            <h4 className="font-bold text-white/90">{habit.title}</h4>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {last7Days.map(date => {
                                const dayProgress = progress.find(p => p.habitId === habit.id && p.date === date);
                                const isCompleted = dayProgress?.completed;
                                const isMissed = !isCompleted && new Date(date) < new Date(today.toISOString().split('T')[0]);

                                return (
                                    <div key={date} className="flex flex-col items-center gap-1">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isCompleted
                                                    ? 'bg-green-400 text-white shadow-lg shadow-green-400/20'
                                                    : isMissed
                                                        ? 'bg-white/5 text-white/20'
                                                        : 'bg-white/10 text-white/40'
                                                }`}
                                            title={`${date}: ${isCompleted ? 'Completed' : 'Incomplete'}`}
                                        >
                                            {isCompleted ? <Check size={14} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
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
