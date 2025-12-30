
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { Goal, Screen } from '../types';
import { PinIcon, TrashIcon, BellIcon, PlusIcon, ChevronRightIcon, FireIcon, StarIcon } from '../components/Icons';
import Confetti from '../components/Confetti';

// Helper function to check if a date is today
const isToday = (isoDate?: string) => {
    if (!isoDate) return false;
    const date = new Date(isoDate);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
};

const CosmicBackground = React.memo(() => {
    return (
        <>
            {[...Array(15)].map((_, i) => (
                <div key={i} className="absolute top-0 left-0 w-px h-px bg-white/70 rounded-full animate-slow-drift" style={{
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`,
                    animationDelay: `${Math.random() * 30}s`, animationDuration: `${20 + Math.random() * 20}s`
                }}/>
            ))}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full filter blur-3xl animate-soft-glow" style={{ backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)'}}></div>
            <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-purple-500/10 rounded-full filter blur-3xl animate-soft-glow animation-delay-4000"></div>
        </>
    );
});


const GrowthScreen: React.FC = () => {
    const { goals, addGoal, updateGoalStatus, toggleDailyGoalCompletion, deleteGoal, togglePinGoal, setGoalReminder, getRealmMoodText, feeling } = useAppContext();
    const [newGoal, setNewGoal] = useState('');
    const [goalType, setGoalType] = useState<'daily' | 'single'>('daily');
    const [reminderModalGoal, setReminderModalGoal] = useState<Goal | null>(null);
    const [reminderTime, setReminderTime] = useState('');
    const [isCompletedVisible, setIsCompletedVisible] = useState(false);
    
    // State to force a re-render when the day changes
    const [todayKey, setTodayKey] = useState(new Date().toDateString());

    // Celebration States
    const [showConfetti, setShowConfetti] = useState(false);
    const [celebrationGoal, setCelebrationGoal] = useState<string | null>(null);

    // Midnight Refresh Logic: Ensures UI updates automatically at 12 AM
    useEffect(() => {
        const updateAtMidnight = () => {
            const now = new Date();
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            const timeUntilMidnight = tomorrow.getTime() - now.getTime();

            return setTimeout(() => {
                setTodayKey(new Date().toDateString());
                updateAtMidnight(); // Schedule next day
            }, timeUntilMidnight + 100); // Add tiny buffer
        };

        const timer = updateAtMidnight();
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (reminderModalGoal) {
            setReminderTime(reminderModalGoal.reminderTime || '');
        }
    }, [reminderModalGoal]);

    const triggerCelebration = (goalName: string) => {
        setShowConfetti(false);
        setTimeout(() => {
            setShowConfetti(true);
            setCelebrationGoal(goalName);
        }, 10);
    };

    const handleAddGoal = () => {
        if (newGoal.trim()) {
            addGoal({
                goalName: newGoal.trim(),
                targetDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Default 30 days
                type: goalType,
            });
            setNewGoal('');
        }
    };

    const handleSetReminder = () => {
        if (!reminderModalGoal) return;
        
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        setGoalReminder(reminderModalGoal.goalName, reminderTime);
        setReminderModalGoal(null);
    };

    const handleClearReminder = () => {
        if (!reminderModalGoal) return;
        setGoalReminder(reminderModalGoal.goalName, null);
        setReminderModalGoal(null);
    };

    const sortedGoals = useMemo(() => {
        return [...goals].sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            if (a.status === 'Active' && b.status !== 'Active') return -1;
            if (a.status !== 'Active' && b.status === 'Active') return 1;
            return a.targetDate.getTime() - b.targetDate.getTime();
        });
    }, [goals]);
    
    // Note: uses todayKey to ensure these filter results update on date change
    const activeGoals = useMemo(() => sortedGoals.filter(g => g.status === 'Active'), [sortedGoals, todayKey]);
    const completedGoals = useMemo(() => sortedGoals.filter(g => g.status === 'Completed'), [sortedGoals]);

    const getCelebrationMessage = () => {
        if (feeling < 35) return "Every small victory counts. Proud of you.";
        if (feeling > 75) return "UNSTOPPABLE! You're crushing it!";
        return "Incredible progress! Keep that momentum going.";
    };

    const GoalItem: React.FC<{ goal: Goal }> = ({ goal }) => {
        // Daily habits reset visually when todayKey (date) changes
        const isActuallyCompleted = (goal.type === 'daily' && isToday(goal.lastCompleted)) || goal.status === 'Completed';

        const progressData = useMemo(() => {
            if (goal.type !== 'single' || goal.status !== 'Active') return null;
            const now = new Date().getTime();
            const startDate = (goal.creationDate ? new Date(goal.creationDate) : new Date(new Date(goal.targetDate).setDate(new Date(goal.targetDate).getDate() - 30))).getTime();
            const endDate = new Date(goal.targetDate).getTime();
            const totalDuration = endDate - startDate;
            if (totalDuration <= 0) return { progress: 100, daysRemaining: 0 };
            const elapsedDuration = now - startDate;
            const progress = Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100));
            const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
            return { progress, daysRemaining };
        }, [goal]);
        
        const renderActionButton = () => {
            if (goal.status === 'Completed') {
                return (
                    <button 
                        onClick={() => updateGoalStatus(goal.goalName, 'Active')}
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 border-2 border-white/50 hover:border-white transition-all duration-300`}
                        aria-label={`Reactivate ${goal.goalName}`}
                    >
                        <PlusIcon className="w-4 h-4 opacity-70" />
                    </button>
                );
            }
            
            if (goal.type === 'daily') {
                const isCompleted = isToday(goal.lastCompleted);
                return (
                    <button 
                        onClick={() => {
                            if (!isCompleted) triggerCelebration(goal.goalName);
                            toggleDailyGoalCompletion(goal.goalName);
                        }}
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 border-2 transition-all duration-300 ${!isCompleted ? 'border-white/50 hover:border-white' : ''} active:scale-125`}
                        style={{ backgroundColor: isCompleted ? 'var(--accent-color)' : 'transparent', borderColor: isCompleted ? 'var(--accent-color)' : '' }}
                        aria-label={`Mark ${goal.goalName} as completed for today`}
                    >
                        {isCompleted && <svg className="w-4 h-4 text-white animate-modal-in" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </button>
                );
            }
    
            if (goal.type === 'single') {
                return (
                    <button 
                        onClick={() => {
                            triggerCelebration(goal.goalName);
                            updateGoalStatus(goal.goalName, 'Completed');
                        }}
                        className={`w-6 h-6 rounded-md flex items-center justify-center mr-3 flex-shrink-0 border-2 border-white/50 hover:border-white transition-all duration-300 active:scale-125`}
                        aria-label={`Mark ${goal.goalName} as completed`}
                    />
                );
            }
    
            return null;
        };

        return (
            <div className={`glassmorphism p-3.5 rounded-xl flex flex-col transition-all duration-500 animate-fade-in-up text-[--text-on-glass] ${isActuallyCompleted ? 'opacity-50 scale-[0.98]' : 'hover:scale-[1.01] active:scale-[0.99]'}`}>
                <div className="flex items-center w-full">
                    {renderActionButton()}
                    <div className="flex-grow relative overflow-hidden flex items-center">
                        <p className={`font-semibold transition-all duration-500 ${ isActuallyCompleted ? 'opacity-30' : '' }`}>
                            {goal.goalName}
                        </p>
                        {/* Organic Hand-Drawn Strike-Through Effect */}
                        <div 
                            className={`absolute left-0 top-[52%] h-[2px] rounded-full transition-all duration-[600ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${isActuallyCompleted ? 'w-full opacity-60' : 'w-0 opacity-0'}`} 
                            style={{ 
                                backgroundColor: 'var(--accent-color)',
                                transform: 'translateY(-50%) rotate(-0.5deg)',
                                boxShadow: isActuallyCompleted ? '0 0 8px var(--glow-color)' : 'none'
                            }}
                        />
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                         {goal.status === 'Active' && (
                            <>
                                {goal.type === 'daily' && (
                                    <button onClick={() => setReminderModalGoal(goal)} className="opacity-70 hover:opacity-100 transition-colors" aria-label={`Set reminder for ${goal.goalName}`}>
                                        <BellIcon className="w-5 h-5" isActive={!!goal.reminderTime} />
                                    </button>
                                )}
                                <button onClick={() => togglePinGoal(goal.goalName)} className="opacity-70 hover:opacity-100 transition-colors" aria-label={`Pin ${goal.goalName}`}>
                                    <PinIcon className="w-5 h-5" isPinned={goal.isPinned} />
                                </button>
                            </>
                         )}
                        <button onClick={() => deleteGoal(goal.goalName)} className="opacity-70 hover:text-red-400 transition-colors" aria-label={`Delete ${goal.goalName}`}>
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                {progressData && goal.status === 'Active' && (
                    <div className="mt-2.5 pl-9 w-full">
                        <div className="flex justify-between items-center text-xs opacity-70 mb-1">
                            <span>Progress</span>
                            <span>{progressData.daysRemaining} days left</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progressData.progress}%`, backgroundColor: 'var(--accent-color)' }}></div>
                        </div>
                    </div>
                )}
                {goal.type === 'daily' && goal.status === 'Active' && (
                    <div className="mt-2.5 pl-9 w-full flex items-center space-x-4 text-xs font-semibold" style={{ color: 'var(--accent-color)' }}>
                        <div className="flex items-center space-x-1" title="Current Streak">
                            <FireIcon className={`w-4 h-4 ${isToday(goal.lastCompleted) ? 'text-orange-400 animate-pulse' : 'text-slate-400'}`} />
                            <span>{goal.currentStreak || 0} Days</span>
                        </div>
                        <div className="flex items-center space-x-1 opacity-80" title="Longest Streak">
                            <StarIcon className="w-4 h-4 text-yellow-300" />
                            <span>{goal.longestStreak || 0} Days</span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-full w-full flex flex-col p-6 relative overflow-x-hidden text-[--text-primary]" style={{ paddingTop: `calc(2.5rem + env(safe-area-inset-top, 0px))` }}>
             <Confetti trigger={showConfetti} />

             <div className="absolute inset-0 z-0 pointer-events-none">
                <CosmicBackground />
            </div>

            <header className="text-center z-10 mb-6 flex-shrink-0 animate-fade-in-up">
                <h2 className="font-light text-sm tracking-widest uppercase opacity-80 text-[--text-secondary]">The Cosmic Realm</h2>
                <h1 className="font-sans text-3xl font-bold opacity-90 text-[--text-header]">Personal Growth</h1>
                <p className="text-xs font-semibold text-[--accent-color] mt-1">{getRealmMoodText(Screen.Growth)}</p>
            </header>
            
            <main className="z-10 flex-grow flex flex-col w-full max-w-md mx-auto overflow-y-auto pr-1" style={{ paddingBottom: `calc(7rem + env(safe-area-inset-bottom, 0px))` }}>
                <div data-no-swipe="true" className="glassmorphism rounded-3xl p-4 mb-6 shadow-lg text-[--text-on-glass]">
                    <h3 className="font-sans font-semibold text-center text-lg mb-3">Set a New Intention</h3>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={newGoal}
                            onChange={(e) => setNewGoal(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleAddGoal()}
                            placeholder="e.g., Read for 15 minutes"
                            className="flex-grow p-2.5 bg-transparent border-white/20 border rounded-lg focus:ring-2 focus:border-transparent placeholder:opacity-60 outline-none"
                            style={{ ringColor: 'var(--accent-color)' } as any}
                        />
                         <button
                            onClick={handleAddGoal}
                            disabled={!newGoal.trim()}
                            className="text-white px-5 rounded-lg font-semibold hover:opacity-80 transition-all duration-300 active:scale-95 disabled:bg-gray-500/50"
                            style={{ backgroundColor: 'var(--accent-color)' }}
                        >
                            Add
                        </button>
                    </div>
                     <div className="flex justify-center space-x-4 mt-3 pt-3 border-t border-white/10">
                        <label className="flex items-center space-x-2 cursor-pointer text-sm">
                            <input type="radio" name="goalType" value="daily" checked={goalType === 'daily'} onChange={() => setGoalType('daily')} className="form-radio bg-transparent border-white/50 focus:ring-transparent" style={{ accentColor: 'var(--accent-color)' }} />
                            <span>Daily Habit</span>
                        </label>
                         <label className="flex items-center space-x-2 cursor-pointer text-sm">
                            <input type="radio" name="goalType" value="single" checked={goalType === 'single'} onChange={() => setGoalType('single')} className="form-radio bg-transparent border-white/50 focus:ring-transparent" style={{ accentColor: 'var(--accent-color)' }} />
                            <span>Single Goal</span>
                        </label>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="font-sans font-semibold text-lg pl-1" style={{ color: 'var(--accent-color)' }}>Active Intentions</h3>
                    {activeGoals.length > 0 ? (
                        activeGoals.map(goal => <GoalItem key={goal.goalName + todayKey} goal={goal} />)
                    ) : (
                        <div className="text-center opacity-70 glassmorphism p-4 rounded-xl">
                            <p>No active goals yet.</p>
                            <p className="text-xs">Set an intention above to begin your journey!</p>
                        </div>
                    )}
                </div>

                {completedGoals.length > 0 && (
                    <div className="mt-6">
                        <button 
                            onClick={() => setIsCompletedVisible(!isCompletedVisible)}
                            className="w-full flex justify-between items-center text-left glassmorphism p-3.5 rounded-xl transition-colors hover:bg-white/10"
                        >
                            <h3 className="font-sans font-semibold text-lg" style={{ color: 'var(--accent-color)' }}>
                                Past Victories ({completedGoals.length})
                            </h3>
                            <ChevronRightIcon className={`w-6 h-6 transition-transform duration-300 ${isCompletedVisible ? 'rotate-90' : 'rotate-0'}`} style={{ color: 'var(--accent-color)' }} />
                        </button>
                        <div 
                            className={`grid transition-all duration-500 ease-in-out ${isCompletedVisible ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}
                        >
                            <div className="overflow-hidden">
                                <div className="space-y-3">
                                    {completedGoals.map(goal => <GoalItem key={goal.goalName} goal={goal} />)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Celebration Modal */}
            {celebrationGoal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[110] flex items-center justify-center p-6 animate-fade-in-up">
                    <div className="glassmorphism rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center border-t border-white/30 animate-modal-in">
                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/20">
                            <StarIcon className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-[--text-on-glass] mb-2 leading-tight">Achievement Unlocked!</h2>
                        <p className="text-[--accent-color] font-bold text-sm uppercase tracking-widest mb-4">"{celebrationGoal}"</p>
                        <p className="text-base text-[--text-on-glass]/80 italic mb-8">
                           {getCelebrationMessage()}
                        </p>
                        <button 
                            onClick={() => setCelebrationGoal(null)}
                            className="w-full bg-[--accent-color] text-white py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all"
                        >
                            Continue Shining
                        </button>
                    </div>
                </div>
            )}

            {reminderModalGoal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glassmorphism rounded-3xl p-6 max-w-sm w-full shadow-2xl text-white animate-modal-in" style={{ borderColor: 'rgba(var(--accent-color-rgb), 0.3)'}}>
                        <h2 className="text-xl font-sans font-bold text-center mb-2" style={{ color: 'var(--accent-color)'}}>Set Daily Reminder</h2>
                        <p className="text-center text-sm mb-4 truncate">{reminderModalGoal.goalName}</p>
                        
                        <div className="my-6">
                            <label htmlFor="reminder-time" className="block text-center text-sm mb-2">Reminder time:</label>
                            <input
                                id="reminder-time"
                                type="time"
                                value={reminderTime}
                                onChange={(e) => setReminderTime(e.target.value)}
                                className="w-full p-2 bg-white/10 border-none rounded-lg focus:ring-2 text-white placeholder-white/60 text-center text-2xl"
                                style={{ ringColor: 'var(--accent-color)' } as any}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <button onClick={handleSetReminder} disabled={!reminderTime} className="w-full text-white py-2.5 rounded-xl font-semibold transition-colors disabled:bg-gray-500/50" style={{ backgroundColor: 'var(--accent-color)' }}>
                                Set Reminder
                            </button>
                            <button onClick={handleClearReminder} className="w-full bg-white/10 text-white py-2.5 rounded-xl font-semibold hover:bg-white/20 transition-colors">
                                Clear Reminder
                            </button>
                        </div>
                        <button onClick={() => setReminderModalGoal(null)} className="w-full mt-4 text-white/70 text-sm hover:text-white transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GrowthScreen;
