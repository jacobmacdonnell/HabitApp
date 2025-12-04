import React, { useState } from 'react';
import { Trash2, Github, Moon, Volume2, ChevronRight, Shield, Bell } from 'lucide-react';
import { useHabit } from '../context/HabitContext.jsx';

export const SettingsView = () => {
    const { resetData } = useHabit();
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(true);

    return (
        <div className="space-y-8 animate-fade-in pb-8">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-3xl font-black text-white tracking-tight">Settings</h2>
            </div>

            <div className="space-y-8">
                {/* Preferences Section */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Preferences</h3>

                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
                        <div className="p-5 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                                    <Moon size={24} />
                                </div>
                                <span className="font-bold text-lg text-white/90">Dark Mode</span>
                            </div>
                            <div className="text-xs font-bold text-white/40 uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-lg">
                                Always On
                            </div>
                        </div>

                        <button
                            onClick={() => setSound(!sound)}
                            className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-pink-500/20 rounded-2xl text-pink-400">
                                    <Volume2 size={24} />
                                </div>
                                <span className="font-bold text-lg text-white/90">Sound Effects</span>
                            </div>
                            <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${sound ? 'bg-indigo-500' : 'bg-white/10'}`}>
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${sound ? 'right-1' : 'left-1'}`} />
                            </div>
                        </button>

                        <button
                            onClick={() => setNotifications(!notifications)}
                            className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors border-t border-white/5"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                                    <Bell size={24} />
                                </div>
                                <span className="font-bold text-lg text-white/90">Notifications</span>
                            </div>
                            <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${notifications ? 'bg-indigo-500' : 'bg-white/10'}`}>
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${notifications ? 'right-1' : 'left-1'}`} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Data Section */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Data & Privacy</h3>

                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
                        <button className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                                    <Shield size={24} />
                                </div>
                                <span className="font-bold text-lg text-white/90">Privacy Policy</span>
                            </div>
                            <ChevronRight size={20} className="text-white/30" />
                        </button>

                        <button
                            onClick={() => {
                                if (confirm('Are you sure? This will delete all your habits and pet progress.')) {
                                    resetData();
                                }
                            }}
                            className="w-full p-5 flex items-center gap-4 text-red-400 hover:bg-red-500/10 transition-colors group"
                        >
                            <div className="p-3 bg-red-500/10 rounded-2xl group-hover:bg-red-500/20 transition-colors">
                                <Trash2 size={24} />
                            </div>
                            <span className="font-bold text-lg">Reset All Data</span>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-8 text-center space-y-4">
                    <div className="flex justify-center gap-4">
                        <a href="#" className="p-4 bg-white/5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all hover:scale-110">
                            <Github size={24} />
                        </a>
                    </div>
                    <p className="text-white/20 text-sm font-medium">Habit Companion v1.0.2</p>
                </div>
            </div>
        </div>
    );
};
