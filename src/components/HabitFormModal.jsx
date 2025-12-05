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
    const [isClosing, setIsClosing] = useState(false);

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
        setIsClosing(false);
    }, [initialData, isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 250);
    };

    if (!isOpen) return null;

    const colors = [
        '#6366f1', '#a855f7', '#ec4899', '#f43f5e',
        '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6',
    ];

    const icons = ['✨', '💪', '📚', '🧘', '💧', '🏃', '🎯', '💤', '🥗'];

    return (
        <>
            {/* Backdrop - absolute within phone frame */}
            <div
                className="absolute inset-0 z-40 bg-black/80 rounded-[3.5rem]"
                onClick={handleClose}
            />

            {/* Bottom Sheet - slides up within phone frame */}
            <div
                className="absolute bottom-0 left-0 right-0 z-50 bg-[#1c1c1e] rounded-t-[2rem] rounded-b-[3.5rem] border-t border-white/10"
                style={{
                    transform: isClosing ? 'translateY(100%)' : 'translateY(0)',
                    transition: 'transform 0.25s ease-out',
                    animation: isClosing ? 'none' : 'slideUp 0.25s ease-out'
                }}
            >
                {/* Handle Bar */}
                <div className="pt-3 pb-2 flex justify-center">
                    <div className="w-10 h-1 bg-white/20 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-6 pb-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {initialData ? 'Edit Habit' : 'New Habit'}
                        </h2>
                        <p className="text-white/40 text-sm">
                            {initialData ? 'Update your goals' : 'Build a new routine'}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2.5 bg-white/10 rounded-full text-white/60 active:bg-white/20"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="px-6 pb-12 overflow-y-auto" style={{ maxHeight: '55vh' }}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSubmit(formData);
                        }}
                        className="space-y-5"
                    >
                        {/* Habit Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Habit Name</label>
                            <input
                                type="text"
                                placeholder="e.g., Drink Water"
                                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-base text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                autoFocus
                            />
                        </div>

                        {/* Icon Picker */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Icon</label>
                            <div className="flex gap-2 flex-wrap">
                                {icons.map((icon) => (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, icon })}
                                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all ${formData.icon === icon
                                            ? 'bg-white/15 ring-2 ring-white/30'
                                            : 'bg-white/5'
                                            }`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time & Goal Row */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Time of Day */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-1">
                                    <Clock size={10} /> Time
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-xl appearance-none text-white text-sm focus:outline-none focus:bg-white/10"
                                        value={formData.timeOfDay}
                                        onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value })}
                                    >
                                        <option value="anytime" className="bg-[#1c1c1e]">Anytime</option>
                                        <option value="morning" className="bg-[#1c1c1e]">Morning</option>
                                        <option value="midday" className="bg-[#1c1c1e]">Midday</option>
                                        <option value="evening" className="bg-[#1c1c1e]">Evening</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-xs">▼</div>
                                </div>
                            </div>

                            {/* Daily Goal */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-1">
                                    <Target size={10} /> Goal
                                </label>
                                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, targetCount: Math.max(1, prev.targetCount - 1) }))}
                                        className="w-10 h-10 flex items-center justify-center text-white/60 active:bg-white/10 text-lg font-medium"
                                    >
                                        −
                                    </button>
                                    <span className="flex-1 text-center font-bold text-white">{formData.targetCount}</span>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, targetCount: prev.targetCount + 1 }))}
                                        className="w-10 h-10 flex items-center justify-center text-white/60 active:bg-white/10 text-lg font-medium"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Color Picker */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Color</label>
                            <div className="grid grid-cols-9 gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, color })}
                                        className={`aspect-square rounded-full transition-transform ${formData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1c1c1e] scale-110' : ''}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!formData.title}
                            className="w-full py-4 font-bold text-base rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed text-white mt-4"
                            style={{
                                backgroundColor: formData.title ? formData.color : '#333'
                            }}
                        >
                            {initialData ? 'Save Changes' : 'Create Habit'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Keyframes */}
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </>
    );
};
