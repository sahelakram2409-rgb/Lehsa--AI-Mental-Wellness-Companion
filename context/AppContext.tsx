
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useRef, useCallback } from 'react';
import { Screen, JournalEntry, Goal, ChatMessage, Album, Track, Affirmation, AnalyticsEvent } from '../types';
import { analyzeJournalEntry } from '../services/geminiService';
import { ConfettiType } from '../components/Confetti';

function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                if (item === 'null') return null as T;
                return JSON.parse(item, (k, v) => {
                    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(v)) {
                        return new Date(v);
                    }
                    return v;
                });
            }
            return initialValue instanceof Function ? initialValue() : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue instanceof Function ? initialValue() : initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}

interface AppContextType {
  userName: string;
  setUserName: (name: string) => void;
  userCountry: string;
  setUserCountry: (country: string) => void;
  userAge: number | null;
  setUserAge: (age: number | null) => void;
  userGender: string;
  setUserGender: (gender: string) => void;
  isOnboardingComplete: boolean;
  completeOnboarding: () => void;
  journals: JournalEntry[];
  addJournal: (entryText: string, mood?: string, imageUrl?: string | null, imageCaption?: string) => Promise<void>;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'status'>) => void;
  updateGoalStatus: (goalName: string, status: 'Active' | 'Completed') => void;
  toggleDailyGoalCompletion: (goalName: string) => void;
  deleteGoal: (goalName: string) => void;
  togglePinGoal: (goalName: string) => void;
  setGoalReminder: (goalName: string, time: string | null) => void;
  markReminderAsShown: (goalName: string) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  meditationCount: number;
  incrementMeditationCount: (meditationTitle: string) => void;
  affirmations: Affirmation[];
  addAffirmation: (text: string) => void;
  deleteAffirmation: (id: string) => void;
  checkStreaks: () => void;
  feeling: number;
  setFeeling: (feeling: number) => void;
  feelingTimestamp: Date | null;
  logUserAction: (eventName: string, details?: Record<string, any>) => void;
  globalTheme: string | null;
  setGlobalTheme: (theme: string | null) => void;
  restartTour: () => void;
  resetAllData: () => void;
  getRealmMoodText: (realm: Screen) => string;
  // Gamification
  xp: number;
  level: number;
  addXP: (amount: number, reason: string, celebration?: ConfettiType) => void;
  recentXPEvent: { amount: number, reason: string } | null;
  xpToNextLevel: number;
  confettiTrigger: { active: boolean; type: ConfettiType };
  showLevelUp: number | null;
  closeLevelUp: () => void;
}

