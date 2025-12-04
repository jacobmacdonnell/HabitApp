import React, { useState, useEffect } from 'react';
import { X, Clock, Target, Sparkles } from 'lucide-react';

export const HabitFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        timeOfDay: 'anytime',
        frequency: 'daily',
        targetCount: 1,
        color: '#6366f1',
        icon: '✨'
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                title: '',
                timeOfDay: 'anytime',
                frequency: 'daily',
                targetCount: 1,
                color: '#6366f1',
                icon: '✨'
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const colors = [
        '#6366f1', // Indigo
        '#a855f7', // Purple
        '#ec4899', // Pink
        '#f43f5e', // Rose
        '#f97316', // Orange
        '#eab308', // Yellow
        '#22c55e', // Green
        '#14b8a6', // Teal
        '#3b82f6', // Blue
    ];

    return (
        <div className="absolute inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />

            {/* Glass Sheet */}
            <div className="relative w-full max-w-md bg-[#1c1c1e]/80 backdrop-blur-2xl rounded-t-[2.5rem] p-8 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-slide-up border-t border-white/10 ring-1 ring-white/5 overflow-hidden">

                {/* Ambient Glow Background */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"
                />

                {/* Handle Bar */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full" />

                <div className="relative flex justify-between items-center mb-8 mt-2">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                            {initialData ? 'Edit Habit' : 'New Habit'}
                            {!initialData && <Sparkles size={20} className="text-yellow-400 animate-pulse-glow" />}
                        </h2>
                        <p className="text-white/40 text-sm font-medium">
                            {initialData ? 'Update your goals' : 'Start something new'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all active:scale-95 border border-white/5"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(formData);
                    }}
                    className="space-y-6 relative z-10"
                >
                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Habit Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Drink Water"
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-lg font-medium text-white placeholder-white/20 focus:outline-none focus:bg-white/10 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Time of Day */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1 flex items-center gap-1">
                                <Clock size={12} /> Time
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl appearance-none text-white/90 focus:outline-none focus:bg-white/10 transition-all"
                                    value={formData.timeOfDay}
                                    onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value })}
                                >
                                    <option value="anytime" className="bg-[#1c1c1e]">Anytime</option>
                                    <option value="morning" className="bg-[#1c1c1e]">Morning</option>
                                    <option value="midday" className="bg-[#1c1c1e]">Midday</option>
                                    <option value="evening" className="bg-[#1c1c1e]">Evening</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Target Count */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1 flex items-center gap-1">
                                <Target size={12} /> Target
                            </label>
                            <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, targetCount: Math.max(1, prev.targetCount - 1) }))}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors active:scale-90"
                                >
                                    -
                                </button>
                                <span className="flex-1 text-center font-bold text-lg text-white">{formData.targetCount}</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, targetCount: prev.targetCount + 1 }))}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors active:scale-90"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Color Picker */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Color Theme</label>
                        <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-10 h-10 rounded-full transition-all duration-300 flex-shrink-0 relative ${formData.color === color ? 'scale-110' : 'opacity-40 hover:opacity-80 hover:scale-105'}`}
                                    style={{ backgroundColor: color }}
                                >
                                    {formData.color === color && (
                                        <div className="absolute inset-0 rounded-full ring-2 ring-white ring-offset-2 ring-offset-[#1c1c1e]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!formData.title}
                        className="w-full py-4 mt-6 font-bold text-lg rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all text-white relative overflow-hidden group"
                        style={{
                            background: formData.title ? `linear-gradient(135deg, ${formData.color}, ${formData.color}dd)` : '#333'
                        }}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {initialData ? 'Save Changes' : 'Create Habit'}
                            {!initialData && <Sparkles size={18} />}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
};
