import React from 'react';
import { UserProfile } from '../types';
import { WellnessTip } from '../components/WellnessTip';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Trophy, Target, Zap, Clock, Award, ClipboardCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DashboardProps {
  profile: UserProfile | null;
}

const mockActivityData = [
  { name: 'Mon', stress: 2, mood: 4 },
  { name: 'Tue', stress: 3, mood: 3 },
  { name: 'Wed', stress: 4, mood: 2 },
  { name: 'Thu', stress: 2, mood: 5 },
  { name: 'Fri', stress: 1, mood: 4 },
  { name: 'Sat', stress: 1, mood: 5 },
  { name: 'Sun', stress: 2, mood: 4 },
];

export function Dashboard({ profile }: DashboardProps) {
  const nextBadgePoints = 500;
  const progress = ((profile?.points || 0) / nextBadgePoints) * 100;

  return (
    <div className="space-y-8">
      <div className="welcome-section">
        <h1 className="text-3xl font-display font-medium tracking-tight">Welcome back, {profile?.displayName?.split(' ')[0]}</h1>
        <p className="text-muted-foreground font-sage italic text-lg opacity-80 mt-1">You've completed {Math.round(progress)}% of your mental wellness goals this month.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <Card className="hero-module overflow-hidden border-none bg-primary text-white shadow-xl">
            <CardContent className="p-8">
              <Badge variant="secondary" className="mb-6 bg-white/10 text-white hover:bg-white/20 border-none uppercase tracking-wider text-[10px] font-bold">
                Current Module
              </Badge>
              <h2 className="text-3xl font-bold leading-tight max-w-md font-display">Resilience in High-Pressure Environments</h2>
              <div className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 font-bold shadow-lg">
                  Resume Learning
                </Button>
                <div className="text-sm text-white/80 font-bold uppercase tracking-widest">
                  12m remaining • 4 Lessons
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <Card className="card-hover">
              <CardContent className="p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Streak</span>
                <span className="text-xl font-bold text-accent">12 Days 🔥</span>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardContent className="p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Modules</span>
                <span className="text-xl font-bold">{profile?.completedModules?.length || 0} Completed</span>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardContent className="p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Next Check-in</span>
                <span className="text-xl font-bold">Tomorrow</span>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Weekly Progress</CardTitle>
              <CardDescription>Your mood and stress levels over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockActivityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'white' }} />
                  <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: 'white' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="sidebar space-y-8">
          <Card className="bg-white border-border/40 text-center p-8 card-hover shadow-2xl shadow-primary/5">
            <CardContent className="p-0 space-y-4">
              <div className="flex justify-center -space-x-3 mb-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-14 h-14 rounded-full border-4 border-background bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shadow-xl overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/expert-${i}/100/100`} 
                      alt="Expert" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
              <h3 className="text-xl font-medium font-display tracking-tight text-primary">Expert Support</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sage italic px-2">
                "We provide the bridge between expert evidence and personalized care."
              </p>
              <Button className="w-full font-bold shadow-xl shadow-primary/10 bg-primary hover:bg-primary/90 rounded-full py-6 mt-4">Start Consultation</Button>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Badges</span>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                {['🧘', '⚡', '🏆'].map((emoji, i) => (
                  <div key={i} className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center text-xl shadow-sm border border-accent/10">
                    {emoji}
                  </div>
                ))}
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl opacity-50">
                  🔒
                </div>
              </div>
              <div className="space-y-2">
                <Progress value={progress} className="h-1.5" />
                <p className="text-[10px] font-medium text-muted-foreground">Next reward at 500 XP</p>
              </div>
            </CardContent>
          </Card>

          <WellnessTip />
        </div>
      </div>
    </div>
  );
}
