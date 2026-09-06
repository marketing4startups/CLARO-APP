import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, signIn, logOut, handleFirestoreError, OperationType } from './lib/firebase';
import { UserProfile } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Training } from './pages/Training';
import { AssessmentPage } from './pages/Assessment';
import { AdminPage } from './pages/Admin';
import { Resources } from './pages/Resources';
import { Support } from './pages/Support';
import { LandingPage } from './pages/LandingPage';
import { Meditation } from './pages/Meditation';
import { BurnoutPrevention } from './pages/BurnoutPrevention';
import { EphemeralTracker } from './components/EphemeralTracker';
import { Button } from './components/ui/button';
import { Loader2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'meditation' | 'burnout' | 'training' | 'assessment' | 'admin' | 'resources' | 'support'>('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'User',
              photoURL: firebaseUser.photoURL || '',
              role: 'employee',
              points: 0,
              badges: [],
              completedModules: [],
              createdAt: serverTimestamp(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <EphemeralTracker />
        <LandingPage onSignIn={signIn} />
      </>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard profile={profile} />;
      case 'meditation': return <Meditation profile={profile} />;
      case 'burnout': return <BurnoutPrevention profile={profile} />;
      case 'training': return <Training profile={profile} />;
      case 'assessment': return <AssessmentPage profile={profile} />;
      case 'resources': return <Resources />;
      case 'support': return <Support />;
      case 'admin': return <AdminPage profile={profile} />;
      default: return <Dashboard profile={profile} />;
    }
  };

  return (
    <ErrorBoundary>
      <EphemeralTracker />
      <div className="flex min-h-screen bg-background">
        <Sidebar currentView={currentView} setView={setCurrentView} role={profile?.role} />
        <div className="flex flex-1 flex-col">
          <Navbar profile={profile} onLogout={logOut} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
