import React, { useState } from 'react';
import { Trash2, Moon, Sun, Volume2, ChevronRight, Shield, Bell, Smartphone } from 'lucide-react';
import { TimePicker } from './TimePicker';
import { useHabit } from '../context/HabitContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export const SettingsView = () => {
    const { resetData, settings, updateSettings } = useHabit();
    const { themeSetting, setThemeSetting } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(true);

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-white">Settings</h1>

            <div className="space-y-6">
                {/* Preferences Section */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Preferences</h3>

                    <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-md">
                        <div className="p-5 border-b border-white/5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-2.5 bg-indigo-500/20 rounded-2xl text-indigo-400">
                                    <Moon size={20} />
                                </div>
                                <span className="font-bold text-base text-white/90">Appearance</span>
                            </div>
                            {/* iOS-style Segmented Control */}
                            <div className="flex bg-black/30 rounded-2xl p-1.5 gap-1">
                                <button
                                    onClick={() => setThemeSetting('auto')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${themeSetting === 'auto'
                                        ? 'bg-white/15 text-white shadow-sm'
                                        : 'text-white/50 active:bg-white/5'
                                        }`}
                                >
                                    <Smartphone size={18} />
                                    Auto
                                </button>
                                <button
                                    onClick={() => setThemeSetting('light')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${themeSetting === 'light'
                                        ? 'bg-white/15 text-white shadow-sm'
                                        : 'text-white/50 active:bg-white/5'
                                        }`}
                                >
                                    <Sun size={18} />
                                    Light
                                </button>
                                <button
                                    onClick={() => setThemeSetting('dark')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${themeSetting === 'dark'
                                        ? 'bg-white/15 text-white shadow-sm'
                                        : 'text-white/50 active:bg-white/5'
                                        }`}
                                >
                                    <Moon size={18} />
                                    Dark
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setSound(!sound)}
                            className="w-full p-4 flex items-center justify-between active:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-pink-500/20 rounded-2xl text-pink-400">
                                    <Volume2 size={20} />
                                </div>
                                <span className="font-bold text-base text-white/90">Sound Effects</span>
                            </div>
                            <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${sound ? 'bg-indigo-500' : 'bg-white/10'}`}>
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${sound ? 'right-1' : 'left-1'}`} />
                            </div>
                        </button>

                        <button
                            onClick={() => setNotifications(!notifications)}
                            className="w-full p-4 flex items-center justify-between active:bg-white/5 transition-colors border-t border-white/5"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-emerald-500/20 rounded-2xl text-emerald-400">
                                    <Bell size={20} />
                                </div>
                                <span className="font-bold text-base text-white/90">Notifications</span>
                            </div>
                            <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${notifications ? 'bg-indigo-500' : 'bg-white/10'}`}>
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${notifications ? 'right-1' : 'left-1'}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Sleep Schedule Section */}
            <div className="space-y-3 relative z-20">
                <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Sleep Schedule</h3>
                <div className="bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-md p-5 space-y-4">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-2.5 bg-purple-500/20 rounded-2xl text-purple-400">
                            <Moon size={20} />
                        </div>
                        <div className="flex-1">
                            <span className="font-bold text-base text-white/90 block">Pet Sleep Schedule</span>
                            <span className="text-xs text-white/50">Your pet will sleep during these hours</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Bedtime</label>
                            <TimePicker
                                value={settings?.sleepStart || '22:00'}
                                onChange={(val) => updateSettings({ sleepStart: val })}
                                type="bedtime"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Wake Up</label>
                            <TimePicker
                                value={settings?.sleepEnd || '06:00'}
                                onChange={(val) => updateSettings({ sleepEnd: val })}
                                type="wakeup"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Section */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Data & Privacy</h3>

                <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-md">
                    <button className="w-full p-4 flex items-center justify-between active:bg-white/5 transition-colors border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-blue-500/20 rounded-2xl text-blue-400">
                                <Shield size={20} />
                            </div>
                            <span className="font-bold text-base text-white/90">Privacy Policy</span>
                        </div>
                        <ChevronRight size={20} className="text-white/30" />
                    </button>

                    <button
                        onClick={() => {
                            if (confirm('Are you sure? This will delete all your habits and pet progress.')) {
                                resetData();
                            }
                        }}

                        className="w-full p-4 flex items-center gap-4 text-red-400 active:bg-red-500/10 transition-colors"
                    >
                        <div className="p-2.5 bg-red-500/10 rounded-2xl transition-colors">
                            <Trash2 size={20} />
                        </div>
                        <span className="font-bold text-base">Reset All Data</span>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-6 text-center">
                <p className="text-white/20 text-sm font-medium">Habit Companion v1.0.2</p>
            </div>
        </div>
    );
};
