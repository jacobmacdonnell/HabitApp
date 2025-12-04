import React from 'react';
import { Home, Calendar, Settings, User, Battery, Wifi } from 'lucide-react';

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen mesh-bg text-white font-sans selection:bg-pink-500/30 flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-md h-[850px] max-h-[90vh] glass-panel rounded-[3rem] shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-white/10">

                {/* Status Bar Area */}
                <div className="h-14 w-full shrink-0 flex justify-between items-center px-8 pt-2 relative z-50">
                    <span className="text-xs font-bold text-white/90 tracking-wide">9:41</span>
                    <div className="flex items-center gap-2 text-white/90">
                        <Wifi size={14} strokeWidth={3} />
                        <Battery size={14} strokeWidth={3} />
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto p-6 pb-32 scrollbar-hide relative z-10">
                    {children}
                </main>

                {/* Floating Dock Navigation */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
                    <nav className="glass-panel px-2 py-2 rounded-full flex gap-2 items-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/20 pointer-events-auto backdrop-blur-xl bg-black/20">
                        <button className="p-3 rounded-full bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] ring-1 ring-white/20">
                            <Home size={24} strokeWidth={2.5} />
                        </button>
                        <button className="p-3 rounded-full hover:bg-white/5 transition-all text-white/40 hover:text-white active:scale-95">
                            <Calendar size={24} strokeWidth={2.5} />
                        </button>
                        <button className="p-3 rounded-full hover:bg-white/5 transition-all text-white/40 hover:text-white active:scale-95">
                            <User size={24} strokeWidth={2.5} />
                        </button>
                    </nav>
                </div>

                {/* Ambient Glows */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none" />
            </div>
        </div>
    );
};
