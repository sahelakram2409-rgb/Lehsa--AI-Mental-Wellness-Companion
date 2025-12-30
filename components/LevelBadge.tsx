
import React from 'react';
import { useAppContext } from '../context/AppContext';

const LevelBadge: React.FC = () => {
    const { level, xp, xpToNextLevel } = useAppContext();
    const progress = ((500 - xpToNextLevel) / 500) * 100;

    const rankNames = [
        "Quiet Seedling", "Sturdy Sprout", "Kind Sapling", "Resilient Blossom", 
        "Spirit Oak", "Cosmic Florist", "Zen Guardian", "Eternal Gardener"
    ];
    const currentRank = rankNames[Math.min(level - 1, rankNames.length - 1)];

    return (
        <div className="flex flex-col items-end pr-1">
            <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                    <p className="text-[9px] uppercase tracking-[0.1em] opacity-60 font-black text-slate-500">Maturity {level}</p>
                    <p className="text-[11px] font-black text-[--text-header] tracking-tight">{currentRank}</p>
                </div>
                <div className="relative w-12 h-12 flex items-center justify-center group">
                    <div className="absolute inset-0 bg-[--accent-color]/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="24" cy="24" r="21" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="3" />
                        <circle 
                            cx="24" cy="24" r="21" fill="none" 
                            stroke="var(--accent-color)" 
                            strokeWidth="3.5" 
                            strokeDasharray={132}
                            strokeDashoffset={132 - (132 * progress) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="relative w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden border border-slate-100">
                        <div className="absolute inset-0 shimmer-effect opacity-10"></div>
                        <span className="text-sm font-black text-[--accent-color]">{level}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LevelBadge;
