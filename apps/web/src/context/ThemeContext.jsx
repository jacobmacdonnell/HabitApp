import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
    // 'auto' | 'light' | 'dark'
    const [themeSetting, setThemeSetting] = useState(() => {
        const saved = localStorage.getItem('theme-setting');
        return saved || 'auto';
    });

    const [resolvedTheme, setResolvedTheme] = useState('dark');

    useEffect(() => {
        localStorage.setItem('theme-setting', themeSetting);

        const updateResolvedTheme = () => {
            if (themeSetting === 'auto') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setResolvedTheme(prefersDark ? 'dark' : 'light');
            } else {
                setResolvedTheme(themeSetting);
            }
        };

        updateResolvedTheme();

        // Listen for system theme changes when in auto mode
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (themeSetting === 'auto') {
                updateResolvedTheme();
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [themeSetting]);

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;
        if (resolvedTheme === 'light') {
            root.classList.add('light-theme');
            root.classList.remove('dark-theme');
        } else {
            root.classList.add('dark-theme');
            root.classList.remove('light-theme');
        }
    }, [resolvedTheme]);

    return (
        <ThemeContext.Provider value={{ themeSetting, setThemeSetting, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
