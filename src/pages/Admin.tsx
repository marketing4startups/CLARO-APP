import React, { useState, useEffect } from 'react';
import { UserProfile, Assessment } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Users, TrendingUp, AlertCircle, Download, Lock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Button } from '../components/ui/button';

interface AdminProps {
  profile: UserProfile | null;
}

const COLORS = ['#0F4C75', '#FFB347', '#E0F2F1', '#64748B', '#8b5cf6'];

export function AdminPage({ profile }: AdminProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [privacyStats, setPrivacyStats] = useState<{ uniqueViews: number }>({ uniqueViews: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        setUsers(usersSnapshot.docs.map(doc => doc.data() as UserProfile));

        const assessmentsSnapshot = await getDocs(query(collection(db, 'assessments'), orderBy('createdAt', 'desc'), limit(10)));
        setAssessments(assessmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assessment)));

        // Fetch Ephemeral Insights
        const response = await fetch('/api/stats');
        if (response.ok) {
          setPrivacyStats(await response.json());
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'admin_data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (profile?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  const moodDistribution = [
    { name: 'Very Happy', value: users.filter(u => u.points > 1000).length },
    { name: 'Happy', value: users.filter(u => u.points > 500 && u.points <= 1000).length },
    { name: 'Neutral', value: users.filter(u => u.points <= 500).length },
  ];

  return (
    <div className="space-y-12">
      <div className="welcome-section flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-display font-medium tracking-tight text-primary">Organizational Insights</h1>
          <p className="text-muted-foreground font-sage italic text-lg opacity-80 mt-1">
            Visualizing the collective resonance and vitality of your team.
          </p>
        </div>
        <Button variant="outline" className="gap-3 font-bold border-border/60 text-muted-foreground rounded-full px-8 h-14 hover:bg-muted/50">
          <Download className="h-4 w-4" />
          Export Strategic Report
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {[
          { icon: Users, label: 'Resonant Members', val: users.length, detail: '+4 this wave', color: 'primary' },
          { icon: TrendingUp, label: 'Collective Vitality', val: '78%', detail: '+5% elevation', color: 'secondary' },
          { icon: Lock, label: 'Ephemeral Echoes', val: privacyStats.uniqueViews, detail: 'Anonymous Visitors', color: 'accent' }
        ].map((stat, i) => (
          <Card key={i} className="group p-8 border-border/40 bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 rounded-[2.5rem]">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className={`p-4 rounded-2xl bg-muted/30 text-${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <Badge className={`bg-white shadow-sm border-border/20 text-${stat.color} text-[8px] font-bold uppercase tracking-[0.2em]`}>
                  {stat.detail}
                </Badge>
              </div>
              <div>
                <CardDescription className="font-display font-medium text-muted-foreground tracking-widest uppercase text-[10px] mb-1">{stat.label}</CardDescription>
                <div className="text-4xl font-display font-medium text-primary tracking-tight">{stat.val}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="rounded-[2.5rem] border-border/40 shadow-xl shadow-primary/5 bg-white overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-2xl font-display font-medium tracking-tight text-primary italic">Vitality Distribution</CardTitle>
            <CardDescription className="font-sage italic text-sm">Collective engagement levels across the organization.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] p-8 -mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '24px', 
                    border: '1px solid rgba(15, 23, 42, 0.1)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    padding: '16px'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground ml-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/40 shadow-xl shadow-primary/5 bg-white overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-2xl font-display font-medium tracking-tight text-primary italic">Recent Self-Reflections</CardTitle>
            <CardDescription className="font-sage italic text-sm">Aggregated anonymized pulses from the team.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="space-y-4">
              {assessments.map((a, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/20 group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-[10px] font-bold text-primary group-hover:scale-110 transition-transform">
                      {a.userId.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground/80 leading-tight">Member Echo</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                        {new Date(a.createdAt?.seconds * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`${a.mood > 3 ? 'bg-secondary/10 text-secondary' : 'bg-muted text-muted-foreground'} border-none text-[8px] font-bold uppercase px-3`}>Mood {a.mood}</Badge>
                    <Badge className={`${a.stressLevel > 3 ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'} border-none text-[8px] font-bold uppercase px-3`}>Stress {a.stressLevel}</Badge>
                  </div>
                </div>
              ))}
              {assessments.length === 0 && (
                <div className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border/60">
                  <p className="text-sm font-sage italic text-muted-foreground opacity-60">Waiting for collective pulses...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
