
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';
import { JournalIcon, ChatIcon, MeditationIcon, GrowthIcon, MusicIcon, JourneyIcon, ChevronRightIcon } from '../components/Icons';
import LevelBadge from '../components/LevelBadge';
import { GoogleGenAI } from "@google/genai";

const HomeScreen: React.FC = () => {
  const { userName, feeling, setFeeling, setActiveScreen, getRealmMoodText, level, journals } = useAppContext();
  const [hasLogged, setHasLogged] = useState(false);
  const [bloomMessage, setBloomMessage] = useState<string | null>(null);
  const [isBloomLoading, setIsBloomLoading] = useState(false);

  const generateBloomNote = useCallback(async (forcedMood?: number) => {
      setIsBloomLoading(true);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const recentJournalText = journals.slice(0, 1).map(j => j.text).join(' ');
          const currentMoodVal = forcedMood !== undefined ? forcedMood : feeling;
          
          const prompt = `You are Lehsa, a compassionate wellness guide. The user, ${userName}, has a current mood score of ${currentMoodVal}/100. Level: ${level}. Recent activity: ${recentJournalText || "Just starting out"}. 
          Write a single, extremely short (max 10 words), charming, and self-esteem-boosting note. Address their current mood subtly. Do not use hashtags. Keep it concise.`;
          
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: prompt,
              config: {
                  temperature: 0.8,
                  topP: 0.9,
                  maxOutputTokens: 40
              }
          });
          setBloomMessage(response.text.trim());
      } catch (error) {
          setBloomMessage("You are doing enough, and you are enough.");
      } finally {
          setIsBloomLoading(false);
      }
  }, [userName, level, journals, feeling]);

  useEffect(() => {
    if (!bloomMessage) generateBloomNote();
  }, [generateBloomNote, bloomMessage]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const moodFeedback = useMemo(() => {
    if (feeling < 20) return { text: "It's okay to not be okay.", emoji: '☁️', color: 'rgba(71, 85, 105, 0.4)' };
    if (feeling < 40) return { text: "A bit rough?", emoji: '🌥️', color: 'rgba(100, 116, 139, 0.4)' };
    if (feeling < 60) return { text: "Hanging in there.", emoji: '🌤️', color: 'rgba(14, 165, 233, 0.3)' };
    if (feeling < 80) return { text: "Feeling good!", emoji: '☀️', color: 'rgba(251, 191, 36, 0.3)' };
    return { text: "Shining brightly!", emoji: '🌟', color: 'rgba(253, 224, 71, 0.4)' };
  }, [feeling]);

  const handleNavigation = (screen: Screen) => {
    setActiveScreen(screen);
  };

  const handleMoodChange = (val: number) => {
      setFeeling(val);
      setHasLogged(false);
  };

  const handleLogMood = () => {
      setHasLogged(true);
      generateBloomNote(feeling);
  };

  const realmStyles = {
      journal: "bg-gradient-to-br from-[#1a4025] to-[#2d583e] text-white shadow-lg shadow-green-900/20",
      journey: "bg-gradient-to-br from-[#6b1836] to-[#9d2e53] text-white shadow-lg shadow-pink-900/20",
      chat: "bg-gradient-to-br from-[#17153b] to-[#2e2b5e] text-white shadow-lg shadow-indigo-900/20",
      growth: "bg-gradient-to-br from-[#241b45] to-[#433575] text-white shadow-lg shadow-purple-900/20",
      meditation: "bg-gradient-to-br from-[#163350] to-[#265073] text-white shadow-lg shadow-blue-900/20",
      music: "bg-gradient-to-br from-[#1e293b] to-[#334155] text-white shadow-lg shadow-slate-900/20",
  };

  return (
     <div className="h-full w-full flex flex-col p-6 relative overflow-x-hidden" style={{ paddingTop: `calc(3rem + env(safe-area-inset-top, 0px))` }}>
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full blur-3xl animate-pulse-aura pointer-events-none transition-colors duration-1000" style={{ backgroundColor: moodFeedback.color }}></div>
        
        <header className="mb-8 z-10 animate-fade-in-up flex justify-between items-start pl-1">
            <div className="flex flex-col items-start">
                <span className="text-sm font-bold tracking-[0.2em] uppercase text-slate-500/80 mb-1 ml-1">{greeting}</span>
                <h1 className="text-5xl font-black text-slate-800 tracking-tighter leading-tight drop-shadow-sm">
                    {userName || 'Friend'}
                    <span className="text-[--accent-color] text-6xl leading-none">.</span>
                </h1>
            </div>
            <LevelBadge />
        </header>

        <main className="z-10 flex-grow w-full max-w-md mx-auto overflow-y-auto space-y-5 pr-1 pb-24 no-scrollbar">
            {/* The Daily Bloom Card */}
            <div className="animate-bloom-in" key={hasLogged ? 'logged' : 'unlogged'}>
                <div className="glassmorphism rounded-[2.5rem] p-6 mb-6 overflow-hidden relative group">
                    <div className="absolute inset-0 shimmer-effect opacity-30 pointer-events-none"></div>
                    <div className="flex items-center space-x-6">
                        <div className="relative flex-shrink-0">
                            <div className="spirit-orb flex items-center justify-center transition-transform duration-500">
                                <span className={`text-3xl ${isBloomLoading ? 'animate-pulse scale-90 opacity-40' : ''}`}>
                                    {moodFeedback.emoji}
                                </span>
                            </div>
                            {isBloomLoading && (
                                <div className="absolute inset-0 border-4 border-[--accent-color]/20 border-t-[--accent-color] rounded-full animate-spin"></div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[--accent-color] mb-1">Soul Note</h3>
                            {isBloomLoading ? (
                                <div className="space-y-2 py-2">
                                    <div className="h-2 w-full bg-slate-300/30 rounded-full animate-pulse"></div>
                                    <div className="h-2 w-2/3 bg-slate-300/30 rounded-full animate-pulse delay-75"></div>
                                </div>
                            ) : (
                                <p className="text-lg font-bold text-slate-800 leading-tight italic drop-shadow-sm">
                                    "{bloomMessage}"
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="glassmorphism rounded-[2.5rem] p-6 shadow-xl animate-fade-in-up relative border border-white/40">
                <div className="flex flex-col items-center justify-center mb-4">
                     <h3 className="text-lg font-bold text-slate-800 mb-1">Mind Pulse</h3>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Current Vibrancy</p>
                     
                     <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/90 to-white/60 shadow-inner flex items-center justify-center border border-white/80 mb-2 relative group cursor-pointer active:scale-95 transition-transform">
                        <div className="absolute inset-0 bg-[--accent-color]/10 rounded-full animate-ping opacity-20"></div>
                        <span className="text-4xl filter drop-shadow-sm transform transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">{moodFeedback.emoji}</span>
                     </div>
                     <p className="text-center font-black text-slate-700 text-sm tracking-wide h-5 transition-all duration-300">
                        {hasLogged ? "Reflected" : moodFeedback.text}
                    </p>
                </div>
                
                {!hasLogged ? (
                    <div className="relative h-12 flex items-center justify-center mb-3 mx-2">
                         <div className="absolute w-full h-3 rounded-full overflow-hidden bg-slate-200/50 shadow-inner">
                             <div 
                                className="h-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                                style={{ width: `${feeling}%`, background: 'linear-gradient(90deg, #fbbf24 0%, #f97316 100%)' }}
                             />
                         </div>
                         <input type="range" min="0" max="100" value={feeling} onChange={(e) => handleMoodChange(parseInt(e.target.value))} className="absolute w-full h-full opacity-0 cursor-pointer z-20" />
                         <div className="absolute h-7 w-7 bg-white rounded-full shadow-lg border-2 border-slate-50 pointer-events-none transition-all duration-100 ease-out flex items-center justify-center z-10" style={{ left: `calc(${feeling}% - 14px)` }}>
                             <div className="w-2 h-2 rounded-full bg-orange-500 shadow-sm"></div>
                         </div>
                    </div>
                ) : (
                    <div className="flex justify-center mb-3">
                         <div className="h-12 flex items-center px-4 rounded-full bg-emerald-50 text-emerald-600 text-sm font-black border border-emerald-100 animate-fade-in-up">
                            ✨ Awareness Logged
                         </div>
                    </div>
                )}

                <div className="flex justify-center space-x-3 mt-4">
                    {!hasLogged ? (
                        <button onClick={handleLogMood} className="px-8 py-2.5 rounded-full bg-[--accent-color] text-white text-xs font-black shadow-lg shadow-orange-500/30 active:scale-95 transition-all overflow-hidden relative border border-white/20">
                             <div className="absolute inset-0 shimmer-effect opacity-30 pointer-events-none"></div>
                             Reflect Pulse
                        </button>
                    ) : (
                        <button onClick={() => setHasLogged(false)} className="px-8 py-2.5 rounded-full bg-slate-200/80 text-slate-600 text-xs font-black active:scale-95 transition-all hover:bg-slate-200">Reset Pulse</button>
                    )}
                </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                 {feeling < 40 ? (
                    <button onClick={() => handleNavigation(Screen.Chat)} className={`w-full p-5 rounded-[2rem] flex items-center justify-between group transition-all duration-300 hover:scale-[1.02] active:scale-95 ${realmStyles.chat} border border-white/10 relative overflow-hidden shadow-xl`}>
                         <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center">
                            <div className="p-3 rounded-2xl bg-white/10 mr-4 shadow-inner border border-white/20"><ChatIcon className="w-6 h-6 text-white" /></div>
                            <div className="text-left">
                                <h4 className="font-black text-lg text-white tracking-tight">{getRealmMoodText(Screen.Chat)}</h4>
                                <p className="text-[10px] text-indigo-100/70 font-black uppercase tracking-[0.2em]">Lunar Realm</p>
                            </div>
                        </div>
                         <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors"><ChevronRightIcon className="w-5 h-5 text-white/80" /></div>
                    </button>
                 ) : (
                    <button onClick={() => handleNavigation(Screen.Journal)} className={`w-full p-5 rounded-[2rem] flex items-center justify-between group transition-all duration-300 hover:scale-[1.02] active:scale-95 ${realmStyles.journal} border border-white/10 relative overflow-hidden shadow-xl`}>
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center">
                            <div className="p-3 rounded-2xl bg-white/10 mr-4 shadow-inner border border-white/20"><JournalIcon className="w-6 h-6 text-white" /></div>
                            <div className="text-left">
                                <h4 className="font-black text-lg text-white tracking-tight">{getRealmMoodText(Screen.Journal)}</h4>
                                <p className="text-[10px] text-green-100/70 font-black uppercase tracking-[0.2em]">Forest Realm</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors"><ChevronRightIcon className="w-5 h-5 text-white/80" /></div>
                    </button>
                 )}
            </div>

            <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <button onClick={() => handleNavigation(Screen.Meditation)} className={`p-5 rounded-[2rem] flex flex-col items-start justify-between h-28 hover:brightness-110 transition-all active:scale-95 ${realmStyles.meditation} border border-white/10 group shadow-lg`}>
                    <MeditationIcon className="w-7 h-7 text-white mb-auto group-hover:scale-110 transition-transform" />
                    <div className="w-full text-left">
                        <span className="font-black text-base block text-white truncate tracking-tight">{getRealmMoodText(Screen.Meditation)}</span>
                        <span className="text-[9px] uppercase tracking-[0.2em] opacity-70 font-black">Ocean Realm</span>
                    </div>
                </button>
                 <button onClick={() => handleNavigation(Screen.Music)} className={`p-5 rounded-[2rem] flex flex-col items-start justify-between h-28 hover:brightness-110 transition-all active:scale-95 ${realmStyles.music} border border-white/10 group shadow-lg`}>
                    <MusicIcon className="w-7 h-7 text-white mb-auto group-hover:scale-110 transition-transform" />
                    <div className="w-full text-left">
                        <span className="font-black text-base block text-white truncate tracking-tight">{getRealmMoodText(Screen.Music)}</span>
                        <span className="text-[9px] uppercase tracking-[0.2em] opacity-70 font-black">Starlight Realm</span>
                    </div>
                </button>
                <button onClick={() => handleNavigation(Screen.Growth)} className={`p-5 rounded-[2rem] flex flex-col items-start justify-between h-28 hover:brightness-110 transition-all active:scale-95 ${realmStyles.growth} border border-white/10 group shadow-lg`}>
                    <GrowthIcon className="w-7 h-7 text-white mb-auto group-hover:scale-110 transition-transform" />
                    <div className="w-full text-left">
                        <span className="font-black text-base block text-white truncate tracking-tight">{getRealmMoodText(Screen.Growth)}</span>
                        <span className="text-[9px] uppercase tracking-[0.2em] opacity-70 font-black">Cosmic Realm</span>
                    </div>
                </button>
                 <button onClick={() => handleNavigation(Screen.Journey)} className={`p-5 rounded-[2rem] flex flex-col items-start justify-between h-28 hover:brightness-110 transition-all active:scale-95 ${realmStyles.journey} border border-white/10 group shadow-lg`}>
                    <JourneyIcon className="w-7 h-7 text-white mb-auto group-hover:scale-110 transition-transform" />
                    <div className="w-full text-left">
                        <span className="font-black text-base block text-white truncate tracking-tight">{getRealmMoodText(Screen.Journey)}</span>
                        <span className="text-[9px] uppercase tracking-[0.2em] opacity-70 font-black">Sunset Realm</span>
                    </div>
                </button>
            </div>
        </main>
     </div>
  );
};

export default HomeScreen;
