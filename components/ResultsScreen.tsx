import React, { useState } from 'react';
import { GroundingChunk } from '../types';
import { LoaderIcon, SearchIcon } from './icons';
import ReactMarkdown from 'react-markdown';


interface ResultsScreenProps {
  title: string;
  description: string;
  isLoading: boolean;
  loadingText: string;
  results: { text: string; sources: GroundingChunk[] } | null;
  onBack: () => void;
  error: string;
  requiresManualLocation: boolean;
  onManualSearch: (query: string) => void;
}

const SourceLink: React.FC<{ source: GroundingChunk }> = ({ source }) => {
  const sourceData = source.web || source.maps;
  if (!sourceData) return null;

  return (
    <a
      href={sourceData.uri}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 bg-ivory hover:bg-gold-light/50 border border-gold-light rounded-lg transition-colors duration-300 group"
    >
      <p className="font-semibold text-aqua-dark group-hover:underline truncate">{sourceData.title}</p>
      <p className="text-sm text-text-light truncate">{sourceData.uri}</p>
    </a>
  );
};

const ManualLocationInput: React.FC<{ onSearch: (query: string) => void; message: string }> = ({ onSearch, message }) => {
    const [query, setQuery] = useState('');
    const defaultMessage = "To find local results, please grant location access or enter your City/State or ZIP code below.";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-center p-4 sm:p-8 h-full animate-fade-in">
            <h3 className="text-xl font-bold text-gold-dark">Location Access Needed</h3>
            <p className="mt-2 text-text-light max-w-md">
                {message || defaultMessage}
            </p>
            <form onSubmit={handleSubmit} className="mt-6 w-full max-w-sm flex items-center gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., San Francisco, CA or 94102"
                    className="flex-1 px-4 py-3 border border-gold-main rounded-full focus:outline-none focus:ring-2 focus:ring-aqua-main"
                />
                <button 
                    type="submit"
                    className="group flex-shrink-0 inline-flex items-center justify-center px-4 py-3 bg-aqua-main text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-aqua-dark disabled:bg-gray-300"
                    disabled={!query.trim()}
                >
                    <SearchIcon className="h-5 w-5" />
                </button>
            </form>
        </div>
    );
};


export const ResultsScreen: React.FC<ResultsScreenProps> = ({ title, description, isLoading, loadingText, results, onBack, error, requiresManualLocation, onManualSearch }) => {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 py-8 sm:p-8 animate-fade-in">
      <div className="w-full max-w-4xl">
        <button onClick={onBack} className="text-aqua-main font-semibold mb-6 hover:underline">&larr; Back to Next Steps</button>
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gold-dark tracking-tight">{title}</h2>
          <p className="mt-3 text-md sm:text-lg text-text-light">{description}</p>
        </div>

        <div className="mt-8 w-full bg-white/60 p-4 sm:p-6 rounded-xl shadow-lg border border-gold-light/30 min-h-[300px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-8 h-full">
              <LoaderIcon className="h-12 w-12 text-aqua-main" />
              <p className="mt-4 text-lg font-semibold text-gold-dark">{loadingText}</p>
            </div>
          )}
          {!isLoading && results && (
            <div className="animate-fade-in">
              <div className="text-text-dark space-y-4 prose max-w-none">
                 <ReactMarkdown components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-gold-dark mt-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold text-gold-dark mt-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold text-gold-dark mt-2" {...props} />,
                    p: ({node, ...props}) => <p className="leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="pl-2" {...props} />,
                    a: ({node, ...props}) => <a className="text-aqua-dark hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                 }}>{results.text}</ReactMarkdown>
              </div>
              
              {results.sources.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gold-dark border-b-2 border-gold-light pb-2 mb-4">Sources & Locations</h3>
                  <div className="space-y-3">
                    {results.sources.map((source, index) => (
                      <SourceLink key={index} source={source} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
           {!isLoading && !results && requiresManualLocation && (
               <ManualLocationInput onSearch={onManualSearch} message={error} />
           )}
           {!isLoading && !results && !requiresManualLocation && (
             <p className="text-center text-text-light p-8">Could not retrieve information. Please try again.</p>
           )}
        </div>
      </div>
    </div>
  );
};