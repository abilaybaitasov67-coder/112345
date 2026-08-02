import { useState } from 'react';
import { todayExercises } from '../lib/fitnessData';

interface Props { onClose: () => void }

export function WorkoutPlayer({ onClose }: Props) {
  const [index, setIndex] = useState(0);
  const exercise = todayExercises[index];
  const finished = index === todayExercises.length - 1;
  return (
    <div className="workout-player">
      <header><button onClick={onClose}>×</button><span>{index + 1} / {todayExercises.length}</span><small>24 МИН</small></header>
      <div className="workout-player__visual"><span>{String(index + 1).padStart(2, '0')}</span><div className="motion-figure"><i /><b /><em /></div></div>
      <section><small>ТЕХНИКА</small><h1>{exercise.name}</h1><p>{exercise.detail}</p><div className="set-target"><b>{exercise.target}</b><span>Отдых: {exercise.rest}</span></div><button onClick={() => finished ? onClose() : setIndex((value) => value + 1)}>{finished ? 'Завершить тренировку' : 'Готово · следующее'}</button></section>
    </div>
  );
}
