export function PoisonEnding({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="poison-ending">
      <div className="poison-ending__scene" aria-hidden="true">
        <span>🏥</span>
        <i>ЗАКРЫТО</i>
      </div>
      <p className="game-scene__label">Dark ending</p>
      <h1>Директор умер.</h1>
      <h2>Больницу закрыли.</h2>
      <p>
        Вскоре после происшествия здание опечатали,
        а внутри началось расследование.
      </p>
      <button className="restart-button" onClick={onRestart}>Начать заново ↻</button>
    </section>
  );
}
