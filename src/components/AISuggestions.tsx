import React, { useState, useEffect } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { getHabitSuggestions } from '../services/aiService';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Plus, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AISuggestions() {
  const { habits, addHabit } = useHabits();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    const data = await getHabitSuggestions(habits);
    setSuggestions(data);
    setLoading(false);
  };

  useEffect(() => {
    if (habits.length >= 0 && suggestions.length === 0) {
      fetchSuggestions();
    }
  }, [habits.length]);

  return (
    <div className="space-y-8 pb-20 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="flex font-bold text-black text-2xl md:text-4xl items-center gap-2 md:gap-3 dark:text-white tracking-tighter">
            <Sparkles className="text-black dark:text-white" size={window.innerWidth < 768 ? 24 : 32} />
            SYNC INTELLIGENCE
          </h3>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-2">Behavioral Analysis & Optimization</p>
        </div>
        <button 
          onClick={fetchSuggestions}
          disabled={loading}
          className="self-start sm:self-auto p-3 md:p-4 bg-white border border-[#E5E5E5] rounded-2xl hover:border-black transition-all disabled:opacity-50 dark:bg-neutral-900 dark:border-neutral-800"
        >
          <RefreshCw className={cn(loading && "animate-spin")} size={20} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col h-64 items-center justify-center text-center">
          <Loader2 className="animate-spin text-black mb-4 dark:text-white" size={40} />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Parsing Neural patterns...</p>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          <AnimatePresence>
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-[#E5E5E5] p-8 rounded-2xl flex flex-col justify-between hover:border-black transition-colors dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-white"
              >
                <div>
                  <div className="inline-flex items-center gap-2 mb-6">
                    <span className="text-2xl">✨</span>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Recommendation 0{index + 1}</h4>
                  </div>
                  <h4 className="font-bold text-black text-2xl mb-3 dark:text-white tracking-tight">{suggestion.name}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 dark:text-neutral-400 italic">
                    "{suggestion.description}"
                  </p>
                </div>
                
                <button 
                  onClick={() => addHabit({
                    name: suggestion.name,
                    description: suggestion.description,
                    frequency: 'daily',
                    icon: suggestion.icon,
                    color: suggestion.color,
                    order: habits.length
                  })}
                  className="w-full py-4 bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-800 transition-all dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                >
                  Adopt To Schedule
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
