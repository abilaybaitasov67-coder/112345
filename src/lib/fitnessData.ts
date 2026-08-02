export type FitnessGoal = 'strength' | 'shape' | 'energy';
export type FitnessSection = 'today' | 'plan' | 'progress' | 'coach';

export interface FitnessExercise {
  name: string;
  detail: string;
  target: string;
  rest: string;
}

export const fitnessGoals = [
  { id: 'strength', icon: '01', title: 'Стать сильнее', text: 'Силовые тренировки и плавный рост нагрузки' },
  { id: 'shape', icon: '02', title: 'Улучшить форму', text: 'Равномерная программа для всего тела' },
  { id: 'energy', icon: '03', title: 'Больше энергии', text: 'Короткие тренировки на выносливость' },
] as const;

export const fitnessNav: Array<{ id: FitnessSection; label: string; icon: string }> = [
  { id: 'today', label: 'Сегодня', icon: '●' },
  { id: 'plan', label: 'План', icon: '▦' },
  { id: 'progress', label: 'Прогресс', icon: '↗' },
  { id: 'coach', label: 'Тренер', icon: '✦' },
];

export const todayExercises: FitnessExercise[] = [
  { name: 'Приседания', detail: 'Колени направлены вслед за носками', target: '3 × 10', rest: '60 сек' },
  { name: 'Отжимания', detail: 'Корпус держи одной прямой линией', target: '3 × 8', rest: '60 сек' },
  { name: 'Ягодичный мост', detail: 'Задержись наверху на одну секунду', target: '3 × 12', rest: '45 сек' },
  { name: 'Планка', detail: 'Не прогибай поясницу', target: '3 × 25 сек', rest: '45 сек' },
];

export const weeklyPlan = [
  { day: 'ПН', name: 'Всё тело A', time: '24 мин', status: 'Сегодня', tone: 'active' },
  { day: 'ВТ', name: 'Восстановление', time: '12 мин', status: 'Легко', tone: 'light' },
  { day: 'СР', name: 'Всё тело B', time: '27 мин', status: 'Тренировка', tone: 'normal' },
  { day: 'ЧТ', name: 'Отдых', time: '—', status: 'Свободно', tone: 'rest' },
  { day: 'ПТ', name: 'Сила и баланс', time: '25 мин', status: 'Тренировка', tone: 'normal' },
];

export const muscleBalance = [
  { name: 'Ноги', value: 68 },
  { name: 'Грудь', value: 54 },
  { name: 'Спина', value: 61 },
  { name: 'Кор', value: 72 },
  { name: 'Плечи', value: 47 },
];
