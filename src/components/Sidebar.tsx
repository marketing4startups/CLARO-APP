import React from 'react';
import { LayoutDashboard, BookOpen, ClipboardCheck, ShieldCheck, Heart, Library, Headphones, Flower2, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

interface SidebarProps {
  currentView: string;
  setView: (view: any) => void;
  role?: string;
}

export function Sidebar({ currentView, setView, role }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Sanctuary', icon: LayoutDashboard },
    { id: 'meditation', label: 'Serenity', icon: Flower2 },
    { id: 'burnout', label: 'Prevention', icon: AlertTriangle },
    { id: 'training', label: 'Wisdom', icon: BookOpen },
    { id: 'assessment', label: 'Clarity', icon: ClipboardCheck },
    { id: 'resources', label: 'Library', icon: Library },
    { id: 'support', label: 'Resonance', icon: Headphones },
  ];

  if (role === 'admin') {
    navItems.push({ id: 'admin', label: 'Insights', icon: ShieldCheck });
  }

  return (
    <aside className="hidden w-72 flex-col border-r border-border/40 bg-white md:flex">
      <div className="flex h-24 items-center gap-3 px-10">
        <div className="relative">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <div className="absolute -top-1.5 -right-1.5 h-2 w-2 rounded-full bg-accent animate-pulse" />
        </div>
        <h1 className="text-2xl font-display font-black tracking-tighter text-primary">CLARO</h1>
      </div>
      <nav className="flex-1 space-y-3 px-8 py-10">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              'w-full justify-start gap-5 rounded-2xl px-6 py-8 text-sm font-bold transition-all duration-300 relative group overflow-hidden',
              currentView === item.id 
                ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/20 scale-[1.02]' 
                : 'text-muted-foreground hover:bg-muted/50 hover:text-primary font-sage italic text-base'
            )}
            onClick={() => setView(item.id)}
          >
            <item.icon className={cn("h-5 w-5 transition-transform duration-500 group-hover:scale-110", currentView === item.id ? "text-accent" : "text-primary/40")} />
            {item.label}
            {currentView === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="absolute right-4 w-1.5 h-1.5 rounded-full bg-accent"
              />
            )}
          </Button>
        ))}
      </nav>
      <div className="p-8">
        <div className="rounded-[2rem] bg-background border border-border/40 p-8 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground opacity-50">Authorized Hub</p>
          <p className="mt-3 text-sm font-sage italic text-primary leading-relaxed">© 2024 Claro Alchemy</p>
          <div className="mt-6 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Resonance Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
