import React from 'react';
import { UserProfile } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { LogOut, Bell } from 'lucide-react';

interface NavbarProps {
  profile: UserProfile | null;
  onLogout: () => void;
}

export function Navbar({ profile, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 md:hidden">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <h2 className="text-xl font-extrabold tracking-tighter text-primary">CLARO</h2>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-primary"></span>
          </Button>
          <div className="flex items-center gap-4 border-l pl-6">
            <div className="hidden text-right md:block">
              <p className="text-sm font-bold text-foreground">{profile?.displayName}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{profile?.role}</p>
            </div>
            <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
              <AvatarImage src={profile?.photoURL} />
              <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">{profile?.displayName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={onLogout} title="Sign out" className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
