import { describe, it, expect } from 'vitest';
import { getStreak, formatDate } from './utils';

describe('Habit Utils', () => {
  it('should format date correctly', () => {
    const date = new Date('2023-10-27T10:00:00');
    expect(formatDate(date)).toBe('2023-10-27');
  });

  it('should calculate current streak correctly', () => {
    const today = formatDate(new Date());
    const yesterday = formatDate(new Date(Date.now() - 86400000));
    const twoDaysAgo = formatDate(new Date(Date.now() - 172800000));
    
    // 3 day streak
    expect(getStreak([today, yesterday, twoDaysAgo])).toBe(3);
    
    // 1 day streak (only today)
    expect(getStreak([today])).toBe(1);
    
    // Broken streak
    expect(getStreak([today, twoDaysAgo])).toBe(1);
    
    // No streak (nothing done today or yesterday)
    const threeDaysAgo = formatDate(new Date(Date.now() - 259200000));
    expect(getStreak([threeDaysAgo])).toBe(0);
  });
});
