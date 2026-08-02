import { muscleBalance } from '../lib/fitnessData';

export function FitnessProgress() {
  return (
    <section className="fitness-screen">
      <div className="fitness-title-row">
        <div><span className="fitness-label">БЕЗ СРАВНЕНИЯ С ДРУГИМИ</span><h1>Твой прогресс</h1><p>Мы сравниваем тебя только с твоими прошлыми результатами.</p></div>
        <div className="personal-level"><small>ЛИЧНЫЙ УРОВЕНЬ</small><b>Новичок II</b></div>
      </div>
      <div className="progress-grid">
        <article className="balance-card">
          <div><small>БАЛАНС ТЕЛА</small><b>61%</b></div>
          <div className="muscle-bars">
            {muscleBalance.map((muscle) => (
              <label key={muscle.name}><span>{muscle.name}<small>{muscle.value}%</small></span><i><b style={{ width: `${muscle.value}%` }} /></i></label>
            ))}
          </div>
        </article>
        <article className="weekly-chart">
          <small>АКТИВНОСТЬ ЗА НЕДЕЛЮ</small>
          <div>{[42, 18, 65, 28, 80, 35, 52].map((value, index) => <i key={index}><b style={{ height: `${value}%` }} /><small>{['Пн','Вт','Ср','Чт','Пт','Сб','Вс'][index]}</small></i>)}</div>
        </article>
      </div>
      <div className="achievement-row">
        <article><span>✓</span><div><b>Первый шаг</b><small>План создан</small></div></article>
        <article><span>3</span><div><b>Три занятия</b><small>Ещё 3 тренировки</small></div></article>
        <article><span>7</span><div><b>Неделя силы</b><small>Ещё 7 дней</small></div></article>
      </div>
    </section>
  );
}
