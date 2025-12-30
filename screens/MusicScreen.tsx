
import React, { useState, useEffect, useRef } from 'react';
import { useMusicContext, useAppContext } from '../context/AppContext';
import { Album, Track, Screen } from '../types';

const natureArt = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdSQSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhNDAyNTsiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMmQ1ODNlOyIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNnUkEpIiAvPjxwYXRoIGQ9Ik0wIDEwMCBRNTAgNTAgMTAwIDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYTRmYzU3IiBzdHJva2Utd2lkdGg9IjUiIG9wYWNpdHk9IjAuNSIgLz48L3N2Zz4=';
const zenArt = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InpSQSIgeDE9IjAlIiB5MT0iMTAwJSIgeDI9IjEwMCUiIHkyPSIwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzE3MTUzYjsiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMmUyYjVlOyIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCN6UkEpIiAvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuMyIgLz48L3N2Zz4=';

// Video Sources
const VIDEO_STARS = 'https://v.ftcdn.net/04/81/47/44/700_F_481474421_mXqL14k7W0fIq9tK6E2zK9I2n4S5e2hU_ST.mp4';
const VIDEO_OCEAN = 'https://v.ftcdn.net/01/71/18/76/700_F_171187652_N5wS3A8FkU1D8rY9rK0qE2zW9zN4oP8A_ST.mp4';

