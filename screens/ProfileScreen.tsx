import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const themeOptions = [
    { id: 'day-mode', name: 'Daylight', bg: 'bg-gradient-to-br from-[#a8c4e0] to-[#f5d0b9]' },
    { id: 'forest-mode', name: 'Forest', bg: 'bg-gradient-to-br from-[#2a4b3a] to-[#182c20]' },
    { id: 'sunset-mode', name: 'Sunset', bg: 'bg-gradient-to-br from-[#4a0e2a] via-[#c32361] to-[#fbbf24]' },
    { id: 'night-mode', name: 'Lunar', bg: 'bg-gradient-to-br from-[#0f0c29] to-[#232044]' },
    { id: 'cosmic-mode', name: 'Cosmic', bg: 'bg-gradient-to-br from-[#1d1a3d] to-[#000000]' },
    { id: 'ocean-mode', name: 'Ocean', bg: 'bg-gradient-to-br from-[#1f4263] to-[#2a3a4a]' },
    { id: 'starlight-mode', name: 'Starlight', bg: 'bg-gradient-to-br from-[#0e1c2e] via-[#302b63] to-[#202d40]' },
    { id: 'sunrise-mode', name: 'Sunrise', bg: 'bg-gradient-to-br from-[#fbc2eb] to-[#a6c1ee]' },
];

