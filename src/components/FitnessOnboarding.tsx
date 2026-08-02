import { useState } from 'react';
import { FitnessGoal, fitnessGoals } from '../lib/fitnessData';

interface Props {
  onComplete: (goal: FitnessGoal) => void;
}

export function FitnessOnboarding({ onComplete }: Props) {
  const [goal, setGoal] = useState<FitnessGoal>('strength');
  const [place, setPlace] = useState('home');
  return (
    <section className="fitness-onboarding">
      <div className="fitness-onboarding__copy">
        <span className="fitness-label">ПЛАН ЗА 30 СЕКУНД</span>
        <h1>Тренер, который понимает тебя</h1>
        <p>Без обязательных фото и сравнений с другими. План меняется по твоему самочувствию.</p>
        <div className="privacy-note"><b>✓</b> Твои ответы используются только для программы</div>
      </div>
      <div className="onboarding-card">
        <small>ШАГ 1 ИЗ 2 · ВЫБЕРИ ЦЕЛЬ</small>
        <div className="fitness-goals">
          {fitnessGoals.map((item) => (
            <button className={goal === item.id ? 'is-selected' : ''} key={item.id} onClick={() => setGoal(item.id)}>
              <b>{item.icon}</b><span><strong>{item.title}</strong><small>{item.text}</small></span><i>{goal === item.id ? '✓' : '→'}</i>
            </button>
          ))}
        </div>
        <small>ГДЕ БУДЕШЬ ТРЕНИРОВАТЬСЯ?</small>
        <div className="place-choice">
          <button className={place === 'home' ? 'is-selected' : ''} onClick={() => setPlace('home')}>Дома</button>
          <button className={place === 'gym' ? 'is-selected' : ''} onClick={() => setPlace('gym')}>В зале</button>
        </div>
        <button className="fitness-primary" onClick={() => onComplete(goal)}>Создать безопасный план</button>
      </div>
    </section>
  );
}
