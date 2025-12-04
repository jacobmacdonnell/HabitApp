import React from 'react';
import { X, Trash2, Github, Moon, Volume2 } from 'lucide-react';
import { useHabit } from '../context/HabitContext.jsx';

export const SettingsModal = ({ isOpen, onClose }) => {
    const { resetAllData } = useHabit();

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
                    <h2 className="text-2xl font-bold text-white tracking-tight">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white/60 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Preferences Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider ml-1">Preferences</h3>

                        <div className="glass-panel rounded-2xl overflow-hidden">
                            <div className="p-4 flex items-center justify-between border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                        <Moon size={20} />
                                    </div>
                                    <span className="font-medium text-white/90">Dark Mode</span>
                                </div>
                                <div className="w-12 h-7 bg-indigo-600 rounded-full relative">
                                    <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>

                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400">
                                        <Volume2 size={20} />
                                    </div>
                                    <span className="font-medium text-white/90">Sound Effects</span>
                                </div>
                                <div className="w-12 h-7 bg-indigo-600 rounded-full relative">
                                    <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider ml-1">Data</h3>

                        <button
                            onClick={() => {
                                if (confirm('Are you sure? This will delete all your habits and pet progress.')) {
                                    resetAllData();
                                    onClose();
                                }
                            }}
                            className="w-full p-4 glass-button rounded-2xl flex items-center gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group"
                        >
                            <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Reset All Data</span>
                        </button>
                    </div>

                    {/* About Section */}
                    <div className="pt-4 text-center">
                        <p className="text-white/30 text-sm">Habit Companion v1.0</p>
                        <div className="flex justify-center gap-4 mt-4">
                            <a href="#" className="text-white/40 hover:text-white transition-colors">
                                <Github size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
