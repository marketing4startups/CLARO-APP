import React, { useState, useEffect } from 'react';
import { UserProfile, Assessment } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Smile, Frown, Meh, Loader2, Send, History, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface AssessmentProps {
  profile: UserProfile | null;
}

export function AssessmentPage({ profile }: AssessmentProps) {
  const [mood, setMood] = useState<number>(3);
  const [stress, setStress] = useState<number>(3);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<Assessment[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!profile) return;
      try {
        const q = query(
          collection(db, 'assessments'),
          where('userId', '==', profile.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assessment));
        setHistory(docs);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoadingHistory(false);
      }
    }
    fetchHistory();
  }, [profile, submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'assessments'), {
        userId: profile.uid,
        mood,
        stressLevel: stress,
        notes,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setNotes('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'assessments');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center max-w-xl mx-auto">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-8 rounded-full bg-secondary/10 p-10 text-secondary border border-secondary/20 shadow-2xl shadow-secondary/10"
        >
          <Send className="h-16 w-16" />
        </motion.div>
        <h2 className="text-4xl font-display font-medium tracking-tight text-primary">Your Wisdom is Noted.</h2>
        <p className="mt-4 text-muted-foreground font-sage italic text-lg leading-relaxed">
          "The greatest clarity comes from regular reflection." Your check-in helps us pave the way for your wellbeing.
        </p>
        <Button className="mt-10 font-bold rounded-full py-7 px-10 shadow-xl shadow-primary/10 bg-primary text-primary-foreground" onClick={() => setSubmitted(false)}>
          Begin Another Reflection
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-16 py-8">
      <div className="welcome-section text-center">
        <h1 className="text-4xl font-display font-medium tracking-tight text-primary">Daily Sanctuary Check-in</h1>
        <p className="text-muted-foreground font-sage italic text-lg opacity-80 mt-2">
          Pause. Breathe. How is your inner landscape today?
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-2xl shadow-primary/5 border-border/40 bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-10 pb-4">
            <CardTitle className="text-2xl font-display font-medium tracking-tight text-primary">Self-Reflection</CardTitle>
            <CardDescription className="font-sage italic text-base">Your responses are a private bridge to your own resilience.</CardDescription>
          </CardHeader>
          <CardContent className="p-10 space-y-12">
            <div className="space-y-6">
              <Label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">Current Mood State</Label>
              <div className="flex justify-between gap-3">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMood(val)}
                    className={`flex flex-1 flex-col items-center gap-3 rounded-2xl border p-6 transition-all duration-300 ${
                      mood === val ? 'border-primary bg-primary/5 ring-4 ring-primary/5 scale-105 shadow-lg' : 'hover:bg-muted/50 border-border/40'
                    }`}
                  >
                    {val === 1 && <Frown className={`h-10 w-10 transition-colors ${mood === val ? 'text-primary' : 'text-muted-foreground/30'}`} />}
                    {val === 3 && <Meh className={`h-10 w-10 transition-colors ${mood === val ? 'text-primary' : 'text-muted-foreground/30'}`} />}
                    {val === 5 && <Smile className={`h-10 w-10 transition-colors ${mood === val ? 'text-primary' : 'text-muted-foreground/30'}`} />}
                    {val !== 1 && val !== 3 && val !== 5 && <div className={`h-10 w-10 rounded-full border-2 transition-all ${mood === val ? 'border-primary bg-primary shadow-inner scale-75' : 'border-muted-foreground/20'}`} />}
                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">{val}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 bg-muted/20 p-8 rounded-3xl border border-border/40">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">Intensity of Stress</Label>
                <Badge className="bg-primary text-primary-foreground rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest">
                  {stress === 1 ? 'Perfectly Calm' : stress === 2 ? 'At Ease' : stress === 3 ? 'Navigating' : stress === 4 ? 'Challenged' : 'Overwhelmed'}
                </Badge>
              </div>
              <div className="relative pt-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={stress}
                  onChange={(e) => setStress(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="absolute top-1/2 left-0 h-1.5 bg-primary rounded-full -z-10" style={{ width: `${(stress - 1) * 25}%` }} />
              </div>
              <div className="flex justify-between text-[8px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 px-1 pt-2">
                <span>Tranquil</span>
                <span>High Pressure</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="notes" className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground px-1">Internal Monologue (Private)</Label>
              <Textarea
                id="notes"
                placeholder="What words define your state right now?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[160px] resize-none rounded-[2rem] border-border/60 bg-muted/10 p-6 focus:ring-primary/10 font-sage italic text-lg leading-relaxed placeholder:opacity-30"
              />
            </div>
          </CardContent>
          <CardFooter className="p-10 pt-0">
            <Button type="submit" className="w-full font-bold shadow-2xl shadow-primary/10 py-8 rounded-full text-lg tracking-wide bg-primary text-primary-foreground hover:scale-[1.01] transition-transform" disabled={submitting}>
              {submitting ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <Send className="mr-3 h-5 w-5" />}
              Seal Reflection
            </Button>
          </CardFooter>
        </Card>
      </form>

      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <History className="h-5 w-5 text-primary opacity-30" />
          <h2 className="text-2xl font-display font-medium tracking-tight text-primary">Your Resilience Path</h2>
        </div>
        
        <div className="grid gap-4">
          {loadingHistory ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
            </div>
          ) : history.length > 0 ? (
            history.map((item) => (
              <Card key={item.id} className="border-border/40 bg-white/50 backdrop-blur-sm card-hover rounded-3xl group overflow-hidden">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 ${item.mood >= 4 ? 'bg-secondary/10 text-secondary' : item.mood <= 2 ? 'bg-red-50 text-red-600' : 'bg-primary/5 text-primary'}`}>
                      {item.mood >= 4 ? <Smile className="h-6 w-6" /> : item.mood <= 2 ? <Frown className="h-6 w-6" /> : <Meh className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-base font-bold text-foreground/80">State: {item.mood}/5</p>
                        <div className="h-1 w-1 rounded-full bg-border" />
                        <p className="text-sm font-medium text-muted-foreground italic font-sage">Pressure: {item.stressLevel}/5</p>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 opacity-50" />
                        {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString(undefined, { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                      </p>
                    </div>
                  </div>
                  {item.notes && (
                    <Badge variant="ghost" className="bg-muted text-muted-foreground border-none text-[8px] font-bold uppercase tracking-[0.2em] px-4 py-1 rounded-full">
                      Journaled
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 bg-muted/10 rounded-[2.5rem] border border-dashed border-border/60">
              <p className="text-base text-muted-foreground font-sage italic opacity-60">"Every journey starts with a single point of data." Start yours above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
