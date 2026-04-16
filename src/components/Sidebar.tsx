import React from 'react';
import { LayoutDashboard, BookOpen, ClipboardCheck, ShieldCheck, Heart, Library, Headphones } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

interface SidebarProps {
  currentView: string;
  setView: (view: any) => void;
  role?: string;
}

export function Sidebar({ currentView, setView, role }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'training', label: 'Training', icon: BookOpen },
    { id: 'assessment', label: 'Assessment', icon: ClipboardCheck },
    { id: 'resources', label: 'Resources', icon: Library },
    { id: 'support', label: 'Support', icon: Headphones },
  ];

  if (role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin', icon: ShieldCheck });
  }

  return (
    <aside className="hidden w-64 flex-col border-r bg-white md:flex">
      <div className="flex h-16 items-center gap-2 px-10">
        <div className="relative">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <div className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-accent" />
        </div>
        <h1 className="text-xl font-extrabold tracking-tighter text-primary">CLARO</h1>
      </div>
      <nav className="flex-1 space-y-2 px-6 py-8">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              'w-full justify-start gap-4 rounded-xl px-4 py-6 text-sm font-bold transition-all',
              currentView === item.id 
                ? 'bg-blue-50 text-primary shadow-sm' 
                : 'text-muted-foreground hover:bg-slate-50 hover:text-foreground'
            )}
            onClick={() => setView(item.id)}
          >
            <item.icon className={cn("h-5 w-5", currentView === item.id ? "text-primary" : "text-muted-foreground")} />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="p-6">
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Enterprise Edition</p>
          <p className="mt-2 text-xs font-medium text-slate-600 leading-relaxed">© 2024 Claro Health</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">PWA Installed</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
