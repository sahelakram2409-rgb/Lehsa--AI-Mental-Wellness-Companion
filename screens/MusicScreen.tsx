import React, { useState, useEffect, useRef } from 'react';
import { useMusicContext, useAppContext } from '../context/AppContext';
import { Album, Track } from '../types';

const cosmicCoverArt = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImNvc21pY0dyYWQiIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIwJSIgeTI9IjAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMWQxYTNkOyIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzMDJiNjM7IiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2Nvc21pY0dyYWQpIiAvPjxwYXRoIGQ9Ik0xMCw5MCBRNDAsNzAgNTAsNDAgQzYwLDEwIDgwLDIwIDkwLDQwIiBzdHJva2U9IiM4MTg4Zjg3MCIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIiAvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjYwIiByPSIzIiBmaWxsPSIjYTViNGZjIiBvcGFjaXR5PSIwLjkiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjcwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC43IiAvPjwvc3ZnPg==';
const oceanicCoverArt = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Im9jZWFuR3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxZjQyNjM7IiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InNtopb3AtY29sb3I6IzJhM2E0YTsiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZGh0PSIxMDAiIGZpbGw9InVybCgjb2NlYW5HcmFkKSIgLz48cGF0aCBkPSJNLTEwLDUwIFEyNSwzNSA1MCw1MCBUMTEwLDUwIiBzdHJva2U9InJnYmEoMTM1LCAyMDYsIDI1MCwgMC41KSIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIiAvPjxwYXRoIGQ9Ik0tMTAsNjAgUTI1LDc1IDUwLDYwIFQxMTAsNjAiIHN0cm9rZT0icmdiYSgxMzUsIDIwNiwgMjUwLCAwLjMpIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiIC8+PGNpcmNsZSBjeD0iMjAiIGN5PSI3NSIgcj0iMyIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiAvPjxjaXJjbGUgY3g9IjgwIiBjeT0iODUiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgLz48L3N2Zz4=';
const raysOfReflectionCover = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InJlZmxlY3Rpb25HcmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I2E4YzRlMDsiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmNWQwYjk7IiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI3JlZmxlY3Rpb25HcmFkKSIgLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyNSIgZmlsbD0icmdiYSgyNTUsMjU1LDIyMCwwLjgpIiAvPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIC8+PC9zdmc+';
const auroraCoverArt = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImF1cm9yYURyZWFtIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMGUxYzJlOyIgLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMwMmI2MzsiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNWMyMmEzOyIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNhdXJvcmFEcmVhbSkiIC8+PHBhdGggZD0iTTAsNjAgUTUwLDQwIDEwMCw2MCIgc3Ryb2tlPSJyZ2JhKDIxNiwgMTkxLCAyMTYsIDAuNSkiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIgLz48cGF0aCBkPSJNMCw3NSBRNTAsNTUgMTAwLDc1IiBzdHJva2U9InJnYmEoMjE2LCAxOTEsIDIxNiwgMC4zKSIgc3Ryb2tlLXdpZHRoPSI1IiBmaWxsPSJub25lIiAvPjwvc3ZnPg==';
const forestWhispersCover = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImY2IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMjI1MjNkIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMmE2YjRhIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZGh0PSIxMDAiIGZpbGw9InVybCgjZjYpIi8+PHBhdGggZD0iTTMwIDgwIFYgNDAgQyAzMCwyNSA0MCwyNSA0MCw0MCBWIDgwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxNjMzMjIiIHN0cm9rZS13aWR0aD0iNCIvPjxwYXRoIGQ9Ik03MCA4MCBWIDUwIEMgNzAsMzUgODAsMzUgODAsNTAgViA4MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTYzMzIyIiBzdHJva2Utd2lkdGg9IjQiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIxMiIgZmlsbD0iIzM4ODIyOSIgZmlsbC1vcGFjaXR5PSIwLjciLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjUwIiByPSIxNSIgZmlsbD0iIzM4ODIyOSIgZmlsbC1vcGFjaXR5PSIwLjYiLz48L3N2Zz4=';
const sunsetSonataCover = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InN1bnNldEdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNGEwZTJhOyIgLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I2MzMjM2MTsiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjg5YjRmOyIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNzdW5zZXRHcmFkKSIgLz48Y2lyY2xlIGN4PSI1MCIgY3k9Ijg1IiByPSIzMCIgZmlsbD0icmdiYSgyNTEsIDE5MSwgMzYsIDAuNCkiIC8+PHJlY3QgeT0iNzAiIHdpZHRoPSIxMDAiIGhlaWdodD0iNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIiAvPjxyZWN0IHk9Ijc4IiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgLz48L3N2Zz4=';
const midnightMelodiesCover = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Im1pZG5pZ2h0R3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwZjBjMjk7IiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzIzMjA0NDsiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZGh0PSIxMDAiIGZpbGw9InVybCgjbWlkbmlnaHRHcmFkKSIgLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjI1IiByPSIxMiIgZmlsbD0iI2YxZjVmOSIgLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjQwIiByPSIxLjUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiIC8+PGNpcmNsZSBjeD0iMzUiIGN5PSIxNSIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOSIgLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjU1IiByPSIyIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC43IiAvPjxjaXJjbGUgY3g9Ijg1IiBjeT0iNzAiIHI9IjEiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiIC8+PC9zdmc+';
const gardenOfGrowthCover = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Imdyb3d0aEdyYWQiIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIwJSIgeTI9IjAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMWQxYTNkOyIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzMDJiNjM7IiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2dyb3d0aEdyYWQpIiAvPjxwYXRoIGQ9Ik0yMCw4MCBDNDAsNjAgMzAsMzAgNTAsMjAiIHN0cm9rZT0iIzgxOGNmOCIgc3Ryb2tlLXdpZHRoPSI1IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+PGNpcmNsZSBjeD0iNTAiIGN5PSIyMCIgcj0iOCIgZmlsbD0iI2E1YjRmYyIgLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjIwIiByPSIxNSIgZmlsbD0iI2E1YjRmYyIgb3BhY2l0eT0iMC4zIiAvPjwvc3ZnPg==';

