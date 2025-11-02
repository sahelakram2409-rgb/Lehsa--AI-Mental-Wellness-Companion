import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';

interface GuidedTourProps {
    navItemRefs: React.RefObject<HTMLButtonElement>[];
    onComplete: () => void;
}

const tourSteps = [
    { title: "Your Home", description: "This is your starting point. Check in with your feelings and navigate to all your wellness realms." },
    { title: "The Forest Realm", description: "A safe space to reflect in your journal. Lehsa will offer gentle insights on your entries." },
    { title: "The Sunset Realm", description: "Track your progress and watch your personal wellness constellation grow with every milestone." },
    { title: "The Starlight Realm", description: "Relax with a collection of calming music and immersive video backgrounds." },
    { title: "The Ocean Realm", description: "Breathe and find calm with guided meditation sessions set in a tranquil ocean environment." },
    { title: "The Cosmic Realm", description: "Set and manage your personal growth goals to chart your path forward." },
    { title: "The Lunar Realm", description: "Chat with me, Lehsa, anytime. I'm here to listen and support you without judgment." },
];

const tourScreens = [
    Screen.Home,
    Screen.Journal,
    Screen.Journey,
    Screen.Music,
    Screen.Meditation,
    Screen.Growth,
    Screen.Chat,
];

const GuidedTour: React.FC<GuidedTourProps> = ({ navItemRefs, onComplete }) => {
    const { setActiveScreen } = useAppContext();
    const [stepIndex, setStepIndex] = useState(0);
    const [fireflyStyle, setFireflyStyle] = useState<React.CSSProperties>({ top: '50%', left: '-30px', opacity: 0 });
    const [cardStyle, setCardStyle] = useState<React.CSSProperties>({ opacity: 0, transform: 'translateX(-50%) translateY(10px)' });
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const startStepTransition = () => {
            if (stepIndex >= navItemRefs.length) {
                setActiveScreen(Screen.Home);
                onComplete();
                return;
            }

            // 1. Change the active screen
            const currentScreen = tourScreens[stepIndex];
            setActiveScreen(currentScreen);

            // 2. Wait for animations (like BottomNav sliding) to settle
            // This delay is crucial. It must be longer than the BottomNav's 400ms transition.
            // Increased to 600ms for added stability.
            setTimeout(() => {
                const element = navItemRefs[stepIndex]?.current;
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // 3. Move the firefly to the correct, final position
                    setFireflyStyle({
                        top: rect.top + rect.height / 2,
                        left: rect.left + rect.width / 2,
                    });
                    
                    // 4. Wait for the firefly to arrive, then show the info card
                    setTimeout(() => {
                        setCardStyle({ opacity: 1, transform: 'translateX(-50%) translateY(0px)' });
                        setIsTransitioning(false);
                    }, 1200); // This should match the firefly's transition duration
                } else {
                    // Failsafe in case the element isn't ready
                    setIsTransitioning(false);
                }
            }, 600); 
        };

        const timer = setTimeout(startStepTransition, stepIndex === 0 ? 500 : 100);
        return () => clearTimeout(timer);

    }, [stepIndex, navItemRefs, onComplete, setActiveScreen]);
    
    const handleNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCardStyle({ opacity: 0, transform: 'translateX(-50%) translateY(10px)' });
        
        setTimeout(() => {
            setStepIndex(prev => prev + 1);
        }, 300);
    };
    
    const handleSkip = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCardStyle({ opacity: 0, transform: 'translateX(-50%) translateY(10px)' });
        setFireflyStyle(prev => ({ ...prev, opacity: 0, left: '110%' }));
        setActiveScreen(Screen.Home);
        setTimeout(onComplete, 500);
    };

    if (stepIndex >= tourSteps.length) {
        return null;
    }

    const currentStep = tourSteps[stepIndex];

    return (
        <div className="tour-overlay">
            <div className="tour-firefly" style={fireflyStyle}></div>
            <div className="tour-card glassmorphism p-4 shadow-2xl text-white text-center rounded-3xl" style={cardStyle}>
                <h3 className="font-bold text-lg mb-2">{currentStep.title}</h3>
                <p className="text-sm mb-4 opacity-90">{currentStep.description}</p>
                <div className="flex space-x-2">
                    <button onClick={handleSkip} disabled={isTransitioning} className="flex-1 text-xs bg-white/10 py-2 rounded-lg disabled:opacity-50 transition-colors hover:bg-white/20">Skip Tour</button>
                    <button onClick={handleNext} disabled={isTransitioning} className="flex-1 text-xs bg-slate-800 text-white py-2 rounded-lg disabled:opacity-50 transition-colors hover:bg-slate-700">
                        {stepIndex === tourSteps.length - 1 ? 'Finish' : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuidedTour;