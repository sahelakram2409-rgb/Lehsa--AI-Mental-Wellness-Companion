
import React, { useEffect, useState } from 'react';

export type ConfettiType = 'stars' | 'leaves' | 'flowers' | 'standard' | 'none';

interface ConfettiPiece {
  id: number;
  startX: number;
  startY: number;
  color: string;
  size: number;
  content: React.ReactNode;
  rotation: number;
  duration: number;
  delay: number;
  side: 'left' | 'right';
}

const COLORS = {
  stars: ['#fbbf24', '#f59e0b', '#ffffff'],
  leaves: ['#4ade80', '#22c55e', '#16a34a'],
  flowers: ['#f472b6', '#ec4899', '#fbcfe8'],
  standard: ['#818cf8', '#6366f1', '#a5b4fc'],
};

const Confetti: React.FC<{ trigger: boolean; type?: ConfettiType }> = ({ trigger, type = 'standard' }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (trigger && type !== 'none') {
      const activeType = type as keyof typeof COLORS;
      const count = activeType === 'stars' ? 40 : 25;
      
      const newPieces = Array.from({ length: count }).map((_, i) => {
        const side = Math.random() > 0.5 ? 'left' : 'right';
        return {
          id: Date.now() + i,
          // Spawn from top shoulders
          startX: side === 'left' ? -10 : 110,
          startY: Math.random() * 20 - 10,
          color: COLORS[activeType][Math.floor(Math.random() * COLORS[activeType].length)],
          size: Math.random() * 12 + 14,
          rotation: Math.random() * 360,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 1.5,
          side: side,
          content: getPieceContent(activeType as ConfettiType),
        };
      });
      
      setPieces(newPieces);
      const timer = setTimeout(() => setPieces([]), 6000);
      return () => clearTimeout(timer);
    }
  }, [trigger, type]);

  function getPieceContent(t: ConfettiType) {
    switch (t) {
      case 'stars': return '★';
      case 'flowers': return '🌸';
      case 'leaves': return '🍃';
      default: return '✦';
    }
  }

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute side-drift-fall"
          style={{
            left: `${p.startX}%`,
            top: `${p.startY}%`,
            '--drift-x': p.side === 'left' ? '55vw' : '-55vw',
            '--fall-y': '120vh',
            '--rot': `${p.rotation + (Math.random() > 0.5 ? 720 : -720)}deg`,
            '--dur': `${p.duration}s`,
            '--del': `${p.delay}s`,
            color: p.color,
            fontSize: `${p.size}px`,
            filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.4))',
          } as any}
        >
          {p.content}
        </div>
      ))}
      <style>{`
        @keyframes side-drift-fall {
          0% { 
            transform: translate(0, 0) rotate(0deg) scale(0);
            opacity: 0;
          }
          15% { 
            opacity: 1;
            transform: translate(calc(var(--drift-x) * 0.3), 10vh) rotate(45deg) scale(1.4);
          }
          50% {
            transform: translate(calc(var(--drift-x) * 0.6), 40vh) rotate(180deg) scale(1.1);
          }
          100% { 
            transform: translate(var(--drift-x), var(--fall-y)) rotate(var(--rot)) scale(0.6);
            opacity: 0;
          }
        }
        .side-drift-fall {
          animation: side-drift-fall var(--dur) cubic-bezier(0.25, 0.1, 0.25, 1) var(--del) forwards;
        }
      `}</style>
    </div>
  );
};

export default Confetti;
