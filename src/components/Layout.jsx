import React from 'react';
import { Home, Calendar, User, Settings, Battery, Wifi } from 'lucide-react';

export const Layout = ({ children, currentView, onNavigate }) => {
    return (
        <div className="min-h-screen mesh-bg text-white font-sans selection:bg-pink-500/30 flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-md h-[850px] max-h-[90vh] glass-panel rounded-[3.5rem] shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-white/10 transition-all duration-500">

                {/* Status Bar Area */}
                <div className="h-16 w-full shrink-0 flex justify-between items-center px-8 pt-4 relative z-50">
                    <div className="px-4 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/5 flex items-center gap-2">
                        <span className="text-xs font-bold text-white/90 tracking-wide">9:41</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90 bg-black/20 backdrop-blur-md border border-white/5 px-4 py-1.5 rounded-full">
                        <Wifi size={14} strokeWidth={3} />
                        <Battery size={14} strokeWidth={3} />
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto p-6 pb-36 scrollbar-hide relative z-10">
                    {children}
                </main>

                {/* Floating Dock Navigation */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
                    <nav className="glass-panel px-3 py-3 rounded-full flex gap-3 items-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/20 pointer-events-auto backdrop-blur-xl bg-black/20 hover:scale-105 transition-transform duration-300">
                        <button
                            onClick={() => onNavigate && onNavigate('today')}
                            className={`p-4 rounded-full transition-all duration-300 group relative ${currentView === 'today' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-110' : 'hover:bg-white/10 text-white/50 hover:text-white'}`}
                        >
                            <Home size={24} strokeWidth={3} className="group-hover:-translate-y-1 transition-transform duration-300" />
                            {currentView === 'today' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-50" />}
                        </button>

                        <button
                            onClick={() => onNavigate && onNavigate('weekly')}
                            className={`p-4 rounded-full transition-all duration-300 group relative ${currentView === 'weekly' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-110' : 'hover:bg-white/10 text-white/50 hover:text-white'}`}
                        >
                            <Calendar size={24} strokeWidth={3} className="group-hover:-translate-y-1 transition-transform duration-300" />
                            {currentView === 'weekly' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-50" />}
                        </button>

                        <button
                            onClick={() => onNavigate && onNavigate('pet')}
                            className={`p-4 rounded-full transition-all duration-300 group relative ${currentView === 'pet' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-110' : 'hover:bg-white/10 text-white/50 hover:text-white'}`}
                        >
                            <User size={24} strokeWidth={3} className="group-hover:-translate-y-1 transition-transform duration-300" />
                            {currentView === 'pet' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-50" />}
                        </button>

                        <button
                            onClick={() => onNavigate && onNavigate('settings')}
                            className={`p-4 rounded-full transition-all duration-300 group relative ${currentView === 'settings' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-110' : 'hover:bg-white/10 text-white/50 hover:text-white'}`}
                        >
                            <Settings size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                            {currentView === 'settings' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-50" />}
                        </button>
                    </nav>
                </div>

                {/* Ambient Glows */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-purple-500/20 to-transparent pointer-events-none mix-blend-screen" />
            </div>
        </div>
    );
};
