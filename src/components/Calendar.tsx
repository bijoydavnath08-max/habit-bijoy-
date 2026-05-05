import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHabits } from '../contexts/HabitContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { logs } = useHabits();

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const renderHeader = () => (
    <div className="flex mb-8 md:mb-12 flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h3 className="font-bold text-black text-2xl md:text-3xl tracking-tighter dark:text-white uppercase">{format(currentMonth, 'MMMM yyyy')}</h3>
        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Historical Integrity Report</p>
      </div>
      <div className="flex gap-2">
        <button onClick={prevMonth} className="flex-1 sm:flex-none p-3 rounded-xl border border-[#E5E5E5] bg-white hover:border-black dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-white transition-all">
          <ChevronLeft size={18} className="mx-auto" />
        </button>
        <button onClick={nextMonth} className="flex-1 sm:flex-none p-3 rounded-xl border border-[#E5E5E5] bg-white hover:border-black dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-white transition-all">
          <ChevronRight size={18} className="mx-auto" />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return (
      <div className="grid grid-cols-7 mb-4">
        {dayNames.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-black text-neutral-300 tracking-[0.2em]">
            {d}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    return (
      <div className="grid grid-cols-7 gap-px bg-[#E5E5E5] border border-[#E5E5E5] rounded-2xl overflow-hidden dark:bg-neutral-800 dark:border-neutral-800">
        {days.map((day, i) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayLogs = logs.filter(l => l.date === dateStr && l.status === 'completed');
          const isSelected = isSameDay(day, new Date());
          const isInMonth = isSameMonth(day, monthStart);

          return (
            <div 
              key={i} 
              className={cn(
                "aspect-square p-3 flex flex-col items-center justify-between transition-all",
                !isInMonth ? "bg-[#FBFBFB] opacity-30 dark:bg-neutral-950" : "bg-white dark:bg-neutral-900",
                isSelected ? "relative" : ""
              )}
            >
              {isSelected && <div className="absolute inset-0 border-2 border-black dark:border-white z-10 pointer-events-none" />}
              
              <span className={cn(
                "text-[10px] font-bold",
                isSelected ? "text-black dark:text-white" : "text-gray-300"
              )}>
                {format(day, 'd')}
              </span>
              
              <div className="flex flex-wrap gap-1 justify-center">
                {dayLogs.map((log, idx) => (
                  <div key={idx} className="h-1.5 w-1.5 rounded-full bg-black dark:bg-white" />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="pb-20 max-w-4xl">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
