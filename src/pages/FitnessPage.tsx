import { useState } from 'react';
import { Link } from 'wouter';
import '../styles/fitness.css';

const goals = [
  { id: 'strength', icon: '01', title: 'Стать сильнее', text: 'Силовые тренировки и рост нагрузки' },
  { id: 'shape', icon: '02', title: 'Улучшить форму', text: 'Сбалансированная программа на всё тело' },
  { id: 'energy', icon: '03', title: 'Больше энергии', text: 'Короткие тренировки и развитие выносливости' },
] as const;

export function FitnessPage() {
  const [goal, setGoal] = useState<(typeof goals)[number]['id']>('strength');
  const [started, setStarted] = useState(false);
  const selected = goals.find((item) => item.id === goal) ?? goals[0];

  return (
    <main className="fitness-page">
      <header className="fitness-header">
        <Link href="/">← На главную</Link>
        <strong>FORMA</strong>
        <button>Войти</button>
      </header>

      {!started ? (
        <section className="fitness-intro">
          <div className="fitness-intro__copy">
            <span className="fitness-label">ТВОЙ ПЕРСОНАЛЬНЫЙ ТРЕНЕР</span>
            <h1>Начнём с твоей цели</h1>
            <p>Ответь на несколько вопросов, и приложение подготовит безопасный план тренировок.</p>
          </div>
          <div className="fitness-goals">
            {goals.map((item) => (
              <button
                className={goal === item.id ? 'is-selected' : ''}
                key={item.id}
                onClick={() => setGoal(item.id)}
              >
                <b>{item.icon}</b>
                <span><strong>{item.title}</strong><small>{item.text}</small></span>
                <i>{goal === item.id ? '✓' : '→'}</i>
              </button>
            ))}
          </div>
          <button className="fitness-primary" onClick={() => setStarted(true)}>
            Составить мой план
          </button>
        </section>
      ) : (
        <section className="fitness-dashboard">
          <div className="fitness-dashboard__title">
            <span className="fitness-label">ПЛАН НА СЕГОДНЯ</span>
            <h1>{selected.title}</h1>
            <p>Первая тренировка · 18 минут · без оборудования</p>
          </div>
          <article className="workout-card">
            <div className="workout-card__number">01</div>
            <div><small>РАЗМИНКА</small><h2>Готовим всё тело</h2><p>5 простых упражнений с подсказками тренера</p></div>
            <button>Начать</button>
          </article>
          <div className="fitness-stats">
            <article><b>0</b><span>тренировок</span></article>
            <article><b>0</b><span>минут</span></article>
            <article><b>1</b><span>день серии</span></article>
          </div>
          <button className="fitness-back" onClick={() => setStarted(false)}>Изменить цель</button>
        </section>
      )}
    </main>
  );
}
