import React, { useState } from 'react';
import { Heart, Zap, Moon, Coffee, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface MentalHealthCheckInProps {
  onSubmit: (data: {
    moodScore: number;
    stressLevel: number;
    energyLevel: number;
    sleepHours: number;
    notes: string;
    symptoms: string[];
  }) => void;
  isLoading?: boolean;
}

const commonSymptoms = [
  'Headache',
  'Fatigue',
  'Anxiety',
  'Difficulty concentrating',
  'Irritability',
  'Insomnia',
  'Restlessness',
  'Body tension'
];

export function MentalHealthCheckIn({ onSubmit, isLoading }: MentalHealthCheckInProps) {
  const [moodScore, setMoodScore] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [notes, setNotes] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);

  const handleSymptomToggle = (symptom: string) => {
    setSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      moodScore,
      stressLevel,
      energyLevel,
      sleepHours,
      notes,
      symptoms
    });
  };

  const getMoodColor = (score: number) => {
    if (score <= 3) return 'text-red-600';
    if (score <= 5) return 'text-yellow-600';
    if (score <= 7) return 'text-blue-600';
    return 'text-green-600';
  };

  const getMoodEmoji = (score: number) => {
    if (score <= 2) return '😟';
    if (score <= 4) return '😐';
    if (score <= 6) return '🙂';
    if (score <= 8) return '😊';
    return '😄';
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-6 flex items-center text-xl font-semibold text-gray-900">
        <Heart className="mr-2 h-6 w-6 text-red-500" />
        Daily Wellbeing Check-in
      </h3>

      <div className="space-y-6">
        {/* Mood Score */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">How's your mood?</label>
            <span className={`text-3xl font-bold ${getMoodColor(moodScore)}`}>
              {getMoodEmoji(moodScore)} {moodScore}/10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={moodScore}
            onChange={(e) => setMoodScore(parseInt(e.target.value))}
            className="mt-2 w-full cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Stress Level */}
        <div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <AlertCircle className="mr-2 h-4 w-4 text-orange-500" />
              Stress Level
            </label>
            <span className="text-2xl font-bold text-orange-600">{stressLevel}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={stressLevel}
            onChange={(e) => setStressLevel(parseInt(e.target.value))}
            className="mt-2 w-full cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>Relaxed</span>
            <span>Very Stressed</span>
          </div>
        </div>

        {/* Energy Level */}
        <div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Zap className="mr-2 h-4 w-4 text-yellow-500" />
              Energy Level
            </label>
            <span className="text-2xl font-bold text-yellow-600">{energyLevel}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
            className="mt-2 w-full cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>Exhausted</span>
            <span>Energized</span>
          </div>
        </div>

        {/* Sleep Hours */}
        <div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Moon className="mr-2 h-4 w-4 text-indigo-500" />
              Sleep Last Night
            </label>
            <span className="text-2xl font-bold text-indigo-600">{sleepHours}h</span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={sleepHours}
            onChange={(e) => setSleepHours(parseFloat(e.target.value))}
            className="mt-2 w-full cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>No sleep</span>
            <span>12 hours</span>
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Any symptoms today?
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {commonSymptoms.map(symptom => (
              <button
                key={symptom}
                onClick={() => handleSymptomToggle(symptom)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  symptoms.includes(symptom)
                    ? 'bg-red-100 text-red-700 border-2 border-red-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling? What's on your mind?"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2"
        >
          {isLoading ? 'Saving...' : 'Save Check-in'}
        </Button>
      </div>
    </div>
  );
}
