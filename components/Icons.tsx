import React from 'react';

interface IconProps {
  className?: string;
  isActive?: boolean;
  style?: React.CSSProperties;
}

const IconGlowFilter = () => (
    <filter id="icon-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur" />
        <feFlood floodColor="var(--accent-color)" floodOpacity="0.8" result="color" />
        <feComposite in="color" in2="blur" operator="in" result="glow" />
        <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
        </feMerge>
    </filter>
);

export const HomeIcon: React.FC<IconProps> = ({ className, isActive, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
    <defs><IconGlowFilter /></defs>
    <g filter="url(#icon-glow)">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
        {!isActive && <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" style={{stroke: 'black', strokeWidth: 0.5, strokeOpacity: 0.8}} />}
    </g>
  </svg>
);

export const JournalIcon: React.FC<IconProps> = ({ className, isActive, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
    <defs><IconGlowFilter /></defs>
    <g filter="url(#icon-glow)">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      {!isActive && <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" style={{stroke: 'black', strokeWidth: 0.5, strokeOpacity: 0.8}} />}
    </g>
  </svg>
);

export const JourneyIcon: React.FC<IconProps> = ({ className, isActive, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
        <defs><IconGlowFilter /></defs>
        <g filter="url(#icon-glow)">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l6-6.25 2.25 2.25L19.5 8.25" />
            {!isActive && <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l6-6.25 2.25 2.25L19.5 8.25" style={{stroke: 'black', strokeWidth: 0.5, strokeOpacity: 0.8}} />}
        </g>
    </svg>
);

export const GrowthIcon: React.FC<IconProps> = ({ className, isActive, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
      <defs><IconGlowFilter /></defs>
      <g filter="url(#icon-glow)">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        {!isActive && <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" style={{stroke: 'black', strokeWidth: 0.5, strokeOpacity: 0.8}} />}
      </g>
    </svg>
);

export const ChatIcon: React.FC<IconProps> = ({ className, isActive, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
    <defs><IconGlowFilter /></defs>
    <g filter="url(#icon-glow)">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      {!isActive && <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" style={{stroke: 'black', strokeWidth: 0.5, strokeOpacity: 0.8}} />}
    </g>
  </svg>
);

export const MusicIcon: React.FC<IconProps> = ({ className, isActive, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" className={className} style={{ overflow: 'visible', ...style }}>
        <defs>
            <filter id="neon-music-glow-v2" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur in="SourceAlpha" stdDeviation={isActive ? "2" : "1.5"} result="blur" />
                <feFlood floodColor="#f472b6" result="pink-color" />
                <feComposite in="pink-color" in2="blur" operator="in" result="pink-blur" />
                <feOffset in="pink-blur" dx="-2" dy="0" result="pink-glow-offset" />
                <feFlood floodColor="#60a5fa" result="blue-color" />
                <feComposite in="blue-color" in2="blur" operator="in" result="blue-blur" />
                <feOffset in="blue-blur" dx="2" dy="0" result="blue-glow-offset" />
                <feMerge>
                    <feMergeNode in="pink-glow-offset"/>
                    <feMergeNode in="blue-glow-offset"/>
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#neon-music-glow-v2)" transform="translate(4, 3.5)">
            <path d="M7 3v9a3.5 3.5 0 100 7a3.5 3.5 0 100-7 M15 3v9a3.5 3.5 0 100 7a3.5 3.5 0 100-7 M7 3h8" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    </svg>
);

export const MeditationIcon: React.FC<IconProps> = ({ className, isActive, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
      <defs><IconGlowFilter /></defs>
      <g filter="url(#icon-glow)">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm4.5 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Z" />
        {!isActive && <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm4.5 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Z" style={{stroke: 'black', strokeWidth: 0.5, strokeOpacity: 0.8}} />}
      </g>
    </svg>
);

export const ProfileIcon: React.FC<IconProps> = ({ className, isActive, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
      <defs><IconGlowFilter /></defs>
      <g filter="url(#icon-glow)">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        {!isActive && <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" style={{stroke: 'black', strokeWidth: 0.5, strokeOpacity: 0.8}} />}
      </g>
    </svg>
);

export const SendIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        <path d="M6 12 3.269 3.125A5.969 5.969 0 0 1 21.485 12 5.97 5.97 0 0 1 3.27 20.875L6 12Zm0 0h12.75" />
    </svg>
);

export const RestartIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.181-3.183m-4.991-2.691V4.5a2.25 2.25 0 0 1 2.25-2.25h.008a2.25 2.25 0 0 1 2.25 2.25v.375" />
    </svg>
);

export const PinIcon: React.FC<IconProps & { isPinned?: boolean }> = ({ className, isPinned, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={isPinned ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25V3.75m0 13.5-3.75-3.75M12 17.25l3.75-3.75M3 3h18" />
    </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={style}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

export const BellIcon: React.FC<IconProps> = ({ className, isActive, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
    {isActive ? (
      <path d="M11.25 4.533A9.041 9.041 0 0 1 12 4.5c5.132 0 9.25 4.118 9.25 9.167v.083c0 .816-.16 1.606-.46 2.34M12 21a2.25 2.25 0 0 1-2.25-2.25H14.25a2.25 2.25 0 0 1-2.25 2.25Z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.31 5.033A23.94 23.94 0 0 0 9.143 17.082M12 21a2.25 2.25 0 0 1-2.25-2.25H14.25A2.25 2.25 0 0 1 12 21Z" />
    )}
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const FireIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <path fillRule="evenodd" d="M10.233 2.06a.75.75 0 00-1.466 0l-3.25 6.25a.75.75 0 00.612 1.055l.236.035.023.003.003.001a11.986 11.986 0 005.184 0l.003-.001.023-.003.236-.035a.75.75 0 00.612-1.055l-3.25-6.25zm1.185 8.52a23.46 23.46 0 01-2.836 0L5.05 16.636a.75.75 0 00.915 1.054l3.298-2.2a1.5 1.5 0 011.474 0l3.298 2.2a.75.75 0 00.915-1.054l-3.532-6.046z" clipRule="evenodd" />
    </svg>
);

export const StarIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <path fillRule="evenodd" d="M10.868 2.884c-.321-.662-1.215-.662-1.536 0l-1.809 3.72-4.111.6c-.733.107-1.026.993-.493 1.511l2.974 2.899-.702 4.094c-.125.73.642 1.285 1.29.957l3.675-1.932 3.675 1.932c.648.328 1.415-.227 1.29-.957l-.702-4.094 2.974-2.899c.533-.518.24-1.404-.493-1.511l-4.111-.6-1.809-3.72z" clipRule="evenodd" />
    </svg>
);

export const ImageIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

export const XCircleIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
);

export const PreviousTrackIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
    </svg>
);

export const NextTrackIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 4.5l7.5 7.5-7.5 7.5m6-15l7.5 7.5-7.5 7.5" />
    </svg>
);