
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { getMeditationAudio } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { RestartIcon } from '../components/Icons';
import { Screen } from '../types';

// Helper functions for audio decoding
function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
    const sampleRate = 24000;
    const numChannels = 1;
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

interface Meditation {
  id: string;
  title: string;
  description: string;
  script: string;
  orbClass: string;
  soundscape: {
    name: string;
    audioSrc: string;
  };
}

// Using Google Actions sounds which are very stable and CORS-friendly
const meditations: Meditation[] = [
  {
    id: 'calm',
    title: 'Calm Breathing',
    description: 'Center your mind and body with rhythmic breathing.',
    script: "Welcome. Find a comfortable position. [pause:3] Let's begin. [inhale:4] Breathe in slowly... [hold:5] Hold the breath... [exhale:6] And release gently... [pause:3] Again. [inhale:4] Breathe in... [hold:5] And hold... [exhale:6] Breathe out... [pause:3] One more time. [inhale:4] Deep breath in... [hold:5] Hold... [exhale:6] And let go completely. [pause:2] You are calm.",
    orbClass: 'orb-calm',
    soundscape: {
        name: 'Ocean Waves',
        audioSrc: 'https://actions.google.com/sounds/v1/water/ocean_waves.ogg'
    }
  },
  {
    id: 'focus',
    title: 'Mindful Focus',
    description: 'Sharpen your concentration on the present moment.',
    script: "Find a quiet space and settle in. [pause:3] For the next few moments, we will practice mindful focus. [pause:3] Bring your attention to your breath. [pause:5] Notice the sensation of the air entering your nostrils... and leaving. [pause:8] Your mind will wander. That's okay. [pause:4] When you notice it has wandered, gently guide it back to your breath. [pause:8] Just focus on the in-breath... and the out-breath. [pause:10] Continue this for a few more moments. [pause:15] Now, gently bring your awareness back to the room. [pause:3] Carry this focus with you.",
    orbClass: 'orb-focus',
    soundscape: {
        name: 'Forest Ambience',
        audioSrc: 'https://actions.google.com/sounds/v1/ambient/forest_ambience.ogg'
    }
  },
  {
    id: 'gratitude',
    title: 'Gratitude Practice',
    description: 'Cultivate thankfulness for the present moment.',
    script: "Gently close your eyes. [pause:3] Bring to mind something you are grateful for today. [pause:5] It can be small, like the warmth of the sun, or a kind word from a friend. [pause:8] Hold this feeling of gratitude in your heart. [inhale:4] Breathe in this feeling... [hold:4] Let it fill you up... [exhale:6] And exhale with a gentle smile. [pause:5] Now, think of one more thing you are thankful for. [pause:8] Acknowledge this gift. [pause:5] Carry this warmth with you.",
    orbClass: 'orb-gratitude',
    soundscape: {
        name: 'Morning Birds',
        audioSrc: 'https://actions.google.com/sounds/v1/ambient/morning_birds.ogg'
    }
  },
  {
    id: 'sleep',
    title: 'Sleep Wind-Down',
    description: 'Release the day and prepare for restful sleep.',
    script: "Settle into a comfortable, resting position. [pause:4] Let go of the day's events. They are in the past. [pause:6] Bring your attention to your body. [pause:4] Feel the weight of it, supported and safe. [inhale:5] Take a slow, deep breath in... [hold:3] hold it gently... [exhale:7] and as you breathe out, release all tension. [pause:5] Let your muscles soften. [pause:5] Let your mind quiet down. [pause:8] You are ready for sleep. [pause:5] Rest now.",
    orbClass: 'orb-sleep',
    soundscape: {
        name: 'Soft Wind',
        audioSrc: 'https://actions.google.com/sounds/v1/weather/soft_wind.ogg'
    }
  },
];

const BackgroundElements: React.FC = React.memo(() => (
    <>{[...Array(8)].map((_, i) => (<div key={i} className="absolute top-0 left-0 w-px h-px bg-white/20 rounded-full animate-slow-drift" style={{ left: `${Math.random() * 100}%`, width: `${Math.random() * 8 + 3}px`, height: `${Math.random() * 8 + 3}px`, animationDelay: `${Math.random() * 25}s`, animationDuration: `${20 + Math.random() * 20}s`, filter: 'blur(3px)'}} />))}</>
));

