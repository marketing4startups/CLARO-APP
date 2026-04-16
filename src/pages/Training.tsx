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
    <div className="space-y-12">
      <div className="welcome-section">
        <h1 className="text-3xl font-display font-medium tracking-tight text-primary">Training Sanctuary</h1>
        <p className="text-muted-foreground font-sage italic text-lg opacity-80 mt-1">
          Expand your knowledge and earn vitality points for your wellness journey.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const isCompleted = profile?.completedModules?.includes(module.id);
          return (
            <Card key={module.id} className="group flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1.5 border-border/40 bg-white">
              <div className="h-40 bg-background/50 p-6 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <BookOpen className="h-16 w-16 text-primary/20 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4">
                  {isCompleted && (
                    <Badge className="bg-secondary/20 text-secondary border-secondary/30 uppercase tracking-[0.2em] text-[9px] font-bold px-3">
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
              <CardHeader className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none uppercase tracking-[0.2em] text-[9px] font-bold px-3">
                    {module.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-display font-medium text-primary tracking-tight">{module.title}</CardTitle>
                <CardDescription className="line-clamp-2 font-sage italic text-sm opacity-80 leading-relaxed">{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-primary/40" />
                    {module.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-accent" />
                    {module.points} pts
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-6 px-6">
                <Button 
                  className={`w-full font-bold transition-all duration-300 rounded-full py-6 flex items-center justify-center gap-2 ${isCompleted ? 'bg-muted/50 text-muted-foreground hover:bg-muted font-display uppercase tracking-widest text-[10px]' : 'bg-primary text-primary-foreground shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02]'}`}
                  variant={isCompleted ? 'ghost' : 'default'}
                  onClick={() => setSelectedModule(module)}
                >
                  {isCompleted ? 'Review Wisdom' : (
                    <>
                      <PlayCircle className="h-4 w-4" />
                      Start Module
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
        <DialogContent className="max-w-2xl rounded-[2rem] overflow-hidden border-none shadow-2xl p-0">
          <div className="bg-primary p-12 text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <BookOpen className="h-48 w-48" />
            </div>
            <div className="relative z-10">
              <Badge className="bg-white/10 text-white border-white/20 mb-6 uppercase tracking-[0.3em] text-[8px] font-bold px-4 py-1.5">
                {selectedModule?.category} Wisdom
              </Badge>
              <DialogTitle className="text-4xl md:text-5xl font-display font-medium tracking-tight leading-tight">
                {selectedModule?.title}
              </DialogTitle>
              <p className="mt-4 text-primary-foreground/70 font-sage italic text-lg decoration-accent/30 decoration-2 underline-offset-8">
                Duration: {selectedModule?.duration} • Award: {selectedModule?.points} Vitality Points
              </p>
            </div>
          </div>
          
          <div className="max-h-[50vh] overflow-y-auto px-12 py-10 bg-background">
            <div className="prose prose-slate max-w-none">
              <p className="text-xl leading-relaxed font-sage italic text-foreground/80 first-letter:text-6xl first-letter:font-display first-letter:font-bold first-letter:text-primary first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8]">
                {selectedModule?.content}
              </p>
              
              <div className="mt-16 p-10 bg-muted/30 rounded-[2.5rem] border border-border/40 relative">
                <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-accent flex items-center justify-center text-primary shadow-lg">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="font-display font-medium text-primary text-xl mb-6 tracking-tight italic">Key Takeaways for Growth</h4>
                <ul className="grid gap-5">
                  {[
                    'Awareness is the first step toward lasting mental clarity.',
                    'Consistent micro-habits lead to exponential resilience.',
                    'Your wellbeing is the foundation of your professional clearity.'
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-4 group">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2.5 shrink-0" />
                      <span className="text-base font-medium text-foreground/70 font-sage italic leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="px-12 py-8 bg-muted/10 border-t border-border/40 flex items-center justify-between gap-4">
            <Button variant="ghost" className="rounded-full font-bold uppercase tracking-widest text-[9px] px-8" onClick={() => setSelectedModule(null)}>Dismiss</Button>
            {!profile?.completedModules?.includes(selectedModule?.id || '') && (
              <Button 
                className="rounded-full px-10 py-7 font-bold shadow-2xl shadow-primary/20 bg-primary text-primary-foreground hover:scale-[1.02] transition-transform"
                onClick={() => handleComplete(selectedModule!.id, selectedModule!.points)}
                disabled={completing}
              >
                {completing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5 text-accent" />}
                Claim Vitality Points
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Loader2 } from 'lucide-react';
