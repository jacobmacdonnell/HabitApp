import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown } from 'lucide-react';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 3;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const Wheel = ({ options, value, onChange }) => {
    const containerRef = useRef(null);
    const scrollTimeout = useRef(null);

    // Scroll to initial value on mount
    useEffect(() => {
        if (containerRef.current) {
            const index = options.indexOf(value);
            if (index !== -1) {
                containerRef.current.scrollTop = index * ITEM_HEIGHT;
            }
        }
    }, []); // Only on mount

    const handleScroll = () => {
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
            if (containerRef.current) {
                const scrollTop = containerRef.current.scrollTop;
                const index = Math.round(scrollTop / ITEM_HEIGHT);
                const safeIndex = Math.max(0, Math.min(index, options.length - 1));
                if (options[safeIndex] !== value) {
                    onChange(options[safeIndex]);
                }
            }
        }, 80);
    };

    const handleItemClick = (option) => {
        const index = options.indexOf(option);
        if (containerRef.current && index !== -1) {
            containerRef.current.scrollTo({
                top: index * ITEM_HEIGHT,
                behavior: 'smooth'
            });
        }
        onChange(option);
    };

    return (
        <div
            ref={containerRef}
            className="overflow-y-auto scrollbar-hide"
            onScroll={handleScroll}
            style={{
                height: CONTAINER_HEIGHT,
                scrollSnapType: 'y mandatory',
                WebkitOverflowScrolling: 'touch'
            }}
        >
            {/* Top spacer */}
            <div style={{ height: ITEM_HEIGHT }} />

            {options.map((option) => (
                <div
                    key={option}
                    onClick={() => handleItemClick(option)}
                    className={`flex items-center justify-center cursor-pointer transition-all duration-150 select-none ${option === value
                        ? 'text-white text-lg font-bold'
                        : 'text-white/40 text-base'
                        }`}
                    style={{
                        height: ITEM_HEIGHT,
                        scrollSnapAlign: 'center'
                    }}
                >
                    {option}
                </div>
            ))}

            {/* Bottom spacer */}
            <div style={{ height: ITEM_HEIGHT }} />
        </div>
    );
};

export const TimePicker = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const parseTime = (timeStr) => {
        const [h, m] = (timeStr || '00:00').split(':').map(Number);
        const period = h >= 12 ? 'PM' : 'AM';
        const hour12 = h % 12 || 12;
        return {
            hour: hour12.toString(),
            minute: m.toString().padStart(2, '0'),
            period
        };
    };

    const to24Hour = (h, m, p) => {
        let hour = parseInt(h);
        if (p === 'PM' && hour !== 12) hour += 12;
        if (p === 'AM' && hour === 12) hour = 0;
        return `${hour.toString().padStart(2, '0')}:${m}`;
    };

    const { hour, minute, period } = parseTime(value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const hoursList = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const minutesList = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const periodsList = ['AM', 'PM'];

    const handleUpdate = (newHour, newMinute, newPeriod) => {
        onChange(to24Hour(newHour, newMinute, newPeriod));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-black/20 border rounded-xl px-4 py-3 flex items-center justify-between font-bold focus:outline-none transition-all ${isOpen ? 'border-white/30 bg-black/30 text-white' : 'border-white/10 text-white hover:bg-black/30'
                    }`}
            >
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-white/50" />
                    <span>{hour}:{minute} {period}</span>
                </div>
                <ChevronDown size={16} className={`text-white/30 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1c1c1e] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden ring-1 ring-white/10">
                    <div className="relative flex" style={{ height: CONTAINER_HEIGHT }}>

                        {/* Center Highlight Bar */}
                        <div
                            className="absolute left-2 right-2 bg-white/10 pointer-events-none rounded-xl"
                            style={{
                                top: ITEM_HEIGHT,
                                height: ITEM_HEIGHT
                            }}
                        />

                        {/* Wheels */}
                        <div className="flex-1 relative z-10">
                            <Wheel
                                options={hoursList}
                                value={hour}
                                onChange={(h) => handleUpdate(h, minute, period)}
                            />
                        </div>
                        <div className="flex-1 relative z-10">
                            <Wheel
                                options={minutesList}
                                value={minute}
                                onChange={(m) => handleUpdate(hour, m, period)}
                            />
                        </div>
                        <div className="flex-1 relative z-10">
                            <Wheel
                                options={periodsList}
                                value={period}
                                onChange={(p) => handleUpdate(hour, minute, p)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
