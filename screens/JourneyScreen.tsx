
import React, { useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { FireIcon, StarIcon } from '../components/Icons';
import { Screen } from '../types';

const motivationalQuotes = [
    "The journey of a thousand miles begins with a single step.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Consistency is what transforms average into excellence.",
    "Progress is not linear. Trust the process.",
    "The secret of your future is hidden in your daily routine."
];

const isToday = (isoDate?: string) => {
    if (!isoDate) return false;
    const date = new Date(isoDate);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
};

const TreeOfLife: React.FC<{ level: number }> = ({ level }) => {
    // Dynamic tree generation based on level
    const leafCount = Math.min(level * 5, 50);
    const flowers = level > 5 ? Math.min((level - 5) * 2, 10) : 0;
    
    return (
        <div className="relative w-full h-48 flex items-center justify-center overflow-visible mb-6">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                {/* Trunk */}
                <path d="M100,180 Q100,100 100,60" stroke="#5d4037" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M100,120 Q70,90 40,80" stroke="#5d4037" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M100,110 Q130,80 160,70" stroke="#5d4037" strokeWidth="4" strokeLinecap="round" fill="none" />
                
                {/* Leaves */}
                {[...Array(leafCount)].map((_, i) => (
                    <circle 
                        key={i} 
                        cx={70 + Math.sin(i * 137.5) * (30 + i * 1.5)} 
                        cy={90 + Math.cos(i * 137.5) * (30 + i * 1.5)} 
                        r={Math.random() * 3 + 2} 
                        fill={i % 2 === 0 ? "#4caf50" : "#8bc34a"} 
                        className="animate-pulse-aura"
                        style={{ animationDelay: `${i * 0.1}s`, '--aura-color': 'rgba(76, 175, 80, 0.2)' } as any}
                    />
                ))}

                {/* Flowers for higher levels */}
                {[...Array(flowers)].map((_, i) => (
                    <circle 
                        key={`flower-${i}`} 
                        cx={100 + Math.sin(i * 60) * 50} 
                        cy={100 + Math.cos(i * 60) * 50} 
                        r="4" 
                        fill="#f48fb1" 
                        className="animate-firefly-glow"
                    />
                ))}
            </svg>
            <div className="absolute bottom-2 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full border border-white/30">
                <span className="text-xs font-black uppercase tracking-widest text-white">The Garden of Self</span>
            </div>
        </div>
    );
};

const JourneyScreen: React.FC = () => {
    const { journals, goals, meditationCount, checkStreaks, getRealmMoodText, level, xp } = useAppContext();

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
        return motivationalQuotes[today.getDate() % motivationalQuotes.length];
    }, []);
    
    return (
        <div className="h-full w-full flex flex-col p-6 relative overflow-x-hidden text-[--text-primary]" style={{ paddingTop: `calc(2.5rem + env(safe-area-inset-top, 0px))` }}>
            <header className="text-center z-10 mb-6 flex-shrink-0 animate-fade-in-up">
                <h2 className="font-light text-sm tracking-widest uppercase opacity-80 text-[--text-secondary]">The Sunset Realm</h2>
                <h1 className="font-sans text-3xl font-bold opacity-90 text-[--text-header]">Your Evolution</h1>
                <p className="text-xs font-semibold text-[--accent-color] mt-1">{getRealmMoodText(Screen.Journey)}</p>
            </header>

            <main className="z-10 flex-grow flex flex-col items-center w-full max-w-md mx-auto overflow-y-auto" style={{ paddingBottom: `calc(7rem + env(safe-area-inset-bottom, 0px))` }}>
                
                <TreeOfLife level={level} />

                <div className="glassmorphism rounded-3xl p-5 w-full mb-6 text-[--text-on-glass] border-t border-white/20">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h3 className="text-xl font-black">Level {level}</h3>
                            <p className="text-xs opacity-70 uppercase font-bold tracking-widest">Growth Maturity</p>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-black">{xp} <span className="opacity-50 text-[10px]">TOTAL XP</span></span>
                        </div>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden shadow-inner">
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-[--accent-color] transition-all duration-1000 ease-out"
                            style={{ width: `${(xp % 500) / 5}%` }}
                        />
                    </div>
                    <p className="text-[10px] mt-2 opacity-60 text-center font-bold tracking-widest uppercase">Next maturity stage in {500 - (xp % 500)} points</p>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full mb-6">
                    <div className="glassmorphism p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                        <span className="text-3xl mb-1">🧘</span>
                        <span className="text-lg font-black text-white">{meditationCount}</span>
                        <span className="text-[10px] uppercase font-bold opacity-60">Stillness</span>
                    </div>
                    <div className="glassmorphism p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                        <span className="text-3xl mb-1">✍️</span>
                        <span className="text-lg font-black text-white">{journals.length}</span>
                        <span className="text-[10px] uppercase font-bold opacity-60">Insights</span>
                    </div>
                </div>

                <div className="w-full text-center px-6 py-4 glassmorphism rounded-2xl italic opacity-90 text-sm mb-6 border border-white/10">
                    "{dailyQuote}"
                </div>

                <div className="w-full">
                    <h3 className="text-lg font-sans font-bold mb-3 text-[--text-header] pl-1">Habit Resilience</h3>
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
                                        <span>Personal Best: {goal.longestStreak || 0}</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="glassmorphism p-4 rounded-xl text-center opacity-70 text-[--text-on-glass]">
                                <p>No daily habits set yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JourneyScreen;
