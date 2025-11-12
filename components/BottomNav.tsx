import React, { useRef, useEffect, useState } from 'react';
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
  const [navWidth, setNavWidth] = useState(0);
  const navRef = useRef<HTMLElement>(null);

  const [translateX, setTranslateX] = useState(0);
  const [isManualDrag, setIsManualDrag] = useState(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartTranslateX = useRef(0);

  useEffect(() => {
    const updateWidth = () => {
      if (navRef.current) {
        setNavWidth(navRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (isDragging.current) return; // Don't auto-slide while user is dragging
    
    const activeIndex = screenOrder.indexOf(activeScreen);
    const itemWidth = navWidth / 5; // We want to show 5 items
    
    if (itemWidth > 0) {
        const totalWidth = itemWidth * navItems.length;
        if (totalWidth <= navWidth) {
            // Center the whole block if it's smaller than the container
            setTranslateX((navWidth - totalWidth) / 2);
            return;
        }

        const offset = -activeIndex * itemWidth + (navWidth / 2) - (itemWidth / 2);
        
        // Clamp the offset to prevent overscrolling on screen change
        const minTranslateX = -(totalWidth - navWidth);
        const maxTranslateX = 0;
        const clampedOffset = Math.max(minTranslateX, Math.min(maxTranslateX, offset));
        
        setTranslateX(clampedOffset);
    }
  }, [activeScreen, navWidth]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      isDragging.current = true;
      setIsManualDrag(true);
      dragStartX.current = e.touches[0].clientX;
      dragStartTranslateX.current = translateX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;
      
      const deltaX = e.touches[0].clientX - dragStartX.current;
      const newTranslateX = dragStartTranslateX.current + deltaX;

      const itemWidth = navWidth / 5;
      const totalWidth = itemWidth * navItems.length;
      if (totalWidth <= navWidth) return;

      const minTranslateX = -(totalWidth - navWidth);
      const maxTranslateX = 0;

      const clampedTranslateX = Math.max(minTranslateX, Math.min(maxTranslateX, newTranslateX));
      setTranslateX(clampedTranslateX);
  };

  const handleTouchEnd = () => {
      isDragging.current = false;
      setIsManualDrag(false);
  };
  
  const activeIndex = screenOrder.indexOf(activeScreen);
  const itemWidth = navWidth / 5;

  return (
    <nav 
      ref={navRef} 
      className="fixed bottom-0 left-0 w-full z-50 overflow-hidden"
      style={{ 
        height: 'calc(6rem + env(safe-area-inset-bottom, 0px))', 
        paddingBottom: 'env(safe-area-inset-bottom, 0px)' 
      }}
    >
      <div className="absolute bottom-0 left-0 w-full h-full glassmorphism" />
      <div
        className={`flex h-full ${!isManualDrag ? 'transition-transform duration-500' : ''}`}
        style={{ transform: `translateX(${translateX}px)`, width: `${itemWidth * navItems.length}px`, willChange: 'transform' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {navItems.map((item, index) => {
          const isActive = activeIndex === index;
          const distance = Math.abs(activeIndex - index);
          
          const scale = isActive ? 1 : Math.max(0.7, 1 - distance * 0.15);
          const opacity = isActive ? 1 : Math.max(0.5, 1 - distance * 0.25);

          return (
            <button
              ref={navItemRefs[index]}
              key={item.label}
              onClick={() => setActiveScreen(item.screen)}
              className="flex flex-col items-center justify-center z-10 relative transition-all duration-500 ease-out group"
              style={{ width: `${itemWidth}px`, transform: `scale(${scale})`, opacity: opacity }}
              aria-label={item.label}
            >
              <div className={`relative flex items-center justify-center w-16 h-12 transition-transform duration-300 ${isActive ? '-translate-y-2' : ''}`}>
                 {isActive && (
                    <div 
                      className="absolute inset-0 rounded-full transition-all duration-500 ease-out"
                      style={{ background: 'var(--accent-color)', filter: 'blur(16px)', opacity: 0.6, transform: 'scale(1.4)' }}
                    ></div>
                )}
                <item.icon
                  className={`w-7 h-7 mb-1 transition-all duration-300 group-hover:opacity-80 ${isActive ? `scale-110` : ''}`}
                  style={{ color: isActive ? 'var(--accent-color)' : 'var(--icon-inactive-color)'}}
                  isActive={isActive}
                />
              </div>
              <span className={`text-xs transition-all duration-300 group-hover:opacity-80 ${isActive ? `font-bold` : ''}`} style={{ color: isActive ? 'var(--text-primary)' : 'var(--icon-inactive-color)'}}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
