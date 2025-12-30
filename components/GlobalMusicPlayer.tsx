
import React, { useEffect, useState, useRef } from 'react';
import { useMusicContext } from '../context/AppContext';
import { NextTrackIcon, PreviousTrackIcon } from './Icons';

const GlobalMusicPlayer: React.FC = () => {
    const { 
        currentTrack, 
        currentAlbum, 
        isPlaying, 
        isBuffering,
        togglePlayPause, 
        playNext,
        playPrevious,
        audioRef, 
        videoRef 
    } = useMusicContext();
    
    const [progress, setProgress] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
        };
        const handleEnded = () => playNext();
        const handleLoadStart = () => setProgress(0);

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('loadstart', handleLoadStart);
        
        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('loadstart', handleLoadStart);
        };
    }, [audioRef, playNext]);

    useEffect(() => {
        if(containerRef.current && currentTrack) {
            containerRef.current.style.transform = 'translateY(20px) scale(0.95)';
            containerRef.current.style.opacity = '0';
            setTimeout(() => {
                 if (containerRef.current) {
                    containerRef.current.style.transform = 'translateY(0) scale(1)';
                    containerRef.current.style.opacity = '1';
                 }
            }, 50);
        }
    }, [currentTrack]);
    
    if (!currentTrack) return null;

    return (
        <>
            <div 
                ref={containerRef} 
                className="fixed left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-40 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] global-music-player"
                style={{ bottom: `calc(6.5rem + env(safe-area-inset-bottom, 0px))` }}
            >
                <div className="glassmorphism rounded-3xl p-3 flex items-center shadow-2xl relative overflow-hidden border border-white/20">
                    <div className="absolute top-0 left-0 h-full bg-white/5 pointer-events-none" style={{ width: `${progress}%` }}></div>
                    <div className="absolute bottom-0 left-0 h-1 bg-[--accent-color] opacity-60 transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
                    
                    <div className="relative w-12 h-12 flex-shrink-0">
                        <img src={currentAlbum?.coverArt} alt={currentAlbum?.title} className={`w-full h-full rounded-2xl object-cover shadow-lg ${isPlaying ? 'animate-pulse' : ''}`} />
                        {isBuffering && (
                            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 mx-4 overflow-hidden">
                        <p className="text-white font-black text-sm truncate uppercase tracking-tight">{currentTrack?.title}</p>
                        <p className="text-white/50 text-[10px] truncate font-bold uppercase tracking-widest">{currentAlbum?.artist}</p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <button onClick={playPrevious} className="w-8 h-8 flex items-center justify-center opacity-60 hover:opacity-100 active:scale-90 transition-all">
                            <PreviousTrackIcon className="w-4 h-4" />
                        </button>
                        <button onClick={togglePlayPause} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all active:scale-90">
                            {isPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.07v3.86a1 1 0 001.555.832l3.197-1.93a1 1 0 000-1.664l-3.197-1.93z" clipRule="evenodd" /></svg>
                            )}
                        </button>
                        <button onClick={playNext} className="w-8 h-8 flex items-center justify-center opacity-60 hover:opacity-100 active:scale-90 transition-all">
                            <NextTrackIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
            <audio ref={audioRef} crossOrigin="anonymous" playsInline />
            <video ref={videoRef} crossOrigin="anonymous" loop muted playsInline style={{ display: 'none' }} />
        </>
    );
};

export default GlobalMusicPlayer;
