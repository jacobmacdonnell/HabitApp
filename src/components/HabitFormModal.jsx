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
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setVisible(true));
        } else {
            setVisible(false);
        }
    }, [isOpen]);

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

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 200);
    };

    if (!isOpen) return null;

    const colors = [
        '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
        '#ec4899', '#f43f5e', '#f97316', '#22c55e', '#14b8a6',
    ];

    const icons = ['✨', '💪', '📚', '🧘', '💧', '🏃', '🎯', '💤', '🥗'];

    return (
        <div className="absolute inset-0 z-50 overflow-hidden pointer-events-none" style={{ isolation: 'isolate' }}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 rounded-[3.5rem] pointer-events-auto"
                style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.2s ease-out' }}
                onClick={handleClose}
            />

            {/* Bottom Sheet */}
            <div
                className="absolute bottom-0 left-0 right-0 bg-[#1c1c1e] rounded-t-[2rem] rounded-b-[3.5rem] border-t border-white/10 pointer-events-auto"
                style={{
                    transform: visible ? 'translateY(0)' : 'translateY(100%)',
                    transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
                    willChange: 'transform'
                }}
            >
                {/* Handle Bar */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-9 h-1 bg-white/20 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-5 pt-2 pb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">
                            {initialData ? 'Edit Habit' : 'New Habit'}
                        </h2>
                        <p className="text-sm text-white/40 mt-0.5">
                            {initialData ? 'Update your goals' : 'Build a new routine'}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white/50 active:bg-white/20"
                    >
                        <X size={16} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Form */}
                <div className="px-5 pb-10 overflow-y-auto" style={{ maxHeight: '52vh' }}>
                    <form
                        onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}
                        className="space-y-4"
                    >
                        {/* Habit Name */}
                        <div>
                            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2 ml-1">
                                Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Drink 8 glasses of water"
                                className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-[15px] text-white placeholder-white/25 focus:outline-none focus:bg-white/8 focus:border-white/20"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                autoFocus
                            />
                        </div>

                        {/* Icon Picker */}
                        <div>
                            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2 ml-1">
                                Icon
                            </label>
                            <div className="grid grid-cols-9 gap-1.5">
                                {icons.map((icon) => (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, icon })}
                                        className={`aspect-square rounded-lg flex items-center justify-center text-xl ${formData.icon === icon ? 'bg-white/15 ring-1 ring-white/40' : 'bg-white/5'}`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time & Goal */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Time */}
                            <div>
                                <label className="flex items-center gap-1 text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2 ml-1">
                                    <Clock size={10} /> Time
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-xl appearance-none text-white text-sm focus:outline-none"
                                        value={formData.timeOfDay}
                                        onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value })}
                                    >
                                        <option value="anytime" className="bg-[#1c1c1e]">Anytime</option>
                                        <option value="morning" className="bg-[#1c1c1e]">Morning</option>
                                        <option value="midday" className="bg-[#1c1c1e]">Midday</option>
                                        <option value="evening" className="bg-[#1c1c1e]">Evening</option>
                                    </select>
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-[10px] pointer-events-none">▼</span>
                                </div>
                            </div>

                            {/* Goal */}
                            <div>
                                <label className="flex items-center gap-1 text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2 ml-1">
                                    <Target size={10} /> Goal
                                </label>
                                <div className="h-11 flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, targetCount: Math.max(1, prev.targetCount - 1) }))}
                                        className="w-10 h-full flex items-center justify-center text-white/50 text-lg"
                                    >−</button>
                                    <span className="flex-1 text-center text-white font-semibold">{formData.targetCount}</span>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, targetCount: prev.targetCount + 1 }))}
                                        className="w-10 h-full flex items-center justify-center text-white/50 text-lg"
                                    >+</button>
                                </div>
                            </div>
                        </div>

                        {/* Color Picker */}
                        <div>
                            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2 ml-1">
                                Color
                            </label>
                            <div className="grid grid-cols-9 gap-1.5">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, color })}
                                        className={`aspect-square rounded-lg ${formData.color === color ? 'ring-1 ring-white/40' : ''}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={!formData.title.trim()}
                            className="w-full h-12 mt-3 font-semibold text-[15px] rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
                            style={{ backgroundColor: formData.title.trim() ? formData.color : '#333' }}
                        >
                            {initialData ? 'Save Changes' : 'Create Habit'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
