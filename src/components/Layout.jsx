import React from 'react';
import { Home, Calendar, Settings, User } from 'lucide-react';

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen mesh-bg text-white font-sans selection:bg-pink-500/30 flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-md h-[850px] max-h-[90vh] glass-panel rounded-[3rem] shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-white/10">

                {/* Status Bar Area */}
                <div className="h-14 w-full shrink-0 flex justify-between items-center px-8 pt-2">
                    <span className="text-xs font-medium text-white/70">9:41</span>
                    <div className="flex gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-white/20" />
                        <div className="w-4 h-4 rounded-full bg-white/20" />
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto p-6 pb-28 scrollbar-hide relative z-10">
                    {children}
                </main>

                {/* Floating Dock Navigation */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
                    <nav className="glass-panel px-6 py-4 rounded-full flex gap-8 items-center shadow-lg border border-white/20">
                        <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/90">
                            <Home size={24} strokeWidth={2.5} />
                        </button>
                        <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                            <Calendar size={24} strokeWidth={2.5} />
                        </button>
                        <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                            <User size={24} strokeWidth={2.5} />
                        </button>
                    </nav>
                </div>

                {/* Ambient Glows */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-purple-500/20 to-transparent pointer-events-none" />
            </div>
        </div>
    );
};
