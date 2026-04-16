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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 rounded-full bg-secondary p-6 text-secondary-foreground"
        >
          <Send className="h-12 w-12" />
        </motion.div>
        <h2 className="text-3xl font-bold">Thank you for checking in!</h2>
        <p className="mt-2 text-muted-foreground">Your assessment has been recorded. This helps us tailor your wellness journey.</p>
        <Button className="mt-8 font-bold shadow-lg" onClick={() => setSubmitted(false)}>Submit Another Check-in</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <div className="welcome-section">
        <h1 className="text-3xl font-bold tracking-tight">Daily Check-in</h1>
        <p className="text-muted-foreground">How are you feeling today? Your responses are confidential.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-xl border-slate-100">
          <CardHeader>
            <CardTitle>Self-Assessment</CardTitle>
            <CardDescription>Take a moment to reflect on your current state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <Label className="text-sm font-bold uppercase tracking-widest text-slate-500">How is your mood today?</Label>
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMood(val)}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                      mood === val ? 'border-primary bg-blue-50 ring-2 ring-primary/10' : 'hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    {val === 1 && <Frown className={`h-8 w-8 ${mood === val ? 'text-primary' : 'text-slate-300'}`} />}
                    {val === 3 && <Meh className={`h-8 w-8 ${mood === val ? 'text-primary' : 'text-slate-300'}`} />}
                    {val === 5 && <Smile className={`h-8 w-8 ${mood === val ? 'text-primary' : 'text-slate-300'}`} />}
                    {val !== 1 && val !== 3 && val !== 5 && <div className={`h-8 w-8 rounded-full border-2 ${mood === val ? 'border-primary bg-primary' : 'border-slate-200'}`} />}
                    <span className="text-xs font-bold">{val}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-bold uppercase tracking-widest text-slate-500">Stress Level</Label>
                <span className="text-sm font-bold text-primary">
                  {stress === 1 ? 'Very Low' : stress === 2 ? 'Low' : stress === 3 ? 'Moderate' : stress === 4 ? 'High' : 'Very High'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={stress}
                onChange={(e) => setStress(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                <span>Calm</span>
                <span>Stressed</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-bold uppercase tracking-widest text-slate-500">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Anything else on your mind?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px] resize-none rounded-xl border-slate-200 focus:ring-primary/20"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full font-bold shadow-lg py-6" disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Submit Assessment
            </Button>
          </CardFooter>
        </Card>
      </form>

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-slate-400" />
          <h2 className="text-xl font-bold">Recent History</h2>
        </div>
        
        <div className="space-y-4">
          {loadingHistory ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
            </div>
          ) : history.length > 0 ? (
            history.map((item) => (
              <Card key={item.id} className="border-slate-100 card-hover">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${item.mood >= 4 ? 'bg-secondary text-secondary-foreground' : item.mood <= 2 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                      {item.mood >= 4 ? <Smile className="h-5 w-5" /> : item.mood <= 2 ? <Frown className="h-5 w-5" /> : <Meh className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold">Mood: {item.mood}/5 • Stress: {item.stressLevel}/5</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </p>
                    </div>
                  </div>
                  {item.notes && (
                    <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none text-[10px] font-bold uppercase">
                      Has Notes
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8 italic">No check-ins yet. Start your journey today!</p>
          )}
        </div>
      </div>
    </div>
  );
}
