import React, { useState } from 'react';
import { AlertCircle, BarChart3, Heart, Zap } from 'lucide-react';
import { Button } from './ui/button';

interface BurnoutAssessmentResult {
  emotionalExhaustion: number;
  cynicism: number;
  efficacy: number;
  overallScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  recommendations: string[];
}

interface BurnoutAssessmentProps {
  onSubmit: (result: BurnoutAssessmentResult) => void;
  isLoading?: boolean;
}

// Maslach Burnout Inventory-inspired questions
const ASSESSMENT_QUESTIONS = [
  {
    category: 'Emotional Exhaustion',
    questions: [
      "I feel emotionally drained from my work",
      "Working with people all day is really a strain for me",
      "I feel fatigued when I wake up and have to face another day on the job",
      "I feel burned out from my work",
      "I feel I'm working too hard on my job",
    ]
  },
  {
    category: 'Cynicism/Depersonalization',
    questions: [
      "I've become more callous toward people since I took this job",
      "I worry that this job is hardening me emotionally",
      "I don't really care what happens to some people at work",
      "I feel I treat some people at work as if they were impersonal objects",
    ]
  },
  {
    category: 'Professional Efficacy (Reduced)',
    questions: [
      "I can effectively solve the problems that come up in my work",
      "I deal very effectively with the concerns of my co-workers",
      "I feel I'm making an effective contribution to what this organization does",
      "I can understand easily how my colleagues feel about things",
      "I feel energized when I accomplish something at work",
    ]
  }
];

