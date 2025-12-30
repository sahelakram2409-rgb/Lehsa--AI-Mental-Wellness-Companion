
import { GoogleGenAI, Modality } from "@google/genai";
import { JournalEntry, ChatMessage } from '../types';

// Per coding guidelines, we create the client right before use
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getChatResponse = async (history: ChatMessage[], newMessage: string, journalContext: string, userCountry: string, userAge: number | null, userGender: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const chatHistory = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        const profileContextParts = [];
        if (userAge) profileContextParts.push(`${userAge} years old`);
        if (userGender) profileContextParts.push(userGender);
        if (userCountry) profileContextParts.push(`from ${userCountry}`);
        const profileContext = profileContextParts.length > 0 ? `The user is ${profileContextParts.join(', ')}.` : 'The user is from an unspecified location.';

        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            history: chatHistory,
            config: {
                systemInstruction: `You are Lehsa, a compassionate AI wellness companion. ${profileContext} Be supportive, empathetic, and a good listener. Use the provided journal context to be aware of the user's state. Be subtle and never mention the journal directly.

IMPORTANT: If the user expresses severe distress, mentions self-harm, or asks for help, you MUST provide relevant, local crisis helpline numbers for their country (${userCountry}). If their country is unspecified, provide a few major international helpline numbers.

Journal Context:
${journalContext || "No recent journal entries."}`
            }
        });
        
        const response = await chat.sendMessage({ message: newMessage });
        return response.text.trim();
    } catch (error) {
        console.error("Error getting chat response:", error);
        return "I'm having a little trouble connecting right now, but I'm still here to listen.";
    }
};

export const analyzeJournalEntry = async (entryText: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const prompt = `You are a gentle and insightful AI wellness companion. Read the following journal entry and provide a short, compassionate, and constructive reflection on it. Focus on identifying emotions, patterns, or underlying themes without being judgmental. Keep the reflection to 2-3 sentences.

Journal Entry:
"${entryText}"

Your Reflection:`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error analyzing journal entry:", error);
        return "Thank you for sharing your thoughts. Taking the time to reflect is a wonderful step.";
    }
};

export const suggestGoalFromJournal = async (entryText: string): Promise<string | null> => {
    try {
        const ai = getAiClient();
        const prompt = `Analyze the following journal entry. If there's a clear opportunity for a small, actionable, and positive personal growth goal, suggest one. The goal should be phrased as a concise action. If no clear goal emerges, respond with "null".

Journal Entry:
"${entryText}"

Suggested Goal:`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        const suggestion = response.text.trim();
        return suggestion.toLowerCase() === 'null' ? null : suggestion;
    } catch (error) {
        console.error("Error suggesting goal:", error);
        return null;
    }
}

export const summarizeJournalEntries = async (entries: JournalEntry[]): Promise<string> => {
    if (entries.length === 0) return "There are no recent entries to summarize.";

    try {
        const ai = getAiClient();
        const formattedEntries = entries
            .map(entry => `Date: ${entry.timestamp.toLocaleDateString()}\nEntry: ${entry.text}\n`)
            .join('\n---\n');

        const prompt = `You are Lehsa, a compassionate AI wellness companion. The user has requested a summary of their journal entries from the past week. Please read the following entries and provide a gentle, insightful summary.

Journal Entries:
${formattedEntries}

Your Weekly Summary:`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error summarizing journal entries:", error);
        return "I'm having a little trouble reflecting on your entries right now.";
    }
};

export const getMeditationAudio = async (script: string): Promise<string | null> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: script }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("Error generating meditation audio:", error);
        return null;
    }
};
