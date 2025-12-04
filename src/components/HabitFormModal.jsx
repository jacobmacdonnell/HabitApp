import React, { useState, useEffect } from 'react';
import { X, Clock, Target } from 'lucide-react';

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

    return (
        <div className="absolute inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Glass Sheet */}
            <div className="relative w-full max-w-md bg-[#1c1c1e]/90 backdrop-blur-2xl rounded-t-[2.5rem] p-8 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-slide-up border-t border-white/10 ring-1 ring-white/5">
                {/* Handle Bar */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full" />

                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {initialData ? 'Edit Habit' : 'New Habit'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white/60 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(formData);
                    }}
                    className="space-y-6"
                >
                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60 ml-1">Habit Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Drink Water"
                            className="w-full px-5 py-4 glass-input rounded-2xl text-lg font-medium placeholder-white/30 focus:ring-2 focus:ring-indigo-500/50"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Time of Day */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60 ml-1 flex items-center gap-2">
                                <Clock size={14} /> Time
                            </label>
                            <select
                                className="w-full px-4 py-3 glass-input rounded-xl appearance-none text-white/90"
                                value={formData.timeOfDay}
                                onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value })}
                            >
                                <option value="anytime">Anytime</option>
                                <option value="morning">Morning</option>
                                <option value="midday">Midday</option>
                                <option value="evening">Evening</option>
                            </select>
                        </div>

                        {/* Target Count */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60 ml-1 flex items-center gap-2">
                                <Target size={14} /> Target
                            </label>
                            <div className="flex items-center gap-3 px-4 py-3 glass-input rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, targetCount: Math.max(1, prev.targetCount - 1) }))}
                                    className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20"
                                >
                                    -
                                </button>
                                <span className="flex-1 text-center font-bold">{formData.targetCount}</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, targetCount: prev.targetCount + 1 }))}
                                    className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Color Picker */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-white/60 ml-1">Color Theme</label>
                        <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6'].map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-10 h-10 rounded-full border-2 transition-all duration-300 flex-shrink-0 ${formData.color === color ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!formData.title}
                        className="w-full py-4 bg-white text-black font-bold text-lg rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] mt-4"
                    >
                        {initialData ? 'Save Changes' : 'Create Habit'}
                    </button>
                </form>
            </div>
        </div>
    );
};
