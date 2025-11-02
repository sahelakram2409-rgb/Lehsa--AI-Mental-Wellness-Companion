import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChatMessage } from '../types';
import { getChatResponse } from '../services/geminiService';
import { SendIcon } from '../components/Icons';

const ChatScreen: React.FC = () => {
    const { chatMessages, addChatMessage, journals, feeling, feelingTimestamp, userCountry, userAge, userGender } = useAppContext();
    const [userInput, setUserInput] = useState('');
    const [isBuddyTyping, setIsBuddyTyping] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const userHasScrolledUpRef = useRef(false);

    // This effect tracks if the user has scrolled away from the bottom.
    useEffect(() => {
        const container = scrollContainerRef.current;
        const handleScroll = () => {
            if (container) {
                // Check if the user is more than 50px away from the bottom
                const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
                userHasScrolledUpRef.current = !isNearBottom;
            }
        };
        container?.addEventListener('scroll', handleScroll);
        return () => container?.removeEventListener('scroll', handleScroll);
    }, []);

    // This effect handles the intelligent auto-scrolling logic.
    useLayoutEffect(() => {
        const lastMessage = chatMessages[chatMessages.length - 1];
        const isAIMessage = lastMessage && lastMessage.sender === 'buddy';

        // Don't scroll if an AI message arrived AND the user has scrolled up to read.
        if (isAIMessage && userHasScrolledUpRef.current) {
            return;
        }

        // In all other cases (user sent a message, or AI replied while user was at the bottom), scroll down.
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSend = async () => {
        const trimmedInput = userInput.trim();
        if (trimmedInput === '' || isBuddyTyping) return;

        // When the user sends a message, they intend to be at the bottom.
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

        try {
            let feelingContext = '';
            if (feelingTimestamp) {
                const now = new Date();
                const fifteenMinutes = 15 * 60 * 1000;
                if (now.getTime() - feelingTimestamp.getTime() < fifteenMinutes) {
                    let feelingDescription = 'neutral';
                    if (feeling <= 20) feelingDescription = "very down";
                    else if (feeling <= 40) feelingDescription = "a bit down";
                    else if (feeling <= 60) feelingDescription = "neutral";
                    else if (feeling <= 80) feelingDescription = "quite good";
                    else feelingDescription = "very good";
                    
                    feelingContext = `Recent Feeling Context: The user recently indicated they are feeling ${feelingDescription} (${feeling}/100).\n\n---\n\n`;
                }
            }

            const journalContext = journals.slice(0, 5).map(entry => {
                let context = `Date: ${entry.timestamp.toLocaleDateString()}`;
                if (entry.mood) context += `, Mood: ${entry.mood}`;
                context += `\nEntry: ${entry.text}`;
                if (entry.reflection) {
                    context += `\nLehsa's Reflection: ${entry.reflection}`;
                }
                return context;
            }).join('\n\n---\n\n');

            const fullContext = feelingContext + journalContext;

            const responseText = await getChatResponse(chatMessages, trimmedInput, fullContext, userCountry, userAge, userGender);
            const buddyResponse: ChatMessage = { id: `buddy-${Date.now()}`, text: responseText, sender: 'buddy', timestamp: new Date() };
            addChatMessage(buddyResponse);
        } catch (error) {
            console.error("Error getting chat response:", error);
            const errorMessage: ChatMessage = { id: `buddy-err-${Date.now()}`, text: "I'm having a little trouble connecting right now. Please try again in a moment.", sender: 'buddy', timestamp: new Date() };
            addChatMessage(errorMessage);
        } finally {
            setIsBuddyTyping(false);
        }
    };
    
    return (
        <div className="h-full w-full flex flex-col relative overflow-x-hidden text-[--text-primary]">
            <div className="absolute inset-0 z-0 pointer-events-none">
                 {[...Array(3)].map((_, i) => (
                    <div key={i} className="absolute h-0.5 w-24 bg-gradient-to-l from-white to-transparent rounded-full animate-shooting-star" style={{
                        top: `${Math.random() * 60}%`,
                        right: '-50vw',
                        animationDuration: `${3 + Math.random() * 4}s`,
                        animationDelay: `${Math.random() * 12}s`,
                    }}></div>
                ))}
                 {[...Array(15)].map((_, i) => (
                    <div key={i} className="absolute top-0 left-0 w-px h-px bg-white/70 rounded-full animate-slow-drift" style={{
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`,
                        animationDelay: `${Math.random() * 30}s`, animationDuration: `${20 + Math.random() * 20}s`
                    }}/>
                 ))}
            </div>

            <div className="relative flex flex-col h-full p-6 pt-10 z-10">
                <header className="text-center mb-4 flex-shrink-0">
                    <h2 className="font-light text-sm tracking-widest opacity-80 uppercase text-[--text-secondary]">The Lunar Realm</h2>
                    <h1 className="font-sans text-3xl font-bold opacity-90 text-[--text-header]">AI Companion</h1>
                </header>
                
                <div ref={scrollContainerRef} className="flex-grow overflow-y-auto mb-4 pr-2 space-y-4 pb-28">
                    {chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl shadow-lg ${
                                msg.sender === 'user' 
                                ? 'bg-indigo-500 text-white rounded-br-lg' 
                                : 'glassmorphism text-[--text-on-glass] rounded-bl-lg'
                            }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isBuddyTyping && (
                         <div className="flex justify-start animate-fade-in-up">
                            <div className="max-w-[85%] p-3 rounded-2xl glassmorphism rounded-bl-lg">
                                <div className="flex items-center space-x-2.5 px-2">
                                    <span className="w-2 h-2 bg-indigo-200 rounded-full animate-pulsing-star" style={{ animationDelay: '0s' }}></span>
                                    <span className="w-2 h-2 bg-indigo-200 rounded-full animate-pulsing-star" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="w-2 h-2 bg-indigo-200 rounded-full animate-pulsing-star" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="absolute bottom-28 left-6 right-6">
                    <div className="relative">
                        <input
                            type="text" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()}
                            placeholder="Message Lehsa..."
                            className="w-full p-4 pr-12 glassmorphism border-none rounded-full focus:ring-2 focus:ring-indigo-400 text-[--text-on-glass] placeholder:text-[--text-on-glass]/60 transition-shadow duration-300 focus:shadow-[0_0_15px_rgba(129,140,248,0.5)]"
                            disabled={isBuddyTyping}
                        />
                        <button onClick={handleSend} disabled={isBuddyTyping || userInput.trim() === ''} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed transition-transform active:scale-90">
                            <SendIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatScreen;
