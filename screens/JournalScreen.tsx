import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { summarizeJournalEntries } from '../services/geminiService';
import { TrashIcon, ImageIcon, XCircleIcon } from '../components/Icons';

const JournalScreen: React.FC = () => {
  const { journals, addJournal, affirmations, addAffirmation, deleteAffirmation } = useAppContext();
  const [entryText, setEntryText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState('');
  const [affirmationText, setAffirmationText] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if ((entryText.trim() === '' && !image) || isSaving) return;
    setIsSaving(true);
    await addJournal(entryText, selectedMood || undefined, image, imageCaption);
    setEntryText('');
    setSelectedMood(null);
    setImage(null);
    setImageCaption('');
    setIsSaving(false);
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setShowSummaryModal(true);
    setSummary(null);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentJournals = journals.filter(j => new Date(j.timestamp) > oneWeekAgo);

    if (recentJournals.length === 0) {
        setSummary("You don't have any journal entries from the last 7 days to summarize.");
        setIsSummarizing(false);
        return;
    }

    const summaryText = await summarizeJournalEntries(recentJournals);
    setSummary(summaryText);
    setIsSummarizing(false);
  };

  const handleAddAffirmation = () => {
    if (affirmationText.trim() === '') return;
    addAffirmation(affirmationText.trim());
    setAffirmationText('');
  };

  const moods = ['😊', '😢', '😐', '😩', '😌'];
  const moodDescriptions: { [key: string]: string } = {
      '😊': 'Happy',
      '😢': 'Sad',
      '😐': 'Neutral',
      '😩': 'Stressed',
      '😌': 'Calm',
  };

  return (
    <div className="h-full w-full flex flex-col p-6 pt-10 relative overflow-x-hidden text-[--text-primary]">
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute rounded-full animate-firefly-glow" style={{
                top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, 
                width: `${Math.random() * 3 + 2}px`, height: `${Math.random() * 3 + 2}px`, 
                animationDelay: `${Math.random() * 8}s`, animationDuration: `${3 + Math.random() * 5}s`
            }}/>
        ))}
      </div>

      <header className="text-center z-20 mb-6 flex-shrink-0">
        <h2 className="font-light text-sm tracking-widest opacity-80 uppercase text-[--text-secondary]">The Forest Realm</h2>
        <h1 className="font-sans text-3xl font-bold opacity-90 text-[--text-header]">Reflective Journal</h1>
      </header>

      <main className="z-20 flex-grow w-full max-w-md mx-auto overflow-y-auto space-y-5 pb-28 pr-1">
        <div className="glassmorphism p-4 rounded-3xl shadow-lg space-y-4">
          <textarea
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
            placeholder="Let your thoughts flow..."
            className="w-full h-32 p-3 bg-transparent border border-white/20 rounded-2xl focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none text-[--text-on-glass] placeholder:text-[--text-on-glass]/60 resize-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(74,222,128,0.5)]"
            disabled={isSaving}
          />
          {image && (
            <div className="animate-fade-in-up space-y-2">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                <img src={image} alt="Journal preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => { setImage(null); setImageCaption(''); }} 
                  className="absolute top-1 right-1 text-white bg-black/50 rounded-full"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Add a caption..."
                className="w-full p-2 bg-transparent border border-white/20 rounded-lg focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none text-[--text-on-glass] placeholder:text-[--text-on-glass]/60 text-sm"
              />
            </div>
          )}
          <div>
            <p className="text-center text-sm opacity-80 mb-3">How are you feeling?</p>
            <div className="flex justify-around">
              {moods.map(mood => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`text-3xl transition-transform duration-200 ease-in-out ${selectedMood === mood ? 'scale-125' : 'scale-100 opacity-60 hover:opacity-100'}`}
                  aria-label={moodDescriptions[mood]}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isSaving}
                className="p-3 bg-green-500/30 text-white rounded-2xl hover:bg-green-400/30 transition-all duration-300 active:scale-95 disabled:bg-gray-500/50"
                aria-label="Attach Image"
            >
                <ImageIcon className="w-6 h-6" />
            </button>
            <button 
              onClick={handleSave} 
              disabled={isSaving || (entryText.trim() === '' && !image)} 
              className={`w-full bg-green-500/80 text-white py-3 rounded-2xl font-semibold hover:bg-green-400/80 transition-all duration-300 disabled:bg-gray-500/50 active:scale-95 ${isSaving ? 'animate-pulsing-glow' : ''}`}
              style={{ '--glow-color': 'rgba(74, 222, 128, 0.6)' } as React.CSSProperties}
            >
              {isSaving ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </div>
        
        <div className="glassmorphism p-4 rounded-3xl shadow-lg space-y-3">
            <h3 className="text-lg font-sans font-semibold text-center text-green-200">Daily Affirmations</h3>
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={affirmationText}
                    onChange={(e) => setAffirmationText(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleAddAffirmation()}
                    placeholder="e.g., I am worthy of peace."
                    className="flex-grow p-2.5 bg-transparent border border-white/20 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none text-[--text-on-glass] placeholder:text-[--text-on-glass]/60"
                />
                <button
                    onClick={handleAddAffirmation}
                    disabled={!affirmationText.trim()}
                    className="bg-green-500/80 text-white px-5 rounded-lg font-semibold hover:bg-green-400/80 transition-all duration-300 active:scale-95 disabled:bg-gray-500/50"
                >
                    Add
                </button>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {affirmations.length > 0 ? (
                    affirmations.map(affirmation => (
                        <div key={affirmation.id} className="glassmorphism p-2.5 rounded-lg flex items-center justify-between animate-fade-in-up">
                            <p className="text-sm flex-grow">{affirmation.text}</p>
                            <button onClick={() => deleteAffirmation(affirmation.id)} className="opacity-70 hover:text-red-400 transition-colors ml-2 flex-shrink-0" aria-label={`Delete affirmation`}>
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-sm opacity-60 pt-2">Add your first affirmation.</p>
                )}
            </div>
        </div>

        <div className="glassmorphism p-4 rounded-3xl shadow-lg space-y-3">
          <h3 className="text-lg font-sans font-semibold text-center text-green-200">Past Reflections</h3>
           <button 
              onClick={handleSummarize} 
              disabled={isSummarizing}
              className={`w-full bg-green-500/50 text-white py-2.5 mb-2 rounded-xl font-semibold hover:bg-green-400/50 transition-all duration-300 disabled:bg-gray-500/50 active:scale-95 ${isSummarizing ? 'animate-pulsing-glow' : ''}`}
              style={{ '--glow-color': 'rgba(74, 222, 128, 0.4)' } as React.CSSProperties}
            >
              {isSummarizing ? 'Reflecting...' : 'Summarize Last 7 Days'}
            </button>
          <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
            {journals.length > 0 ? (
              journals.map(entry => (
                <div key={entry.id} className="bg-green-50/10 p-4 rounded-xl animate-fade-in-up">
                  {entry.imageUrl && (
                    <div className="mb-3">
                        <img src={entry.imageUrl} alt="Journal entry" className="w-full h-40 object-cover rounded-lg" />
                        {entry.imageCaption && (
                            <p className="text-xs italic opacity-80 mt-1.5 text-center">{entry.imageCaption}</p>
                        )}
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold opacity-70">
                      {new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                    {entry.mood && <span className="text-2xl">{entry.mood}</span>}
                  </div>
                  <p className="text-sm mb-3 whitespace-pre-wrap">{entry.text}</p>
                  {entry.reflection && (
                    <div className="border-t border-green-300/20 pt-3 mt-3">
                      <p className="text-xs font-bold text-green-300 mb-1">Lehsa's Reflection</p>
                      <p className="text-sm italic opacity-80">{entry.reflection}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-sm opacity-60 pt-2">Your journal entries will appear here.</p>
            )}
          </div>
        </div>
      </main>
      
      {showSummaryModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="glassmorphism border-green-400/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-[--text-on-glass] animate-modal-in">
                    <h2 className="text-xl font-sans font-bold text-center mb-4 text-green-300">Your Weekly Reflection</h2>
                    
                    {isSummarizing || !summary ? (
                        <div className="flex flex-col items-center justify-center h-48">
                            <div 
                                className="w-8 h-8 rounded-full animate-firefly-glow"
                                style={{ 
                                    backgroundColor: 'rgba(220, 230, 200, 0.8)',
                                    animationDuration: '2s'
                                }}
                            ></div>
                            <p className="mt-4 text-sm opacity-80 animate-pulse">Lehsa is reflecting on your week...</p>
                        </div>
                    ) : (
                        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
                            <p className="text-sm whitespace-pre-wrap leading-relaxed opacity-90">{summary}</p>
                        </div>
                    )}

                    <button 
                        onClick={() => setShowSummaryModal(false)} 
                        className="w-full mt-6 bg-green-500/80 text-white py-2.5 rounded-xl font-semibold hover:bg-green-400/80 transition-colors disabled:opacity-50"
                        disabled={isSummarizing}
                    >
                        Close
                    </button>
                </div>
            </div>
      )}
    </div>
  );
};

export default JournalScreen;