// High-quality, stable public domain ambient tracks. These sources are known to be reliable.
const albums: Album[] = [
  { 
    id: 'album-earth', 
    title: 'Earthly Echoes', 
    artist: 'Nature Series', 
    coverArt: natureArt, 
    tracks: [
      { title: 'Forest Dawn', audioSrc: 'https://actions.google.com/sounds/v1/ambient/forest_ambience.ogg', videoSrc: VIDEO_OCEAN },
      { title: 'Morning Songbirds', audioSrc: 'https://actions.google.com/sounds/v1/ambient/morning_birds.ogg', videoSrc: VIDEO_OCEAN },
      { title: 'Gentle Rain', audioSrc: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg', videoSrc: VIDEO_OCEAN },
      { title: 'Rolling Waves', audioSrc: 'https://actions.google.com/sounds/v1/water/ocean_waves.ogg', videoSrc: VIDEO_OCEAN },
      { title: 'Soft Breezes', audioSrc: 'https://actions.google.com/sounds/v1/weather/soft_wind.ogg', videoSrc: VIDEO_OCEAN },
    ] 
  },
  { 
    id: 'album-zen', 
    title: 'Ethereal Space', 
    artist: 'Cosmic Series', 
    coverArt: zenArt, 
    tracks: [
      { title: 'Celestial Echo', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', videoSrc: VIDEO_STARS },
      { title: 'Star Drift', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', videoSrc: VIDEO_STARS },
      { title: 'Lunar Meditation', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', videoSrc: VIDEO_STARS },
      { title: 'Nebula Dream', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', videoSrc: VIDEO_STARS },
      { title: 'Silent Cosmos', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', videoSrc: VIDEO_STARS },
    ] 
  }
];

const AudioVisualizer: React.FC = () => {
    const { analyser, isPlaying } = useMusicContext();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!analyser || !canvasRef.current || !isPlaying) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let animationFrameId: number;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const renderFrame = () => {
            animationFrameId = requestAnimationFrame(renderFrame);
            analyser.getByteFrequencyData(dataArray);
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);
            const radius = Math.min(width, height) / 3.5;
            const centerX = width / 2;
            const centerY = height / 2;
            ctx.beginPath();
            const startAngle = -Math.PI / 2;
            const startR = radius * (1 + (dataArray[0] / 255) * 0.4);
            ctx.moveTo(centerX + startR * Math.cos(startAngle), centerY + startR * Math.sin(startAngle));
            for (let i = 0; i < bufferLength; i++) {
                const angle = (i / bufferLength) * Math.PI * 2 - Math.PI / 2;
                const R = radius * (1 + (dataArray[i] / 255) * 0.4);
                ctx.lineTo(centerX + R * Math.cos(angle), centerY + R * Math.sin(angle));
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 3;
            ctx.stroke();
        };
        renderFrame();
        return () => cancelAnimationFrame(animationFrameId);
    }, [analyser, isPlaying]);

    return <canvas ref={canvasRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-40 pointer-events-none z-0" />;
};

const MusicScreen: React.FC = () => {
  const { playTrack, currentTrack, isPlaying, isBuffering } = useMusicContext();
  const { logUserAction, getRealmMoodText } = useAppContext();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const handlePlayTrack = (album: Album, track: Track) => {
      playTrack(album, track);
      logUserAction('music_track_played', { track: track.title });
  }

  return (
    <div className="h-full w-full flex flex-col p-6 relative overflow-x-hidden text-[--text-primary]" style={{ paddingTop: `calc(2.5rem + env(safe-area-inset-top, 0px))` }}>
      <header className="text-center z-10 mb-6 flex-shrink-0 animate-fade-in-up">
        <h2 className="font-light text-[10px] tracking-[0.3em] uppercase opacity-80 text-[--text-secondary] mb-1">Starlight Resonance</h2>
        <h1 className="font-sans text-3xl font-black opacity-90 text-[--text-header] tracking-tight">Mind Calming Music</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[--accent-color] mt-2">{getRealmMoodText(Screen.Music)}</p>
      </header>
      
      <main className="z-10 flex-grow w-full max-w-2xl mx-auto overflow-y-auto no-scrollbar pr-1" style={{ paddingBottom: `calc(10rem + env(safe-area-inset-bottom, 0px))` }}>
        {!selectedAlbum ? (
            <div className="space-y-10 animate-fade-in-up">
                {albums.map(album => (
                    <div key={album.id}>
                        <div className="flex justify-between items-end mb-4 px-2">
                             <h3 className="text-xl font-black tracking-tight">{album.title}</h3>
                             <button onClick={() => setSelectedAlbum(album)} className="text-[10px] font-black uppercase tracking-widest text-[--accent-color] hover:underline">View All</button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {album.tracks.slice(0, 2).map(track => (
                                <div 
                                    key={track.title}
                                    onClick={() => handlePlayTrack(album, track)}
                                    className={`aspect-[4/3] glassmorphism rounded-[2rem] p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95 group relative overflow-hidden ${currentTrack?.title === track.title ? 'ring-2 ring-[--accent-color]' : ''}`}
                                >
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">{album.artist}</span>
                                    <span className="font-black leading-tight text-sm tracking-tight">{track.title}</span>
                                    {currentTrack?.title === track.title && (isPlaying || isBuffering) && (
                                        <div className="mt-3 flex space-x-1.5 items-center">
                                            {isBuffering ? (
                                                <div className="w-4 h-4 border-2 border-[--accent-color] border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <div className="w-1 h-3 bg-[--accent-color] rounded-full animate-bounce"></div>
                                                    <div className="w-1 h-4 bg-[--accent-color] rounded-full animate-bounce delay-75"></div>
                                                    <div className="w-1 h-3 bg-[--accent-color] rounded-full animate-bounce delay-150"></div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="animate-fade-in-up">
                <button onClick={() => setSelectedAlbum(null)} className="glassmorphism text-[10px] font-black tracking-[0.2em] uppercase py-2 px-5 rounded-full mb-8 flex items-center gap-2 hover:bg-white/10 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                    Back to Library
                </button>
                <div className="flex flex-col md:flex-row gap-10">
                    <div className="md:w-56 text-center">
                        <div className="aspect-square glassmorphism rounded-[3rem] overflow-hidden shadow-2xl mb-6 p-2 relative group">
                            <img src={selectedAlbum.coverArt} className="w-full h-full object-cover rounded-[2.5rem] group-hover:scale-105 transition-transform duration-1000" alt={selectedAlbum.title} />
                            <div className="absolute inset-0 bg-black/10 rounded-[2.5rem]"></div>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight">{selectedAlbum.title}</h3>
                        <p className="text-[10px] opacity-40 uppercase font-black tracking-[0.2em] mt-2">{selectedAlbum.artist}</p>
                    </div>
                    <div className="flex-grow space-y-3">
                        {selectedAlbum.tracks.map((track, i) => {
                            const isCurrent = currentTrack?.title === track.title;
                            return (
                                <div 
                                    key={track.title}
                                    onClick={() => handlePlayTrack(selectedAlbum, track)}
                                    className={`glassmorphism p-5 rounded-[1.5rem] flex items-center justify-between cursor-pointer group transition-all duration-300 ${isCurrent ? 'bg-white/10 shadow-lg' : 'hover:bg-white/5 opacity-80 hover:opacity-100'}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <span className={`text-[10px] font-black w-4 opacity-30 ${isCurrent ? 'text-[--accent-color] opacity-100' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
                                        <div>
                                            <p className={`font-bold text-base transition-colors tracking-tight ${isCurrent ? 'text-[--accent-color]' : ''}`}>{track.title}</p>
                                            <p className="text-[9px] opacity-40 font-black uppercase tracking-widest mt-1">Peaceful Session Ambient</p>
                                        </div>
                                    </div>
                                    {isCurrent && isBuffering ? (
                                        <div className="w-5 h-5 border-2 border-[--accent-color] border-t-transparent rounded-full animate-spin"></div>
                                    ) : isCurrent && isPlaying ? (
                                        <div className="w-8 h-8 rounded-full bg-[--accent-color]/20 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-[--accent-color]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.07v3.86a1 1 0 001.555.832l3.197-1.93a1 1 0 000-1.664l-3.197-1.93z" clipRule="evenodd" /></svg>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )}
      </main>
      {isPlaying && <AudioVisualizer />}
    </div>
  );
};

export default MusicScreen;
