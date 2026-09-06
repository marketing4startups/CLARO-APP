# 🧘‍♀️ Workplace Wellbeing App - CLARO

A comprehensive mental health and meditation platform designed to support employee wellbeing in the workplace. Built with React, Vite, Firebase, and Tailwind CSS.

## 📋 Features

### 🎯 Core Features

#### 1. **Meditation & Mindfulness** 
- **Guided Meditation Library**: 6+ professionally curated meditation sessions
- **Categories**: 
  - Breathing exercises for stress relief
  - Body scan for relaxation
  - Mindfulness meditation for focus
  - Guided visualization for creativity
  - Loving-kindness for compassion
  - Sleep meditation for better rest
- **Customizable Duration**: 5-30 minute sessions
- **Difficulty Levels**: Beginner, Intermediate, Advanced

#### 2. **Meditation Timer**
- Visual progress tracking with circular timer
- Real-time countdown display (MM:SS format)
- Play/Pause/Reset controls
- Mood tracking before and after meditation
- Completion sound feedback (customizable)
- Volume control

#### 3. **Mental Health Check-in**
- Daily wellbeing assessment
- **Mood Score** (1-10 scale) with emoji feedback
- **Stress Level** tracking
- **Energy Level** assessment
- Sleep hours tracking
- Symptom tracking (headache, fatigue, anxiety, etc.)
- Personal notes field
- Data persistence to Firebase

#### 4. **Wellness Dashboard**
- Mental Health Score visualization
- Meditation streak counter
- Total meditation minutes tracked
- Average mood improvement per session
- Recent meditation sessions history
- Achievements and badges system
- Progress charts and metrics

#### 5. **Meditation Library**
- Filterable meditation guides
- Category-based organization
- Difficulty indicator
- Instructor information
- Session benefits display
- Beautiful card-based UI
- Quick start functionality

#### 6. **User Achievements**
- Milestone-based badges
- "First Steps" badge - Complete first meditation
- "7-Day Streak" badge - Meditate 7 days in a row
- Future: 30-day streak, 100+ minutes, mood improvement

### 🏢 Workplace Integration

- **Employee Dashboard**: Central hub for wellness metrics
- **Team Insights** (Admin): Aggregate wellbeing metrics
- **Resource Library**: Mental health articles and guides
- **Support Services**: Direct access to counseling/EAP
- **Training Modules**: Mental health education
- **Assessment Tracking**: Regular mental health assessments

## 🛠️ Tech Stack

### Frontend
- **React 19.0.0** - UI framework
- **Vite 6.2.0** - Build tool
- **TypeScript 5.8** - Type safety
- **Tailwind CSS 4.1** - Styling
- **Motion (Framer Motion)** - Animations
- **Lucide React** - Icons

### Backend & Services
- **Firebase 12.12.0**
  - Authentication (Email/Social)
  - Firestore (NoSQL database)
  - Cloud Storage
  - Analytics
- **Express.js 4.21** - API server
- **Node.js** - Runtime

### Development
- **TSX** - TypeScript executor
- **ESLint** - Code quality
- **PostCSS** - CSS processing
- **Autoprefixer** - Vendor prefixes

## 📁 Project Structure

```
src/
├── pages/
│   ├── Dashboard.tsx          # Main dashboard
│   ├── Meditation.tsx         # Meditation hub & library
│   ├── Training.tsx           # Training modules
│   ├── Assessment.tsx         # Mental health assessments
│   ├── Resources.tsx          # Resource library
│   ├── Support.tsx            # Support services
│   ├── Admin.tsx              # Admin dashboard
│   └── LandingPage.tsx        # Login/onboarding
├── components/
│   ├── MeditationTimer.tsx    # Timer component
│   ├── MeditationLibrary.tsx  # Library component
│   ├── MentalHealthCheckIn.tsx # Check-in form
│   ├── WellnessDashboard.tsx  # Wellness stats
│   ├── Navbar.tsx             # Top navigation
│   ├── Sidebar.tsx            # Main navigation
│   ├── ui/                    # UI components
│   └── ...
├── lib/
│   ├── firebase.ts            # Firebase config
│   └── utils.ts               # Utility functions
├── types.ts                   # TypeScript interfaces
├── App.tsx                    # Main app component
├── main.tsx                   # Entry point
└── index.css                  # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/marketing4startups/CLARO-APP.git
cd CLARO-APP
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
Create `.env.local` with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## 📊 Data Models

### MeditationSession
```typescript
{
  id: string;
  userId: string;
  guideId: string;
  guideName: string;
  durationMinutes: number;
  category: 'breathing' | 'body-scan' | 'mindfulness' | 'visualization' | 'gratitude';
  completedAt: Date;
  moodBefore: number;      // 1-10
  moodAfter: number;       // 1-10
  notes: string;
}
```

### MentalHealthCheckIn
```typescript
{
  id: string;
  userId: string;
  timestamp: Date;
  moodScore: number;       // 1-10
  stressLevel: number;     // 1-10
  energyLevel: number;     // 1-10
  sleepHours: number;
  notes: string;
  symptoms: string[];
}
```

## 🎨 User Interface

### Color Scheme
- **Primary**: Indigo (#4F46E5)
- **Accent**: Purple/Orange
- **Success**: Green
- **Alert**: Red/Orange
- **Neutral**: Gray

### Responsive Design
- Mobile-first approach
- Tailored for all screen sizes
- Touch-friendly interface on mobile
- Desktop optimized layout

## 🔐 Security Features

- Firebase Authentication
- Email verification
- Password encryption
- Firestore security rules
- CORS protection
- Environment variable secrets

## 📈 Future Enhancements

- [ ] Breathing exercise animations
- [ ] Audio meditation tracks (5.1 library)
- [ ] Social meditation groups
- [ ] AI-powered mood recommendations
- [ ] Integration with wearables (Fitbit, Apple Watch)
- [ ] Offline meditation access
- [ ] Advanced analytics and reporting
- [ ] Customizable break reminders
- [ ] Team challenges and goals
- [ ] Biofeedback integration
- [ ] Multiple language support
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact our support team via the app
- Email: support@claro-wellness.com

## 📞 Contact

**CLARO Wellness Team**
- Website: https://claro-wellness.com
- Email: hello@claro-wellness.com
- Twitter: @CLAROWellness

---

**Made with ❤️ for workplace wellbeing**

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Mental Health Resources](https://www.mentalhealth.gov)

---

*Last Updated: September 2024*
*Version: 0.1.0*
