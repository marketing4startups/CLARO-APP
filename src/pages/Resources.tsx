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
    <div className="space-y-8">
      <div className="welcome-section flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Wellness Library</h1>
          <p className="text-muted-foreground">Expert-curated resources to support your mental and physical well-being.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search resources..." 
            className="pl-10 rounded-xl border-slate-200 focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="card-hover overflow-hidden border-slate-100">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${resource.color}`}>
                      <resource.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none uppercase tracking-wider text-[10px] font-bold">
                      {resource.category}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{resource.readTime}</span>
                    <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-blue-50">
                      Read More <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-slate-900 text-white border-none overflow-hidden shadow-2xl">
            <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-6">
                <Badge className="bg-blue-500/20 text-blue-400 border-none uppercase tracking-widest text-[10px] font-bold">
                  Guided Meditation
                </Badge>
                <h2 className="text-3xl font-bold leading-tight">Finding Focus in a Distracted World</h2>
                <p className="text-slate-400 leading-relaxed">
                  A 15-minute guided session designed to help you anchor your attention and reduce cognitive load during busy workdays.
                </p>
                <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 py-6 rounded-xl shadow-lg">
                  <Play className="mr-2 h-5 w-5 fill-current" /> Play Session
                </Button>
              </div>
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-20" />
                <Brain className="h-20 w-20 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="overflow-hidden border-none bg-emerald-50 shadow-sm card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                <Wind className="h-3.5 w-3.5" />
                Quick Tool: Box Breathing
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-8 text-center">
              <div className="relative mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={breathPhase}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: breathPhase === 'Inhale' ? 1.2 : breathPhase === 'Exhale' ? 0.8 : 1,
                      opacity: 1 
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${
                      isBreathing ? 'border-emerald-500 bg-emerald-100' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <span className="text-sm font-bold text-emerald-700">
                      {isBreathing ? breathPhase : 'Ready?'}
                    </span>
                  </motion.div>
                </AnimatePresence>
                {isBreathing && (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 rounded-full border-2 border-dashed border-emerald-300"
                  />
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mb-6 max-w-[200px]">
                Box breathing is a powerful technique used to calm the nervous system.
              </p>
              
              <Button 
                onClick={() => setIsBreathing(!isBreathing)}
                className={`w-full font-bold shadow-md ${
                  isBreathing ? 'bg-slate-800 hover:bg-slate-900' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isBreathing ? 'Stop Exercise' : 'Start 4-4-4-4'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-100 card-hover">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Emergency Support</CardTitle>
              <CardDescription className="text-xs">If you are in immediate crisis, please reach out.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Global Crisis Line</p>
                <p className="text-lg font-bold text-red-700">988</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Text Support</p>
                <p className="text-lg font-bold text-slate-700">Text HOME to 741741</p>
              </div>
              <p className="text-[10px] text-muted-foreground text-center italic">
                Available 24/7 • Confidential • Free
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
