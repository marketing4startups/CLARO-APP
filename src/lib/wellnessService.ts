import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc,
  getDoc,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { MeditationSession, MentalHealthCheckIn, UserProfile } from '../types';

// Meditation Sessions

export async function saveMeditationSession(session: Omit<MeditationSession, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, 'meditationSessions'), {
      ...session,
      completedAt: Timestamp.now(),
    });
    return { success: true, sessionId: docRef.id };
  } catch (error) {
    console.error('Error saving meditation session:', error);
    return { success: false, error };
  }
}

export async function getUserMeditationSessions(userId: string) {
  try {
    const q = query(
      collection(db, 'meditationSessions'),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc'),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (MeditationSession & { id: string })[];
  } catch (error) {
    console.error('Error fetching meditation sessions:', error);
    return [];
  }
}

export async function getMeditationStats(userId: string) {
  try {
    const sessions = await getUserMeditationSessions(userId);
    
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalMinutes: 0,
        streak: 0,
        averageMoodImprovement: 0,
        lastSessionDate: null,
      };
    }

    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const averageMoodImprovement = Math.round(
      sessions.reduce((sum, s) => sum + (s.moodAfter - s.moodBefore), 0) / sessions.length * 10
    ) / 10;

    // Calculate streak (consecutive days)
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      
      const sessionOnDate = sessions.some(s => {
        const sessionDate = new Date(s.completedAt);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === checkDate.getTime();
      });

      if (sessionOnDate) {
        streak++;
      } else if (i === 0 || streak > 0) {
        break;
      }
    }

    return {
      totalSessions: sessions.length,
      totalMinutes,
      streak,
      averageMoodImprovement,
      lastSessionDate: sessions[0]?.completedAt || null,
    };
  } catch (error) {
    console.error('Error calculating meditation stats:', error);
    return {
      totalSessions: 0,
      totalMinutes: 0,
      streak: 0,
      averageMoodImprovement: 0,
      lastSessionDate: null,
    };
  }
}

// Mental Health Check-ins

export async function saveMentalHealthCheckIn(checkIn: Omit<MentalHealthCheckIn, 'id' | 'timestamp'>, userId: string) {
  try {
    const docRef = await addDoc(collection(db, 'mentalHealthCheckIns'), {
      ...checkIn,
      userId,
      timestamp: Timestamp.now(),
    });
    return { success: true, checkInId: docRef.id };
  } catch (error) {
    console.error('Error saving mental health check-in:', error);
    return { success: false, error };
  }
}

export async function getTodaysMentalHealthCheckIn(userId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const q = query(
      collection(db, 'mentalHealthCheckIns'),
      where('userId', '==', userId),
      where('timestamp', '>=', Timestamp.fromDate(today)),
      where('timestamp', '<', Timestamp.fromDate(tomorrow)),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as MentalHealthCheckIn & { id: string };
  } catch (error) {
    console.error('Error fetching today\'s check-in:', error);
    return null;
  }
}

export async function getUserMentalHealthHistory(userId: string, daysBack: number = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    startDate.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, 'mentalHealthCheckIns'),
      where('userId', '==', userId),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      orderBy('timestamp', 'desc'),
      limit(100)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (MentalHealthCheckIn & { id: string })[];
  } catch (error) {
    console.error('Error fetching mental health history:', error);
    return [];
  }
}

export async function calculateMentalHealthScore(userId: string) {
  try {
    const checkIns = await getUserMentalHealthHistory(userId, 7);
    
    if (checkIns.length === 0) {
      return 5; // Default middle score
    }

    const averageMood = checkIns.reduce((sum, c) => sum + c.moodScore, 0) / checkIns.length;
    return Math.round(averageMood);
  } catch (error) {
    console.error('Error calculating mental health score:', error);
    return 5;
  }
}

// User Wellness Profile Updates

export async function updateUserWellnessProfile(userId: string, updates: Partial<UserProfile>) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
    return { success: true };
  } catch (error) {
    console.error('Error updating user wellness profile:', error);
    return { success: false, error };
  }
}

export async function updateUserMeditationStreak(userId: string, streak: number) {
  return updateUserWellnessProfile(userId, {
    meditationStreakDays: streak,
  });
}

export async function updateUserMeditationMinutes(userId: string, addMinutes: number) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const currentMinutes = userDoc.data()?.meditationMinutesToday || 0;
    
    await updateDoc(userRef, {
      meditationMinutesToday: currentMinutes + addMinutes,
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating meditation minutes:', error);
    return { success: false, error };
  }
}

// Achievements

export async function unlockAchievement(userId: string, achievementId: string, achievementName: string) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const currentAchievements = userDoc.data()?.achievements || [];

    if (!currentAchievements.includes(achievementId)) {
      await updateDoc(userRef, {
        badges: [...(userDoc.data()?.badges || []), {
          id: achievementId,
          name: achievementName,
          unlockedAt: Timestamp.now(),
        }],
      });
      return { success: true, newAchievement: true };
    }

    return { success: true, newAchievement: false };
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return { success: false, error };
  }
}

// Batch Operations

export async function syncWellnessData(userId: string) {
  try {
    const stats = await getMeditationStats(userId);
    const mentalHealthScore = await calculateMentalHealthScore(userId);
    const todayCheckIn = await getTodaysMentalHealthCheckIn(userId);

    // Check for achievements
    const achievements = [];
    
    // First meditation achievement
    if (stats.totalSessions === 1) {
      achievements.push({ id: 'first-meditation', name: 'First Steps' });
    }

    // 7-day streak achievement
    if (stats.streak >= 7) {
      achievements.push({ id: 'seven-day-streak', name: '7-Day Streak' });
    }

    // Update user profile with all data
    await updateUserWellnessProfile(userId, {
      meditationStreakDays: stats.streak,
      mentalHealthScore,
    });

    return {
      success: true,
      stats,
      mentalHealthScore,
      todayCheckIn,
      unlockedAchievements: achievements,
    };
  } catch (error) {
    console.error('Error syncing wellness data:', error);
    return { success: false, error };
  }
}
