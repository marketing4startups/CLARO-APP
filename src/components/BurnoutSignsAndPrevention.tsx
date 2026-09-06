import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, BookOpen, Users, Lightbulb, Shield } from 'lucide-react';
import { Button } from './ui/button';

interface BurnoutSignsProps {}

const BURNOUT_SIGNS = [
  {
    category: 'Physical Signs',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    signs: [
      'Chronic fatigue and low energy',
      'Frequent headaches or muscle tension',
      'Sleep disturbances or insomnia',
      'Weakened immune system (frequent illness)',
      'Weight changes or appetite loss',
      'Increased use of substances (alcohol, caffeine, sugar)',
    ]
  },
  {
    category: 'Emotional Signs',
    icon: Lightbulb,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    signs: [
      'Persistent irritability or mood swings',
      'Cynicism and detachment from work',
      'Reduced empathy or patience',
      'Feelings of helplessness or hopelessness',
      'Increased anxiety or panic attacks',
      'Depression or persistent sadness',
    ]
  },
  {
    category: 'Behavioral Signs',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    signs: [
      'Withdrawing from colleagues and social activities',
      'Reduced productivity or quality of work',
      'Increased absenteeism or tardiness',
      'Procrastination or avoidance of tasks',
      'Difficulty concentrating or remembering things',
      'Increased errors or mistakes',
    ]
  },
  {
    category: 'Work Performance Signs',
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    signs: [
      'Missing deadlines or reduced output',
      'Difficulty making decisions',
      'Loss of enthusiasm for projects',
      'Reduced participation in meetings',
      'Increased conflicts with team members',
      'Negative attitude toward work',
    ]
  }
];

const PREVENTION_STRATEGIES = [
  {
    title: 'Workload Management',
    icon: BookOpen,
    tips: [
      'Regularly assess and balance team workload',
      'Ensure realistic deadlines and expectations',
      'Encourage time off and vacation usage',
      'Support flexible working arrangements',
      'Redistribute work during peak periods',
      'Allow for professional development time',
    ]
  },
  {
    title: 'Supportive Culture',
    icon: Users,
    tips: [
      'Foster open communication and psychological safety',
      'Recognize and celebrate achievements',
      'Provide constructive feedback regularly',
      'Encourage peer support and mentorship',
      'Promote team-building activities',
      'Normalize discussing mental health',
    ]
  },
  {
    title: 'Personal Wellness',
    icon: Shield,
    tips: [
      'Encourage regular exercise and movement breaks',
      'Promote access to meditation and mindfulness',
      'Provide mental health resources and EAP',
      'Support healthy eating and sleep habits',
      'Encourage breaks throughout the day',
      'Facilitate stress management workshops',
    ]
  },
  {
    title: 'Career Development',
    icon: Lightbulb,
    tips: [
      'Provide clear career progression paths',
      'Offer training and skill development',
      'Support passion projects and interests',
      'Enable autonomy in role decisions',
      'Create opportunities for growth',
      'Foster mastery and skill-building',
    ]
  }
];

const MANAGER_ACTIONS = [
  {
    severity: 'Preventive',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    textColor: 'text-green-700',
    icon: CheckCircle2,
    actions: [
      'Monthly 1-on-1s focused on wellbeing',
      'Normalize mental health conversations',
      'Provide education on burnout signs',
      'Model good work-life balance',
      'Encourage wellness program participation',
      'Share mental health resources proactively',
    ]
  },
  {
    severity: 'Early Intervention',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-700',
    icon: AlertTriangle,
    actions: [
      'Schedule confidential check-in conversation',
      'Listen without judgment',
      'Explore specific stressors and challenges',
      'Offer immediate support (workload adjustment, flexibility)',
      'Discuss wellness and support options',
      'Set follow-up meeting to monitor progress',
    ]
  },
  {
    severity: 'Critical Intervention',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    textColor: 'text-red-700',
    icon: AlertTriangle,
    actions: [
      'Immediate meeting with employee and HR',
      'Discuss formal support plan and accommodations',
      'Consider temporary workload reduction',
      'Explore medical leave or sabbatical options',
      'Connect with professional mental health support',
      'Maintain regular check-ins with HR oversight',
    ]
  }
];

