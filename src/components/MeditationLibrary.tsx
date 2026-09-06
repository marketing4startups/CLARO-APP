import React from 'react';
import { Heart, Clock, Zap } from 'lucide-react';
import { MeditationGuide } from '../types';
import { Button } from './ui/button';

interface MeditationLibraryProps {
  guides: MeditationGuide[];
  onSelectGuide: (guide: MeditationGuide) => void;
  selectedCategory?: string;
  onFilterByCategory?: (category: string) => void;
}

const categoryColors: Record<string, string> = {
  breathing: 'bg-blue-100 text-blue-800',
  'body-scan': 'bg-purple-100 text-purple-800',
  mindfulness: 'bg-green-100 text-green-800',
  visualization: 'bg-orange-100 text-orange-800',
  gratitude: 'bg-pink-100 text-pink-800',
};

const difficultyColors: Record<string, string> = {
  beginner: 'text-green-600',
  intermediate: 'text-yellow-600',
  advanced: 'text-red-600',
};

export function MeditationLibrary({ 
  guides, 
  onSelectGuide, 
  selectedCategory,
  onFilterByCategory 
}: MeditationLibraryProps) {
  const categories = Array.from(new Set(guides.map(g => g.category)));

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => onFilterByCategory?.('')}
            variant={selectedCategory === '' ? 'default' : 'outline'}
            size="sm"
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => onFilterByCategory?.(category)}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className={selectedCategory === category ? '' : ''}
            >
              {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Meditation Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map(guide => (
          <div
            key={guide.id}
            className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500">
              <img
                src={guide.imageUrl}
                alt={guide.title}
                className="h-full w-full object-cover opacity-80"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%234F46E5" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle"%3E🧘%3C/text%3E%3C/svg%3E';
                }}
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${categoryColors[guide.category]}`}>
                  {guide.category.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
              <h4 className="font-semibold text-gray-900">{guide.title}</h4>
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{guide.description}</p>

              {/* Meta Info */}
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {guide.durationMinutes} min
                </div>
                <div className={`flex items-center gap-1 font-medium ${difficultyColors[guide.difficulty]}`}>
                  <Zap className="h-4 w-4" />
                  {guide.difficulty}
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-3 flex flex-wrap gap-1">
                {guide.benefits.slice(0, 2).map((benefit, i) => (
                  <span key={i} className="inline-block rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-700">
                    {benefit}
                  </span>
                ))}
                {guide.benefits.length > 2 && (
                  <span className="text-xs text-gray-500">+{guide.benefits.length - 2}</span>
                )}
              </div>

              {/* Instructor */}
              <div className="mt-3 text-xs text-gray-500">
                <p>by {guide.instructor}</p>
              </div>

              {/* Button */}
              <Button
                onClick={() => onSelectGuide(guide)}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700"
              >
                <Heart className="mr-2 h-4 w-4" />
                Start Meditation
              </Button>
            </div>
          </div>
        ))}
      </div>

      {guides.length === 0 && (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-600">No meditations found. Try a different filter.</p>
        </div>
      )}
    </div>
  );
}
