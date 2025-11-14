export enum AppScreen {
  WELCOME,
  UPLOAD,
  PROCESSING,
  REVEAL,
  NEXT_STEPS,
  DENTIST_FINDER,
  FINANCING_INFO,
}

// Based on Gemini API response for grounding
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets: {
            text: string;
            author: string;
            rating: number;
        }[];
    }[];
  };
}

export interface GeminiResults {
    text: string;
    sources: GroundingChunk[];
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}
