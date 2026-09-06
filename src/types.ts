export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'employee' | 'admin';
  points: number;
  badges: string[];
  completedModules: string[];
  createdAt: any;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  duration: string;
  points: number;
}

export interface Assessment {
  id: string;
  userId: string;
  mood: number;
  stressLevel: number;
  notes: string;
  createdAt: any;
}

export interface Consultation {
  id: string;
  userId: string;
  expertName: string;
  scheduledAt: any;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'Article' | 'Exercise' | 'Guide';
  content: string;
  readTime: string;
  icon: string;
}

export interface MeditationSession {
  id: string;
  userId: string;
  guideId: string;
  guideName: string;
  durationMinutes: number;
  category: 'breathing' | 'body-scan' | 'mindfulness' | 'visualization' | 'gratitude';
  completedAt: any;
  moodBefore: number;
  moodAfter: number;
  notes: string;
}

export interface MeditationGuide {
  id: string;
  title: string;
  description: string;
  category: 'breathing' | 'body-scan' | 'mindfulness' | 'visualization' | 'gratitude';
  durationMinutes: number;
  audioUrl: string;
  transcript: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  imageUrl: string;
  instructor: string;
}

export interface MentalHealthCheckIn {
  id: string;
  userId: string;
  timestamp: any;
  moodScore: number;
  stressLevel: number;
  energyLevel: number;
  sleepHours: number;
  notes: string;
  symptoms: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: any;
  criteria: {
    type: 'meditation_count' | 'meditation_streak' | 'mood_improvement' | 'total_minutes';
    target: number;
  };
}
