
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChatMessage, Screen } from '../types';
import { getChatResponse, getMeditationAudio } from '../services/geminiService';
import { SendIcon } from '../components/Icons';

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

const ChatScreen: React.FC = () => {
    const { chatMessages, addChatMessage, journals, feeling, feelingTimestamp, userCountry, userAge, userGender, getRealmMoodText } = useAppContext();
    const [userInput, setUserInput] = useState('');
    const [isBuddyTyping, setIsBuddyTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [animationState, setAnimationState] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const userHasScrolledUpRef = useRef(false);
    const recognitionRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    useEffect(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        return () => {
            if (audioSourceRef.current) {
                audioSourceRef.current.stop();
            }
        };
    }, []);

    const speakResponse = useCallback(async (text: string) => {
        if (!audioContextRef.current) return;
        setIsSpeaking(true);
        setAnimationState('inhale');

        try {
            const base64Audio = await getMeditationAudio(`Say compassionately: ${text}`);
            if (!base64Audio || !audioContextRef.current) throw new Error("TTS failed");

            const audioData = decode(base64Audio);
            const buffer = await decodeAudioData(audioData, audioContextRef.current);

            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            source.start(0);
            audioSourceRef.current = source;

            const interval = setInterval(() => {
                setAnimationState(prev => prev === 'inhale' ? 'exhale' : 'inhale');
            }, 600);

            source.onended = () => {
                clearInterval(interval);
                setIsSpeaking(false);
                setAnimationState('idle');
            };
        } catch (error) {
            console.error("TTS Error:", error);
            setIsSpeaking(false);
            setAnimationState('idle');
        }
    }, []);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setUserInput(prev => prev ? `${prev} ${transcript}` : transcript);
                setIsListening(false);
                setAnimationState('idle');
            };

            recognitionRef.current.onerror = (event: any) => {
                setIsListening(false);
                setAnimationState('idle');
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
                setAnimationState('idle');
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setAnimationState('idle');
        } else {
            setIsListening(true);
            setAnimationState('hold');
            recognitionRef.current?.start();
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        const handleScroll = () => {
            if (container) {
                const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
                userHasScrolledUpRef.current = !isNearBottom;
            }
        };
        container?.addEventListener('scroll', handleScroll);
        return () => container?.removeEventListener('scroll', handleScroll);
    }, []);

    useLayoutEffect(() => {
        const lastMessage = chatMessages[chatMessages.length - 1];
        if (lastMessage && lastMessage.sender === 'buddy' && userHasScrolledUpRef.current) return;
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSend = async () => {
        const trimmedInput = userInput.trim();
        if (trimmedInput === '' || isBuddyTyping) return;

        userHasScrolledUpRef.current = false;
        
        const newUserMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            text: trimmedInput,
            sender: 'user',
            timestamp: new Date(),
        };

        addChatMessage(newUserMessage);
        setUserInput('');
        setIsBuddyTyping(true);
        setAnimationState('inhale');

        try {
            let feelingContext = '';
            if (feelingTimestamp) {
                const now = new Date();
                const fifteenMinutes = 15 * 60 * 1000;
                if (now.getTime() - feelingTimestamp.getTime() < fifteenMinutes) {
                    let feelingDescription = feeling < 40 ? "stressed" : feeling > 70 ? "radiant" : "balanced";
                    feelingContext = `Recent Feeling Context: The user feels ${feelingDescription} (${feeling}/100).\n\n---\n\n`;
                }
            }

            const journalContext = journals.slice(0, 3).map(entry => `Journal Entry (${entry.timestamp.toLocaleDateString()}): ${entry.text}`).join('\n\n---\n\n');
            const fullContext = feelingContext + journalContext;

            const responseText = await getChatResponse(chatMessages, trimmedInput, fullContext, userCountry, userAge, userGender);
            const buddyResponse: ChatMessage = { id: `buddy-${Date.now()}`, text: responseText, sender: 'buddy', timestamp: new Date() };
            addChatMessage(buddyResponse);
            speakResponse(responseText);
        } catch (error) {
            console.error("Error getting chat response:", error);
            const errorMessage: ChatMessage = { id: `buddy-err-${Date.now()}`, text: "I'm having a little trouble connecting right now. I'm still here for you.", sender: 'buddy', timestamp: new Date() };
            addChatMessage(errorMessage);
        } finally {
            setIsBuddyTyping(false);
            if (!isSpeaking) setAnimationState('idle');
        }
    };
    
    return (
        <div className="h-full w-full flex flex-col relative overflow-x-hidden text-[--text-primary]">
            <div className="absolute inset-0 z-0 pointer-events-none">
                 {[...Array(3)].map((_, i) => (
                    <div key={i} className="absolute h-0.5 w-24 bg-gradient-to-l from-white/30 to-transparent rounded-full animate-shooting-star" style={{
                        top: `${Math.random() * 60}%`,
                        right: '-50vw',
                        animationDuration: `${4 + Math.random() * 4}s`,
                        animationDelay: `${Math.random() * 15}s`,
                    }}></div>
                ))}
            </div>

            <div className="relative flex flex-col h-full p-6 z-10" style={{ paddingTop: `calc(2.5rem + env(safe-area-inset-top, 0px))` }}>
                <header className="text-center mb-4 flex-shrink-0 animate-fade-in-up">
                    <h2 className="font-light text-[10px] tracking-[0.3em] opacity-80 uppercase text-[--text-secondary] mb-4">Lunar Resonance</h2>
                    <div className="flex flex-col items-center">
                        <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
                            <div className={`orb ${animationState} orb-calm shadow-xl relative z-10 border border-white/20`}></div>
                            {(isListening || isSpeaking) && (
                                <div className="absolute inset-0 bg-[--accent-color]/20 rounded-full animate-ping opacity-50"></div>
                            )}
                            {isBuddyTyping && (
                                <div className="absolute inset-[-10px] border-2 border-dashed border-indigo-400/30 rounded-full animate-spin"></div>
                            )}
                        </div>
                        <h1 className="font-sans text-2xl font-black opacity-90 text-[--text-header]">Lehsa</h1>
                        <p className="text-[10px] font-bold text-[--accent-color] mt-2 tracking-[0.2em] uppercase">{isSpeaking ? 'Echoing Peace' : isListening ? 'Absorbing Thought' : 'Zen Observer'}</p>
                    </div>
                </header>
                
                <div ref={scrollContainerRef} className="flex-grow overflow-y-auto mb-4 pr-2 space-y-4 no-scrollbar" style={{ paddingBottom: `calc(7rem + env(safe-area-inset-bottom, 0px))` }}>
                    {chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                            <div className={`max-w-[85%] p-4 rounded-3xl shadow-lg border border-white/10 ${
                                msg.sender === 'user' 
                                ? 'bg-indigo-600/80 backdrop-blur-md text-white rounded-br-none' 
                                : 'glassmorphism text-[--text-on-glass] rounded-bl-none'
                            }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="absolute left-6 right-6" style={{ bottom: `calc(7rem + env(safe-area-inset-bottom, 0px))` }}>
                    <div className="relative flex items-center space-x-2">
                        <div className="relative flex-grow">
                            <input
                                type="text" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()}
                                placeholder={isListening ? "Lehsa is listening..." : "Whisper your thoughts..."}
                                className="w-full p-4 pr-12 glassmorphism border-none rounded-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-[--text-on-glass] placeholder:text-[--text-on-glass]/40 transition-shadow duration-300"
                                disabled={isBuddyTyping}
                            />
                            <button onClick={handleSend} disabled={isBuddyTyping || userInput.trim() === ''} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 disabled:opacity-30 transition-transform active:scale-90">
                                <SendIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <button 
                            onClick={toggleListening}
                            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${isListening ? 'bg-red-500/80 animate-pulse' : 'glassmorphism'}`}
                        >
                            {isListening ? (
                                <div className="flex space-x-1">
                                    <div className="w-1 h-3 bg-white rounded-full animate-bounce"></div>
                                    <div className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatScreen;
