import React, { useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen, screenOrder } from '../types';
import { HomeIcon, JournalIcon, JourneyIcon, GrowthIcon, ChatIcon, MusicIcon, MeditationIcon, ProfileIcon } from './Icons';

interface BottomNavProps {
  navItemRefs: React.RefObject<HTMLButtonElement>[];
}

const navItems = [
    { label: 'Home', icon: HomeIcon, screen: Screen.Home },
    { label: 'Journal', icon: JournalIcon, screen: Screen.Journal },
    { label: 'Journey', icon: JourneyIcon, screen: Screen.Journey },
    { label: 'Music', icon: MusicIcon, screen: Screen.Music },
    { label: 'Meditation', icon: MeditationIcon, screen: Screen.Meditation },
    { label: 'Growth', icon: GrowthIcon, screen: Screen.Growth },
    { label: 'Chat', icon: ChatIcon, screen: Screen.Chat },
    { label: 'Profile', icon: ProfileIcon, screen: Screen.Profile },
];

const BottomNav: React.FC<BottomNavProps> = ({ navItemRefs }) => {
  const { activeScreen, setActiveScreen } = useAppContext();
  const navScrollRef = useRef<HTMLDivElement>(null);

  const activeIndex = screenOrder.indexOf(activeScreen);

  useEffect(() => {
    // Scroll active item into view smoothly on screen change
    if (navScrollRef.current && activeIndex >= 0) {
        const activeElement = navScrollRef.current.children[activeIndex] as HTMLElement;
        if (activeElement) {
            const containerCenter = navScrollRef.current.offsetWidth / 2;
            const elementCenter = activeElement.offsetLeft + activeElement.offsetWidth / 2;
            const scrollPos = elementCenter - containerCenter;

            navScrollRef.current.scrollTo({
                left: scrollPos,
                behavior: 'smooth'
            });
        }
    }
  }, [activeIndex]);

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 pointer-events-none" style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}>
      <div className="mx-auto max-w-lg w-full px-4 mb-2 pointer-events-auto">
        <div 
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 flex items-center justify-start overflow-x-auto no-scrollbar py-2 px-2"
            ref={navScrollRef}
            style={{ 
                WebkitOverflowScrolling: 'touch',
                scrollSnapType: 'x mandatory'
            }}
        >
            {navItems.map((item, index) => {
            const isActive = activeScreen === item.screen;
            
            return (
                <button
                    ref={navItemRefs[index]}
                    key={item.label}
                    onClick={() => setActiveScreen(item.screen)}
                    className={`flex-shrink-0 relative group flex flex-col items-center justify-center min-w-[4.5rem] py-2 transition-all duration-300 ease-out scroll-snap-align-center rounded-xl mx-1`}
                    style={{ 
                        opacity: isActive ? 1 : 0.6,
                    }}
                    aria-label={item.label}
                >
                    {isActive && (
                         <div className="absolute inset-0 bg-white/10 rounded-xl shadow-inner border border-white/10 transition-all duration-300" />
                    )}
                    
                    <div className={`relative z-10 p-1.5 rounded-full transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-1' : ''}`}>
                         {isActive && <div className="absolute inset-0 bg-[var(--accent-color)] opacity-20 blur-lg rounded-full" />}
                         <item.icon
                            className={`w-6 h-6 transition-colors duration-300`}
                            style={{ color: isActive ? 'var(--accent-color)' : 'var(--icon-inactive-color)' }}
                            isActive={isActive}
                         />
                    </div>
                    {isActive ? (
                        <span className="text-[10px] font-bold mt-1 text-[var(--text-primary)] animate-fade-in-up">
                            {item.label}
                        </span>
                    ) : (
                         <div className="w-1 h-1 rounded-full bg-[var(--icon-inactive-color)] opacity-40 mt-2" />
                    )}
                </button>
            );
            })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;