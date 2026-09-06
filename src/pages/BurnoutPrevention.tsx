import React, { useState } from 'react';
import { AlertTriangle, Users, BookOpen, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { ManagerDashboard } from '../components/ManagerDashboard';
import { BurnoutAssessment } from '../components/BurnoutAssessment';
import { BurnoutSignsAndPrevention } from '../components/BurnoutSignsAndPrevention';
import { Button } from '../components/ui/button';

interface BurnoutPreventionPageProps {
  profile: UserProfile | null;
}

// Mock team data
const MOCK_TEAM: Array<{
  uid: string;
  displayName: string;
  email: string;
  burnoutRiskScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  indicators: string[];
  lastCheckIn: Date;
  consecutiveHighStress: number;
  meditationEngagement: number;
  workPattern: 'healthy' | 'at-risk' | 'concerning';
}> = [
  {
    uid: '1',
    displayName: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    burnoutRiskScore: 78,
    riskLevel: 'critical',
    indicators: ['High stress levels', 'Missing deadlines', 'Low engagement', 'Frequent absences'],
    lastCheckIn: new Date(Date.now() - 86400000 * 3),
    consecutiveHighStress: 8,
    meditationEngagement: 5,
    workPattern: 'concerning'
  },
  {
    uid: '2',
    displayName: 'Mike Chen',
    email: 'mike.chen@company.com',
    burnoutRiskScore: 58,
    riskLevel: 'high',
    indicators: ['Increased cynicism', 'Reduced productivity', 'Team conflicts'],
    lastCheckIn: new Date(Date.now() - 86400000 * 2),
    consecutiveHighStress: 5,
    meditationEngagement: 20,
    workPattern: 'at-risk'
  },
  {
    uid: '3',
    displayName: 'Emma Rodriguez',
    email: 'emma.rodriguez@company.com',
    burnoutRiskScore: 42,
    riskLevel: 'moderate',
    indicators: ['Occasional fatigue', 'Light workload concerns'],
    lastCheckIn: new Date(Date.now() - 86400000),
    consecutiveHighStress: 2,
    meditationEngagement: 60,
    workPattern: 'at-risk'
  },
  {
    uid: '4',
    displayName: 'James Williams',
    email: 'james.williams@company.com',
    burnoutRiskScore: 25,
    riskLevel: 'low',
    indicators: [],
    lastCheckIn: new Date(),
    consecutiveHighStress: 0,
    meditationEngagement: 85,
    workPattern: 'healthy'
  }
];

type ViewType = 'dashboard' | 'assessment' | 'education' | 'guide';

export function BurnoutPrevention({ profile }: BurnoutPreventionPageProps) {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [assessmentResult, setAssessmentResult] = useState<any>(null);

  const isManager = profile?.role === 'admin' || profile?.role === 'manager';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🛡️ Burnout Prevention & Recognition</h1>
        <p className="mt-2 text-gray-600">
          Recognize warning signs early and take preventive action to protect team wellbeing
        </p>
      </div>

      {/* Role-based Info Banner */}
      <div className={`rounded-lg border-l-4 p-4 ${
        isManager
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-blue-500 bg-blue-50'
      }`}>
        <p className={isManager ? 'text-indigo-800' : 'text-blue-800'}>
          {isManager
            ? '👔 You have manager access to team wellbeing data. Use these tools to support your team proactively.'
            : '💪 Complete your assessment and access prevention resources to protect your own wellbeing.'}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors ${
            currentView === 'dashboard'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="h-5 w-5" />
          {isManager ? 'Team Dashboard' : 'My Wellbeing'}
        </button>

        <button
          onClick={() => setCurrentView('assessment')}
          className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors ${
            currentView === 'assessment'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <CheckCircle2 className="h-5 w-5" />
          Burnout Assessment
        </button>

        <button
          onClick={() => setCurrentView('education')}
          className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors ${
            currentView === 'education'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BookOpen className="h-5 w-5" />
          Signs & Prevention
        </button>

        {isManager && (
          <button
            onClick={() => setCurrentView('guide')}
            className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors ${
              currentView === 'guide'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
            Manager Guide
          </button>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {currentView === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {isManager ? (
              <ManagerDashboard
                profile={profile}
                teamMembers={MOCK_TEAM}
              />
            ) : (
              <div className="space-y-6 rounded-lg bg-white p-8 shadow-md">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Wellbeing Status</h2>
                  <p className="mt-2 text-gray-600">
                    Track your personal burnout risk and get personalized recommendations
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-blue-50 p-6 border-l-4 border-blue-500">
                    <p className="text-sm font-medium text-gray-600">Personal Assessment</p>
                    <p className="mt-2 text-3xl font-bold text-blue-600">-</p>
                    <p className="mt-2 text-xs text-gray-600">Complete assessment to get started</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-6 border-l-4 border-green-500">
                    <p className="text-sm font-medium text-gray-600">Meditation Engagement</p>
                    <p className="mt-2 text-3xl font-bold text-green-600">0%</p>
                    <p className="mt-2 text-xs text-gray-600">Track your practice</p>
                  </div>
                  <div className="rounded-lg bg-indigo-50 p-6 border-l-4 border-indigo-500">
                    <p className="text-sm font-medium text-gray-600">Support Resources</p>
                    <p className="mt-2 text-3xl font-bold text-indigo-600">✓</p>
                    <p className="mt-2 text-xs text-gray-600">Always available</p>
                  </div>
                </div>

                <div className="rounded-lg bg-indigo-50 border-l-4 border-indigo-500 p-6">
                  <h3 className="font-semibold text-indigo-900 mb-3">Next Steps</h3>
                  <ol className="space-y-2 text-indigo-800">
                    <li>1. Complete your Burnout Assessment to understand your current risk level</li>
                    <li>2. Learn the signs and prevention strategies in "Signs & Prevention"</li>
                    <li>3. Engage in regular meditation and wellness practices</li>
                    <li>4. Share concerns with your manager or HR if needed</li>
                  </ol>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {currentView === 'assessment' && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <BurnoutAssessment
              onSubmit={(result) => {
                setAssessmentResult(result);
              }}
            />
          </motion.div>
        )}

        {currentView === 'education' && (
          <motion.div
            key="education"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <BurnoutSignsAndPrevention />
          </motion.div>
        )}

        {currentView === 'guide' && isManager && (
          <motion.div
            key="guide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6 rounded-lg bg-white p-8 shadow-md">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">👔 Manager's Guide to Burnout Prevention</h2>
                <p className="mt-2 text-gray-600">
                  Your role is critical in preventing and addressing burnout. Use these guidelines to support your team.
                </p>
              </div>

              <div className="space-y-6">
                {/* Section 1: Recognition */}
                <div className="rounded-lg border-2 border-blue-300 bg-blue-50 p-6">
                  <h3 className="mb-4 text-lg font-bold text-blue-900">1. Recognition: Spot Early Warning Signs</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li>✓ Look for combinations of physical, emotional, behavioral, and work performance changes</li>
                    <li>✓ Monitor productivity, engagement, and team interactions</li>
                    <li>✓ Pay attention to changes from baseline behavior</li>
                    <li>✓ Don't dismiss subtle signs—early intervention is most effective</li>
                  </ul>
                </div>

                {/* Section 2: Conversation */}
                <div className="rounded-lg border-2 border-purple-300 bg-purple-50 p-6">
                  <h3 className="mb-4 text-lg font-bold text-purple-900">2. The Conversation: How to Approach a Team Member</h3>
                  <div className="space-y-3">
                    <p className="text-purple-800">
                      <strong>Setting:</strong> Private, safe, uninterrupted space
                    </p>
                    <p className="text-purple-800">
                      <strong>Opening:</strong> "I've noticed you seem stressed lately. I care about your wellbeing. Can we talk?"
                    </p>
                    <p className="text-purple-800">
                      <strong>Listening:</strong> Listen more than you talk. Show genuine empathy and concern.
                    </p>
                    <p className="text-purple-800">
                      <strong>Offering Help:</strong> "What support would help you most? Here are some options..."
                    </p>
                    <p className="text-purple-800">
                      <strong>Follow-up:</strong> Schedule a check-in within 1-2 weeks
                    </p>
                  </div>
                </div>

                {/* Section 3: Actions */}
                <div className="rounded-lg border-2 border-green-300 bg-green-50 p-6">
                  <h3 className="mb-4 text-lg font-bold text-green-900">3. Immediate Actions You Can Take</h3>
                  <ul className="space-y-2 text-green-800">
                    <li>✓ Adjust workload or deadlines if possible</li>
                    <li>✓ Offer flexible working arrangements</li>
                    <li>✓ Encourage and support wellness activities</li>
                    <li>✓ Provide access to EAP or counseling services</li>
                    <li>✓ Increase check-in frequency</li>
                    <li>✓ Model good work-life balance yourself</li>
                  </ul>
                </div>

                {/* Section 4: Escalation */}
                <div className="rounded-lg border-2 border-red-300 bg-red-50 p-6">
                  <h3 className="mb-4 text-lg font-bold text-red-900">4. When to Escalate to HR</h3>
                  <ul className="space-y-2 text-red-800">
                    <li>⚠️ When signs are severe or rapidly worsening</li>
                    <li>⚠️ When the employee discloses mental health concerns</li>
                    <li>⚠️ When simple interventions haven't improved the situation</li>
                    <li>⚠️ When you're unsure about appropriate next steps</li>
                    <li>⚠️ When a formal accommodation or leave may be needed</li>
                  </ul>
                </div>

                {/* Section 5: Prevention */}
                <div className="rounded-lg border-2 border-indigo-300 bg-indigo-50 p-6">
                  <h3 className="mb-4 text-lg font-bold text-indigo-900">5. Long-term Prevention Culture</h3>
                  <ul className="space-y-2 text-indigo-800">
                    <li>✓ Normalize conversations about mental health and burnout</li>
                    <li>✓ Set and model healthy work hours and boundaries</li>
                    <li>✓ Celebrate achievements and recognize good work</li>
                    <li>✓ Ensure realistic workloads and timelines</li>
                    <li>✓ Support professional development and growth</li>
                    <li>✓ Create psychological safety for open communication</li>
                  </ul>
                </div>

                {/* Key Reminders */}
                <div className="rounded-lg bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <p className="font-semibold text-yellow-900 mb-2">⚠️ Key Reminders:</p>
                  <ul className="space-y-1 text-sm text-yellow-800">
                    <li>• You're not a therapist—focus on support, not diagnosis</li>
                    <li>• Maintain confidentiality—treat conversations sensitively</li>
                    <li>• Document your concerns and actions for HR records</li>
                    <li>• Always involve HR or occupational health for serious cases</li>
                    <li>• Take care of yourself too—manager burnout is real</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
