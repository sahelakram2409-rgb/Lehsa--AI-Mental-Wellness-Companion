import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';

const HomeScreen: React.FC = () => {
  const { userName, setActiveScreen, feeling, setFeeling } = useAppContext();
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showNextActions, setShowNextActions] = useState(false);
  const [pulseMessage, setPulseMessage] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    
    const getGreeting = () => {
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };
    setGreeting(getGreeting());

    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));

  }, []);

  const getPulseMessage = (value: number) => {
    if (value <= 20) return "It's okay to not be okay. I'm here to listen.";
    if (value <= 40) return "Looks like a tough day. Let's work through it together.";
    if (value <= 60) return "Right in the middle. Let's explore what's on your mind.";
    if (value <= 80) return "Feeling pretty good today. What's bringing you joy?";
    return "It's wonderful to see you shining so brightly today!";
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setFeeling(value);
    setPulseMessage(getPulseMessage(value));
    if (!showNextActions) {
      setShowNextActions(true);
    }
  };

  const playcards = [
    { title: 'Reflective Journal', subtitle: 'Forest Realm', screen: Screen.Journal, theme: 'forest-mode-bg' },
    { title: 'Your Journey', subtitle: 'Sunset Realm', screen: Screen.Journey, theme: 'sunset-mode-bg' },
    { title: 'AI Companion', subtitle: 'Lunar Realm', screen: Screen.Chat, theme: 'night-mode-bg' },
    { title: 'Personal Growth', subtitle: 'Cosmic Realm', screen: Screen.Growth, theme: 'cosmic-mode-bg' },
    { title: 'Meditation', subtitle: 'Ocean Realm', screen: Screen.Meditation, theme: 'ocean-mode-bg' },
    { title: 'Calming Music', subtitle: 'Starlight Realm', screen: Screen.Music, theme: 'starlight-mode-bg' },
  ];

  return (
    <div className="h-full w-full flex flex-col p-6 pt-12 relative">
      <header className="z-10 flex-shrink-0 mb-8">
        <h1 className="text-4xl font-sans font-bold leading-tight" style={{ color: 'var(--text-header)' }}>{greeting}, {userName}!</h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>{currentDate}</p>
      </header>

      <main className="flex-grow flex flex-col justify-end z-10 overflow-y-auto pb-28">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div data-no-swipe="true" className="glassmorphism rounded-3xl p-6 text-center" style={{ color: 'var(--text-on-glass)' }}>
              <h2 className="text-xl font-sans font-semibold">Lehsa Pulse</h2>
              <p className="text-md font-light opacity-80 mt-1 mb-6">How are you feeling right now?</p>
              
              <div className="relative h-6 flex items-center">
                <input type="range" min="0" max="100" value={feeling} onChange={handleSliderChange} className="custom-slider w-full" />
              </div>

              {showNextActions && (
                <div className="mt-6 pt-5 border-t border-black/10 dark:border-white/10 animate-fade-in-up">
                    <p className="text-sm italic text-center opacity-90 mb-4 h-10 flex items-center justify-center">{pulseMessage}</p>
                    <div className="flex space-x-3">
                        <button 
                          onClick={() => setActiveScreen(Screen.Journal)} 
                          className="flex-1 py-2.5 px-4 rounded-full text-sm transition-all active:scale-95"
                          style={{ backgroundColor: 'var(--accent-color)', color: 'var(--accent-color-text)' }}
                        > 
                          Write about it 
                        </button>
                        <button 
                          onClick={() => setActiveScreen(Screen.Chat)}
                          className="flex-1 py-2.5 px-4 rounded-full text-sm transition-all active:scale-95"
                          style={{ backgroundColor: 'var(--accent-color)', color: 'var(--accent-color-text)' }}
                        > 
                          Talk it through
                        </button>
                    </div>
                </div>
              )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {playcards.map((card) => (
              <button
                key={card.screen}
                onClick={() => setActiveScreen(card.screen)}
                className={`p-4 rounded-2xl text-left transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-lg hover:shadow-xl relative overflow-hidden ${card.theme}`}
              >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 text-white">
                  <h3 className="text-md font-sans font-semibold">{card.title}</h3>
                  <p className="text-xs font-light opacity-80">{card.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;