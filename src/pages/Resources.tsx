import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { BookOpen, Wind, Brain, Heart, Search, ExternalLink, Play } from 'lucide-react';
import { Input } from '../components/ui/input';
import { motion, AnimatePresence } from 'motion/react';

const resources = [
  {
    id: 'r1',
    title: 'Managing Workplace Burnout',
    description: 'Identify the signs of burnout and learn practical strategies to reclaim your energy.',
    category: 'Article',
    readTime: '8 min',
    icon: Brain,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'r2',
    title: 'The Science of Better Sleep',
    description: 'How sleep impacts your cognitive performance and emotional resilience.',
    category: 'Guide',
    readTime: '12 min',
    icon: Heart,
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    id: 'r3',
    title: 'Desk Yoga: 5-Minute Flow',
    description: 'Quick stretches you can do at your desk to release tension and improve posture.',
    category: 'Exercise',
    readTime: '5 min',
    icon: Wind,
    color: 'bg-emerald-100 text-emerald-600'
  },
  {
    id: 'r4',
    title: 'Digital Detox Handbook',
    description: 'Setting boundaries with technology to improve focus and mental clarity.',
    category: 'Guide',
    readTime: '10 min',
    icon: Brain,
    color: 'bg-amber-100 text-amber-600'
  }
];

export function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');

  // Simple breathing exercise logic
  React.useEffect(() => {
    let timer: any;
    if (isBreathing) {
      const phases: ('Inhale' | 'Hold' | 'Exhale' | 'Pause')[] = ['Inhale', 'Hold', 'Exhale', 'Pause'];
      let currentIdx = 0;
      
      const runPhase = () => {
        setBreathPhase(phases[currentIdx]);
        timer = setTimeout(() => {
          currentIdx = (currentIdx + 1) % phases.length;
          runPhase();
        }, 4000); // 4 seconds per phase
      };
      
      runPhase();
    }
    return () => clearTimeout(timer);
  }, [isBreathing]);

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="welcome-section flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-display font-medium tracking-tight text-primary">Wellness Sanctuary Library</h1>
          <p className="text-muted-foreground font-sage italic text-lg opacity-80 mt-1">
            Curated wisdom to nourish your mental and physical resonance.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary opacity-30" />
          <Input 
            placeholder="Search the library..." 
            className="pl-12 rounded-full border-border/60 bg-white h-14 focus:ring-primary/10 font-sage italic text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-12">
          <div className="grid gap-8 sm:grid-cols-2">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="group overflow-hidden border-border/40 bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 rounded-[2rem]">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-primary/5 text-primary group-hover:scale-110 transition-transform duration-500`}>
                      <resource.icon className="h-6 w-6" />
                    </div>
                    <Badge className="bg-muted text-muted-foreground/60 border-none uppercase tracking-[0.25em] text-[8px] font-bold px-4 py-1.5 rounded-full">
                      {resource.category}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-display font-medium text-primary tracking-tight italic mb-3">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground font-sage italic line-clamp-2 mb-8 opacity-70 leading-relaxed">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/40">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">{resource.readTime} Journey</span>
                    <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5 rounded-full px-4 group-hover:translate-x-1 transition-transform">
                      Explore <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-primary text-primary-foreground border-none shadow-[0_32px_64px_-16px_rgba(15,23,42,0.2)] rounded-[3rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <CardContent className="p-12 flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="flex-1 space-y-8">
                <Badge className="bg-white/10 text-white border-white/20 uppercase tracking-[0.4em] text-[8px] font-bold px-6 py-2 rounded-full">
                  Guided Resonance
                </Badge>
                <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight leading-tight italic">Finding Focus in a <br /><span className="font-sage">Distracted World.</span></h2>
                <p className="text-primary-foreground/60 text-lg leading-relaxed font-sage italic">
                  A 15-minute guided session designed to help you anchor your attention and reduce cognitive load during high-resonance days.
                </p>
                <Button className="bg-white text-primary hover:bg-slate-100 font-bold px-10 py-8 rounded-full shadow-2xl shadow-primary/20 text-lg">
                  <Play className="mr-3 h-6 w-6 fill-current" /> Play Session
                </Button>
              </div>
              <div className="w-56 h-56 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center relative shrink-0">
                <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-10" />
                <Brain className="h-24 w-24 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-10">
          <Card className="overflow-hidden border-border/40 bg-secondary/5 shadow-xl shadow-secondary/5 rounded-[2.5rem] border">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
                <Wind className="h-4 w-4" />
                Resonance Tool: Box Breathing
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-10 text-center">
              <div className="relative mb-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={breathPhase}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: breathPhase === 'Inhale' ? 1.3 : breathPhase === 'Exhale' ? 0.8 : 1,
                      opacity: 1 
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className={`w-40 h-40 rounded-full flex items-center justify-center border-2 transition-all duration-1000 ${
                      isBreathing ? 'border-secondary bg-secondary/10 shadow-[0_0_50px_-10px_rgba(16,185,129,0.3)]' : 'border-border/60 bg-muted/50'
                    }`}
                  >
                    <span className="text-base font-display font-medium text-primary tracking-tight italic">
                      {isBreathing ? breathPhase : 'Ready?'}
                    </span>
                  </motion.div>
                </AnimatePresence>
                {isBreathing && (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 rounded-full border border-dashed border-secondary/30"
                  />
                )}
              </div>
              
              <p className="text-sm font-sage italic text-muted-foreground mb-8 max-w-[240px] px-2 opacity-60">
                Box breathing is a powerful technique architected to calm the central nervous system instantly.
              </p>
              
              <Button 
                onClick={() => setIsBreathing(!isBreathing)}
                className={`w-full font-bold shadow-2xl py-8 rounded-full text-base tracking-wide transition-all ${
                  isBreathing ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-primary-foreground hover:bg-secondary/90 shadow-secondary/20'
                }`}
              >
                {isBreathing ? 'Halt Resonance' : 'Initiate 4-4-4-4'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-white shadow-xl shadow-primary/5 rounded-[2.5rem]">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500">Immediate Shield</CardTitle>
              <CardDescription className="text-xs font-sage italic">If you are in deep turbulence, reach out immediately.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="p-6 rounded-3xl bg-red-50 border border-red-100 group hover:scale-[1.02] transition-transform">
                <p className="text-[9px] font-bold text-red-600 uppercase tracking-[0.3em] mb-2">Global Crisis Line</p>
                <p className="text-3xl font-display font-medium text-red-700 tracking-tighter">988</p>
              </div>
              <div className="p-6 rounded-3xl bg-muted/30 border border-border/40 group hover:scale-[1.02] transition-transform">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-2">Private Text Support</p>
                <p className="text-2xl font-display font-medium text-primary tracking-tight">Text HOME to 741741</p>
              </div>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.4em] text-center opacity-40">
                24/7 • Secure • Free
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
