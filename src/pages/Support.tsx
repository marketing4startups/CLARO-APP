import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Calendar, Clock, Video, MessageSquare, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';

const experts = [
  {
    id: 'e1',
    name: 'Dr. Sarah Jenkins',
    title: 'Clinical Psychologist',
    specialty: 'Stress & Anxiety',
    rating: 4.9,
    reviews: 124,
    availability: 'Available in 15m',
    image: 'https://i.pravatar.cc/150?u=sarah'
  },
  {
    id: 'e2',
    name: 'Marcus Chen',
    title: 'Executive Coach',
    specialty: 'Leadership & Burnout',
    rating: 4.8,
    reviews: 89,
    availability: 'Tomorrow, 9:00 AM',
    image: 'https://i.pravatar.cc/150?u=marcus'
  },
  {
    id: 'e3',
    name: 'Elena Rodriguez',
    title: 'Mindfulness Expert',
    specialty: 'Meditation & Focus',
    rating: 5.0,
    reviews: 210,
    availability: 'Available Now',
    image: 'https://i.pravatar.cc/150?u=elena'
  }
];

export function Support() {
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState(1);

  const handleBook = (expert: any) => {
    setSelectedExpert(expert);
    setBookingStep(1);
  };

  return (
    <div className="space-y-12">
      <div className="welcome-section">
        <h1 className="text-3xl font-display font-medium tracking-tight text-primary">Expert Guidance Sanctuary</h1>
        <p className="text-muted-foreground font-sage italic text-lg opacity-80 mt-1">
          Connect with world-class professionals for tailored mental resonance.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <div className="grid gap-8">
            {experts.map((expert) => (
              <Card key={expert.id} className="group overflow-hidden border-border/40 bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
                <CardContent className="p-0 flex flex-col md:flex-row">
                  <div className="w-full md:w-56 h-64 md:h-auto bg-background/50 relative overflow-hidden">
                    <img 
                      src={expert.image} 
                      alt={expert.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-white/95 text-primary backdrop-blur-md border-none font-bold text-[8px] uppercase tracking-[0.3em] px-4 py-1.5 shadow-xl">
                        {expert.specialty}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-display font-medium text-primary tracking-tight italic">{expert.name}</h3>
                        <div className="flex items-center gap-1.5 text-accent">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-bold text-primary opacity-60">{expert.rating}</span>
                        </div>
                      </div>
                      <p className="text-base font-sage italic text-muted-foreground mb-6 opacity-80">{expert.title}</p>
                      
                      <div className="flex flex-wrap gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-secondary" />
                          {expert.availability}
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-secondary" />
                          Secure Video
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-secondary" />
                          Direct Chat
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-10 flex items-center gap-4">
                      <Button onClick={() => handleBook(expert)} className="flex-1 font-bold shadow-2xl shadow-primary/10 bg-primary text-primary-foreground rounded-full py-7 group-hover:scale-[1.02] transition-transform">
                        Schedule Resonance Session
                      </Button>
                      <Button variant="outline" className="font-bold border-border/60 text-muted-foreground rounded-full h-14 w-14 p-0 hover:bg-muted">
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          <Card className="bg-primary text-primary-foreground border-none shadow-[0_32px_64px_-16px_rgba(15,23,42,0.2)] rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
            
            <CardContent className="p-10 space-y-8 relative z-10">
              <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center border border-white/20">
                <ShieldCheck className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-medium tracking-tight italic mb-3">Sacredly Secure</h3>
                <p className="text-primary-foreground/60 text-base leading-relaxed font-sage italic">
                  Claro utilizes bank-grade, end-to-end encryption. Your identity remains an unreadable echo to the rest of the organization.
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  'Identity Anonymity Shield',
                  'HIPAA-Level Compliance',
                  'Zero Attribution Policy'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-white shadow-xl shadow-primary/5 rounded-[2rem]">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Recent Resonances</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6 border border-dashed border-border/60">
                  <Calendar className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <p className="text-lg font-display font-medium text-primary tracking-tight">Quiet Waters</p>
                <p className="text-sm font-sage italic text-muted-foreground mt-2 px-4 opacity-60">Your upcoming sessions will be visualised here.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedExpert} onOpenChange={() => setSelectedExpert(null)}>
        <DialogContent className="max-w-md rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-background p-10 space-y-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-125" />
                <Avatar className="h-32 w-32 border-8 border-white shadow-2xl relative z-10">
                  <AvatarImage src={selectedExpert?.image} />
                  <AvatarFallback className="bg-primary text-white text-3xl font-display">{selectedExpert?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-display font-medium text-primary tracking-tight italic">{selectedExpert?.name}</h3>
                <p className="text-[10px] font-bold text-accent uppercase tracking-[0.3em]">{selectedExpert?.title}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/40">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-center">Select Your Convergence Window</p>
              <div className="grid grid-cols-2 gap-3">
                {['2:30 PM', '3:00 PM', '4:30 PM', '5:00 PM'].map((time) => (
                  <Button 
                    key={time} 
                    variant="outline" 
                    className="font-bold border-border/40 hover:border-primary hover:bg-primary/5 rounded-2xl h-14 transition-all hover:scale-[1.02]"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 text-center">
              <p className="text-sm font-sage italic text-primary/70">
                "Finding clarity in the noise is a shared pursuit. Let's begin."
              </p>
            </div>
          </div>

          <div className="p-10 bg-muted/20 border-t border-border/40 flex flex-col gap-4">
            <Button className="w-full font-bold shadow-2xl shadow-primary/20 bg-primary text-primary-foreground rounded-full py-8 text-lg tracking-wide hover:scale-[1.02] transition-transform">
              Confirm Resonance
            </Button>
            <Button variant="ghost" onClick={() => setSelectedExpert(null)} className="font-bold uppercase tracking-widest text-[9px] text-muted-foreground hover:bg-transparent">
              Maybe another time
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
