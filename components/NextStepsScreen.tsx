import React from 'react';
import { RefreshCwIcon, MapPinIcon, DollarSignIcon } from './icons';

interface NextStepsScreenProps {
    onStartOver: () => void;
    onFindDentists: () => void;
    onExploreFinancing: () => void;
}

const FeatureCard: React.FC<{ title: string, description: string, cta: string, icon: React.ReactNode, onClick: () => void }> = ({ title, description, cta, icon, onClick }) => (
    <div className="bg-white/50 rounded-xl shadow-md p-6 text-center border border-gold-light/50 transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col">
        <div className="mx-auto bg-aqua-light rounded-full p-3 w-16 h-16 flex items-center justify-center">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-gold-dark mt-4">{title}</h3>
        <p className="mt-3 text-text-light flex-grow">{description}</p>
        <button 
            onClick={onClick}
            className="mt-6 w-full px-6 py-3 bg-aqua-main text-white font-semibold rounded-full shadow-md hover:bg-aqua-dark transition-colors duration-300"
        >
            {cta}
        </button>
    </div>
);

export const NextStepsScreen: React.FC<NextStepsScreenProps> = ({ onStartOver, onFindDentists, onExploreFinancing }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 animate-fade-in">
        <div className="text-center w-full max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gold-dark tracking-tight">Your Path to Transformation</h2>
            <p className="mt-3 text-md sm:text-lg text-text-light">
                Seeing is the first step. Now, let's create a plan to make your new smile a reality.
            </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl animate-slide-in-up">
            <FeatureCard 
                title="Connect with a Dentist"
                description="Find top-rated, verified dentists in your area who can turn your vision into reality."
                cta="Find Dentists Near Me"
                icon={<MapPinIcon className="h-8 w-8 text-aqua-dark"/>}
                onClick={onFindDentists}
            />
            <FeatureCard 
                title="Explore Financing"
                description="Affordable 'Smile Now, Pay Later' plans designed to fit your budget. Your dream smile is within reach."
                cta="View Savings Plans"
                icon={<DollarSignIcon className="h-8 w-8 text-aqua-dark"/>}
                onClick={onExploreFinancing}
            />
        </div>

        <div className="mt-12 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
             <button
                onClick={onStartOver}
                className="group inline-flex items-center text-text-light font-semibold hover:text-aqua-dark transition-colors duration-300"
              >
                <RefreshCwIcon className="mr-2 h-5 w-5" />
                Start Over
            </button>
        </div>
    </div>
  );
};
