import React, { useState } from 'react';
import { Check, Minus, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';

export const TrendsView = ({ habits, progress }) => {
    const [trendMode, setTrendMode] = useState('weekly'); // 'weekly' | 'monthly'
    const today = new Date();

    // Weekly Logic
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    // Monthly Logic (Last 30 days)
    const last30Days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (29 - i));
        return d.toISOString().split('T')[0];
    });

    const getDayLabel = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    return (
        <div className="space-y-6">
            {/* Trends Header & Toggle */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2 pr-14">
                    <h2 className="text-3xl font-black text-white tracking-tight">Trends</h2>
                    <div className="flex gap-1 bg-white/5 p-1 rounded-[2rem] border border-white/5 backdrop-blur-md">
                        <button
                            onClick={() => setTrendMode('weekly')}
                            className={`px-6 py-2.5 rounded-[1.5rem] text-xs font-bold transition-all duration-300 active:scale-95 ${trendMode === 'weekly' ? 'bg-white text-black shadow-lg scale-105' : 'text-white/40'}`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setTrendMode('monthly')}
                            className={`px-6 py-2.5 rounded-[1.5rem] text-xs font-bold transition-all duration-300 active:scale-95 ${trendMode === 'monthly' ? 'bg-white text-black shadow-lg scale-105' : 'text-white/40'}`}
                        >
                            Monthly
                        </button>
                    </div>
                </div>
            </div>

            {trendMode === 'weekly' ? (
                // WEEKLY VIEW
                <div className="space-y-4">
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
                            <div key={habit.id} className="p-5 rounded-[2.5rem] glass-card flex flex-col gap-4">
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
            ) : (
                // MONTHLY VIEW (Heatmap Style)
                <div className="space-y-4">
                    {habits.map(habit => {
                        // Calculate monthly consistency
                        const completedCount = last30Days.filter(date => {
                            const p = progress.find(p => p.habitId === habit.id && p.date === date);
                            return p?.completed;
                        }).length;
                        const consistency = Math.round((completedCount / 30) * 100);

                        return (
                            <div key={habit.id} className="p-6 rounded-[2.5rem] glass-card space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-inner ring-1 ring-white/10"
                                            style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                                        >
                                            {habit.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg">{habit.title}</h4>
                                            <div className="text-xs text-white/50 font-medium">30 Day Consistency: <span className="text-white">{consistency}%</span></div>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                        <TrendingUp size={20} className={consistency > 70 ? 'text-green-400' : consistency > 40 ? 'text-yellow-400' : 'text-white/30'} />
                                    </div>
                                </div>

                                {/* Heatmap Grid */}
                                <div className="grid grid-cols-10 gap-1.5">
                                    {last30Days.map(date => {
                                        const dayProgress = progress.find(p => p.habitId === habit.id && p.date === date);
                                        const isCompleted = dayProgress?.completed;
                                        const isToday = date === today.toISOString().split('T')[0];

                                        return (
                                            <div
                                                key={date}
                                                className={`aspect-square rounded-md transition-all duration-500 ${isCompleted
                                                    ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                                                    : 'bg-white/5'
                                                    } ${isToday ? 'ring-1 ring-white' : ''}`}
                                                title={date}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
