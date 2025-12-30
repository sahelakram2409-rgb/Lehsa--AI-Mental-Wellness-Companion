
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const GrowthToast: React.FC = () => {
    const { recentXPEvent } = useAppContext();
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState<{ amount: number, reason: string } | null>(null);

    useEffect(() => {
        if (recentXPEvent) {
            setData(recentXPEvent);
            setVisible(true);
            // Flash for only 1.2s total. Fast and clean.
            const timer = setTimeout(() => setVisible(false), 1200);
            return () => clearTimeout(timer);
        }
    }, [recentXPEvent]);

    if (!data) return null;

    return (
        <div 
            className={`fixed bottom-28 right-6 z-[100] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] transform ${visible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}
        >
            <div className="glassmorphism pl-3 pr-6 py-2 rounded-2xl flex items-center space-x-3 shadow-xl border-l-4 border-orange-400 overflow-hidden group">
                <div className="absolute inset-0 shimmer-effect opacity-10 pointer-events-none"></div>
                
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-white text-[10px] font-black">+{data.amount}</span>
                </div>
                
                <div className="flex flex-col">
                    <p className="text-[9px] font-black uppercase tracking-widest text-orange-600/70 leading-none mb-1">XP</p>
                    <p className="text-sm font-bold text-slate-800 leading-tight truncate max-w-[140px]">{data.reason}</p>
                </div>
            </div>
        </div>
    );
};

export default GrowthToast;
