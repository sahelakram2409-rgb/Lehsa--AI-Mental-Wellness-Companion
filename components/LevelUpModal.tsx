
import React from 'react';
import { useAppContext } from '../context/AppContext';

const LevelUpModal: React.FC = () => {
    const { showLevelUp, closeLevelUp, userName } = useAppContext();

    if (showLevelUp === null) return null;

    const rankNames = [
        "Quiet Seedling", "Sturdy Sprout", "Kind Sapling", "Resilient Blossom", 
        "Spirit Oak", "Cosmic Florist", "Zen Guardian", "Eternal Gardener"
    ];
    const currentRank = rankNames[Math.min(showLevelUp - 1, rankNames.length - 1)];

    return (
        <div 
            className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-fade-in"
            onClick={closeLevelUp}
        >
            <div 
                className="glassmorphism rounded-[3rem] p-8 max-w-sm w-full shadow-2xl text-center border border-white/20 animate-bloom-in relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute inset-0 shimmer-effect opacity-10 pointer-events-none"></div>
                
                <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50 group">
                        <span className="text-5xl font-black text-white group-hover:scale-110 transition-transform">{showLevelUp}</span>
                    </div>
                </div>

                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-orange-500 mb-2">New Maturity Stage</h2>
                <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-tight leading-none">
                    {currentRank}
                </h1>
                
                <div className="bg-slate-50/50 rounded-2xl p-4 mb-8 italic text-slate-600 text-sm border border-slate-200/50 leading-relaxed">
                    "Growth is a gradual bloom, {userName}. Every day you show up, you are nurturing the garden of your soul."
                </div>

                <button 
                    onClick={closeLevelUp}
                    className="w-full bg-[--accent-color] text-white py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all hover:brightness-110"
                >
                    Keep Growing
                </button>
            </div>
        </div>
    );
};

export default LevelUpModal;
