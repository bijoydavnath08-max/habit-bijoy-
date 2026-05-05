import React from 'react';
import { useHabits } from '../contexts/HabitContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Zap, Target, TrendingUp, Trophy } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

export default function Dashboard() {
  const { habits, logs } = useHabits();

  // Calculate stats
  const completedToday = logs.filter(l => 
    l.date === new Date().toISOString().split('T')[0] && l.status === 'completed'
  ).length;

  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  // Weekly data for chart
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weeklyData = days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayLogs = logs.filter(l => l.date === dateStr && l.status === 'completed');
    return {
      name: format(day, 'EEE'),
      completed: dayLogs.length,
      total: totalHabits
    };
  });

  return (
    <div className="grid grid-cols-12 gap-6 lg:gap-10 pb-20">
      {/* Main Stats Area */}
      <div className="col-span-12 lg:col-span-8 flex flex-col">
        <div className="mb-8 lg:mb-12 flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-6">
          <div className="text-[80px] md:text-[120px] font-black leading-[0.8] tracking-tighter text-black font-display dark:text-white">
            {completionRate}<span className="text-[30px] md:text-[40px] text-gray-300 dark:text-neutral-700">%</span>
          </div>
          <div className="pb-1 sm:pb-3">
            <div className="text-[10px] md:text-sm font-bold uppercase tracking-widest dark:text-white">Progress</div>
            <div className="text-gray-400 text-xs md:text-sm italic dark:text-neutral-500">{completedToday} of {totalHabits} habits completed</div>
          </div>
        </div>

        {/* Weekly Chart Container */}
        <div className="premium-border bg-white p-4 md:p-8 rounded-2xl dark:bg-neutral-900 dark:border-neutral-800">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 md:mb-8 text-gray-400">Weekly Activity</h4>
          <div className="h-[200px] md:h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F0F0F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#A3A3A3', fontSize: 10, fontWeight: 700 }} 
                  dy={10}
                />
                <Bar dataKey="completed" radius={[2, 2, 0, 0]} barSize={40}>
                  {weeklyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.completed === entry.total && entry.total > 0 ? '#000000' : '#E5E5E5'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sidebar Info Area */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 dark:bg-neutral-900 dark:border-neutral-800">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-gray-400">Streak Intelligence</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold italic dark:text-white">12 Days</span>
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 dark:bg-orange-900/20">🔥</div>
          </div>
          <div className="text-xs text-gray-500 leading-relaxed dark:text-neutral-400">
            You're in the top 3% of users this week. Your morning routine is becoming semi-automatic.
          </div>
        </div>

        <div className="bg-black text-white rounded-2xl p-6 dark:bg-white dark:text-black">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-60">Rewards</h4>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl dark:bg-black/5">🏃‍♂️</div>
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl dark:bg-black/5">🧘‍♀️</div>
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl text-black dark:bg-black dark:text-white border border-white/20">📚</div>
          </div>
          <p className="mt-6 text-[10px] font-bold uppercase tracking-widest opacity-40">3 Badges Unlocked</p>
        </div>

        <div className="bg-[#F1F5F9] rounded-2xl p-6 flex-1 dark:bg-neutral-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">✨</span>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-neutral-300">AI Wisdom</h4>
          </div>
          <p className="text-sm font-medium mb-4 dark:text-neutral-200">
            Small habits make a big difference. Try <span className="underline decoration-2 underline-offset-4">habit stacking</span>: perform your new habit immediately after an existing one.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, delay }: { icon: React.ReactNode, title: string, value: string, subtitle: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-white border border-neutral-200 p-6 rounded-3xl dark:bg-neutral-900 dark:border-neutral-800"
    >
      <div className="flex mb-4 items-center justify-between">
        <div className="bg-neutral-50 p-2 rounded-xl dark:bg-neutral-800">{icon}</div>
      </div>
      <h4 className="font-medium text-neutral-500 text-sm mb-1 dark:text-neutral-400">{title}</h4>
      <div className="font-bold text-neutral-900 text-2xl mb-1 dark:text-neutral-50">{value}</div>
      <p className="text-neutral-400 text-xs dark:text-neutral-500">{subtitle}</p>
    </motion.div>
  );
}

function Badge({ icon, name, level, color = "bg-neutral-50" }: { icon: string, name: string, level: number, color?: string }) {
  return (
    <div className={cn("flex flex-col items-center p-4 rounded-2xl min-w-[100px]", color, "dark:bg-neutral-800")}>
      <span className="text-3xl mb-2">{icon}</span>
      <span className="font-bold text-neutral-900 text-sm dark:text-neutral-100">{name}</span>
      <span className="text-neutral-500 text-xs dark:text-neutral-400">Level {level}</span>
    </div>
  );
}
