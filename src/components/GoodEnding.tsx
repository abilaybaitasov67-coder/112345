export function GoodEnding({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="good-ending">
      <div className="good-ending__gate" aria-hidden="true">
        <span>🌅</span>
        <i />
        <i />
      </div>
      <p className="game-scene__label">Good ending</p>
      <h1>YOU DID IT.</h1>
      <h2>YOU ESCAPED.</h2>
      <p>The gates are open. You are finally free.</p>
      <button className="restart-button" onClick={onRestart}>Play again ↻</button>
    </section>
  );
}
