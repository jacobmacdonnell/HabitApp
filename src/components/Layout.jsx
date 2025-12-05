import React from 'react';
import { Home, Calendar, User, Settings, Battery, Wifi } from 'lucide-react';

export const Layout = ({ children, currentView, onNavigate, hideNav = false, modal }) => {
    return (
        <div className="min-h-screen mesh-bg text-white font-sans selection:bg-pink-500/30 flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-md h-[850px] max-h-[90vh] glass-panel rounded-[3.5rem] shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-white/10">

                {/* Status Bar Area */}
                <div className="h-16 w-full shrink-0 flex justify-between items-center px-8 pt-4 relative z-30">
                    <div className="px-4 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/5 flex items-center gap-2">
                        <span className="text-xs font-bold text-white/90 tracking-wide">9:41</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90 bg-black/20 backdrop-blur-md border border-white/5 px-4 py-1.5 rounded-full">
                        <Wifi size={14} strokeWidth={3} />
                        <Battery size={14} strokeWidth={3} />
                    </div>
                </div>

                {/* Main Content - Scrollable */}
                <main className="flex-1 overflow-y-auto p-6 pb-36 scrollbar-hide relative z-10">
                    {children}
                </main>

                {/* Floating Dock Navigation */}
                {!hideNav && (
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center z-40 pointer-events-none">
                        <nav className="bg-black/80 px-1.5 py-1.5 rounded-full flex gap-1.5 items-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10 pointer-events-auto">
                            <button
                                onClick={() => onNavigate && onNavigate('today')}
                                className={`p-2.5 rounded-full transition-all duration-200 active:scale-95 ${currentView === 'today' ? 'bg-white text-black shadow-md' : 'text-white/50'}`}
                            >
                                <Home size={18} strokeWidth={2.5} />
                            </button>

                            <button
                                onClick={() => onNavigate && onNavigate('weekly')}
                                className={`p-2.5 rounded-full transition-all duration-200 active:scale-95 ${currentView === 'weekly' ? 'bg-white text-black shadow-md' : 'text-white/50'}`}
                            >
                                <Calendar size={18} strokeWidth={2.5} />
                            </button>

                            <button
                                onClick={() => onNavigate && onNavigate('pet')}
                                className={`p-2.5 rounded-full transition-all duration-200 active:scale-95 ${currentView === 'pet' ? 'bg-white text-black shadow-md' : 'text-white/50'}`}
                            >
                                <User size={18} strokeWidth={2.5} />
                            </button>

                            <button
                                onClick={() => onNavigate && onNavigate('settings')}
                                className={`p-2.5 rounded-full transition-all duration-200 active:scale-95 ${currentView === 'settings' ? 'bg-white text-black shadow-md' : 'text-white/50'}`}
                            >
                                <Settings size={18} strokeWidth={2.5} />
                            </button>
                        </nav>
                    </div>
                )}

                {/* Ambient Glows */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none mix-blend-screen z-0" />
                <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-purple-500/20 to-transparent pointer-events-none mix-blend-screen z-0" />

                {/* Modal Slot - Renders on top of everything inside phone */}
                {modal}
            </div>
        </div>
    );
};
