
import React, { useState, useEffect, useRef, createRef } from 'react';
import { AppProvider, MusicProvider, useAppContext } from './context/AppContext';
import { Screen, screenOrder } from './types';

import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import JournalScreen from './screens/JournalScreen';
import JourneyScreen from './screens/JourneyScreen';
import ChatScreen from './screens/ChatScreen';
import BreatheScreen from './screens/BreatheScreen';
import GrowthScreen from './screens/GrowthScreen';
import MusicScreen from './screens/MusicScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNav from './components/BottomNav';
import GlobalMusicPlayer from './components/GlobalMusicPlayer';
import GuidedTour from './components/GuidedTour';
import GrowthToast from './components/GrowthToast';
import Confetti from './components/Confetti';
import LevelUpModal from './components/LevelUpModal';

const screens: Record<Screen, React.FC> = {
  [Screen.Home]: HomeScreen,
  [Screen.Journal]: JournalScreen,
  [Screen.Journey]: JourneyScreen,
  [Screen.Chat]: ChatScreen,
  [Screen.Meditation]: BreatheScreen,
  [Screen.Growth]: GrowthScreen,
  [Screen.Music]: MusicScreen,
  [Screen.Profile]: ProfileScreen,
};

const screenThemes: Record<Screen, string> = {
    [Screen.Home]: 'day-mode',
    [Screen.Journal]: 'forest-mode',
    [Screen.Journey]: 'sunset-mode',
    [Screen.Music]: 'starlight-mode',
    [Screen.Meditation]: 'ocean-mode',
    [Screen.Growth]: 'cosmic-mode',
    [Screen.Chat]: 'night-mode',
    [Screen.Profile]: 'sunrise-mode',
};

const ANIMATION_DURATION = 400;

const AppContent: React.FC = () => {
    const { 
        activeScreen,
        setActiveScreen,
        isOnboardingComplete, 
        globalTheme,
        confettiTrigger
    } = useAppContext();
    const [showSplash, setShowSplash] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [showTour, setShowTour] = useState(() => !localStorage.getItem('tourComplete'));
    
    const touchStartX = useRef(0);
    const isSwiping = useRef(false);
    
    const navItemRefs = useRef<React.RefObject<HTMLButtonElement>[]>(
        [...Array(screenOrder.length)].map(() => createRef<HTMLButtonElement>())
    );

    const [transitionInfo, setTransitionInfo] = useState<{
        currentScreen: Screen;
        previousScreen: Screen | null;
        direction: 'forward' | 'backward' | 'none';
    }>({
        currentScreen: activeScreen,
        previousScreen: null,
        direction: 'none'
    });
    
    useEffect(() => {
        if (activeScreen !== transitionInfo.currentScreen) {
            const currentIndex = screenOrder.indexOf(activeScreen);
            const prevIndex = screenOrder.indexOf(transitionInfo.currentScreen);
            
            setTransitionInfo({
                currentScreen: activeScreen,
                previousScreen: transitionInfo.currentScreen,
                direction: currentIndex > prevIndex ? 'forward' : 'backward'
            });

            const timer = setTimeout(() => {
                setTransitionInfo(s => ({ ...s, previousScreen: null, direction: 'none' }));
            }, ANIMATION_DURATION);

            return () => clearTimeout(timer);
        }
    }, [activeScreen, transitionInfo.currentScreen]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => setShowSplash(false), 500);
        }, 3200);
        return () => clearTimeout(timer);
    }, []);

    const handleTourComplete = () => {
        setShowTour(false);
        localStorage.setItem('tourComplete', 'true');
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('button, input, textarea, a, [data-no-swipe="true"], .global-music-player')) return;
        if (!isOnboardingComplete || showTour || transitionInfo.direction !== 'none') return;
        touchStartX.current = e.targetTouches[0].clientX;
        isSwiping.current = true;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!isSwiping.current || !isOnboardingComplete) return;
        isSwiping.current = false;
        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - touchStartX.current;
        const swipeThreshold = window.innerWidth / 4;

        if (deltaX > swipeThreshold) {
            const currentIndex = screenOrder.indexOf(activeScreen);
            const prevIndex = (currentIndex - 1 + screenOrder.length) % screenOrder.length;
            setActiveScreen(screenOrder[prevIndex]);
        } else if (deltaX < -swipeThreshold) {
            const currentIndex = screenOrder.indexOf(activeScreen);
            const nextIndex = (currentIndex + 1) % screenOrder.length;
            setActiveScreen(screenOrder[nextIndex]);
        }
    };

    if (showSplash) return <SplashScreen isFadingOut={isFadingOut} />;
    if (!isOnboardingComplete) return <OnboardingScreen />;
    
    const screensToRender = [transitionInfo.currentScreen];
    if (transitionInfo.previousScreen && transitionInfo.previousScreen !== transitionInfo.currentScreen) {
        screensToRender.push(transitionInfo.previousScreen);
    }
    
    const effectiveTheme = globalTheme || screenThemes[activeScreen];

    return (
        <div 
            className={`h-full w-full font-sans relative ${effectiveTheme}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <Confetti trigger={confettiTrigger.active} type={confettiTrigger.type} />
            <GrowthToast />
            <LevelUpModal />
            <div className="absolute top-0 left-0 w-full h-full z-10 overflow-hidden">
                 {screensToRender.map((screen) => {
                    const ScreenComponent = screens[screen];
                    const isCurrent = screen === transitionInfo.currentScreen;
                    const isPrevious = screen === transitionInfo.previousScreen;
                    const screenTheme = globalTheme || screenThemes[screen];

                    let animationClass = '';
                    if (isCurrent && transitionInfo.direction !== 'none') {
                        animationClass = transitionInfo.direction === 'forward' ? 'animate-screen-in-from-right' : 'animate-screen-in-from-left';
                    } else if (isPrevious && transitionInfo.direction !== 'none') {
                        animationClass = transitionInfo.direction === 'forward' ? 'animate-screen-out-to-left' : 'animate-screen-out-to-right';
                    }

                    return (
                        <div
                            key={screen}
                            className={`absolute inset-0 ${animationClass} ${screenTheme} ${screenTheme}-bg`}
                            style={{ pointerEvents: isCurrent ? 'auto' : 'none', zIndex: isCurrent ? 2 : 1 }}
                        >
                            <ScreenComponent />
                        </div>
                    );
                })}
            </div>

            <BottomNav navItemRefs={navItemRefs.current} />
            <GlobalMusicPlayer />
            {isOnboardingComplete && showTour && <GuidedTour navItemRefs={navItemRefs.current} onComplete={handleTourComplete} />}
        </div>
    );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MusicProvider>
        <AppContent />
      </MusicProvider>
    </AppProvider>
  );
};

export default App;