interface MusicContextType {
    currentAlbum: Album | null;
    currentTrack: Track | null;
    isPlaying: boolean;
    playTrack: (album: Album, track: Track) => Promise<void>;
    togglePlayPause: () => Promise<void>;
    playNext: () => Promise<void>;
    playPrevious: () => Promise<void>;
    audioRef: React.RefObject<HTMLAudioElement>;
    videoRef: React.RefObject<HTMLVideoElement>;
    analyser: AnalyserNode | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const MusicContext = createContext<MusicContextType | undefined>(undefined);

const isToday = (isoDate?: string) => {
    if (!isoDate) return false;
    const date = new Date(isoDate);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useLocalStorage<string>('userName', '');
  const [userCountry, setUserCountry] = useLocalStorage<string>('userCountry', '');
  const [userAge, setUserAge] = useLocalStorage<number | null>('userAge', null);
  const [userGender, setUserGender] = useLocalStorage<string>('userGender', '');
  const [isOnboardingComplete, setIsOnboardingComplete] = useLocalStorage<boolean>('onboardingComplete', false);
  const [journals, setJournals] = useLocalStorage<JournalEntry[]>('journals', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [chatMessages, setChatMessages] = useLocalStorage<ChatMessage[]>('chatMessages', () => [
      { id: 'buddy-init', text: `Hello! I'm Lehsa. How can I support you today?`, sender: 'buddy' as const, timestamp: new Date() }
  ]);
  const [meditationCount, setMeditationCount] = useLocalStorage<number>('meditationCount', 0);
  const [affirmations, setAffirmations] = useLocalStorage<Affirmation[]>('affirmations', []);
  const [analyticsEvents, setAnalyticsEvents] = useLocalStorage<AnalyticsEvent[]>('analyticsEvents', []);
  const [globalTheme, setGlobalTheme] = useLocalStorage<string | null>('globalTheme', null);
  
  // Gamification state
  const [xp, setXP] = useLocalStorage<number>('userXP', 0);
  const [recentXPEvent, setRecentXPEvent] = useState<{ amount: number, reason: string } | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState<{ active: boolean; type: ConfettiType }>({ active: false, type: 'standard' });
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);

  const [feeling, setFeelingState] = useState(50);
  const [feelingTimestamp, setFeelingTimestamp] = useState<Date | null>(null);
  const [activeScreen, _setActiveScreen] = useState<Screen>(Screen.Home);

  const level = useMemo(() => Math.floor(xp / 500) + 1, [xp]);
  const xpToNextLevel = useMemo(() => 500 - (xp % 500), [xp]);

  const triggerConfetti = useCallback((type: ConfettiType = 'standard') => {
      setConfettiTrigger({ active: false, type });
      setTimeout(() => setConfettiTrigger({ active: true, type }), 10);
      setTimeout(() => setConfettiTrigger(prev => ({ ...prev, active: false })), 4000);
  }, []);

  const addXP = useCallback((amount: number, reason: string, celebration: ConfettiType = 'none') => {
      const oldLevel = Math.floor(xp / 500) + 1;
      const newXP = xp + amount;
      const newLevel = Math.floor(newXP / 500) + 1;
      
      setXP(newXP);
      setRecentXPEvent({ amount, reason });
      
      if (newLevel > oldLevel) {
          setShowLevelUp(newLevel);
          triggerConfetti('stars');
      } else if (celebration !== 'none') {
          triggerConfetti(celebration);
      }
      
      // Clearing state fast for snappy UI
      setTimeout(() => setRecentXPEvent(null), 2500);
  }, [xp, setXP, triggerConfetti]);

  const closeLevelUp = useCallback(() => setShowLevelUp(null), []);

  const logUserAction = useCallback((eventName: string, details: Record<string, any> = {}) => {
      const newEvent: AnalyticsEvent = {
          id: `event-${Date.now()}-${Math.random()}`,
          eventName,
          timestamp: new Date(),
          details,
      };
      setAnalyticsEvents(prev => [...prev, newEvent]);
  }, [setAnalyticsEvents]);
  
  const setActiveScreen = useCallback((screen: Screen) => {
      logUserAction('screen_view', { screen });
      _setActiveScreen(screen);
  }, [logUserAction]);

  const completeOnboarding = useCallback(() => {
    setIsOnboardingComplete(true)
    addXP(100, "Starting your journey", 'flowers');
    logUserAction('onboarding_completed', {
        age: userAge,
        gender: userGender,
        country: userCountry
    });
  }, [setIsOnboardingComplete, logUserAction, userAge, userGender, userCountry, addXP]);

  const addJournal = useCallback(async (entryText: string, mood?: string, imageUrl?: string | null, imageCaption?: string) => {
    const reflection = await analyzeJournalEntry(entryText);
    const newEntry: JournalEntry = { 
        id: `journal-${Date.now()}`, 
        text: entryText, 
        timestamp: new Date(), 
        reflection, 
        mood,
        imageUrl: imageUrl || null,
        imageCaption: imageCaption || undefined,
    };
    setJournals(prev => [newEntry, ...prev]);
    addXP(50, "Daily Reflection", 'leaves');
    logUserAction('journal_added', { mood: mood || 'not_set', length: entryText.length, has_image: !!imageUrl, has_caption: !!imageCaption });
  }, [setJournals, logUserAction, addXP]);

  const addGoal = useCallback((goal: Omit<Goal, 'status'>) => {
    setGoals(prev => [{ ...goal, status: 'Active', creationDate: new Date(), currentStreak: 0, longestStreak: 0 }, ...prev]);
    addXP(20, "Planting a Goal Seed", 'leaves');
    logUserAction('goal_added', { type: goal.type });
  }, [setGoals, logUserAction, addXP]);

  const updateGoalStatus = useCallback((goalName: string, status: 'Active' | 'Completed') => {
      setGoals(prev => {
          const goal = prev.find(g => g.goalName === goalName);
          if (goal && status === 'Completed' && goal.type === 'single') {
              addXP(100, "Goal Bloom", 'stars');
              logUserAction('goal_completed_single', { goalName });
          }
          return prev.map(g => g.goalName === goalName ? { ...g, status } : g);
      });
  }, [setGoals, logUserAction, addXP]);

  const toggleDailyGoalCompletion = useCallback((goalName: string) => {
    setGoals(prev => prev.map(g => {
        if (g.goalName !== goalName || g.type !== 'daily') {
            return g;
        }

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const isCompletedToday = isToday(g.lastCompleted);

        if (!isCompletedToday) {
            addXP(30, "Habit Nurtured", 'stars');
            logUserAction('goal_completed_daily', { goalName });
            const lastCompletedDate = g.lastCompleted ? new Date(g.lastCompleted) : null;
            const wasCompletedYesterday = lastCompletedDate?.toDateString() === yesterday.toDateString();
            const newCurrentStreak = wasCompletedYesterday ? (g.currentStreak || 0) + 1 : 1;
            const newLongestStreak = Math.max(g.longestStreak || 0, newCurrentStreak);

            if (newCurrentStreak % 7 === 0) {
                addXP(70, "7-Day Resilience", 'flowers');
            }

            return {
                ...g,
                lastCompleted: today.toISOString(),
                currentStreak: newCurrentStreak,
                longestStreak: newLongestStreak
            };
        } else {
            return {
                ...g,
                lastCompleted: undefined,
                currentStreak: (g.currentStreak || 1) - 1,
            };
        }
    }));
  }, [setGoals, logUserAction, addXP]);

  const checkStreaks = useCallback(() => {
    setGoals(prevGoals => {
        let hasChanged = false;
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const updatedGoals = prevGoals.map(goal => {
            if (goal.type === 'daily' && goal.status === 'Active' && (goal.currentStreak || 0) > 0) {
                const lastCompletedDate = goal.lastCompleted ? new Date(goal.lastCompleted) : null;
                const isCurrent = lastCompletedDate?.toDateString() === today.toDateString() || lastCompletedDate?.toDateString() === yesterday.toDateString();
                if (!isCurrent) {
                    if (goal.currentStreak !== 0) {
                        hasChanged = true;
                        return { ...goal, currentStreak: 0 };
                    }
                }
            }
            return goal;
        });
        return hasChanged ? updatedGoals : prevGoals;
    });
  }, [setGoals]);

  const deleteGoal = useCallback((goalName: string) => {
    setGoals(prev => prev.filter(g => g.goalName !== goalName));
  }, [setGoals]);

  const togglePinGoal = useCallback((goalName: string) => {
      setGoals(prev => prev.map(g => g.goalName === goalName ? { ...g, isPinned: !g.isPinned } : g));
  }, [setGoals]);

  const setGoalReminder = useCallback((goalName: string, time: string | null) => {
      setGoals(prev => prev.map(g => {
          if (g.goalName === goalName) {
              return { ...g, reminderTime: time || undefined, reminderShownForDate: undefined };
          }
          return g;
      }));
  }, [setGoals]);

  const markReminderAsShown = useCallback((goalName: string) => {
      const today = new Date().toISOString().split('T')[0];
      setGoals(prev => prev.map(g => g.goalName === goalName ? { ...g, reminderShownForDate: today } : g));
  }, [setGoals]);

  const addChatMessage = useCallback((message: ChatMessage) => {
    if (message.sender === 'user') {
        // Less annoying XP: only give XP for significant sharing (every 5 messages)
        if (chatMessages.filter(m => m.sender === 'user').length % 5 === 0) {
            addXP(20, "Meaningful Soul Sharing", 'stars');
        }
    }
    setChatMessages(prev => [...prev, message]);
  }, [setChatMessages, addXP, chatMessages]);

  const incrementMeditationCount = useCallback((meditationTitle: string) => {
      setMeditationCount(prev => prev + 1);
      addXP(60, "Mental Stillness", 'flowers');
      logUserAction('meditation_completed', { title: meditationTitle });
  }, [setMeditationCount, logUserAction, addXP]);
  
  const setFeeling = useCallback((newFeeling: number) => {
    setFeelingState(newFeeling);
    setFeelingTimestamp(new Date());
    const celebration: ConfettiType = newFeeling < 40 ? 'leaves' : 'flowers';
    addXP(10, "Mood Connection", celebration);
    logUserAction('feeling_updated', { value: newFeeling });
  }, [logUserAction, addXP]);

  const addAffirmation = useCallback((text: string) => {
    const newAffirmation: Affirmation = { id: `affirmation-${Date.now()}`, text, timestamp: new Date() };
    setAffirmations(prev => [newAffirmation, ...prev]);
    addXP(10, "Internal Sunshine", 'standard');
  }, [setAffirmations, addXP]);

  const deleteAffirmation = useCallback((id: string) => {
    setAffirmations(prev => prev.filter(a => a.id !== id));
  }, [setAffirmations]);

  const restartTour = useCallback(() => {
    localStorage.removeItem('tourComplete');
    window.location.reload();
  }, []);

  const resetAllData = useCallback(() => {
    const appKeys = ['userName', 'userCountry', 'userAge', 'userGender', 'onboardingComplete', 'journals', 'goals', 'chatMessages', 'meditationCount', 'affirmations', 'analyticsEvents', 'globalTheme', 'tourComplete', 'userXP'];
    appKeys.forEach(key => localStorage.removeItem(key));
    window.location.reload();
  }, []);

  const getRealmMoodText = useCallback((realm: Screen) => {
    if (feeling < 35) { // Low Mood
        switch(realm) {
            case Screen.Chat: return "I'm here to listen";
            case Screen.Journal: return "Let it all out";
            case Screen.Music: return "Gentle comfort";
            case Screen.Meditation: return "Breathe & release";
            case Screen.Growth: return "One small step";
            case Screen.Journey: return "Your valid path";
            case Screen.Home: return "Home";
            case Screen.Profile: return "Your Profile";
            default: return "";
        }
    } else if (feeling > 75) { // High Mood
        switch(realm) {
            case Screen.Chat: return "Share the joy";
            case Screen.Journal: return "Capture this feeling";
            case Screen.Music: return "Vibrant tunes";
            case Screen.Meditation: return "Gratitude practice";
            case Screen.Growth: return "Keep rising";
            case Screen.Journey: return "Celebrating you";
            case Screen.Home: return "Home";
            case Screen.Profile: return "Your Profile";
            default: return "";
        }
    } else { // Neutral Mood
        switch(realm) {
            case Screen.Chat: return "Chat with Lehsa";
            case Screen.Journal: return "Reflect on today";
            case Screen.Music: return "Relaxing melodies";
            case Screen.Meditation: return "Center yourself";
            case Screen.Growth: return "Grow & Evolve";
            case Screen.Journey: return "Your Journey";
            case Screen.Home: return "Home";
            case Screen.Profile: return "Your Profile";
            default: return "";
        }
    }
  }, [feeling]);

  const value = useMemo(() => ({
    userName, setUserName, userCountry, setUserCountry, userAge, setUserAge, userGender, setUserGender, 
    isOnboardingComplete, completeOnboarding, journals, addJournal, goals, addGoal,
    updateGoalStatus, toggleDailyGoalCompletion, deleteGoal, togglePinGoal, setGoalReminder, markReminderAsShown,
    chatMessages, addChatMessage, activeScreen, setActiveScreen, meditationCount, incrementMeditationCount,
    affirmations, addAffirmation, deleteAffirmation, checkStreaks, feeling, setFeeling, feelingTimestamp, logUserAction,
    globalTheme, setGlobalTheme, restartTour, resetAllData, getRealmMoodText,
    xp, level, addXP, recentXPEvent, xpToNextLevel, confettiTrigger, showLevelUp, closeLevelUp
  }), [
    userName, setUserName, userCountry, setUserCountry, userAge, setUserAge, userGender, setUserGender, 
    isOnboardingComplete, completeOnboarding, journals, addJournal, goals, addGoal,
    updateGoalStatus, toggleDailyGoalCompletion, deleteGoal, togglePinGoal, setGoalReminder, markReminderAsShown,
    chatMessages, addChatMessage, activeScreen, setActiveScreen, meditationCount, incrementMeditationCount,
    affirmations, addAffirmation, deleteAffirmation, checkStreaks, feeling, setFeeling, feelingTimestamp, logUserAction,
    globalTheme, setGlobalTheme, restartTour, resetAllData, getRealmMoodText,
    xp, level, addXP, recentXPEvent, xpToNextLevel, confettiTrigger, showLevelUp, closeLevelUp
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  
    const setupAudioContext = useCallback(() => {
        if (!audioContextRef.current && audioRef.current) {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = context.createAnalyser();
            analyser.fftSize = 256;

            if(!sourceNodeRef.current) {
                sourceNodeRef.current = context.createMediaElementSource(audioRef.current);
                sourceNodeRef.current.connect(analyser);
                analyser.connect(context.destination);
            }

            audioContextRef.current = context;
            analyserRef.current = analyser;
        }
    }, []);

    const playTrack = useCallback(async (album: Album, track: Track) => {
        const audio = audioRef.current;
        const video = videoRef.current;
        if (!audio || !video) return;

        if (!audioContextRef.current) setupAudioContext();

        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            try { await audioContextRef.current.resume(); } catch (e) { console.error(e); }
        }
        
        setCurrentAlbum(album);
        setCurrentTrack(track);
        audio.src = track.audioSrc;
        video.src = track.videoSrc;

        try {
            audio.load();
            video.load();
            await audio.play();
            video.play().catch(e => console.warn(e));
            setIsPlaying(true);
        } catch (error) {
            setIsPlaying(false);
        }
    }, [setupAudioContext]);


    const togglePlayPause = useCallback(async () => {
        const audio = audioRef.current;
        const video = videoRef.current;
        if (!currentTrack || !audio || !video) return;

        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
           await audioContextRef.current.resume();
        }
        
        if (isPlaying) {
            audio.pause();
            video.pause();
            setIsPlaying(false);
        } else {
            try {
                await audio.play();
                video.play().catch(e => console.warn(e));
                setIsPlaying(true);
            } catch (error) {
                setIsPlaying(false);
            }
        }
    }, [isPlaying, currentTrack]);


    const playNext = useCallback(async () => {
        if (!currentAlbum || !currentTrack) return;
        const currentIndex = currentAlbum.tracks.findIndex(t => t.title === currentTrack.title);
        const nextIndex = (currentIndex + 1) % currentAlbum.tracks.length;
        await playTrack(currentAlbum, currentAlbum.tracks[nextIndex]);
    }, [currentAlbum, currentTrack, playTrack]);

    const playPrevious = useCallback(async () => {
        if (!currentAlbum || !currentTrack) return;
        const currentIndex = currentAlbum.tracks.findIndex(t => t.title === currentTrack.title);
        const prevIndex = (currentIndex - 1 + currentAlbum.tracks.length) % currentAlbum.tracks.length;
        await playTrack(currentAlbum, currentAlbum.tracks[prevIndex]);
    }, [currentAlbum, currentTrack, playTrack]);
    
    const value = useMemo(() => ({
        currentAlbum, currentTrack, isPlaying, playTrack, togglePlayPause, playNext, playPrevious,
        audioRef, videoRef, analyser: analyserRef.current
    }), [currentAlbum, currentTrack, isPlaying, playTrack, togglePlayPause, playNext, playPrevious, analyserRef]);

    return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

export const useMusicContext = () => {
    const context = useContext(MusicContext);
    if (context === undefined) throw new Error('useMusicContext must be used within a MusicProvider');
    return context;
}