const ProfileScreen: React.FC = () => {
    const { 
        userName, setUserName, 
        userAge,
        userGender,
        userCountry,
        globalTheme, setGlobalTheme,
        restartTour, resetAllData,
        logUserAction
     } = useAppContext();

    const [name, setName] = useState(userName);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        setUserName(name);
        setIsEditing(false);
        logUserAction('profile_updated');
    };

    const handleResetData = () => {
        if (window.confirm("Are you sure you want to reset all your app data? This action is permanent and cannot be undone.")) {
            resetAllData();
        }
    };

    return (
        <div className="h-full w-full flex flex-col p-6 relative overflow-x-hidden text-[--text-primary]" style={{ paddingTop: `calc(2.5rem + env(safe-area-inset-top, 0px))` }}>
            <header className="text-center z-10 mb-6 flex-shrink-0">
                <h2 className="font-light text-sm tracking-widest uppercase opacity-80 text-[--text-secondary]">The Sunrise Realm</h2>
                <h1 className="font-sans text-3xl font-bold opacity-90 text-[--text-header]">Profile & Settings</h1>
            </header>

            <main className="z-10 flex-grow w-full max-w-md mx-auto overflow-y-auto space-y-6 pr-1" style={{ paddingBottom: `calc(7rem + env(safe-area-inset-bottom, 0px))` }}>
                
                {/* Profile Details */}
                <div className="glassmorphism p-4 rounded-3xl shadow-lg">
                    <h3 className="text-lg font-sans font-semibold text-center text-[--text-header] mb-4">Your Profile</h3>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <label className="w-20 text-sm font-semibold opacity-80">Name</label>
                            {isEditing ? (
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 p-2 bg-transparent border-b-2 border-[--accent-color]/50 focus:border-[--accent-color] outline-none" />
                            ) : (
                                <p className="flex-1 p-2">{name}</p>
                            )}
                        </div>
                         <div className="flex items-center">
                            <label className="w-20 text-sm font-semibold opacity-80">Age</label>
                            <p className="flex-1 p-2 opacity-80">{userAge || 'Not set'}</p>
                        </div>
                        <div className="flex items-center">
                            <label className="w-20 text-sm font-semibold opacity-80">Gender</label>
                            <p className="flex-1 p-2 opacity-80">{userGender || 'Not set'}</p>
                        </div>
                         <div className="flex items-center">
                            <label className="w-20 text-sm font-semibold opacity-80">Country</label>
                            <p className="flex-1 p-2 opacity-80">{userCountry || 'Not set'}</p>
                        </div>
                    </div>
                    <div className="mt-4 text-right">
                        {isEditing ? (
                            <button onClick={handleSave} className="py-2 px-5 rounded-full text-sm font-semibold transition-all active:scale-95" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--accent-color-text)' }}>Save</button>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="py-2 px-5 rounded-full text-sm font-semibold transition-all active:scale-95" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--accent-color-text)' }}>Edit Name</button>
                        )}
                    </div>
                </div>

                {/* Theme Customization */}
                <div className="glassmorphism p-4 rounded-3xl shadow-lg">
                    <h3 className="text-lg font-sans font-semibold text-center text-[--text-header] mb-4">Customize Your Global Realm</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {themeOptions.map(theme => (
                            <button 
                                key={theme.id}
                                onClick={() => setGlobalTheme(theme.id)}
                                className={`aspect-square rounded-lg transition-all duration-200 ${theme.bg} ${globalTheme === theme.id ? 'ring-2 ring-offset-2 ring-offset-transparent' : 'opacity-70 hover:opacity-100'}`}
                                // Fix: Replaced non-standard `ringColor` with the correct CSS variable for Tailwind's ring color.
                                style={{ '--tw-ring-color': 'var(--accent-color)' } as React.CSSProperties}
                                aria-label={`Select ${theme.name} theme`}
                            >
                                <span className="sr-only">{theme.name}</span>
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={() => setGlobalTheme(null)}
                        className={`w-full mt-4 text-left p-3 glassmorphism rounded-lg hover:bg-white/10 transition-colors text-sm font-semibold ${globalTheme === null ? 'ring-2' : ''}`}
                        // Fix: Replaced non-standard `ringColor` with the correct CSS variable for Tailwind's ring color.
                        style={{ '--tw-ring-color': 'var(--accent-color)' } as React.CSSProperties}
                    >
                       Use Default Realm Themes
                    </button>
                </div>

                 {/* App Settings */}
                <div className="glassmorphism p-4 rounded-3xl shadow-lg">
                    <h3 className="text-lg font-sans font-semibold text-center text-[--text-header] mb-4">App Settings</h3>
                    <div className="space-y-3">
                        <button onClick={restartTour} className="w-full text-left p-3 glassmorphism rounded-lg hover:bg-white/10 transition-colors">
                            Restart Guided Tour
                        </button>
                        <button onClick={handleResetData} className="w-full text-left p-3 glassmorphism rounded-lg hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 transition-colors">
                            Reset All App Data...
                        </button>
                    </div>
                </div>

                {/* About Lehsa */}
                <div className="glassmorphism p-5 rounded-3xl shadow-lg mb-4">
                    <div className="flex flex-col items-center mb-5">
                         <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[--accent-color] to-white/50 shadow-inner flex items-center justify-center mb-3 animate-soft-glow">
                             <span className="font-serif italic text-2xl text-white font-bold">L</span>
                         </div>
                        <h3 className="text-xl font-sans font-bold text-[--text-header]">About Lehsa</h3>
                        <p className="text-xs font-medium opacity-60 tracking-widest uppercase mt-1">AI Mental Wellness Companion</p>
                    </div>

                    <div className="space-y-5 text-sm leading-relaxed opacity-90 text-[--text-primary] text-justify">
                        <p>
                            Lehsa is more than just an app; it is a digital sanctuary designed to help you navigate the complexities of your inner world. Built on the principles of <strong>Zen Minimalism</strong> and a <strong>Privacy-First</strong> architecture, Lehsa acts as a compassionate ecosystem for self-reflection and growth.
                        </p>

                        <div>
                            <h4 className="font-semibold text-[--accent-color] mb-2 text-center sm:text-left">The Realms of Wellness</h4>
                            <p className="mb-2">Lehsa categorizes your wellness journey into distinct "Realms" to create immersive, focused experiences:</p>
                            <ul className="space-y-2 mt-2">
                                <li className="flex items-start"><span className="mr-2 text-[--accent-color]">🌿</span> <span><strong>The Forest:</strong> A space for deep journaling.</span></li>
                                <li className="flex items-start"><span className="mr-2 text-[--accent-color]">🌙</span> <span><strong>The Lunar Realm:</strong> An empathetic AI companion.</span></li>
                                <li className="flex items-start"><span className="mr-2 text-[--accent-color]">🌊</span> <span><strong>The Ocean:</strong> Guided meditations for calm.</span></li>
                                <li className="flex items-start"><span className="mr-2 text-[--accent-color]">🪐</span> <span><strong>The Cosmic Realm:</strong> Growth and goal setting.</span></li>
                            </ul>
                        </div>

                         <div>
                            <h4 className="font-semibold text-[--accent-color] mb-2 text-center sm:text-left">Your Privacy, Our Priority</h4>
                            <p>
                                We believe that true vulnerability requires safety. That is why Lehsa operates entirely locally on your device. Your journal entries, personal goals, and chat histories are never sent to a central server for storage. Your data stays with you.
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-4 border-t border-white/10 text-center">
                        <p className="text-xs opacity-50">Version 1.0.0 • Gemini Powered</p>
                        <p className="text-xs opacity-50 mt-1">Made with ❤️ for Mental Wellness</p>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default ProfileScreen;