const albums: Album[] = [
  { id: 'album1', title: 'Starlight Reflections', artist: 'Lehsa AI', coverArt: cosmicCoverArt, tracks: [
      { title: 'Orion\'s Belt', audioSrc: '/audio/track1-1.mp3', videoSrc: '/videos/video1.mp4' },
      { title: 'Celestial Choir', audioSrc: '/audio/track1-2.mp3', videoSrc: '/videos/video1.mp4' },
      { title: 'Whispers of the Void', audioSrc: '/audio/track1-3.mp3', videoSrc: '/videos/video1.mp4' },
      { title: 'Deep Sleep Supernova', audioSrc: '/audio/track1-4.mp3', videoSrc: '/videos/video1.mp4' },
  ] },
  { id: 'album2', title: 'Oceanic Serenity', artist: 'Lehsa AI', coverArt: oceanicCoverArt, tracks: [
      { title: 'Mariana', audioSrc: '/audio/track3-1.mp3', videoSrc: '/videos/video3.mp4' },
      { title: 'Siren\'s Call', audioSrc: '/audio/track3-2.mp3', videoSrc: '/videos/video3.mp4' },
      { title: 'Whale Song', audioSrc: '/audio/track3-3.mp3', videoSrc: '/videos/video3.mp4' },
      { title: 'Tidal Slumber', audioSrc: '/audio/track3-4.mp3', videoSrc: '/videos/video3.mp4' },
  ] },
  { id: 'album3', title: 'Rays of Reflection', artist: 'Lehsa AI', coverArt: raysOfReflectionCover, tracks: [
      { title: 'First Light', audioSrc: '/audio/track5-1.mp3', videoSrc: '/videos/video5.mp4' },
      { title: 'Morning Hymn', audioSrc: '/audio/track5-2.mp3', videoSrc: '/videos/video5.mp4' },
      { title: 'Sunbeam Meadow', audioSrc: '/audio/track5-3.mp3', videoSrc: '/videos/video5.mp4' },
      { title: 'Golden Hour Calm', audioSrc: '/audio/track5-4.mp3', videoSrc: '/videos/video5.mp4' },
  ] },
  { id: 'album4', title: 'Aurora Dreams', artist: 'Lehsa AI', coverArt: auroraCoverArt, tracks: [
      { title: 'Arctic Glow', audioSrc: '/audio/track7-1.mp3', videoSrc: '/videos/video7.mp4' },
      { title: 'Northern Lullaby', audioSrc: '/audio/track7-2.mp3', videoSrc: '/videos/video7.mp4' },
      { title: 'Ice Crystals Forming', audioSrc: '/audio/track7-3.mp3', videoSrc: '/videos/video7.mp4' },
      { title: 'Polar Night Peace', audioSrc: '/audio/track7-4.mp3', videoSrc: '/videos/video7.mp4' },
  ] },
  { id: 'album5', title: 'Forest Whispers', artist: 'Lehsa AI', coverArt: forestWhispersCover, tracks: [
      { title: 'Canopy', audioSrc: '/audio/track2-1.mp3', videoSrc: '/videos/video2.mp4' },
      { title: 'Druid\'s Chant', audioSrc: '/audio/track2-2.mp3', videoSrc: '/videos/video2.mp4' },
      { title: 'Rustling Leaves & Rain', audioSrc: '/audio/track2-3.mp3', videoSrc: '/videos/video2.mp4' },
      { title: 'Earthen Slumber', audioSrc: '/audio/track2-4.mp3', videoSrc: '/videos/video2.mp4' },
  ] },
  { id: 'album6', title: 'Sunset Sonata', artist: 'Lehsa AI', coverArt: sunsetSonataCover, tracks: [
      { title: 'Horizon', audioSrc: '/audio/track4-1.mp3', videoSrc: '/videos/video4.mp4' },
      { title: 'Evening Serenade', audioSrc: '/audio/track4-2.mp3', videoSrc: '/videos/video4.mp4' },
      { title: 'Crickets at Dusk', audioSrc: '/audio/track4-3.mp3', videoSrc: '/videos/video4.mp4' },
      { title: 'Crimson Rest', audioSrc: '/audio/track4-4.mp3', videoSrc: '/videos/video4.mp4' },
  ] },
  { id: 'album7', title: 'Midnight Melodies', artist: 'Lehsa AI', coverArt: midnightMelodiesCover, tracks: [
      { title: 'Nocturne', audioSrc: '/audio/track6-1.mp3', videoSrc: '/videos/video6.mp4' },
      { title: 'Moonlit Aria', audioSrc: '/audio/track6-2.mp3', videoSrc: '/videos/video6.mp4' },
      { title: 'Silent Night Wind', audioSrc: '/audio/track6-3.mp3', videoSrc: '/videos/video6.mp4' },
      { title: 'Deep Dreamscape', audioSrc: '/audio/track6-4.mp3', videoSrc: '/videos/video6.mp4' },
  ] },
  { id: 'album8', title: 'Garden of Growth', artist: 'Lehsa AI', coverArt: gardenOfGrowthCover, tracks: [
      { title: 'Bloom', audioSrc: '/audio/track8-1.mp3', videoSrc: '/videos/video8.mp4' },
      { title: 'Athem of Becoming', audioSrc: '/audio/track8-2.mp3', videoSrc: '/videos/video8.mp4' },
      { title: 'Gentle Spring Rain', audioSrc: '/audio/track8-3.mp3', videoSrc: '/videos/video8.mp4' },
      { title: 'Rest and Regrow', audioSrc: '/audio/track8-4.mp3', videoSrc: '/videos/video8.mp4' },
  ] },
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
        
        analyser.fftSize = 128;
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
            // Start from the right-most point on the circle
            const startAngle = -Math.PI / 2;
            const startR = radius * (1 + (dataArray[0] / 255) * 0.4);
            ctx.moveTo(centerX + startR * Math.cos(startAngle), centerY + startR * Math.sin(startAngle));

            dataArray.forEach((value, i) => {
                const p = value / 255; // percentage
                const angle = (i / bufferLength) * Math.PI * 2 - Math.PI / 2;
                const R = radius * (1 + p * 0.4);

                const x = centerX + R * Math.cos(angle);
                const y = centerY + R * Math.sin(angle);
                
                ctx.lineTo(x, y);
            });
            
            ctx.closePath();
            ctx.strokeStyle = 'rgba(236, 230, 255, 0.4)';
            ctx.lineWidth = 2;
            ctx.stroke();
        };

        renderFrame();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [analyser, isPlaying]);

    return (
        <canvas ref={canvasRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30 pointer-events-none" />
    );
};