export function BurnoutAssessment({ onSubmit, isLoading }: BurnoutAssessmentProps) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<BurnoutAssessmentResult | null>(null);

  const currentCategory = ASSESSMENT_QUESTIONS[currentCategoryIndex];
  const totalQuestions = ASSESSMENT_QUESTIONS.reduce((sum, cat) => sum + cat.questions.length, 0);
  const answeredQuestions = Object.keys(responses).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleResponse = (questionIndex: number, score: number) => {
    const questionId = `q_${currentCategoryIndex}_${questionIndex}`;
    setResponses(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  const handleNext = () => {
    if (currentCategoryIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
  };

  const calculateResults = () => {
    const categoryScores: Record<string, number[]> = {
      'Emotional Exhaustion': [],
      'Cynicism/Depersonalization': [],
      'Professional Efficacy (Reduced)': []
    };

    Object.entries(responses).forEach(([questionId, score]) => {
      const [, categoryIdx] = questionId.split('_');
      const categoryName = ASSESSMENT_QUESTIONS[parseInt(categoryIdx)].category;
      categoryScores[categoryName].push(score);
    });

    const emotionalExhaustion = Math.round(
      (categoryScores['Emotional Exhaustion'].reduce((a, b) => a + b, 0) / 
       categoryScores['Emotional Exhaustion'].length) * 20
    ) || 0;

    const cynicism = Math.round(
      (categoryScores['Cynicism/Depersonalization'].reduce((a, b) => a + b, 0) / 
       categoryScores['Cynicism/Depersonalization'].length) * 20
    ) || 0;

    // Invert efficacy score (lower response = higher burnout)
    const efficacy = Math.round(
      ((5 - (categoryScores['Professional Efficacy (Reduced)'].reduce((a, b) => a + b, 0) / 
       categoryScores['Professional Efficacy (Reduced)'].length)) * 20)
    ) || 0;

    const overallScore = Math.round((emotionalExhaustion + cynicism + efficacy) / 3);

    let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    if (overallScore >= 70) riskLevel = 'critical';
    else if (overallScore >= 50) riskLevel = 'high';
    else if (overallScore >= 30) riskLevel = 'moderate';

    const recommendations = getRecommendations(riskLevel, emotionalExhaustion, cynicism, efficacy);

    return {
      emotionalExhaustion,
      cynicism,
      efficacy,
      overallScore,
      riskLevel,
      recommendations
    };
  };

  const getRecommendations = (
    riskLevel: string,
    exhaustion: number,
    cynicism: number,
    efficacy: number
  ): string[] => {
    const recs: string[] = [];

    if (riskLevel === 'critical' || riskLevel === 'high') {
      recs.push('🔴 Seek professional support - consider speaking with a counselor or therapist');
      recs.push('🔴 Discuss with your manager about workload and stress management');
    }

    if (exhaustion > 60) {
      recs.push('Take regular breaks and prioritize rest and sleep');
      recs.push('Engage in daily relaxation practices (meditation, exercise)');
      recs.push('Consider temporary reduction in work hours if possible');
    }

    if (cynicism > 50) {
      recs.push('Seek positive social connections at work and outside');
      recs.push('Reconnect with the purpose of your role');
      recs.push('Consider team-building or social activities');
    }

    if (efficacy > 60) {
      recs.push('Set achievable goals and celebrate small wins');
      recs.push('Seek mentoring or training to build professional confidence');
      recs.push('Discuss career development opportunities with manager');
    }

    if (riskLevel === 'low' || riskLevel === 'moderate') {
      recs.push('Continue preventive practices like meditation and regular exercise');
      recs.push('Maintain healthy work-life boundaries');
    }

    return recs;
  };

  const handleSubmitAssessment = () => {
    if (answeredQuestions === totalQuestions) {
      const calculatedResult = calculateResults();
      setResult(calculatedResult);
      setShowResults(true);
      onSubmit(calculatedResult);
    }
  };

  if (showResults && result) {
    const getRiskColor = (level: string) => {
      switch (level) {
        case 'critical': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' };
        case 'high': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300' };
        case 'moderate': return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300' };
        default: return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300' };
      }
    };

    const color = getRiskColor(result.riskLevel);

    return (
      <div className="space-y-6 rounded-lg bg-white p-8 shadow-md">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Burnout Assessment Results</h2>
          <p className="mt-2 text-gray-600">Completed on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Risk Level */}
        <div className={`rounded-lg border-2 p-6 ${color.bg} ${color.border}`}>
          <div className="flex items-center gap-3">
            <AlertCircle className={`h-8 w-8 ${color.text}`} />
            <div>
              <h3 className={`text-lg font-bold ${color.text}`}>
                {result.riskLevel.toUpperCase()} BURNOUT RISK
              </h3>
              <p className={`text-sm ${color.text}`}>
                Overall Score: {result.overallScore}/100
              </p>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-red-50 p-4 border-l-4 border-red-500">
            <p className="text-sm font-medium text-gray-600">Emotional Exhaustion</p>
            <div className="mt-3 text-3xl font-bold text-red-600">{result.emotionalExhaustion}</div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-red-500"
                style={{ width: `${result.emotionalExhaustion}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg bg-orange-50 p-4 border-l-4 border-orange-500">
            <p className="text-sm font-medium text-gray-600">Cynicism/Depersonalization</p>
            <div className="mt-3 text-3xl font-bold text-orange-600">{result.cynicism}</div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-orange-500"
                style={{ width: `${result.cynicism}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 border-l-4 border-blue-500">
            <p className="text-sm font-medium text-gray-600">Reduced Professional Efficacy</p>
            <div className="mt-3 text-3xl font-bold text-blue-600">{result.efficacy}</div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${result.efficacy}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Recommended Actions</h3>
          <div className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 rounded-lg bg-gray-50 p-4">
                <Zap className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-600" />
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="rounded-lg bg-indigo-50 border-l-4 border-indigo-500 p-4">
          <p className="font-medium text-indigo-900">
            💡 Next Steps: Share these results with your manager or HR department to discuss support options.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-lg bg-white p-8 shadow-md">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Burnout Risk Assessment</h2>
        <p className="mt-2 text-gray-600">
          Based on the Maslach Burnout Inventory framework. Your responses are confidential.
        </p>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-600">Progress: {answeredQuestions} of {totalQuestions}</span>
          <span className="text-indigo-600 font-semibold">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Category Title */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          {currentCategory.category}
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Category {currentCategoryIndex + 1} of {ASSESSMENT_QUESTIONS.length}
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {currentCategory.questions.map((question, idx) => {
          const questionId = `q_${currentCategoryIndex}_${idx}`;
          const response = responses[questionId] || 0;

          return (
            <div key={idx} className="space-y-3">
              <p className="font-medium text-gray-900">{question}</p>
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5].map(score => (
                  <button
                    key={score}
                    onClick={() => handleResponse(idx, score)}
                    className={`flex-1 rounded-lg py-2 font-medium transition-all ${
                      response === score
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Never</span>
                <span>Always</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={handlePrevious}
          disabled={currentCategoryIndex === 0}
          variant="outline"
        >
          ← Previous
        </Button>
        <div className="flex-1" />
        {currentCategoryIndex === ASSESSMENT_QUESTIONS.length - 1 ? (
          <Button
            onClick={handleSubmitAssessment}
            disabled={answeredQuestions !== totalQuestions || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading ? 'Calculating...' : 'Complete Assessment'}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Next →
          </Button>
        )}
      </div>

      {/* Info */}
      <div className="rounded-lg bg-blue-50 p-4 border-l-4 border-blue-500">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This assessment is based on validated burnout research. While it provides useful insights,
          it's not a clinical diagnosis. Please consult with a healthcare professional if you have concerns about your mental health.
        </p>
      </div>
    </div>
  );
}
