import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

interface MeditationTimerProps {
  durationMinutes: number;
  onComplete: () => void;
  onMoodChange?: (moodBefore: number, moodAfter: number) => void;
}

export function MeditationTimer({ durationMinutes, onComplete, onMoodChange }: MeditationTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [moodBefore, setMoodBefore] = useState(5);
  const [moodAfter, setMoodAfter] = useState(5);
  const [showMoodAfter, setShowMoodAfter] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setShowMoodAfter(true);
            playCompletionSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeRemaining]);

  const playCompletionSound = () => {
    if (!isMuted) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.frequency.value = 528;
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    if (onMoodChange) {
      onMoodChange(moodBefore, moodAfter);
    }
    onComplete();
  };

  const progressPercentage = ((durationMinutes * 60 - timeRemaining) / (durationMinutes * 60)) * 100;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      {/* Timer Display */}
      <div className="relative h-48 w-48">
        <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e0e7ff"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeDasharray={`${(progressPercentage / 100) * 282.7} 282.7`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-indigo-600">{formatTime(timeRemaining)}</div>
          <div className="mt-2 text-sm text-gray-600">{durationMinutes} min session</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className={isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'}
          size="lg"
        >
          {isRunning ? (
            <>
              <Pause className="mr-2 h-5 w-5" /> Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" /> Start
            </>
          )}
        </Button>
        <Button
          onClick={() => {
            setTimeRemaining(durationMinutes * 60);
            setIsRunning(false);
            setShowMoodAfter(false);
            setMoodAfter(5);
          }}
          variant="outline"
          size="lg"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => setIsMuted(!isMuted)}
          variant="outline"
          size="lg"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mood Check-in */}
      <div className="w-full max-w-md space-y-4">
        {!showMoodAfter ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">How's your mood before?</label>
              <input
                type="range"
                min="1"
                max="10"
                value={moodBefore}
                onChange={(e) => setMoodBefore(parseInt(e.target.value))}
                className="mt-2 w-full"
                disabled={isRunning}
              />
              <div className="mt-1 text-center text-2xl font-semibold text-indigo-600">{moodBefore}/10</div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mood before: {moodBefore}/10</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">How's your mood after?</label>
              <input
                type="range"
                min="1"
                max="10"
                value={moodAfter}
                onChange={(e) => setMoodAfter(parseInt(e.target.value))}
                className="mt-2 w-full"
              />
              <div className="mt-1 text-center text-2xl font-semibold text-indigo-600">{moodAfter}/10</div>
            </div>
            <Button onClick={handleComplete} className="w-full bg-green-600 hover:bg-green-700">
              Complete Session
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
