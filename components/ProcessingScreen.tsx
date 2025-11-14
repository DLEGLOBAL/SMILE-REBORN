
import React, { useState, useEffect } from 'react';

const messages = [
  "Analyzing your unique smile...",
  "Consulting with our digital artisans...",
  "Crafting your future reflection...",
  "The art of science is at work...",
  "Calibrating the pixels of perfection...",
  "Finalizing your transformation...",
];

export const ProcessingScreen: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center text-text-dark animate-fade-in">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 bg-aqua-main rounded-full opacity-75 animate-pulse-slow"></div>
        <div className="absolute inset-2 bg-ivory rounded-full"></div>
         <div className="absolute inset-4 bg-aqua-main/50 rounded-full animate-pulse-slow animation-delay-500"></div>
      </div>
      <h2 className="mt-8 text-2xl sm:text-3xl font-bold text-gold-dark">Generating Your Vision...</h2>
      <p key={currentMessageIndex} className="mt-4 text-md sm:text-lg text-text-light animate-fade-in">
        {messages[currentMessageIndex]}
      </p>
    </div>
  );
};