const MusicScreen: React.FC = () => {
  const { playTrack, currentTrack, isPlaying } = useMusicContext();
  const { logUserAction } = useAppContext();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const handlePlayTrack = (album: Album, track: Track) => {
      playTrack(album, track);
      logUserAction('music_track_played', { album_title: album.title, track_title: track.title });
  }

  const renderAlbumGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fade-in-up">
        {albums.map((album) => (
        <div 
            key={album.id} 
            className="relative aspect-square cursor-pointer group"
            onClick={() => setSelectedAlbum(album)}
        >
            <img src={album.coverArt} alt={album.title} className="w-full h-full object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105" />
            <div 
            className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-2 text-center rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            >
                <p className="font-bold text-white text-sm">{album.title}</p>
                <p className="text-xs text-white/80">{album.artist}</p>
            </div>
        </div>
        ))}
    </div>
  );

  const renderTrackList = () => {
    if (!selectedAlbum) return null;
    return (
        <div className="animate-fade-in-up">
            <button onClick={() => setSelectedAlbum(null)} className="glassmorphism text-sm font-semibold py-2 px-4 rounded-full mb-4 transition-colors hover:bg-white/10">
                &larr; Back to Albums
            </button>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 w-full md:w-48">
                    <img src={selectedAlbum.coverArt} alt={selectedAlbum.title} className="w-full aspect-square object-cover rounded-2xl shadow-lg" />
                    <h3 className="text-lg font-bold mt-2">{selectedAlbum.title}</h3>
                    <p className="text-sm opacity-80">{selectedAlbum.artist}</p>
                </div>
                <div className="flex-grow space-y-2">
                    {selectedAlbum.tracks.map(track => (
                        <div 
                            key={track.title} 
                            onClick={() => handlePlayTrack(selectedAlbum, track)}
                            className={`glassmorphism p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors hover:bg-white/20 ${currentTrack?.title === track.title ? '' : ''}`}
                            style={{ backgroundColor: currentTrack?.title === track.title ? 'rgba(var(--accent-color-rgb), 0.3)' : ''}}
                        >
                            <span className="font-semibold">{track.title}</span>
                             {currentTrack?.title === track.title && isPlaying ? (
                                <div className="flex space-x-0.5">
                                    <span className="w-1 h-4 animate-pulse" style={{ animationDelay: '0s', backgroundColor: 'var(--accent-color)' }}></span>
                                    <span className="w-1 h-4 animate-pulse" style={{ animationDelay: '0.2s', backgroundColor: 'var(--accent-color)' }}></span>
                                    <span className="w-1 h-4 animate-pulse" style={{ animationDelay: '0.4s', backgroundColor: 'var(--accent-color)' }}></span>
                                </div>
                             ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.07v3.86a1 1 0 001.555.832l3.197-1.93a1 1 0 000-1.664l-3.197-1.93z" clipRule="evenodd" /></svg>
                             )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col p-6 relative overflow-x-hidden text-[--text-primary]" style={{ paddingTop: `calc(2.5rem + env(safe-area-inset-top, 0px))` }}>
      <header className="text-center z-10 mb-6 flex-shrink-0">
        <h2 className="font-light text-sm tracking-widest uppercase opacity-80 text-[--text-secondary]">The Starlight Realm</h2>
        <h1 className="font-sans text-3xl font-bold opacity-90 text-[--text-header]">Calming Music</h1>
      </header>
      
      <main className="z-10 flex-grow w-full max-w-2xl mx-auto overflow-y-auto pr-1" style={{ paddingBottom: `calc(7rem + env(safe-area-inset-bottom, 0px))` }}>
        {selectedAlbum ? renderTrackList() : renderAlbumGrid()}
      </main>

       { isPlaying && <AudioVisualizer /> }
    </div>
  );
};

export default MusicScreen;