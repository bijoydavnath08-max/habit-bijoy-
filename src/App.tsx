import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from './contexts/AuthContext';
import { useHabits } from './contexts/HabitContext';
import { 
  BarChart3, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  LayoutDashboard, 
  Settings, 
  Plus,
  Flame,
  User as UserIcon,
  Moon,
  Sun,
  LogOut,
  Sparkles
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import HabitList from './components/HabitList';
import Calendar from './components/Calendar';
import AISuggestions from './components/AISuggestions';
import { cn } from './lib/utils';

type View = 'dashboard' | 'habits' | 'calendar' | 'ai';

export default function App() {
  const { user, profile, loading, signInWithGoogle, logout } = useAuth();
  const [activeView, setActiveView] = React.useState<View>('dashboard');
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (loading) {
    return (
      <div className="flex bg-neutral-50 h-screen items-center justify-center dark:bg-neutral-950">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="rounded-full border-4 border-neutral-200 h-10 border-t-neutral-600 w-10"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex bg-neutral-50 h-screen items-center justify-center p-4 dark:bg-neutral-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-neutral-200 max-w-sm p-8 rounded-3xl shadow-xl w-full dark:bg-neutral-800 dark:border-neutral-700"
        >
          <div className="flex mb-6 justify-center">
            <div className="bg-neutral-100 flex h-16 rounded-2xl w-16 items-center justify-center dark:bg-neutral-700">
              <CheckCircle2 className="h-8 text-neutral-900 w-8 dark:text-neutral-50" />
            </div>
          </div>
          <h1 className="font-bold text-center text-3xl text-neutral-900 tracking-tight mb-2 dark:text-neutral-50">Habitly</h1>
          <p className="text-center text-neutral-500 mb-8 dark:text-neutral-400">Track your progress, build your legacy.</p>
          <button 
            onClick={signInWithGoogle}
            className="flex font-medium bg-neutral-900 border border-transparent h-12 rounded-xl text-white transition-all w-full items-center justify-center hover:bg-neutral-800 active:scale-95 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'habits': return <HabitList />;
      case 'calendar': return <Calendar />;
      case 'ai': return <AISuggestions />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className={cn("flex h-screen overflow-hidden", isDarkMode ? "dark" : "")}>
      {/* Sidebar */}
      <aside className="bg-white border-r border-[#E5E5E5] flex-col hidden w-64 p-6 z-10 md:flex dark:bg-neutral-900 dark:border-neutral-800">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xs dark:bg-white dark:text-black">H</div>
          <span className="font-bold tracking-tight text-xl dark:text-white">HabitPro</span>
        </div>
        
        <nav className="flex flex-col flex-1 gap-1">
          <NavItem active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem active={activeView === 'habits'} onClick={() => setActiveView('habits')} icon={<CheckCircle2 size={18} />} label="All Habits" />
          <NavItem active={activeView === 'calendar'} onClick={() => setActiveView('calendar')} icon={<CalendarIcon size={18} />} label="Calendar" />
          <NavItem active={activeView === 'ai'} onClick={() => setActiveView('ai')} icon={<Sparkles size={18} />} label="AI Sync" />
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 dark:bg-neutral-800 dark:border-neutral-700">
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Current Effort</div>
            <div className="text-xs font-semibold mb-1 dark:text-neutral-200">Consistency Peak</div>
            <div className="text-[10px] text-gray-500 italic">Level Up in 4 Days</div>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-neutral-400 hover:text-black transition-colors">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={logout} className="text-neutral-400 hover:text-red-500 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="bg-[#FBFBFB] flex-1 overflow-y-auto dark:bg-neutral-950 flex flex-col">
        <header className="h-20 border-b border-[#E5E5E5] px-4 md:px-10 flex items-center justify-between dark:border-neutral-800">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight dark:text-white line-clamp-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h1>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              {profile?.displayName ? `Habit Tracker • ${profile.displayName}` : 'Premium Edition'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold dark:text-white">{profile?.displayName || 'User'}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Lv. {profile?.level || 1}</span>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-neutral-900 rounded-full flex items-center justify-center text-white text-xs font-bold dark:bg-white dark:text-black">
              {profile?.displayName?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-10 pb-20 md:pb-10">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </div>
      </main>

      {/* Mobile Nav */}
      <div className="bg-white border-t border-neutral-200 bottom-0 fixed flex h-16 w-full items-center justify-around z-50 md:hidden dark:bg-neutral-900 dark:border-neutral-800">
        <MobileNavItem active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} icon={<LayoutDashboard size={20} />} />
        <MobileNavItem active={activeView === 'habits'} onClick={() => setActiveView('habits')} icon={<CheckCircle2 size={20} />} />
        <button onClick={() => {}} className="bg-neutral-900 -mt-8 rounded-full shadow-lg p-4 text-white dark:bg-neutral-50 dark:text-neutral-900">
          <Plus size={24} />
        </button>
        <MobileNavItem active={activeView === 'calendar'} onClick={() => setActiveView('calendar')} icon={<CalendarIcon size={20} />} />
        <MobileNavItem active={activeView === 'ai'} onClick={() => setActiveView('ai')} icon={<Sparkles size={20} />} />
      </div>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full",
        active 
          ? "bg-black text-white dark:bg-white dark:text-black" 
          : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MobileNavItem({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-2 rounded-xl transition-all",
        active ? "text-neutral-900 dark:text-neutral-50" : "text-neutral-400"
      )}
    >
      {icon}
    </button>
  );
}
