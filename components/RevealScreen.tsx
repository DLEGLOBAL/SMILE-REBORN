
import React from 'react';
import { ArrowRightIcon } from './icons';

interface RevealScreenProps {
  originalImage: string;
  generatedImage: string;
  onNextStep: () => void;
}

export const RevealScreen: React.FC<RevealScreenProps> = ({ originalImage, generatedImage, onNextStep }) => {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 py-8 sm:p-8 animate-fade-in">
      <div className="text-center w-full max-w-4xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-gold-dark tracking-tight">
          See it. Believe it. Achieve it.
        </h2>
        <p className="mt-3 text-md sm:text-lg text-text-light">
          Here is the vision for your new smile. This is the first step on your journey to renewed confidence.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 w-full max-w-5xl animate-slide-in-up">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-text-light">Before</h3>
          <img src={originalImage} alt="Original smile" className="mt-2 w-full h-auto object-cover rounded-xl shadow-lg border-4 border-gold-light" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-aqua-dark">Your Future Smile</h3>
          <img src={`data:image/png;base64,${generatedImage}`} alt="Generated smile" className="mt-2 w-full h-auto object-cover rounded-xl shadow-lg border-4 border-aqua-main" />
        </div>
      </div>
      
      <div className="mt-10 text-center animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
        <button
          onClick={onNextStep}
          className="group inline-flex items-center justify-center px-8 py-4 bg-aqua-main text-white font-semibold rounded-full shadow-lg hover:bg-aqua-dark transition-all duration-300 transform hover:scale-105"
        >
          Ready for the Next Step?
          <ArrowRightIcon className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
