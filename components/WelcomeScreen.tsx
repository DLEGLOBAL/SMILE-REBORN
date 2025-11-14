
import React from 'react';
import { ArrowRightIcon } from './icons';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 sm:p-6 text-text-dark animate-fade-in">
      <div className="max-w-2xl">
        <h1 className="text-5xl sm:text-6xl font-bold text-gold-dark tracking-tight leading-tight">
          Smile <span className="text-aqua-main">Reborn</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-text-light animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          Your smile is your story—let’s rewrite it.
        </p>
        <p className="mt-4 text-base sm:text-lg text-text-light max-w-xl mx-auto animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
          Instantly visualize your perfect smile with the power of AI. See your best self, then discover your path to make it a reality.
        </p>
        <div className="mt-10 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={onGetStarted}
            className="group inline-flex items-center justify-center px-8 py-4 bg-aqua-main text-white font-semibold rounded-full shadow-lg hover:bg-aqua-dark transition-all duration-300 transform hover:scale-105"
          >
            See Your Future Smile
            <ArrowRightIcon className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
        <p className="mt-10 text-sm text-gold-main font-medium tracking-wider animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
          TAKE BACK YOUR HEALTH. TAKE BACK YOUR LOOK. TAKE BACK YOUR HAPPINESS.
        </p>
      </div>
    </div>
  );
};