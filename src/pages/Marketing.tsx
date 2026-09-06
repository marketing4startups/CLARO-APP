import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, CheckCircle, Users, TrendingDown, BarChart3, 
  Heart, Shield, Zap, ArrowRight, Mail, Linkedin, Twitter
} from 'lucide-react';

export function Marketing() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, integrate with lead capture system
    console.log('Lead captured:', email);
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <span className="text-xl font-bold text-gray-900">CLARO</span>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#impact" className="text-gray-600 hover:text-gray-900">Impact</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
          </div>
          <button className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition">
            Start Trial
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
              Prevent Burnout 
              <span className="text-amber-600"> Before It Costs You</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              CLARO empowers managers to recognize warning signs and implement preventive measures before burnout becomes a crisis. Help your team thrive with science-backed burnout prevention.
            </p>
            <div className="flex gap-4">
              <button className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition font-semibold flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border-2 border-gray-300 text-gray-900 px-8 py-3 rounded-lg hover:border-gray-400 transition font-semibold">
                Schedule Demo
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-6">✓ No credit card required • ✓ 14-day full access • ✓ Manager training included</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-12 border border-amber-200"
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-600 text-white rounded-lg p-3 flex-shrink-0">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">60% More Effective</h3>
                  <p className="text-sm text-gray-600">Prevention catches burnout 60% earlier than crisis intervention</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-amber-600 text-white rounded-lg p-3 flex-shrink-0">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">$150K-300K Saved</h3>
                  <p className="text-sm text-gray-600">Per prevented employee resignation and lost productivity</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-amber-600 text-white rounded-lg p-3 flex-shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Healthier Teams</h3>
                  <p className="text-sm text-gray-600">Build a prevention-focused culture that employees trust</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-amber-600 text-white rounded-lg p-3 flex-shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manager Empowerment</h3>
                  <p className="text-sm text-gray-600">Training and tools for supportive conversations</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Burnout Crisis</h2>
            <p className="text-xl text-gray-600">A silent epidemic costing organizations billions</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { stat: '62%', label: 'of employees experience high burnout' },
              { stat: '$15-30B', label: 'annual economic cost (US only)' },
              { stat: '1 in 3', label: 'workers have left jobs due to burnout' },
              { stat: '150%', label: 'cost to replace burned-out employee' }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ translateY: -5 }}
                className="bg-white rounded-xl p-8 border border-gray-200 text-center"
              >
                <div className="text-3xl font-bold text-amber-600 mb-2">{item.stat}</div>
                <p className="text-gray-600">{item.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 bg-red-50 border-l-4 border-red-600 p-8 rounded">
            <h3 className="text-xl font-semibold text-red-900 mb-4">Why Current Solutions Fail</h3>
            <ul className="space-y-3 text-red-800">
              <li className="flex gap-3">
                <span className="font-bold">❌</span>
                <span><strong>Generic wellness apps:</strong> Meditation doesn't solve workload crisis</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">❌</span>
                <span><strong>EAP-only models:</strong> Crisis-reactive, not preventive</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">❌</span>
                <span><strong>Manager dashboards without tools:</strong> Data without action</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">❌</span>
                <span><strong>No validated assessment:</strong> Can't measure burnout accurately</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Three-Pillar Prevention</h2>
          <p className="text-xl text-gray-600">Recognize. Prevent. Intervene.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: '🎯 Recognize',
              subtitle: 'Early Detection with Validated Assessment',
              features: [
                'Maslach Burnout Inventory-based assessment',
                'Real-time risk scoring (0-100)',
                'Warning signs across 4 dimensions',
                'Trend analysis and monitoring'
              ]
            },
            {
              title: '🛡️ Prevent',
              subtitle: 'Proactive Support & Strategies',
              features: [
                'Manager dashboard with team insights',
                'Evidence-based prevention strategies',
                'Meditation and wellness integration',
                'Prevention playbook for managers'
              ]
            },
            {
              title: '🤝 Intervene',
              subtitle: 'Tiered Response System',
              features: [
                'Level 1: Prevention (everyone)',
                'Level 2: Early intervention (moderate risk)',
                'Level 3: Intensive support (high risk)',
                'Level 4: Crisis support (critical)'
              ]
            }
          ].map((pillar, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ translateY: -10 }}
              className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-amber-600 transition"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{pillar.title}</h3>
              <p className="text-amber-600 font-semibold mb-6">{pillar.subtitle}</p>
              <ul className="space-y-3">
                {pillar.features.map((feature, fidx) => (
                  <li key={fidx} className="flex gap-3 items-start">
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Manager Tools Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Manager Dashboard</h2>
              <p className="text-gray-600 mb-6">Give managers the tools they need to lead with confidence and care.</p>
              <ul className="space-y-4">
                {[
                  'Real-time team burnout metrics',
                  'Individual risk scores and trends',
                  'Specific behavioral indicators',
                  'Action recommendations per team member',
                  'Filter by risk level or department',
                  'Track intervention outcomes'
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 border-2 border-amber-200 shadow-lg">
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Team Health Overview</h4>
                  <div className="flex items-end gap-2 h-20">
                    {[45, 62, 28, 71, 35, 55].map((val, idx) => (
                      <div key={idx} className="flex-1">
                        <div className="bg-amber-200 rounded-t" style={{ height: `${val}%` }}></div>
                        <div className="text-xs text-gray-500 text-center mt-1">E{idx+1}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Risk Status</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <div className="text-2xl font-bold text-green-600">8</div>
                      <div className="text-xs text-green-700">Low Risk</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                      <div className="text-2xl font-bold text-yellow-600">4</div>
                      <div className="text-xs text-yellow-700">Moderate</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded border border-orange-200">
                      <div className="text-2xl font-bold text-orange-600">2</div>
                      <div className="text-xs text-orange-700">High</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded border border-red-200">
                      <div className="text-2xl font-bold text-red-600">1</div>
                      <div className="text-xs text-red-700">Critical</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Proven Impact</h2>
          <p className="text-xl text-gray-600">Real results from organizations using CLARO</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              metric: '40%',
              label: 'Reduction in burnout-related turnover',
              icon: TrendingDown
            },
            {
              metric: '$750K',
              label: 'Average cost savings Year 1 (per 500 employees)',
              icon: BarChart3
            },
            {
              metric: '70%',
              label: 'of managers increased confidence in support',
              icon: Heart
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 border-2 border-amber-200 text-center"
              >
                <Icon className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-amber-600 mb-2">{item.metric}</div>
                <p className="text-gray-700">{item.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Case Study */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="mt-16 bg-white rounded-xl p-12 border-2 border-gray-200 shadow-lg"
        >
          <div className="flex items-start gap-4 mb-6">
            <Users className="w-8 h-8 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Case Study: Tech Company</h3>
              <p className="text-gray-600">500 employees, high-growth engineering organization</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">Challenge</div>
              <p className="text-gray-700">Unexpected resignations from high-performers, managers lacking mental health training</p>
            </div>
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">Solution</div>
              <p className="text-gray-700">Deployed CLARO dashboard, trained 40 managers, established prevention protocols</p>
            </div>
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">Result</div>
              <p className="text-gray-700">2 prevented resignations ($300K saved), 60% manager confidence increase, positive culture shift</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Pay for what you need. Pause or upgrade anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '$10K',
                period: '/year',
                description: '50-250 employees',
                features: [
                  'Burnout assessments (unlimited)',
                  'Basic manager dashboard',
                  'Up to 10 manager accounts',
                  'Email support',
                  'Standard onboarding'
                ],
                cta: 'Start Free Trial',
                highlighted: false
              },
              {
                name: 'Professional',
                price: '$35K',
                period: '/year',
                description: '250-1,000 employees',
                features: [
                  'All Starter features',
                  'Advanced manager dashboard',
                  'Up to 50 manager accounts',
                  'Custom reporting',
                  'Priority support',
                  'Manager training program',
                  'SSO & directory integration'
                ],
                cta: 'Start Free Trial',
                highlighted: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                description: '1,000+ employees',
                features: [
                  'All Professional features',
                  'Unlimited manager accounts',
                  'Advanced analytics',
                  'Custom integrations',
                  'Dedicated success manager',
                  'Quarterly business reviews',
                  'Custom training',
                  'API access'
                ],
                cta: 'Schedule Demo',
                highlighted: false
              }
            ].map((plan, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ translateY: -10 }}
                className={`rounded-xl p-8 border-2 transition ${
                  plan.highlighted 
                    ? 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-600 ring-2 ring-amber-600 ring-offset-4' 
                    : 'bg-white border-gray-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <button className={`w-full py-3 rounded-lg font-semibold mb-6 transition ${
                  plan.highlighted
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'border-2 border-gray-300 text-gray-900 hover:border-gray-400'
                }`}>
                  {plan.cta}
                </button>
                <ul className="space-y-3">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Questions about pricing or need a custom plan?</p>
            <button className="text-amber-600 font-semibold hover:text-amber-700 flex items-center justify-center gap-2 mx-auto">
              Contact sales <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: 'Enterprise Security',
              description: 'SOC 2 Type II certified, data encryption at rest and in transit, regular security audits'
            },
            {
              icon: Heart,
              title: 'Employee Privacy',
              description: 'Employees control their data, voluntary assessment, transparent about how data is used'
            },
            {
              icon: Zap,
              title: 'Fast Implementation',
              description: 'Get started in 2 weeks, manager training included, support throughout deployment'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="text-center">
                <Icon className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="bg-gradient-to-r from-amber-600 to-orange-600 py-20 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Workplace?</h2>
          <p className="text-xl mb-8 opacity-90">Join organizations preventing burnout and building healthier, more engaged teams.</p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@company.com"
                required
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="bg-white text-amber-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2"
              >
                {submitted ? '✓ Sent!' : 'Get Started'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm mt-3 opacity-75">✓ No credit card required • ✓ 14-day full trial • ✓ Cancel anytime</p>
          </form>

          <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white border-opacity-20">
            {[
              { label: 'Demo', icon: '📞', action: 'Schedule' },
              { label: 'Docs', icon: '📚', action: 'Learn' },
              { label: 'Contact', icon: '💬', action: 'Chat' }
            ].map((item, idx) => (
              <button key={idx} className="hover:opacity-80 transition">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-semibold text-sm">{item.action}</div>
                <div className="text-xs opacity-75">{item.label}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <span className="text-white font-bold">CLARO</span>
              </div>
              <p className="text-sm">Preventing burnout, one team at a time.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex justify-between items-center">
            <p className="text-sm">&copy; 2024 CLARO. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition"><Mail className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
