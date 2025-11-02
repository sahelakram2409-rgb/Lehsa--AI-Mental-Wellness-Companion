import React from 'react';

interface SplashScreenProps {
  isFadingOut: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isFadingOut }) => {
  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center transition-opacity duration-500 day-mode day-mode-bg ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative w-[300px] h-[100px] flex items-center justify-center">
        <div className="splash-firefly-element"></div>
        <h1 className="text-6xl font-sans font-black tracking-wider text-slate-800 splash-logo-animate">
          LEHSA
        </h1>
      </div>
    </div>
  );
};

export default SplashScreen;