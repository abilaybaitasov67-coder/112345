import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { FitnessCoach } from '../components/FitnessCoach';
import { FitnessOnboarding } from '../components/FitnessOnboarding';
import { FitnessPlan } from '../components/FitnessPlan';
import { FitnessProgress } from '../components/FitnessProgress';
import { FitnessToday } from '../components/FitnessToday';
import { WorkoutPlayer } from '../components/WorkoutPlayer';
import { FitnessGoal, FitnessSection, fitnessNav } from '../lib/fitnessData';
import '../styles/fitness.css';
import '../styles/fitness-cards.css';
import '../styles/fitness-mobile.css';

function getSection(location: string): FitnessSection {
  const value = location.split('/')[2];
  return fitnessNav.some((item) => item.id === value) ? value as FitnessSection : 'today';
}

export function FitnessPage() {
  const [location, navigate] = useLocation();
  const [goal, setGoal] = useState<FitnessGoal>('strength');
  const [started, setStarted] = useState(location !== '/fitness');
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const section = getSection(location);

  if (!started) {
    return (
      <main className="fitness-page">
        <FitnessHeader />
        <FitnessOnboarding onComplete={(selectedGoal) => {
          setGoal(selectedGoal);
          setStarted(true);
          navigate('/fitness/today');
        }} />
      </main>
    );
  }

  return (
    <main className="fitness-page fitness-app">
      <FitnessHeader />
      <div className="fitness-layout">
        <nav className="fitness-nav" aria-label="Разделы фитнес-приложения">
          {fitnessNav.map((item) => <Link className={section === item.id ? 'is-active' : ''} href={`/fitness/${item.id}`} key={item.id}><i>{item.icon}</i><span>{item.label}</span></Link>)}
        </nav>
        {section === 'today' && <FitnessToday goal={goal} onStart={() => setWorkoutOpen(true)} />}
        {section === 'plan' && <FitnessPlan onStart={() => setWorkoutOpen(true)} />}
        {section === 'progress' && <FitnessProgress />}
        {section === 'coach' && <FitnessCoach />}
      </div>
      {workoutOpen && <WorkoutPlayer onClose={() => setWorkoutOpen(false)} />}
    </main>
  );
}

function FitnessHeader() {
  return (
    <header className="fitness-header">
      <Link href="/">← Проекты</Link><strong>FORMA</strong><Link className="fitness-profile" href="/auth">A</Link>
    </header>
  );
}
