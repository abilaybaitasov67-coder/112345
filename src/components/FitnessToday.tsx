import { FitnessGoal, fitnessGoals, todayExercises } from '../lib/fitnessData';

interface Props {
  goal: FitnessGoal;
  onStart: () => void;
}

export function FitnessToday({ goal, onStart }: Props) {
  const goalName = fitnessGoals.find((item) => item.id === goal)?.title;
  return (
    <section className="fitness-screen">
      <div className="fitness-title-row">
        <div><span className="fitness-label">ВОСКРЕСЕНЬЕ · НЕДЕЛЯ 1</span><h1>Добрый день!</h1><p>Сегодня начинаем спокойно и проверяем технику.</p></div>
        <div className="readiness"><b>82</b><span>Готовность<br /><small>Хорошая</small></span></div>
      </div>
      <article className="today-workout">
        <div className="today-workout__top"><span>ТРЕНИРОВКА 01</span><small>{goalName}</small></div>
        <h2>База всего тела</h2>
        <p>4 упражнения · 24 минуты · без оборудования</p>
        <div className="exercise-preview">
          {todayExercises.map((exercise, index) => <span key={exercise.name}><b>0{index + 1}</b>{exercise.name}</span>)}
        </div>
        <button onClick={onStart}>Начать тренировку <span>→</span></button>
      </article>
      <div className="today-grid">
        <article><small>СЕРИЯ</small><b>1 день</b><p>Начало положено. Не нужно быть идеальным — будь постоянным.</p></article>
        <article><small>СОВЕТ ТРЕНЕРА</small><b>Оставь запас</b><p>Первые подходы заканчивай, когда можешь сделать ещё 2–3 повтора.</p></article>
      </div>
    </section>
  );
}
