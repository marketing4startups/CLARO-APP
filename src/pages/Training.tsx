import React, { useState, useEffect } from 'react';
import { UserProfile, TrainingModule } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { BookOpen, Clock, Zap, CheckCircle2, PlayCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';

interface TrainingProps {
  profile: UserProfile | null;
}

const mockModules: TrainingModule[] = [
  {
    id: 'm1',
    title: 'Mindful Breathing',
    description: 'Learn the basics of mindful breathing to reduce immediate stress.',
    content: 'Mindful breathing is a simple yet powerful technique... (Full content here)',
    category: 'Mindfulness',
    duration: '10 min',
    points: 100
  },
  {
    id: 'm2',
    title: 'Work-Life Balance',
    description: 'Strategies for setting boundaries and managing your time effectively.',
    content: 'Setting boundaries is essential for long-term productivity... (Full content here)',
    category: 'Productivity',
    duration: '15 min',
    points: 150
  },
  {
    id: 'm3',
    title: 'Resilience at Work',
    description: 'Building mental toughness to handle workplace challenges.',
    content: 'Resilience is not about avoiding stress, but learning how to bounce back...',
    category: 'Resilience',
    duration: '20 min',
    points: 200
  }
];

export function Training({ profile }: TrainingProps) {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    async function fetchModules() {
      try {
        const querySnapshot = await getDocs(collection(db, 'modules'));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrainingModule));
        setModules(docs.length > 0 ? docs : mockModules);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'modules');
      } finally {
        setLoading(false);
      }
    }
    fetchModules();
  }, []);

  const handleComplete = async (moduleId: string, points: number) => {
    if (!profile) return;
    setCompleting(true);
    try {
      const userRef = doc(db, 'users', profile.uid);
      await updateDoc(userRef, {
        completedModules: arrayUnion(moduleId),
        points: increment(points)
      });
      // In a real app, we'd update the local profile state or re-fetch
      setSelectedModule(null);
      alert(`Congratulations! You've earned ${points} points.`);
      window.location.reload(); // Simple way to refresh state for this demo
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${profile.uid}`);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Training Modules</h1>
        <p className="text-muted-foreground">Expand your knowledge and earn points for your wellness journey.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const isCompleted = profile?.completedModules?.includes(module.id);
          return (
            <Card key={module.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg card-hover border-slate-100">
              <div className="h-32 bg-secondary/30 p-6 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-primary/20" />
              </div>
              <CardHeader className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none uppercase tracking-wider text-[10px] font-bold">
                    {module.category}
                  </Badge>
                  {isCompleted && (
                    <Badge variant="default" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-none uppercase tracking-wider text-[10px] font-bold">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-bold font-display">{module.title}</CardTitle>
                <CardDescription className="line-clamp-2">{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {module.duration}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-accent" />
                    {module.points} pts
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  className="w-full font-bold" 
                  variant={isCompleted ? 'outline' : 'default'}
                  onClick={() => setSelectedModule(module)}
                >
                  {isCompleted ? 'Review Module' : 'Start Module'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedModule?.title}</DialogTitle>
            <DialogDescription>
              Category: {selectedModule?.category} | Duration: {selectedModule?.duration}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto py-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p>{selectedModule?.content}</p>
              <div className="mt-8 p-4 bg-muted rounded-lg border">
                <h4 className="font-semibold mb-2">Key Takeaways:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Practice consistently for best results.</li>
                  <li>Set aside dedicated time without distractions.</li>
                  <li>Track your progress in the dashboard.</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelectedModule(null)}>Close</Button>
            {!profile?.completedModules?.includes(selectedModule?.id || '') && (
              <Button 
                onClick={() => handleComplete(selectedModule!.id, selectedModule!.points)}
                disabled={completing}
              >
                {completing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                Complete Module
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Loader2 } from 'lucide-react';
