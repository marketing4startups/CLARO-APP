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
    <div className="space-y-8">
      <div className="welcome-section flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor organization-wide wellness and engagement.</p>
        </div>
        <Button variant="outline" className="gap-2 font-bold shadow-sm">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Employees</span>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-[10px] font-bold text-emerald-600 mt-1">+4 this month</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Avg. Engagement</span>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-[10px] font-bold text-emerald-600 mt-1">+5% from last month</p>
          </CardContent>
        </Card>
        <Card className="card-hover border-accent/20 bg-accent/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Ephemeral Insights</span>
            <Lock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{privacyStats.uniqueViews}</div>
            <p className="text-[10px] font-bold text-muted-foreground mt-1">Estimated Anonymous Visitors</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Employee Wellness Distribution</CardTitle>
            <CardDescription>Based on engagement and points.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
            <CardDescription>Latest employee check-ins (Anonymized).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessments.map((a, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="text-sm font-medium">Employee {a.userId.substring(0, 4)}...</p>
                    <p className="text-xs text-muted-foreground">{new Date(a.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={a.mood > 3 ? 'default' : 'secondary'}>Mood: {a.mood}</Badge>
                    <Badge variant={a.stressLevel > 3 ? 'destructive' : 'outline'}>Stress: {a.stressLevel}</Badge>
                  </div>
                </div>
              ))}
              {assessments.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">No assessment data yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
