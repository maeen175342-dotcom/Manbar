
export interface Wisdom {
  text: string;
  author: string;
  source: string;
  moodColor: string;
  category?: string;
}

export interface Contemplation {
  surfaceMeaning: string;
  deepMeaning: string;
  practicalApplication: string;
}

export enum AppState {
  INTRO = 'INTRO',
  SUMMONING = 'SUMMONING',
  REVELATION = 'REVELATION',
  CONTEMPLATION = 'CONTEMPLATION',
  LEGACY = 'LEGACY',
  ADMIN = 'ADMIN'
}

export interface LegacyEntry {
  id: string;
  content: string;
  authorName: string;
  status: 'pending' | 'approved';
  timestamp: number;
}
