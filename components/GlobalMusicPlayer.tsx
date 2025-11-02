import React, { useEffect, useState, useRef } from 'react';
import { useMusicContext } from '../context/AppContext';
import { NextTrackIcon, PreviousTrackIcon } from './Icons';

const GlobalMusicPlayer: React.FC = () => {
    const { 
        currentTrack, 
        currentAlbum, 
        isPlaying, 
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
        const updateProgress = () => {
            if (audio && audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };
        const handleEnded = () => playNext();
        const handleLoadStart = () => setProgress(0);

        if (audio) {
            audio.addEventListener('timeupdate', updateProgress);
            audio.addEventListener('ended', handleEnded);
            audio.addEventListener('loadstart', handleLoadStart);
            return () => {
                audio.removeEventListener('timeupdate', updateProgress);
                audio.removeEventListener('ended', handleEnded);
                audio.removeEventListener('loadstart', handleLoadStart);
            };
        }
    }, [audioRef, playNext]);

    useEffect(() => {
        const container = containerRef.current;
        if(container && currentTrack) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(10px) scale(0.95)';
            setTimeout(() => {
                 container.style.opacity = '1';
                 container.style.transform = 'translateY(0) scale(1)';
            }, 100);
        }
    }, [currentTrack]);
    
    if (!currentTrack) return null;

    return (
        <>
            <div ref={containerRef} className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-40 transition-all duration-300 ease-out global-music-player">
                <div className="glassmorphism rounded-full p-2 flex items-center shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-purple-400/20" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
                    <div className="absolute bottom-0 left-0 h-0.5 bg-purple-400/80" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
                    
                    <img src={currentAlbum?.coverArt} alt={currentAlbum?.title} className="w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="flex-1 mx-3 overflow-hidden">
                        <p className="text-white font-semibold text-sm truncate">{currentTrack?.title}</p>
                        <p className="text-gray-300 text-xs truncate">{currentAlbum?.artist}</p>
                    </div>
                    <div className="flex items-center text-white z-10">
                        <button onClick={playPrevious} className="w-8 h-10 flex items-center justify-center opacity-80 hover:opacity-100">
                            <PreviousTrackIcon className="w-5 h-5" />
                        </button>
                        <button onClick={togglePlayPause} className="w-10 h-10 flex items-center justify-center">
                            {isPlaying ?
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg> :
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.07v3.86a1 1 0 001.555.832l3.197-1.93a1 1 0 000-1.664l-3.197-1.93z" clipRule="evenodd" /></svg>
                            }
                        </button>
                         <button onClick={playNext} className="w-8 h-10 flex items-center justify-center opacity-80 hover:opacity-100">
                            <NextTrackIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
            <audio ref={audioRef} playsInline />
            <video ref={videoRef} loop muted playsInline style={{ display: 'none' }} />
        </>
    );
};

export default GlobalMusicPlayer;