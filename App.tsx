import React, { useState, useCallback } from 'react';
import { AppScreen, GeminiResults } from './types';
import { WelcomeScreen } from './components/WelcomeScreen';
import { UploadScreen } from './components/UploadScreen';
import { ProcessingScreen } from './components/ProcessingScreen';
import { RevealScreen } from './components/RevealScreen';
import { NextStepsScreen } from './components/NextStepsScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { Chatbot } from './components/Chatbot';
import { 
  generatePerfectSmile, 
  findNearbyDentistsByCoords, 
  getFinancingOptionsByCoords,
  findNearbyDentistsByQuery,
  getFinancingOptionsByQuery
} from './services/geminiService';

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

type ManualSearchType = 'dentist' | 'financing' | null;

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.WELCOME);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [results, setResults] = useState<GeminiResults | null>(null);
  const [requiresManualLocation, setRequiresManualLocation] = useState(false);
  const [manualSearchType, setManualSearchType] = useState<ManualSearchType>(null);
  
  const resetApp = () => {
    setCurrentScreen(AppScreen.WELCOME);
    setOriginalImage(null);
    setGeneratedImage(null);
    setError('');
    setResults(null);
    setIsLoading(false);
    setLoadingText('');
    setRequiresManualLocation(false);
    setManualSearchType(null);
  };

  const handleGetStarted = () => setCurrentScreen(AppScreen.UPLOAD);

  const handleImageUploaded = useCallback(async (file: File) => {
    setError('');
    setCurrentScreen(AppScreen.PROCESSING);
    
    try {
      const dataUrl = await fileToDataUrl(file);
      setOriginalImage(dataUrl);

      const base64Image = dataUrl.split(',')[1];
      const resultBase64 = await generatePerfectSmile(base64Image, file.type);
      
      setGeneratedImage(resultBase64);
      setCurrentScreen(AppScreen.REVEAL);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(message);
      setCurrentScreen(AppScreen.UPLOAD); // Go back to upload screen on error
    }
  }, []);
  
  const handleNextStep = () => setCurrentScreen(AppScreen.NEXT_STEPS);
  
  const getLocationAndFetch = async (
    loadingMessage: string,
    screen: AppScreen,
    fetcher: (lat: number, lon: number) => Promise<GeminiResults>,
    searchType: ManualSearchType
  ) => {
    setIsLoading(true);
    setLoadingText(loadingMessage);
    setResults(null);
    setError('');
    setRequiresManualLocation(false);
    setCurrentScreen(screen);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser. Please enter your location manually below.");
      setRequiresManualLocation(true);
      setManualSearchType(searchType);
      setIsLoading(false);
      return;
    }

    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

      if (permissionStatus.state === 'denied') {
        setError("Location access was denied. To find local results, please enable it in your browser settings or enter your location manually below.");
        setRequiresManualLocation(true);
        setManualSearchType(searchType);
        setIsLoading(false);
        return;
      }

      // If state is 'granted' or 'prompt', it will proceed.
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const apiResults = await fetcher(latitude, longitude);
            setResults(apiResults);
          } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown API error occurred.";
            setError(message);
            setCurrentScreen(AppScreen.NEXT_STEPS);
          } finally {
            setIsLoading(false);
          }
        },
        (geoError) => {
          let message = "Could not get your location. Please check location services on your device or enter your location manually below.";
          if (geoError.code === geoError.PERMISSION_DENIED) {
            message = "Location access was denied. To find local results, please enable it in your browser settings or enter your location manually below.";
          }
          setError(message);
          setRequiresManualLocation(true);
          setManualSearchType(searchType);
          setIsLoading(false);
        }
      );
    } catch (e) {
      // Catch errors from permissions API itself if unsupported
       setError("Could not check location permissions. Please enter your location manually below.");
       setRequiresManualLocation(true);
       setManualSearchType(searchType);
       setIsLoading(false);
    }
  };
  
  const handleFindDentists = () => {
    getLocationAndFetch(
        'Finding dentists near you...',
        AppScreen.DENTIST_FINDER,
        findNearbyDentistsByCoords,
        'dentist'
    );
  };

  const handleExploreFinancing = () => {
    getLocationAndFetch(
        'Researching financing options...',
        AppScreen.FINANCING_INFO,
        getFinancingOptionsByCoords,
        'financing'
    );
  };

  const handleManualSearch = async (locationQuery: string) => {
    if (!manualSearchType) return;

    setIsLoading(true);
    setRequiresManualLocation(false);
    setError('');
    setResults(null);

    let fetcher: (query: string) => Promise<GeminiResults>;
    let loadingMessage: string;

    if (manualSearchType === 'dentist') {
      fetcher = findNearbyDentistsByQuery;
      loadingMessage = `Finding dentists near ${locationQuery}...`;
    } else { // 'financing'
      fetcher = getFinancingOptionsByQuery;
      loadingMessage = `Researching financing near ${locationQuery}...`;
    }

    setLoadingText(loadingMessage);

    try {
      const apiResults = await fetcher(locationQuery);
      setResults(apiResults);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(message);
      // Stay on the same screen to allow retry
      setRequiresManualLocation(true);
    } finally {
      setIsLoading(false);
    }
  };


  const handleBackToNextSteps = () => {
    setResults(null);
    setRequiresManualLocation(false);
    setManualSearchType(null);
    setError('');
    setCurrentScreen(AppScreen.NEXT_STEPS);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.WELCOME:
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
      case AppScreen.UPLOAD:
        return <UploadScreen onImageUploaded={handleImageUploaded} onError={setError} />;
      case AppScreen.PROCESSING:
        return <ProcessingScreen />;
      case AppScreen.REVEAL:
        if (originalImage && generatedImage) {
          return <RevealScreen originalImage={originalImage} generatedImage={generatedImage} onNextStep={handleNextStep} />;
        }
        // Fallback
        handleGetStarted();
        return null;
      case AppScreen.NEXT_STEPS:
        return <NextStepsScreen onStartOver={resetApp} onFindDentists={handleFindDentists} onExploreFinancing={handleExploreFinancing} />;
      case AppScreen.DENTIST_FINDER:
          return <ResultsScreen 
              title="Find a Dentist"
              description="Here are some highly-rated cosmetic dentists in your area."
              isLoading={isLoading}
              loadingText={loadingText}
              results={results}
              onBack={handleBackToNextSteps}
              error={error}
              requiresManualLocation={requiresManualLocation}
              onManualSearch={handleManualSearch}
          />;
      case AppScreen.FINANCING_INFO:
          return <ResultsScreen 
              title="Financing Your Smile"
              description="Explore these 'Smile Now, Pay Later' options to make your dream smile affordable."
              isLoading={isLoading}
              loadingText={loadingText}
              results={results}
              onBack={handleBackToNextSteps}
              error={error}
              requiresManualLocation={requiresManualLocation}
              onManualSearch={handleManualSearch}
          />;
      default:
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
    }
  };
  
  const showChatbot = currentScreen !== AppScreen.WELCOME && currentScreen !== AppScreen.PROCESSING;

  return (
    <main className="relative min-h-screen">
      {error && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-11/12 max-w-lg bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md z-50 animate-fade-in" role="alert" onClick={() => setError('')}>
          <div className="flex">
            <div className="py-1"><svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm-1-4a1 1 0 1 1 2 0 1 1 0 0 1-2 0z"/></svg></div>
            <div>
              <p className="font-bold">Notice</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      {renderScreen()}
      {showChatbot && <Chatbot />}
    </main>
  );
};

export default App;