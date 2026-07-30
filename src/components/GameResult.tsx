import { GameStatus } from '../lib/game';

interface GameResultProps {
  status: Exclude<GameStatus, 'playing'>;
  alert: number;
  onRestart: () => void;
}

export function GameResult({ status, alert, onRestart }: GameResultProps) {
  const won = status === 'won';

  return (
    <section className={`game-result ${won ? 'game-result--won' : ''}`}>
      <span className="game-result__icon">{won ? '🌙' : '🚨'}</span>
      <p className="game-scene__label">{won ? 'Миссия выполнена' : 'Побег не удался'}</p>
      <h1>{won ? 'Ты на свободе!' : 'Тебя поймали'}</h1>
      <p>
        {won
          ? `Запасной выход позади, а страх всего ${alert}%. Отличная работа!`
          : 'Шкала страха заполнилась. В следующий раз попробуй найти более тихий путь.'}
      </p>
      <button className="restart-button" onClick={onRestart}>↻ Сыграть ещё раз</button>
    </section>
  );
}
