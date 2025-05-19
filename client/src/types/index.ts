// Todo Types
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

// Habit Types
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 6 = Saturday
export interface Habit {
  id: string;
  name: string;
  days: boolean[]; // Array of 7 booleans, one for each day of the week
  createdAt: number;
}

// Journal Types
export interface JournalEntry {
  date: string; // ISO date string, YYYY-MM-DD
  content: string;
  lastEdited: number; // timestamp
}

export interface JournalEntries {
  [date: string]: JournalEntry;
}

// Zodiac Types
export interface ZodiacInfo {
  month: number | string;
  day: number | string;
  sign?: string;
  traits?: string[];
  motivation?: string;
}

// API Key Types
export interface ApiKeys {
  deepai: string;
  openai: string;
}

// Bio Generator Types
export type BioType = 'instagram' | 'linkedin' | 'twitter';
export interface BioRequest {
  name: string;
  interests: string[];
  type: BioType;
}

// Mini Games
export interface WordPuzzle {
  scrambled: string;
  answer: string;
  hint?: string;
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

// Quote Type
export interface Quote {
  text: string;
  author: string;
}
