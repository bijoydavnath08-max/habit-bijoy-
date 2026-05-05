import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  setDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { Habit, HabitLog, LogStatus } from '../types';
import { formatDate } from '../lib/utils';

interface HabitContextType {
  habits: Habit[];
  logs: HabitLog[];
  addHabit: (habit: Omit<Habit, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabit: (habitId: string, date: string, currentStatus?: LogStatus) => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);

  useEffect(() => {
    if (!user) {
      setHabits([]);
      setLogs([]);
      return;
    }

    const habitsQuery = query(
      collection(db, 'habits'), 
      where('userId', '==', user.uid),
      orderBy('order', 'asc')
    );
    
    const logsQuery = query(
      collection(db, 'habitLogs'),
      where('userId', '==', user.uid)
    );

    const unsubscribeHabits = onSnapshot(habitsQuery, (snapshot) => {
      setHabits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit)));
    });

    const unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HabitLog)));
    });

    return () => {
      unsubscribeHabits();
      unsubscribeLogs();
    };
  }, [user]);

  const addHabit = async (habit: Omit<Habit, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    await addDoc(collection(db, 'habits'), {
      ...habit,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    await updateDoc(doc(db, 'habits', id), updates);
  };

  const deleteHabit = async (id: string) => {
    await deleteDoc(doc(db, 'habits', id));
  };

  const toggleHabit = async (habitId: string, date: string, currentStatus?: LogStatus) => {
    if (!user) return;
    
    const existingLog = logs.find(l => l.habitId === habitId && l.date === date);
    
    if (existingLog) {
      if (currentStatus === 'completed' && existingLog.status === 'completed') {
        // Toggle off
        await deleteDoc(doc(db, 'habitLogs', existingLog.id));
      } else {
        await updateDoc(doc(db, 'habitLogs', existingLog.id), { status: currentStatus || 'completed' });
      }
    } else {
      await addDoc(collection(db, 'habitLogs'), {
        habitId,
        userId: user.uid,
        date,
        status: currentStatus || 'completed',
        createdAt: serverTimestamp()
      });
    }
  };

  return (
    <HabitContext.Provider value={{ habits, logs, addHabit, updateHabit, deleteHabit, toggleHabit }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}
