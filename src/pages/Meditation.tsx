import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MeditationGuide, MeditationSession, UserProfile } from '../types';
import { MeditationLibrary } from '../components/MeditationLibrary';
import { MeditationTimer } from '../components/MeditationTimer';
import { WellnessDashboard } from '../components/WellnessDashboard';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface MeditationPageProps {
  profile: UserProfile | null;
}

// Sample meditation guides
const MEDITATION_GUIDES: MeditationGuide[] = [
  {
    id: '1',
    title: 'Box Breathing for Stress Relief',
    description: 'A simple yet powerful breathing technique to calm your mind and reduce stress instantly.',
    category: 'breathing',
    durationMinutes: 5,
    audioUrl: 'https://example.com/audio/box-breathing.mp3',
    transcript: 'Focus on breathing in for 4 counts, holding for 4, exhaling for 4, and holding for 4...',
    difficulty: 'beginner',
    benefits: ['Stress Relief', 'Calm', 'Focus'],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    instructor: 'Sarah Chen'
  },
  {
    id: '2',
    title: 'Body Scan Relaxation',
    description: 'Progressively relax each part of your body from head to toe for deep relaxation.',
    category: 'body-scan',
    durationMinutes: 10,
    audioUrl: 'https://example.com/audio/body-scan.mp3',
    transcript: 'Begin at the top of your head, noticing any tension...',
    difficulty: 'beginner',
    benefits: ['Relaxation', 'Body Awareness', 'Sleep'],
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0d0fccc4d632?w=400',
    instructor: 'James Martinez'
  },
  {
    id: '3',
    title: 'Mindful Awareness Meditation',
    description: 'Develop present-moment awareness and observe your thoughts without judgment.',
    category: 'mindfulness',
    durationMinutes: 15,
    audioUrl: 'https://example.com/audio/mindfulness.mp3',
    transcript: 'Sit comfortably and bring your attention to your natural breath...',
    difficulty: 'intermediate',
    benefits: ['Focus', 'Clarity', 'Emotional Balance'],
    imageUrl: 'https://images.unsplash.com/photo-1598438081911-e0c5e3e0a2d5?w=400',
    instructor: 'Emma Wilson'
  },
  {
    id: '4',
    title: 'Guided Visualization',
    description: 'Immerse yourself in a peaceful, imaginary place to reduce anxiety and boost creativity.',
    category: 'visualization',
    durationMinutes: 20,
    audioUrl: 'https://example.com/audio/visualization.mp3',
    transcript: 'Picture yourself in a serene natural setting...',
    difficulty: 'intermediate',
    benefits: ['Creativity', 'Anxiety Relief', 'Peace'],
    imageUrl: 'https://images.unsplash.com/photo-1506209613408-eca07ce68773?w=400',
    instructor: 'Michael Zhang'
  },
  {
    id: '5',
    title: 'Loving-Kindness Meditation',
    description: 'Cultivate compassion and goodwill for yourself and others.',
    category: 'gratitude',
    durationMinutes: 15,
    audioUrl: 'https://example.com/audio/loving-kindness.mp3',
    transcript: 'May I be happy, may I be healthy, may I be safe...',
    difficulty: 'intermediate',
    benefits: ['Compassion', 'Gratitude', 'Connection'],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    instructor: 'Lisa Anderson'
  },
  {
    id: '6',
    title: 'Deep Sleep Meditation',
    description: 'Fall into deep, restorative sleep with this gentle guided meditation.',
    category: 'body-scan',
    durationMinutes: 30,
    audioUrl: 'https://example.com/audio/sleep.mp3',
    transcript: 'As you drift off to sleep, let go of the day...',
    difficulty: 'beginner',
    benefits: ['Sleep', 'Relaxation', 'Rest'],
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0d0fccc4d632?w=400',
    instructor: 'Rachel Green'
  },
];

export function Meditation({ profile }: MeditationPageProps) {
  const [view, setView] = useState<'library' | 'timer' | 'dashboard'>('dashboard');
  const [selectedGuide, setSelectedGuide] = useState<MeditationGuide | null>(null);
  const [filteredCategory, setFilteredCategory] = useState('');
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [achievements, setAchievements] = useState([
    { name: 'First Steps', icon: '🎉', unlockedAt: new Date(Date.now() - 86400000 * 5) },
    { name: '7-Day Streak', icon: '🔥', unlockedAt: new Date(Date.now() - 86400000 * 2) },
  ]);

  const filteredGuides = filteredCategory
    ? MEDITATION_GUIDES.filter(g => g.category === filteredCategory)
    : MEDITATION_GUIDES;

  const handleSelectGuide = (guide: MeditationGuide) => {
    setSelectedGuide(guide);
    setView('timer');
  };

  const handleSessionComplete = (moodBefore: number, moodAfter: number) => {
    if (selectedGuide && profile) {
      const newSession: MeditationSession = {
        id: Date.now().toString(),
        userId: profile.uid,
        guideId: selectedGuide.id,
        guideName: selectedGuide.title,
        durationMinutes: selectedGuide.durationMinutes,
        category: selectedGuide.category,
        completedAt: new Date(),
        moodBefore,
        moodAfter,
        notes: ''
      };
      setSessions([newSession, ...sessions]);
      setView('dashboard');
    }
  };

  const meditationStreak = sessions.length > 0 ? Math.min(7, sessions.length) : 0;
  const avgMood = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + s.moodAfter, 0) / sessions.length)
    : 7;

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Meditation & Mental Health</h1>
              <Button
                onClick={() => setView('library')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Start Meditating
              </Button>
            </div>
            <WellnessDashboard
              profile={profile}
              recentSessions={sessions}
              mentalHealthScore={avgMood}
              meditationStreak={meditationStreak}
              achievements={achievements}
            />
          </motion.div>
        )}

        {view === 'library' && (
          <motion.div
            key="library"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <Button
                onClick={() => setView('dashboard')}
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Meditation Library</h1>
            </div>
            <MeditationLibrary
              guides={filteredGuides}
              onSelectGuide={handleSelectGuide}
              selectedCategory={filteredCategory}
              onFilterByCategory={setFilteredCategory}
            />
          </motion.div>
        )}

        {view === 'timer' && selectedGuide && (
          <motion.div
            key="timer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedGuide.title}</h1>
                <p className="mt-1 text-gray-600">{selectedGuide.description}</p>
              </div>
              <Button
                onClick={() => {
                  setView('library');
                  setSelectedGuide(null);
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-lg">
              <MeditationTimer
                durationMinutes={selectedGuide.durationMinutes}
                onComplete={() => setView('library')}
                onMoodChange={(moodBefore, moodAfter) =>
                  handleSessionComplete(moodBefore, moodAfter)
                }
              />

              {/* Guide Info */}
              <div className="mt-8 rounded-lg bg-gray-50 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">About This Meditation</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Instructor</p>
                    <p className="font-medium text-gray-900">{selectedGuide.instructor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Difficulty</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedGuide.difficulty}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Benefits</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedGuide.benefits.map(benefit => (
                      <span
                        key={benefit}
                        className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