const BreatheScreen: React.FC = () => {
  const { incrementMeditationCount, logUserAction, getRealmMoodText } = useAppContext();
  const [loadingMeditationId, setLoadingMeditationId] = useState<string | null>(null);
  const [activeMeditation, setActiveMeditation] = useState<Meditation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [animationState, setAnimationState] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [instructionText, setInstructionText] = useState('Ready?');
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const soundscapeAudioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutIdsRef = useRef<number[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    }
    if (!soundscapeAudioRef.current) {
        soundscapeAudioRef.current = new Audio();
        soundscapeAudioRef.current.crossOrigin = 'anonymous'; 
        soundscapeAudioRef.current.loop = true;
        soundscapeAudioRef.current.volume = 0.3;
        
        // Error handling for soundscape
        soundscapeAudioRef.current.onerror = (e) => {
            console.error("Soundscape loading error:", e);
            setError("The soundscape failed to load. You can still meditate with the guide.");
        };
    }
    return () => {
      handleStopMeditation();
    }
  }, []);

  const clearTimeouts = () => {
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];
  };

  const handleStopMeditation = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.onended = null;
      try { audioSourceRef.current.stop(); } catch(e) { /* Already stopped */ }
      audioSourceRef.current = null;
    }
    if (soundscapeAudioRef.current) {
        soundscapeAudioRef.current.pause();
        soundscapeAudioRef.current.currentTime = 0;
        soundscapeAudioRef.current.src = '';
    }
    clearTimeouts();
    if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
    }
    setActiveMeditation(null);
    setAnimationState('idle');
    setInstructionText('Ready?');
    setRemainingTime(null);
  };

  const handleRestartMeditation = () => {
    if (activeMeditation) {
        logUserAction('meditation_restarted', { title: activeMeditation.title });
        handleStartMeditation(activeMeditation);
    }
  };
  
  const handleStartMeditation = async (meditation: Meditation) => {
    if (loadingMeditationId || !audioContextRef.current || !soundscapeAudioRef.current) return;

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    handleStopMeditation();
    setLoadingMeditationId(meditation.id);
    setError(null);
    logUserAction('meditation_started', { title: meditation.title });

    try {
      const cues: { action: string; duration: number; startTime: number; text: string; }[] = [];
      let cumulativeTime = 0;
      const cleanScript = meditation.script.replace(/\[(.*?):(\d+)\]/g, (_, action, durationStr) => {
        const duration = parseInt(durationStr, 10) * 1000;
        const textInstruction = action === 'inhale' ? 'Breathe in...' : action === 'hold' ? 'Hold...' : action === 'exhale' ? 'Breathe out...' : '';
        cues.push({ action, duration, startTime: cumulativeTime, text: textInstruction });
        cumulativeTime += duration;
        return ' ';
      });

      const base64Audio = await getMeditationAudio(`Say calmly: ${cleanScript}`);
      if (!base64Audio || !audioContextRef.current) throw new Error("Audio generation failed.");

      // Set and load background soundscape
      soundscapeAudioRef.current.src = meditation.soundscape.audioSrc;
      soundscapeAudioRef.current.load();
      
      const playPromise = soundscapeAudioRef.current.play();
      if (playPromise !== undefined) {
          playPromise.catch(e => {
              console.warn("Background soundscape play failed or was blocked:", e);
          });
      }

      setActiveMeditation(meditation);

      const audioData = decode(base64Audio);
      const buffer = await decodeAudioData(audioData, audioContextRef.current);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);
      audioSourceRef.current = source;
      
      setAnimationState('idle');
      setInstructionText('Listen...');

      const totalDuration = Math.ceil(buffer.duration);
      setRemainingTime(totalDuration);
      timerIntervalRef.current = window.setInterval(() => {
          setRemainingTime(prev => {
              if (prev === null || prev <= 1) {
                  if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                  return null;
              }
              return prev - 1;
          });
      }, 1000);

      cues.forEach(cue => {
        const timeoutId = window.setTimeout(() => {
          setAnimationState(cue.action === 'pause' ? 'idle' : cue.action as any);
          if (cue.text) setInstructionText(cue.text);
        }, cue.startTime);
        timeoutIdsRef.current.push(timeoutId);
      });
      
      const currentMeditation = meditation;
      source.onended = () => {
        if (audioSourceRef.current === source) {
            incrementMeditationCount(currentMeditation.title);
            handleStopMeditation();
        }
      };

    } catch (e) {
      console.error("Error starting meditation:", e);
      setError("Unable to load meditation. Please check your internet connection.");
      if (soundscapeAudioRef.current) {
        soundscapeAudioRef.current.pause();
      }
      setActiveMeditation(null);
    } finally {
      setLoadingMeditationId(null);
    }
  };
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };
  
  return (
    <div className="h-full w-full flex flex-col items-center p-6 relative overflow-x-hidden text-[--text-primary]" style={{ paddingTop: `calc(2.5rem + env(safe-area-inset-top, 0px))` }}>
        <div className="absolute inset-0 z-0 pointer-events-none">
            <BackgroundElements />
        </div>

        <header className="text-center z-10 mb-8 flex-shrink-0 animate-fade-in-up">
            <h2 className="font-light text-sm tracking-widest uppercase opacity-80 text-[--text-secondary]">The Ocean Realm</h2>
            <h1 className="font-sans text-3xl font-bold opacity-90 text-[--text-header]">Guided Meditation</h1>
            <p className="text-xs font-semibold text-[--accent-color] mt-1">{getRealmMoodText(Screen.Meditation)}</p>
        </header>

        <main className="z-10 flex-grow flex flex-col items-center justify-center text-center w-full max-w-md overflow-y-auto" style={{ paddingBottom: `calc(7rem + env(safe-area-inset-bottom, 0px))` }}>
          {!activeMeditation ? (
            <div className="w-full space-y-4 animate-fade-in-up pr-2">
              <h3 className="text-2xl font-sans font-semibold mb-2 text-[--text-header]">Choose a Session</h3>
              {meditations.map(med => (
                <div key={med.id} className="glassmorphism p-4 rounded-2xl text-left flex items-center justify-between transition-transform duration-300 hover:scale-[1.02] text-[--text-on-glass]">
                  <div className="flex-grow pr-2">
                    <h4 className="font-bold font-sans">{med.title}</h4>
                    <p className="text-sm opacity-80">{med.description}</p>
                    <p className="text-xs opacity-60 mt-1">Soundscape: {med.soundscape.name}</p>
                  </div>
                  <button
                    onClick={() => handleStartMeditation(med)}
                    disabled={!!loadingMeditationId}
                    className="bg-white/10 hover:bg-white/20 font-semibold px-4 py-2 rounded-full transition-all active:scale-95 disabled:opacity-50 flex-shrink-0 w-28 text-center"
                  >
                    {loadingMeditationId === med.id ? <LoadingSpinner /> : 'Begin'}
                  </button>
                </div>
              ))}
              {error && <p className="text-red-300 mt-4 text-sm font-bold bg-black/20 p-2 rounded-lg">{error}</p>}
            </div>
          ) : (
            <div className="animate-fade-in-up flex flex-col items-center">
              <div className={`relative w-52 h-52 flex items-center justify-center mb-6`}>
                 <div className={`orb ${animationState} ${activeMeditation.orbClass}`} />
                 <p className="text-2xl font-semibold z-10 transition-opacity duration-500">{instructionText}</p>
              </div>
              
              {remainingTime !== null && (
                <p className="text-lg opacity-80 mb-6 font-mono tracking-wider">
                    {formatTime(remainingTime)}
                </p>
              )}
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleRestartMeditation}
                  className="glassmorphism w-16 h-16 flex items-center justify-center rounded-full font-semibold hover:bg-white/20 transition-all duration-300 active:scale-95 text-[--text-on-glass]"
                  aria-label="Restart Session"
                >
                    <RestartIcon className="w-7 h-7" />
                </button>
                <button 
                    onClick={handleStopMeditation}
                    className="glassmorphism px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 active:scale-95 text-[--text-on-glass]"
                >
                    Stop Session
                </button>
              </div>
              {error && <p className="text-red-300 mt-4 text-xs font-bold bg-black/20 p-2 rounded-lg">{error}</p>}
            </div>
          )}
        </main>
    </div>
  );
};

export default BreatheScreen;
