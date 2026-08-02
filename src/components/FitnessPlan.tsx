import { todayExercises, weeklyPlan } from '../lib/fitnessData';

interface Props { onStart: () => void }

export function FitnessPlan({ onStart }: Props) {
  return (
    <section className="fitness-screen">
      <div className="fitness-title-row">
        <div><span className="fitness-label">ТВОЯ ПРОГРАММА</span><h1>Неделя 1</h1><p>Три тренировки и восстановление между ними.</p></div>
        <button className="outline-button">Настроить план</button>
      </div>
      <div className="week-list">
        {weeklyPlan.map((day) => (
          <article className={`week-list__item is-${day.tone}`} key={day.day}>
            <b>{day.day}</b><div><strong>{day.name}</strong><small>{day.status}</small></div><span>{day.time}</span>
          </article>
        ))}
      </div>
      <article className="plan-details">
        <div><small>СЕГОДНЯ</small><h2>База всего тела</h2></div>
        <div className="plan-exercises">
          {todayExercises.map((exercise) => (
            <div key={exercise.name}><span>{exercise.name}<small>{exercise.detail}</small></span><b>{exercise.target}</b></div>
          ))}
        </div>
        <button onClick={onStart}>Начать эту тренировку</button>
      </article>
    </section>
  );
}
