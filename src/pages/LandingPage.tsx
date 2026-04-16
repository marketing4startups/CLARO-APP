import React from 'react';
import { Heart, ShieldCheck, Zap, BarChart3, Users, ArrowRight, CheckCircle2, Lock, Star, Menu, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';

interface LandingPageProps {
  onSignIn: () => void;
}

export function LandingPage({ onSignIn }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <div className="h-4 w-4 rounded-full bg-primary" />
              <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-accent shadow-sm ring-2 ring-background" />
            </div>
            <span className="text-2xl font-display font-black tracking-[0.15em] text-primary">CLARO</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#security" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Security</a>
            <a href="#pricing" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Pricing</a>
            <Button variant="ghost" onClick={onSignIn} className="font-bold text-xs uppercase tracking-widest">Log In</Button>
            <Button onClick={onSignIn} className="rounded-full font-bold px-8 shadow-xl shadow-primary/10">Get Started</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t bg-white p-4 space-y-4 shadow-xl"
          >
            <a href="#features" className="block text-lg font-bold p-2">Features</a>
            <a href="#security" className="block text-lg font-bold p-2">Security</a>
            <a href="#pricing" className="block text-lg font-bold p-2">Pricing</a>
            <Button onClick={onSignIn} className="w-full rounded-xl font-bold py-6">Get Started</Button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge className="mb-8 bg-secondary/10 text-secondary-foreground border-secondary/20 px-5 py-2 rounded-full font-bold uppercase tracking-[0.25em] text-[9px]">
              The Future of Workplace Wellness
            </Badge>
            <h1 className="text-5xl md:text-8xl font-display font-medium tracking-tight text-primary mb-8 leading-[0.95]">
              Bring <span className="text-sage italic">Clarity</span> to <br /> 
              <span className="relative">
                Workplace
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              {" "}Mental Health.
            </h1>
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed font-sage">
              Empower your organization with evidence-based training, real-time wellness tracking, and private expert support.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button onClick={onSignIn} size="lg" className="w-full sm:w-auto rounded-full py-8 px-12 text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full py-8 px-12 text-lg font-bold border-border/60 hover:bg-muted/50 transition-all">
                Request a Demo
              </Button>
            </div>
          </motion.div>

          {/* Hero Image / Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl overflow-hidden">
              <img 
                src="https://picsum.photos/seed/claro-dashboard/1200/800" 
                alt="Claro Dashboard Preview" 
                className="rounded-2xl w-full shadow-inner"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -right-6 hidden lg:block">
              <div className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Security</p>
                  <p className="text-sm font-bold text-slate-900">SOC2 & HIPAA Compliant</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">Trusted by Forward-Thinking Teams</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
            {['Acme Corp', 'GlobalTech', 'Innovate', 'SafeGuard', 'Clarity Partners'].map(name => (
              <span key={name} className="text-xl font-black tracking-tighter text-slate-900">{name.toUpperCase()}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Audience Section */}
      <section id="features" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* For HR */}
            <motion.div 
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -30 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-[0.2em] border border-primary/20">
                <BarChart3 className="h-3 w-3" /> For HR & Leadership
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight leading-tight">
                Turn Well-being into a <br /><span className="text-sage italic">Measurable Asset.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed font-sage italic opacity-80">
                "Workplace health is the new competitive advantage. We provide the clarity to lead with data."
              </p>
              <ul className="grid gap-4">
                {[
                  'Real-time organization wellness heatmaps',
                  'Aggregated, anonymized engagement data',
                  'Cultural clarity and risk mitigation'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 group">
                    <div className="h-2 w-2 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                    <span className="font-medium text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* For Employees */}
            <motion.div 
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 30 }}
              viewport={{ once: true }}
              className="space-y-8 bg-white p-8 md:p-16 rounded-[2.5rem] border border-border/40 shadow-2xl shadow-primary/5 relative"
            >
              <div className="absolute top-8 right-8 text-secondary opacity-10">
                <Heart className="h-32 w-32" />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-[9px] font-bold uppercase tracking-[0.2em] border border-secondary/20">
                <Heart className="h-3 w-3" /> For Employees
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight leading-tight">
                A Safe Space to <br /><span className="text-secondary">Grow & Recover.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed font-sage italic opacity-80">
                "Your sanctuary for resilience. Expert tools, completely anonymous, always clear."
              </p>
              <ul className="grid gap-4">
                {[
                  '100% Anonymity Guarantees',
                  'Expert-led mindfulness & resilience training',
                  'Personalized wellness library'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 group">
                    <CheckCircle2 className="h-5 w-5 text-secondary" />
                    <span className="font-medium text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-primary text-primary-foreground overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/4" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="bg-white/10 text-white border-white/20 mb-8 uppercase tracking-[0.3em] text-[8px] font-bold px-4 py-1.5">Security & Privacy</Badge>
              <h2 className="text-4xl md:text-6xl font-display font-medium mb-8 leading-tight tracking-tight italic">
                Uncompromising Privacy. <br />
                <span className="font-sage">Total Peace of Mind.</span>
              </h2>
              <p className="text-primary-foreground/70 text-lg md:text-xl font-sage leading-relaxed mb-10 italic">
                Claro was architected from day one to protect the most sensitive data in your organization.
              </p>
              <div className="flex items-center gap-8">
                <div className="flex -space-x-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-12 w-12 rounded-full border-2 border-primary bg-primary-foreground/10 backdrop-blur-md flex items-center justify-center">
                      <Lock className="h-5 w-5 text-accent" />
                    </div>
                  ))}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary-foreground/60">
                  Bank-Grade Encryption
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {[
                { icon: Lock, title: 'End-to-End Encryption', desc: 'Personal check-ins and notes are strictly private.' },
                { icon: ShieldCheck, title: 'HIPAA & SOC2 Ready', desc: 'Compliance as a foundation, not an after-thought.' },
                { icon: Users, title: 'Anonymity Shield', desc: 'Aggregated insights that never reveal identities.' }
              ].map((feature, i) => (
                <div key={i} className="group bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-sm p-8 rounded-[2rem] border border-white/10 transition-all duration-500">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1 tracking-tight">{feature.title}</h3>
                      <p className="text-primary-foreground/50 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / ROI Section */}
      <section id="pricing" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-6">Simple, Transparent Pricing.</h2>
            <p className="text-lg text-muted-foreground">Choose the plan that fits your organization's scale and needs.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', price: '$4', desc: 'Perfect for small teams looking to start their wellness journey.', features: ['Up to 50 employees', 'Core training modules', 'Basic analytics', 'Email support'] },
              { name: 'Professional', price: '$8', desc: 'Comprehensive support for growing organizations.', features: ['Up to 500 employees', 'Full resource library', 'Advanced heatmaps', 'Priority support', 'Expert consultations'], popular: true },
              { name: 'Enterprise', price: 'Custom', desc: 'Tailored solutions for large-scale global enterprises.', features: ['Unlimited employees', 'Custom training paths', 'Dedicated account manager', 'SOC2 reporting', 'API access'] }
            ].map((plan, i) => (
              <Card key={i} className={`relative p-8 flex flex-col ${plan.popular ? 'border-primary ring-2 ring-primary/20 shadow-2xl scale-105 z-10' : 'border-slate-100'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-black">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-muted-foreground font-bold">/user/mo</span>}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{plan.desc}</p>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <Button onClick={onSignIn} variant={plan.popular ? 'default' : 'outline'} className="w-full py-6 font-bold rounded-xl">
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="mx-auto max-w-7xl px-4 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Bring Clarity to Your Team?</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Join hundreds of organizations that prioritize mental well-being as a core business value.
          </p>
          <Button onClick={onSignIn} size="lg" className="rounded-2xl py-8 px-12 text-xl font-bold bg-accent text-accent-foreground hover:bg-accent/90 shadow-2xl">
            Start Your Free Trial
          </Button>
          <p className="mt-8 text-sm text-slate-500">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1 space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-xl font-extrabold tracking-tighter text-primary">CLARO</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering organizations to support their people with evidence, empathy, and privacy.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Training</a></li>
                <li><a href="#" className="hover:text-primary">Resources</a></li>
                <li><a href="#" className="hover:text-primary">Expert Support</a></li>
                <li><a href="#" className="hover:text-primary">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Security</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Connect</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">LinkedIn</a></li>
                <li><a href="#" className="hover:text-primary">Twitter</a></li>
                <li><a href="#" className="hover:text-primary">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2024 Claro Health. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-muted-foreground hover:text-primary">Privacy</a>
              <a href="#" className="text-xs text-muted-foreground hover:text-primary">Terms</a>
              <a href="#" className="text-xs text-muted-foreground hover:text-primary">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`rounded-3xl border bg-card text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  );
}