export function BurnoutSignsAndPrevention({}: BurnoutSignsProps) {
  const [activeTab, setActiveTab] = useState<'signs' | 'prevention' | 'actions'>('signs');

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('signs')}
          className={`px-4 py-3 font-semibold transition-colors ${
            activeTab === 'signs'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🚨 Warning Signs
        </button>
        <button
          onClick={() => setActiveTab('prevention')}
          className={`px-4 py-3 font-semibold transition-colors ${
            activeTab === 'prevention'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🛡️ Prevention Strategies
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`px-4 py-3 font-semibold transition-colors ${
            activeTab === 'actions'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          👔 Manager Actions
        </button>
      </div>

      {/* Signs Content */}
      {activeTab === 'signs' && (
        <div className="space-y-6">
          <div className="rounded-lg bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-800">
              <strong>Early Recognition is Key:</strong> These signs often appear gradually. Watch for combinations of symptoms, not just individual occurrences.
            </p>
          </div>

          <div className="grid gap-6">
            {BURNOUT_SIGNS.map((signGroup, idx) => {
              const Icon = signGroup.icon;
              return (
                <div key={idx} className={`rounded-lg border-2 p-6 ${signGroup.bgColor} ${signGroup.borderColor}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className={`h-6 w-6 ${signGroup.color}`} />
                    <h3 className={`text-lg font-bold ${signGroup.color}`}>
                      {signGroup.category}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {signGroup.signs.map((sign, signIdx) => (
                      <li key={signIdx} className="flex items-start gap-3">
                        <span className="mt-1 text-sm font-bold text-gray-500">•</span>
                        <span className="text-gray-700">{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-blue-800 font-semibold mb-2">💡 Manager Tip:</p>
            <p className="text-blue-700">
              Don't wait for multiple signs to intervene. Even one or two signs warrant a caring check-in conversation with your team member. Early intervention prevents escalation.
            </p>
          </div>
        </div>
      )}

      {/* Prevention Strategies */}
      {activeTab === 'prevention' && (
        <div className="space-y-6">
          <div className="rounded-lg bg-green-50 border-l-4 border-green-500 p-4">
            <p className="text-green-800">
              <strong>Prevention is Better Than Cure:</strong> Proactive strategies create a healthy workplace culture and reduce burnout before it starts.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {PREVENTION_STRATEGIES.map((strategy, idx) => {
              const Icon = strategy.icon;
              return (
                <div key={idx} className="rounded-lg bg-white p-6 shadow-md border-t-4 border-indigo-500">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="h-6 w-6 text-indigo-600" />
                    <h3 className="text-lg font-bold text-gray-900">{strategy.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {strategy.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg bg-indigo-50 border-l-4 border-indigo-500 p-4">
            <p className="text-indigo-800 font-semibold mb-2">💼 Implementation Priority:</p>
            <ol className="list-decimal list-inside space-y-1 text-indigo-700">
              <li>Establish open communication channels</li>
              <li>Normalize mental health conversations</li>
              <li>Ensure manageable workloads</li>
              <li>Provide accessible wellness resources</li>
              <li>Support professional development</li>
            </ol>
          </div>
        </div>
      )}

      {/* Manager Actions */}
      {activeTab === 'actions' && (
        <div className="space-y-6">
          <div className="rounded-lg bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-blue-800">
              <strong>Your Role Matters:</strong> Managers are often the first line of defense. Taking appropriate action at the right time can prevent serious burnout outcomes.
            </p>
          </div>

          {MANAGER_ACTIONS.map((actionGroup, idx) => (
            <div key={idx} className={`rounded-lg border-2 p-6 ${actionGroup.bgColor} ${actionGroup.borderColor}`}>
              <div className="flex items-center gap-3 mb-4">
                <actionGroup.icon className={`h-6 w-6 ${actionGroup.textColor}`} />
                <h3 className={`text-lg font-bold ${actionGroup.textColor}`}>
                  {actionGroup.severity}
                </h3>
              </div>

              <div className="space-y-3">
                {actionGroup.actions.map((action, actionIdx) => (
                  <div key={actionIdx} className="rounded-lg bg-white/60 p-3">
                    <div className="flex items-start gap-3">
                      <span className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${actionGroup.textColor}`} style={{ backgroundColor: 'currentColor' }} />
                      <p className="text-gray-700">{action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-lg bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="text-yellow-800 font-semibold mb-2">⚠️ Important Reminders:</p>
            <ul className="space-y-2 text-yellow-700 text-sm">
              <li>• Always involve HR/Occupational Health for critical cases</li>
              <li>• Document conversations and actions taken</li>
              <li>• Maintain confidentiality and treat with sensitivity</li>
              <li>• Follow company policies and legal requirements</li>
              <li>• Seek guidance if unsure about appropriate next steps</li>
            </ul>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4 border border-gray-200 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-indigo-600 mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Training</h4>
              <p className="text-sm text-gray-600">Attend manager wellbeing training</p>
            </div>
            <div className="rounded-lg bg-white p-4 border border-gray-200 text-center">
              <Users className="mx-auto h-8 w-8 text-indigo-600 mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Support Network</h4>
              <p className="text-sm text-gray-600">Connect with HR and occupational health</p>
            </div>
            <div className="rounded-lg bg-white p-4 border border-gray-200 text-center">
              <Shield className="mx-auto h-8 w-8 text-indigo-600 mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Follow Up</h4>
              <p className="text-sm text-gray-600">Regular check-ins show you care</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
