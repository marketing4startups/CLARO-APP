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
    <div className="space-y-8">
      <div className="welcome-section">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Expert Support</h1>
        <p className="text-muted-foreground">Connect with certified professionals for personalized wellness guidance.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="grid gap-6">
            {experts.map((expert) => (
              <Card key={expert.id} className="card-hover overflow-hidden border-slate-100">
                <CardContent className="p-0 flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-48 md:h-auto bg-slate-100 relative">
                    <img 
                      src={expert.image} 
                      alt={expert.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 text-slate-900 backdrop-blur-sm border-none font-bold text-[10px] uppercase tracking-wider">
                        {expert.specialty}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xl font-bold">{expert.name}</h3>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-bold text-slate-700">{expert.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mb-4">{expert.title}</p>
                      
                      <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-blue-500" />
                          {expert.availability}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Video className="h-3.5 w-3.5 text-blue-500" />
                          Video Call
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                          Chat
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center gap-3">
                      <Button onClick={() => handleBook(expert)} className="flex-1 font-bold shadow-md">
                        Book Session
                      </Button>
                      <Button variant="outline" className="font-bold border-slate-200">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <Card className="bg-blue-600 text-white border-none shadow-xl overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Confidential & Secure</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                All consultations are end-to-end encrypted and HIPAA compliant. Your privacy is our top priority.
              </p>
              <ul className="space-y-3">
                {['No data shared with HR', 'Private video rooms', 'Anonymous if preferred'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <div className="h-1 w-1 rounded-full bg-blue-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-slate-100">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Your Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-700">No upcoming sessions</p>
                <p className="text-xs text-muted-foreground mt-1">Your scheduled consultations will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedExpert} onOpenChange={() => setSelectedExpert(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Book Session</DialogTitle>
            <DialogDescription>
              Schedule your 30-minute consultation with {selectedExpert?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Avatar className="h-12 w-12 border-2 border-white">
                <AvatarImage src={selectedExpert?.image} />
                <AvatarFallback>{selectedExpert?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-slate-900">{selectedExpert?.name}</p>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{selectedExpert?.title}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Time (Today)</p>
              <div className="grid grid-cols-2 gap-2">
                {['2:30 PM', '3:00 PM', '4:30 PM', '5:00 PM'].map((time) => (
                  <Button key={time} variant="outline" className="font-bold border-slate-200 hover:border-primary hover:bg-blue-50">
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-between gap-4">
            <Button variant="ghost" onClick={() => setSelectedExpert(null)} className="font-bold">Cancel</Button>
            <Button className="font-bold shadow-lg px-8">
              Confirm Booking <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
