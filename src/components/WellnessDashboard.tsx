import React from 'react';
import { TrendingUp, Target, Heart, Calendar, Zap, Award } from 'lucide-react';
import { UserProfile, MeditationSession } from '../types';

interface WellnessDashboardProps {
  profile: UserProfile | null;
  recentSessions: MeditationSession[];
  mentalHealthScore?: number;
  meditationStreak?: number;
  achievements?: Array<{
    name: string;
    icon: string;
    unlockedAt?: Date;
  }>;
}

export function WellnessDashboard({
  profile,
  recentSessions,
  mentalHealthScore = 7,
  meditationStreak = 5,
  achievements = []
}: WellnessDashboardProps) {
  const totalMinutes = recentSessions.reduce((sum, session) => sum + session.durationMinutes, 0);
  const avgMoodImprovement = recentSessions.length > 0
    ? Math.round(
        recentSessions.reduce((sum, session) => sum + (session.moodAfter - session.moodBefore), 0) /
        recentSessions.length * 10
      ) / 10
    : 0;

  const getStreakColor = (streak: number) => {
    if (streak === 0) return 'text-gray-500';
    if (streak < 7) return 'text-yellow-600';
    if (streak < 30) return 'text-blue-600';
    return 'text-green-600';
  };

  const getMentalHealthColor = (score: number) => {
    if (score <= 3) return { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-500' };
    if (score <= 5) return { bg: 'bg-yellow-50', text: 'text-yellow-700', bar: 'bg-yellow-500' };
    if (score <= 7) return { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' };
    return { bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-500' };
  };

  const healthColorScheme = getMentalHealthColor(mentalHealthScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.displayName}! 👋
        </h2>
        <p className="mt-2 text-gray-600">
          Keep up with your wellbeing journey. You're doing great!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Mental Health Score */}
        <div className={`rounded-lg p-6 ${healthColorScheme.bg}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mental Health Score</p>
              <p className={`mt-2 text-3xl font-bold ${healthColorScheme.text}`}>
                {mentalHealthScore}/10
              </p>
            </div>
            <Heart className={`h-8 w-8 ${healthColorScheme.text}`} />
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full ${healthColorScheme.bar} transition-all`}
              style={{ width: `${mentalHealthScore * 10}%` }}
            />
          </div>
        </div>

        {/* Meditation Streak */}
        <div className="rounded-lg bg-orange-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Meditation Streak</p>
              <p className={`mt-2 text-3xl font-bold ${getStreakColor(meditationStreak)}`}>
                {meditationStreak} days
              </p>
            </div>
            <Zap className={`h-8 w-8 ${getStreakColor(meditationStreak)}`} />
          </div>
          <p className="mt-4 text-xs text-gray-600">Keep it going! 🔥</p>
        </div>

        {/* Total Minutes */}
        <div className="rounded-lg bg-blue-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Minutes</p>
              <p className="mt-2 text-3xl font-bold text-blue-700">{totalMinutes}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <p className="mt-4 text-xs text-gray-600">This month's practice</p>
        </div>

        {/* Mood Improvement */}
        <div className="rounded-lg bg-green-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Mood Boost</p>
              <p className="mt-2 text-3xl font-bold text-green-700">+{avgMoodImprovement}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <p className="mt-4 text-xs text-gray-600">Per session</p>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
          <Calendar className="mr-2 h-5 w-5 text-indigo-600" />
          Recent Meditation Sessions
        </h3>
        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.slice(0, 5).map(session => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-900">{session.guideName}</p>
                  <p className="text-sm text-gray-600">{session.category.replace('-', ' ')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{session.durationMinutes} min</p>
                    <p className="text-sm text-gray-600">
                      Mood: {session.moodBefore} → {session.moodAfter}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-gray-50 p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">No meditation sessions yet. Start your first one today! 🧘</p>
          </div>
        )}
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <Award className="mr-2 h-5 w-5 text-yellow-600" />
            Achievements
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {achievements.map((achievement, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 p-4 text-center"
              >
                <span className="text-4xl">{achievement.icon}</span>
                <p className="mt-2 font-semibold text-gray-900">{achievement.name}</p>
                {achievement.unlockedAt && (
                  <p className="text-xs text-gray-600">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
