import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, Users, Activity, Zap, Heart, Eye, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { Button } from './ui/button';

interface TeamMember {
  uid: string;
  displayName: string;
  email: string;
  burnoutRiskScore: number; // 0-100
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  indicators: string[];
  lastCheckIn: Date;
  consecutiveHighStress: number;
  meditationEngagement: number;
  workPattern: 'healthy' | 'at-risk' | 'concerning';
}

interface ManagerDashboardProps {
  profile: UserProfile | null;
  teamMembers: TeamMember[];
}

export function ManagerDashboard({ profile, teamMembers }: ManagerDashboardProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [filterRisk, setFilterRisk] = useState<'all' | 'critical' | 'high' | 'moderate'>('all');

  const criticalCount = teamMembers.filter(m => m.riskLevel === 'critical').length;
  const highRiskCount = teamMembers.filter(m => m.riskLevel === 'high').length;
  const avgBurnoutScore = Math.round(
    teamMembers.reduce((sum, m) => sum + m.burnoutRiskScore, 0) / (teamMembers.length || 1)
  );

  const filteredMembers = filterRisk === 'all'
    ? teamMembers
    : teamMembers.filter(m => m.riskLevel === filterRisk);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', badge: 'bg-red-100' };
      case 'high': return { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', badge: 'bg-orange-100' };
      case 'moderate': return { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', badge: 'bg-yellow-100' };
      default: return { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', badge: 'bg-green-100' };
    }
  };

  const getRiskIcon = (level: string) => {
    if (level === 'critical' || level === 'high') return <AlertTriangle className="h-5 w-5" />;
    return <Eye className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Team Burnout Prevention Dashboard</h2>
        <p className="mt-2 text-gray-600">Monitor team wellbeing and identify burnout risks early</p>
      </div>

      {/* Critical Alert Banner */}
      {criticalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border-2 border-red-300 bg-red-50 p-4"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">⚠️ Critical Attention Needed</h3>
              <p className="text-sm text-red-800">
                {criticalCount} team member{criticalCount > 1 ? 's' : ''} showing critical burnout indicators.
                Immediate action recommended.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Average Burnout Score */}
        <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Burnout Score</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{avgBurnoutScore}/100</p>
            </div>
            <Activity className="h-8 w-8 text-indigo-500 opacity-20" />
          </div>
          <p className="mt-3 text-xs text-gray-600">
            {avgBurnoutScore < 30 && '✅ Healthy team wellbeing'}
            {avgBurnoutScore >= 30 && avgBurnoutScore < 50 && '⚠️ Monitor closely'}
            {avgBurnoutScore >= 50 && '🚨 Action needed'}
          </p>
        </div>

        {/* Critical Risk */}
        <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Risk</p>
              <p className="mt-2 text-3xl font-bold text-red-600">{criticalCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500 opacity-20" />
          </div>
          <p className="mt-3 text-xs text-gray-600">Immediate intervention required</p>
        </div>

        {/* High Risk */}
        <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk</p>
              <p className="mt-2 text-3xl font-bold text-orange-600">{highRiskCount}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-orange-500 opacity-20" />
          </div>
          <p className="mt-3 text-xs text-gray-600">Preventive action recommended</p>
        </div>

        {/* Team Size */}
        <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Size</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">{teamMembers.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500 opacity-20" />
          </div>
          <p className="mt-3 text-xs text-gray-600">Total team members</p>
        </div>
      </div>

      {/* Filter & Team List */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Team Members Risk Assessment</h3>
          <div className="flex gap-2">
            {(['all', 'critical', 'high', 'moderate'] as const).map(risk => (
              <Button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                variant={filterRisk === risk ? 'default' : 'outline'}
                size="sm"
              >
                {risk.charAt(0).toUpperCase() + risk.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Team Member Cards */}
        <div className="space-y-3">
          {filteredMembers.map(member => {
            const riskColor = getRiskColor(member.riskLevel);
            return (
              <motion.div
                key={member.uid}
                onClick={() => setSelectedMember(member)}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-lg ${riskColor.bg} ${riskColor.border}`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900">{member.displayName}</h4>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskColor.badge} ${riskColor.text}`}>
                        {member.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{member.email}</p>

                    {/* Indicators */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {member.indicators.map((indicator, i) => (
                        <span
                          key={i}
                          className="inline-block rounded-full bg-red-100 px-2.5 py-1 text-xs text-red-700"
                        >
                          {indicator}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-600">High Stress Days</p>
                        <p className="font-semibold text-gray-900">{member.consecutiveHighStress}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Engagement</p>
                        <p className="font-semibold text-gray-900">{member.meditationEngagement}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Last Check-in</p>
                        <p className="font-semibold text-gray-900">
                          {Math.floor((Date.now() - member.lastCheckIn.getTime()) / (1000 * 60 * 60))}h ago
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Risk Score Circle */}
                  <div className="ml-4 text-center">
                    <div className="relative h-16 w-16">
                      <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={
                            member.riskLevel === 'critical' ? '#dc2626' :
                            member.riskLevel === 'high' ? '#ea580c' :
                            member.riskLevel === 'moderate' ? '#eab308' : '#16a34a'
                          }
                          strokeWidth="3"
                          strokeDasharray={`${(member.burnoutRiskScore / 100) * 282.7} 282.7`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-900">{member.burnoutRiskScore}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-600">Risk Score</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredMembers.length === 0 && (
          <div className="rounded-lg bg-gray-50 p-8 text-center">
            <Heart className="mx-auto h-12 w-12 text-green-400" />
            <p className="mt-4 text-gray-600">No team members in this risk category</p>
          </div>
        )}
      </div>

      {/* Selected Member Details */}
      {selectedMember && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recommended Actions for {selectedMember.displayName}
          </h3>
          <div className="space-y-3">
            <div className="rounded-lg bg-blue-50 p-4 border-l-4 border-blue-500">
              <p className="font-medium text-blue-900">Immediate Check-in</p>
              <p className="text-sm text-blue-800 mt-1">
                Schedule a 1-on-1 conversation to discuss workload, stress levels, and support needs.
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-4 border-l-4 border-green-500">
              <p className="font-medium text-green-900">Workload Assessment</p>
              <p className="text-sm text-green-800 mt-1">
                Review current projects and deadlines. Consider redistributing tasks or extending timelines.
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 border-l-4 border-purple-500">
              <p className="font-medium text-purple-900">Wellbeing Support</p>
              <p className="text-sm text-purple-800 mt-1">
                Encourage participation in meditation sessions, mental health resources, and EAP services.
              </p>
            </div>
            {selectedMember.riskLevel === 'critical' && (
              <div className="rounded-lg bg-red-50 p-4 border-l-4 border-red-500">
                <p className="font-medium text-red-900">⚠️ HR Coordination</p>
                <p className="text-sm text-red-800 mt-1">
                  Consider involving HR/occupational health for formal support plan and potential medical leave options.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
