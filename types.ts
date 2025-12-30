
export enum Screen {
  Home = 'Home',
  Journal = 'Journal',
  Journey = 'Journey',
  Music = 'Music',
  Meditation = 'Meditation',
  Growth = 'Growth',
  Chat = 'Chat',
  Profile = 'Profile',
}

export const screenOrder: Screen[] = [
  Screen.Home,
  Screen.Journal,
  Screen.Journey,
  Screen.Music,
  Screen.Meditation,
  Screen.Growth,
  Screen.Chat,
  Screen.Profile,
];

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export interface JournalEntry {
  id: string;
  text: string;
  timestamp: Date;
  reflection?: string;
  mood?: string;
  imageUrl?: string | null;
  imageCaption?: string;
}

export interface ChatMessage {
  id:string;
  text: string;
  sender: 'user' | 'buddy';
  timestamp: Date;
}

export interface Goal {
  goalName: string;
  targetDate: Date;
  creationDate?: Date;
  status: 'Active' | 'Completed';
  type: 'single' | 'daily';
  lastCompleted?: string; // ISO date string
  isPinned?: boolean;
  reminderTime?: string; // e.g., "14:30"
  reminderShownForDate?: string; // e.g., "2024-07-25"
  currentStreak?: number;
  longestStreak?: number;
}

export interface Track {
    title: string;
    audioSrc: string;
    videoSrc: string;
}

export interface Album {
    id: string;
    title: string;
    artist: string;
    coverArt: string;
    tracks: Track[];
}

export interface Affirmation {
  id: string;
  text: string;
  timestamp: Date;
}

export interface AnalyticsEvent {
  id: string;
  eventName: string;
  timestamp: Date;
  details: Record<string, any>;
}
