import React, { useState } from 'react';
import { X, Trash2, Github, Moon, Volume2, ChevronRight, Shield, Bell } from 'lucide-react';
import { useHabit } from '../context/HabitContext.jsx';

export const SettingsModal = ({ isOpen, onClose }) => {
    const { resetData } = useHabit();
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />

            {/* Glass Sheet */}
            <div className="relative w-full max-w-md bg-[#1c1c1e]/80 backdrop-blur-2xl rounded-t-[2.5rem] p-8 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-slide-up border-t border-white/10 ring-1 ring-white/5 overflow-hidden">

                {/* Ambient Glow */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"
                />

                {/* Handle Bar */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full" />

                <div className="relative flex justify-between items-center mb-8 mt-2">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/5 rounded-full text-white/60 active:text-white active:bg-white/10 transition-all active:scale-95 border border-white/5"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-8 relative z-10">
                    {/* Preferences Section */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Preferences</h3>

                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                            <div className="p-4 flex items-center justify-between border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                        <Moon size={20} />
                                    </div>
                                    <span className="font-medium text-white/90">Dark Mode</span>
                                </div>
                                <div className="text-xs font-bold text-white/40 uppercase tracking-wider bg-white/10 px-2 py-1 rounded-md">
                                    Always On
                                </div>
                            </div>

                            <button
                                onClick={() => setSound(!sound)}
                                className="w-full p-4 flex items-center justify-between active:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400">
                                        <Volume2 size={20} />
                                    </div>
                                    <span className="font-medium text-white/90">Sound Effects</span>
                                </div>
                                <div className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${sound ? 'bg-indigo-500' : 'bg-white/10'}`}>
                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${sound ? 'right-1' : 'left-1'}`} />
                                </div>
                            </button>

                            <button
                                onClick={() => setNotifications(!notifications)}
                                className="w-full p-4 flex items-center justify-between active:bg-white/5 transition-colors border-t border-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                        <Bell size={20} />
                                    </div>
                                    <span className="font-medium text-white/90">Notifications</span>
                                </div>
                                <div className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${notifications ? 'bg-indigo-500' : 'bg-white/10'}`}>
                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${notifications ? 'right-1' : 'left-1'}`} />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Data Section */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Data & Privacy</h3>

                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                            <button className="w-full p-4 flex items-center justify-between active:bg-white/5 transition-colors border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                        <Shield size={20} />
                                    </div>
                                    <span className="font-medium text-white/90">Privacy Policy</span>
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
                                className="w-full p-4 flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-colors group"
                            >
                                <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                                    <Trash2 size={20} />
                                </div>
                                <span className="font-medium">Reset All Data</span>
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 text-center">
                        <div className="flex justify-center gap-4 mb-4">
                            <a href="#" className="p-3 bg-white/5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all">
                                <Github size={20} />
                            </a>
                        </div>
                        <p className="text-white/20 text-xs font-medium">Habit Companion v1.0.2</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
