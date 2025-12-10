export enum AppState {
  IDLE = 'IDLE',
  PARSING = 'PARSING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface ParsedLogChunk {
  fileName: string;
  content: string;
  timestamp?: string;
  relevanceScore: number;
}

export interface AnalysisResult {
  lastSeenDate: string;
  locationContext: string;
  signalStrengthAnalysis: string;
  batteryStatus: string;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  summary: string;
  nextSteps: string[];
}
