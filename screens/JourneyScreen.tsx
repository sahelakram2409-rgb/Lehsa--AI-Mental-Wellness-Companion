import React, { useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { FireIcon, StarIcon } from '../components/Icons';

const motivationalQuotes = [
    "The journey of a thousand miles begins with a single step.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "It's not about being perfect. It's about effort. And when you bring that effort every single day, that's where transformation happens.",
    "Consistency is what transforms average into excellence.",
    "Progress is not linear. Trust the process.",
    "The secret of your future is hidden in your daily routine.",
    "Don't watch the clock; do what it does. Keep going."
];

const isToday = (isoDate?: string) => {
    if (!isoDate) return false;
    const date = new Date(isoDate);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
};

const CircularProgress: React.FC<{ percentage: number; color: string; size: number; strokeWidth: number }> = ({ percentage, color, size, strokeWidth }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle
                stroke="rgba(255,255,255,0.1)"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            <circle
                stroke={color}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                style={{ strokeDasharray: circumference, strokeDashoffset: offset, transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
        </svg>
    );
};

const JourneyScreen: React.FC = () => {
    const { journals, goals, meditationCount, checkStreaks } = useAppContext();

    useEffect(() => {
        checkStreaks();
    }, [checkStreaks, goals]);

    const dailyHabits = useMemo(() => goals.filter(g => g.status === 'Active' && g.type === 'daily'), [goals]);
    const habitsCompletedToday = useMemo(() => dailyHabits.filter(g => isToday(g.lastCompleted)).length, [dailyHabits]);
    const totalHabits = dailyHabits.length;
    
    const overallProgress = useMemo(() => {
        const total = totalHabits > 0 ? (habitsCompletedToday / totalHabits) * 100 : 0;
        return Math.round(total);
    }, [habitsCompletedToday, totalHabits]);

    const dailyQuote = useMemo(() => {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 0);
        const diff = today.getTime() - startOfYear.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        return motivationalQuotes[dayOfYear % motivationalQuotes.length];
    }, []);
    
    return (
        <div className="h-full w-full flex flex-col p-6 relative overflow-x-hidden text-[--text-primary]" style={{ paddingTop: `calc(2.5rem + env(safe-area-inset-top, 0px))` }}>
            <header className="text-center z-10 mb-8 flex-shrink-0">
                <h2 className="font-light text-sm tracking-widest uppercase opacity-80 text-[--text-secondary]">The Sunset Realm</h2>
                <h1 className="font-sans text-3xl font-bold opacity-90 text-[--text-header]">Your Journey</h1>
            </header>

            <main className="z-10 flex-grow flex flex-col items-center w-full max-w-md mx-auto overflow-y-auto" style={{ paddingBottom: `calc(7rem + env(safe-area-inset-bottom, 0px))` }}>
                <div className="glassmorphism rounded-3xl p-6 w-full flex items-center space-x-6 mb-6 text-[--text-on-glass]">
                    <div className="relative">
                        <CircularProgress percentage={overallProgress} color="var(--accent-color-hover)" size={100} strokeWidth={8} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">{overallProgress}%</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-sans font-bold">Daily Progress</h3>
                        <div className="space-y-1 mt-2 text-sm">
                            <p>🧘 Meditations: {meditationCount}</p>
                            <p>✍️ Journals: {journals.length}</p>
                            <p>🎯 Habits Today: {habitsCompletedToday}/{totalHabits}</p>
                        </div>
                    </div>
                </div>

                <div className="w-full text-center px-4 py-2 mb-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <p className="text-sm italic opacity-80">
                        "{dailyQuote}"
                    </p>
                </div>

                <div className="w-full">
                    <h3 className="text-lg font-sans font-bold mb-3 text-[--text-header]">Today's Habits</h3>
                     <div className="space-y-3">
                        {dailyHabits.length > 0 ? dailyHabits.map(goal => (
                            <div key={goal.goalName} className="glassmorphism p-3.5 rounded-xl flex flex-col animate-fade-in-up text-[--text-on-glass]">
                                <div className="flex items-center">
                                    <div 
                                        className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 transition-colors duration-300 ${!isToday(goal.lastCompleted) ? 'border-2 border-white/50' : ''}`}
                                        style={isToday(goal.lastCompleted) ? { backgroundColor: 'var(--accent-color)' } : {}}
                                    >
                                        {isToday(goal.lastCompleted) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <p className={`font-semibold transition-opacity duration-300 ${isToday(goal.lastCompleted) ? 'opacity-50 line-through' : ''}`}>{goal.goalName}</p>
                                </div>
                                <div className="pl-8 pt-2 w-full flex items-center space-x-4 text-xs font-semibold" style={{ color: 'var(--accent-color-hover)' }}>
                                    <div className="flex items-center space-x-1">
                                        <FireIcon className="w-4 h-4" />
                                        <span>{goal.currentStreak || 0} Day Streak</span>
                                    </div>
                                    <div className="flex items-center space-x-1 opacity-70">
                                        <StarIcon className="w-4 h-4 text-yellow-300" />
                                        <span>Longest: {goal.longestStreak || 0}</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="glassmorphism p-4 rounded-xl text-center opacity-70 text-[--text-on-glass]">
                                <p>No daily habits set yet.</p>
                                <p className="text-xs">Try setting one in the Growth Realm!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JourneyScreen;