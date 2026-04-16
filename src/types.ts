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
