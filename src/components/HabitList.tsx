import React, { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  PlusCircle,
  Hash
} from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import { Habit } from '../types';

export default function HabitList() {
  const { habits, logs, toggleHabit, deleteHabit, addHabit } = useHabits();
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');

  const today = formatDate(new Date());

  const filteredHabits = habits.filter(h => 
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="left-4 absolute mt-3 text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder="Search your habits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border border-neutral-200 h-11 pl-12 pr-4 rounded-2xl text-sm w-full outline-none focus:ring-2 focus:ring-neutral-900 transition-all dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-50 dark:focus:ring-neutral-50"
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-neutral-900 flex font-medium h-11 px-6 rounded-2xl text-white items-center gap-2 hover:bg-neutral-800 active:scale-95 transition-all dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          <Plus size={20} />
          <span>New Habit</span>
        </button>
      </div>

      <div className="space-y-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Your Active Stack</h3>
          <div className="text-gray-400 text-xs italic">{habits.length} Habits Tracked</div>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredHabits.map((habit, index) => {
            const isDoneToday = logs.some(l => l.habitId === habit.id && l.date === today && l.status === 'completed');
            
            return (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={cn(
                  "p-4 md:p-6 bg-white border border-[#E5E5E5] rounded-2xl flex items-center justify-between group hover:border-black transition-all cursor-pointer dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-white",
                  isDoneToday ? "border-black bg-neutral-50 opacity-100 dark:border-white dark:bg-neutral-800" : ""
                )}>
                  <div className="flex items-center gap-4 md:gap-6">
                    <button 
                      onClick={() => toggleHabit(habit.id, today)}
                      className={cn(
                        "w-5 h-5 md:w-6 md:h-6 border-2 rounded-md flex items-center justify-center transition-all",
                        isDoneToday 
                          ? "bg-black border-black dark:bg-white dark:border-white" 
                          : "border-[#E5E5E5] bg-transparent dark:border-neutral-700"
                      )}
                    >
                      {isDoneToday && (
                        <div className="w-1 md:w-1.5 h-2 md:h-3 border-r-2 border-b-2 border-white rotate-45 mb-1 dark:border-black"></div>
                      )}
                    </button>
                    <div>
                      <h3 className={cn(
                        "font-bold text-base md:text-lg leading-tight dark:text-white",
                        isDoneToday ? "" : ""
                      )}>
                        {habit.name}
                      </h3>
                      <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                        {habit.frequency} • {habit.description || 'Routine'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-6">
                    <div className="flex flex-col items-end">
                      <span className={cn(
                        "text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded",
                        isDoneToday ? "bg-green-50 text-green-600 dark:bg-green-900/20" : "bg-gray-50 text-gray-400 dark:bg-neutral-800"
                      )}>
                        {isDoneToday ? '+12 XP' : 'Daily'}
                      </span>
                      <span className="hidden sm:block text-sm font-mono text-gray-200 mt-1 dark:text-neutral-700">0{index + 1}</span>
                    </div>
                    <button 
                      onClick={() => deleteHabit(habit.id)}
                      className="text-neutral-300 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredHabits.length === 0 && (
          <div className="flex flex-col h-64 items-center justify-center text-center">
            <div className="bg-neutral-100 p-4 rounded-full mb-4 dark:bg-neutral-800">
              <Hash className="text-neutral-400" size={32} />
            </div>
            <h3 className="font-bold text-neutral-900 dark:text-neutral-50">No habits yet</h3>
            <p className="text-neutral-500 max-w-xs text-sm dark:text-neutral-400">Start by adding your first daily routine!</p>
          </div>
        )}
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="bg-black/50 fixed inset-0 flex items-center justify-center p-4 z-[60] backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-neutral-200 max-w-md p-8 rounded-3xl shadow-2xl w-full dark:bg-neutral-900 dark:border-neutral-800"
            >
              <div className="flex mb-6 items-center justify-between">
                <h2 className="font-bold text-neutral-900 text-2xl dark:text-neutral-50">Add Habit</h2>
                <button onClick={() => setShowAddModal(false)} className="text-neutral-400 p-1 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <AddHabitForm onCancel={() => setShowAddModal(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddHabitForm({ onCancel }: { onCancel: () => void }) {
  const { addHabit } = useHabits();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [freq, setFreq] = useState<'daily' | 'weekly' | 'weekdays'>('daily');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    await addHabit({
      name,
      description: desc,
      frequency: freq,
      icon: 'star',
      color: 'blue-500',
      order: 0,
    });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Habit Name</label>
        <input 
          autoFocus
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Deep Work Session"
          className="bg-transparent border border-[#E5E5E5] h-14 px-6 rounded-xl text-lg font-bold w-full outline-none focus:border-black transition-all dark:border-neutral-700 dark:text-white dark:focus:border-white"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Context / Note</label>
        <input 
          type="text" 
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="e.g. at 09:00 AM • 4 Hours"
          className="bg-transparent border border-[#E5E5E5] h-12 px-6 rounded-xl text-sm w-full outline-none focus:border-black transition-all dark:border-neutral-700 dark:text-white dark:focus:border-white"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Frequency</label>
        <div className="grid grid-cols-3 gap-2">
          {['daily', 'weekly', 'weekdays'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFreq(f as any)}
              className={cn(
                "h-10 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all",
                freq === f 
                  ? "bg-black border-black text-white dark:bg-white dark:text-black" 
                  : "bg-transparent border-[#E5E5E5] text-gray-400 hover:border-black dark:border-neutral-700 dark:hover:border-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          type="submit"
          className="flex-1 bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] h-14 rounded-xl hover:bg-neutral-800 transition-all dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          Create Entry
        </button>
      </div>
    </form>
  );
}
