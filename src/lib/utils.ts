import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const sortedDates = [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0);

  // Check if today or yesterday is the latest date
  const latest = new Date(sortedDates[0]);
  latest.setHours(0, 0, 0, 0);
  
  const diff = (current.getTime() - latest.getTime()) / (1000 * 3600 * 24);
  if (diff > 1) return 0;

  for (let i = 0; i < sortedDates.length; i++) {
    const d = new Date(sortedDates[i]);
    d.setHours(0, 0, 0, 0);
    
    if (i === 0) {
      streak = 1;
    } else {
      const prev = new Date(sortedDates[i - 1]);
      prev.setHours(0, 0, 0, 0);
      const dayDiff = (prev.getTime() - d.getTime()) / (1000 * 3600 * 24);
      if (dayDiff === 1) {
        streak++;
      } else {
        break;
      }
    }
  }
  return streak;
}
