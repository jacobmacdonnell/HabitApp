import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const HabitFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        color: '#4ECDC4',
        icon: '✨',
        frequency: { type: 'daily', days: [] },
        timeOfDay: 'anytime',
        targetCount: 1
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                title: '',
                color: '#4ECDC4',
                icon: '✨',
                frequency: { type: 'daily', days: [] },
                timeOfDay: 'anytime',
                targetCount: 1
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8C42', '#A06CD5', '#2C3E50'];
    const times = ['morning', 'midday', 'evening', 'anytime'];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const toggleDay = (dayIndex) => {
        const currentDays = formData.frequency.days || [];
        const newDays = currentDays.includes(dayIndex)
            ? currentDays.filter(d => d !== dayIndex)
            : [...currentDays, dayIndex];

        setFormData({
            ...formData,
            frequency: { ...formData.frequency, type: 'specific', days: newDays }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto text-white shadow-2xl animate-fade-in">
                <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">{initialData ? 'Edit Habit' : 'New Habit'}</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60">Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g., Drink Water"
                            />
                        </div>

                        {/* Color Picker */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60">Color</label>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, color })}
                                        className={`w-10 h-10 rounded-full border-2 shrink-0 transition-all ${formData.color === color ? 'border-white scale-110' : 'border-transparent'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Frequency */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60">Frequency</label>
                            <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
                                {['daily', 'weekly'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, frequency: { ...formData.frequency, type } })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${formData.frequency.type === type ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* Specific Days Selection */}
                            <div className="pt-2">
                                <p className="text-xs text-white/40 mb-2">Or select specific days:</p>
                                <div className="flex justify-between gap-1">
                                    {daysOfWeek.map((day, index) => {
                                        const isSelected = formData.frequency.days?.includes(index);
                                        return (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => toggleDay(index)}
                                                className={`w-10 h-10 rounded-lg text-xs font-bold transition-all ${isSelected ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                                            >
                                                {day.charAt(0)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Time of Day */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60">Time of Day</label>
                            <div className="grid grid-cols-2 gap-2">
                                {times.map(time => (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, timeOfDay: time })}
                                        className={`py-2 px-3 rounded-xl border text-sm transition-all ${formData.timeOfDay === time ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'}`}
                                    >
                                        {time.charAt(0).toUpperCase() + time.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Target Count */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60">Daily Target</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={formData.targetCount}
                                    onChange={e => setFormData({ ...formData, targetCount: parseInt(e.target.value) })}
                                    className="flex-1 accent-indigo-500"
                                />
                                <span className="text-xl font-bold w-8 text-center">{formData.targetCount}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95"
                        >
                            {initialData ? 'Save Changes' : 'Create Habit'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
