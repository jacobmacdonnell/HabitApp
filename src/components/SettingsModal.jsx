import React, { useState } from 'react';
import { X, Trash2, Github, Moon, Volume2, ChevronRight, Shield, Bell } from 'lucide-react';
import { useHabit } from '../context/HabitContext.jsx';

export const SettingsModal = ({ isOpen, onClose }) => {
    const { resetData } = useHabit();
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Bottom Sheet - Slides up from bottom */}
            <div className="relative w-full bg-[#1c1c1e] rounded-t-[2rem] shadow-2xl border-t border-white/10 animate-slide-up">

                {/* Handle Bar */}
                <div className="pt-3 pb-2 flex justify-center">
                    <div className="w-10 h-1 bg-white/20 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-6 pb-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white tracking-tight">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2.5 bg-white/10 rounded-full text-white/60 active:bg-white/20 transition-all active:scale-95"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 pb-10 max-h-[60vh] overflow-y-auto scrollbar-hide space-y-6">
                    {/* Preferences Section */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Preferences</h3>

                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                            <div className="p-4 flex items-center justify-between border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                                        <Moon size={18} />
                                    </div>
                                    <span className="font-medium text-white/90 text-sm">Dark Mode</span>
                                </div>
                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider bg-white/10 px-2 py-1 rounded-md">
                                    Always On
                                </div>
                            </div>

                            <button
                                onClick={() => setSound(!sound)}
                                className="w-full p-4 flex items-center justify-between active:bg-white/5 transition-colors border-b border-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-pink-500/20 rounded-xl text-pink-400">
                                        <Volume2 size={18} />
                                    </div>
                                    <span className="font-medium text-white/90 text-sm">Sound Effects</span>
                                </div>
                                <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${sound ? 'bg-indigo-500' : 'bg-white/10'}`}>
                                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${sound ? 'right-0.5' : 'left-0.5'}`} />
                                </div>
                            </button>

                            <button
                                onClick={() => setNotifications(!notifications)}
                                className="w-full p-4 flex items-center justify-between active:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                                        <Bell size={18} />
                                    </div>
                                    <span className="font-medium text-white/90 text-sm">Notifications</span>
                                </div>
                                <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${notifications ? 'bg-indigo-500' : 'bg-white/10'}`}>
                                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${notifications ? 'right-0.5' : 'left-0.5'}`} />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Data Section */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Data & Privacy</h3>

                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                            <button className="w-full p-4 flex items-center justify-between active:bg-white/5 transition-colors border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                                        <Shield size={18} />
                                    </div>
                                    <span className="font-medium text-white/90 text-sm">Privacy Policy</span>
                                </div>
                                <ChevronRight size={16} className="text-white/30" />
                            </button>

                            <button
                                onClick={() => {
                                    if (confirm('Are you sure? This will delete all your habits and pet progress.')) {
                                        resetData();
                                        onClose();
                                    }
                                }}
                                className="w-full p-4 flex items-center gap-3 text-red-400 active:bg-red-500/10 transition-colors"
                            >
                                <div className="p-2 bg-red-500/10 rounded-xl">
                                    <Trash2 size={18} />
                                </div>
                                <span className="font-medium text-sm">Reset All Data</span>
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 text-center">
                        <div className="flex justify-center gap-4 mb-3">
                            <a href="#" className="p-2.5 bg-white/5 rounded-full text-white/40 active:text-white active:bg-white/10 transition-all">
                                <Github size={18} />
                            </a>
                        </div>
                        <p className="text-white/20 text-xs font-medium">Habit Companion v1.0.2</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
