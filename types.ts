

// Fix: Moved the Crime interface here from geminiService.ts to serve as a single source of truth for types.
export interface Crime {
  subject: string;
  english: string;
  vietnamese: string;
}

export enum Page {
  CrimeAnalysis = 'CRIME_ANALYSIS',
  CaseConverter = 'CASE_CONVERTER',
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  inputText: string;
  result: Crime[];
}