import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, Target, Check, ChevronDown, Sun, Moon, Sunrise, Sparkles } from 'lucide-react';

export const HabitFormModal = ({ isOpen, onClose, onSubmit, initialData, defaultTime }) => {
    const [formData, setFormData] = useState({
        title: '',
        timeOfDay: 'anytime',
        frequency: 'daily',
        targetCount: 1,
        color: '#6366f1',
        icon: '✨'
    });
    const [visible, setVisible] = useState(false);
    const [showTimeSelect, setShowTimeSelect] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowTimeSelect(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                timeOfDay: defaultTime || 'anytime',
                frequency: 'daily',
                targetCount: 1,
                color: '#6366f1',
                icon: '✨'
            });
        }
    }, [initialData, isOpen, defaultTime]);

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
                                        className={`aspect-square rounded-xl flex items-center justify-center text-xl transition-all active:scale-95 ${formData.icon === icon ? 'bg-white/15 ring-1 ring-white ring-offset-1 ring-offset-[#1c1c1e]' : 'bg-white/5 opacity-70 hover:opacity-100'}`}
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
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setShowTimeSelect(!showTimeSelect)}
                                        className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-white text-sm focus:outline-none focus:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {formData.timeOfDay === 'anytime' && <Sparkles size={14} className="text-white" />}
                                            {formData.timeOfDay === 'morning' && <Sunrise size={14} className="text-orange-400" />}
                                            {formData.timeOfDay === 'midday' && <Sun size={14} className="text-yellow-400" />}
                                            {formData.timeOfDay === 'evening' && <Moon size={14} className="text-indigo-400" />}
                                            <span className="capitalize">{formData.timeOfDay === 'anytime' ? 'Anytime' : formData.timeOfDay}</span>
                                        </div>
                                        <ChevronDown size={14} className={`text-white/30 transition-transform ${showTimeSelect ? 'rotate-180' : ''}`} />
                                    </button>

                                    {showTimeSelect && (
                                        <div className="absolute top-full left-0 right-0 mt-2 p-1.5 bg-[#1c1c1e] border border-white/10 rounded-2xl shadow-xl z-50 animate-fade-in-fast origin-top">
                                            {[
                                                { id: 'anytime', label: 'Anytime', icon: <Sparkles size={14} className="text-white" /> },
                                                { id: 'morning', label: 'Morning', icon: <Sunrise size={14} className="text-orange-400" /> },
                                                { id: 'midday', label: 'Midday', icon: <Sun size={14} className="text-yellow-400" /> },
                                                { id: 'evening', label: 'Evening', icon: <Moon size={14} className="text-indigo-400" /> }
                                            ].map((option) => (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, timeOfDay: option.id });
                                                        setShowTimeSelect(false);
                                                    }}
                                                    className={`w-full p-2.5 rounded-xl flex items-center gap-2.5 text-sm font-medium transition-colors ${formData.timeOfDay === option.id ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                                                >
                                                    {option.icon}
                                                    <span>{option.label}</span>
                                                    {formData.timeOfDay === option.id && <Check size={14} className="ml-auto text-white/50" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
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
                                        className={`aspect-square rounded-xl transition-all active:scale-95 flex items-center justify-center ${formData.color === color ? 'ring-1 ring-white ring-offset-1 ring-offset-[#1c1c1e]' : 'opacity-70 hover:opacity-100'}`}
                                        style={{ backgroundColor: color }}
                                    >
                                        {formData.color === color && <Check size={16} className="text-white drop-shadow-md" strokeWidth={3} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="space-y-3 mt-3">
                            <button
                                type="submit"
                                disabled={!formData.title.trim()}
                                className="w-full h-12 font-bold text-[15px] rounded-xl text-white bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                            >
                                {initialData ? 'Save Changes' : 'Create Habit'}
                            </button>

                            {initialData && (
                                <button
                                    type="button"
                                    onClick={() => onClose('delete')}
                                    className="w-full h-12 font-semibold text-[15px] rounded-xl text-red-500 bg-red-500/10 active:bg-red-500/20 active:scale-[0.98] transition-all"
                                >
                                    Delete Habit
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
