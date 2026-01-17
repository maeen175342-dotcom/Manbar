
export interface Wisdom {
  id?: string;
  text: string;
  author: string;
  source: string;
  explanation: string;
  moodColor: string;
  category?: string;
  createdAt?: number;
  updatedAt?: number;
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
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN = 'ADMIN'
}

export interface LegacyEntry {
  id: string;
  content: string;
  authorName: string;
  status: 'pending' | 'approved';
  timestamp: number;
}
