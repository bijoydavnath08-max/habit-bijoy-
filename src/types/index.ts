import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  points: number;
  level: number;
  badges: string[];
  createdAt: Timestamp;
}

export type HabitFrequency = 'daily' | 'weekly' | 'weekdays';

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  order: number;
  createdAt: Timestamp;
  archived?: boolean;
}

export type LogStatus = 'completed' | 'skipped' | 'failed';

export interface HabitLog {
  id: string;
  habitId: string;
  userId: string;
  date: string; // ISO YYYY-MM-DD
  status: LogStatus;
  createdAt: Timestamp;
}

export interface HabitWithStatus extends Habit {
  completedToday: boolean;
  streak: number;
  completionRate: number;
}
