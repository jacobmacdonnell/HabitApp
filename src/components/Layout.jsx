import React from 'react';

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-sans selection:bg-pink-300">
            <div className="max-w-md mx-auto min-h-screen bg-white/10 backdrop-blur-xl shadow-2xl flex flex-col relative overflow-hidden">
                {/* iOS Status Bar Placeholder */}
                <div className="h-12 w-full shrink-0" />

                <main className="flex-1 overflow-y-auto p-6 pb-24 scrollbar-hide">
                    {children}
                </main>

                {/* Bottom Navigation Placeholder */}
                <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white/20 backdrop-blur-md border-t border-white/10 flex justify-around items-center pb-4">
                    {/* Navigation items will go here */}
                </nav>
            </div>
        </div>
    );
};
