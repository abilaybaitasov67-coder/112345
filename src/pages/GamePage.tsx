import { Link } from 'wouter';
import { AishkaShop } from '../components/AishkaShop';
import { GameHud } from '../components/GameHud';
import { GameResult } from '../components/GameResult';
import { GoodEnding } from '../components/GoodEnding';
import { CodeLock } from '../components/CodeLock';
import { CoffeeChoice } from '../components/CoffeeChoice';
import { MobileControls } from '../components/MobileControls';
import { PanelMinigame } from '../components/PanelMinigame';
import { PocketMinigame } from '../components/PocketMinigame';
import { PoisonEnding } from '../components/PoisonEnding';
import { SchoolCanvas } from '../components/SchoolCanvas';
import { useSchoolGame } from '../hooks/useSchoolGame';
import '../styles/game.css';
import '../styles/game-responsive.css';

export function GamePage() {
  const schoolGame = useSchoolGame();
  const { game, restart, act, setDirection } = schoolGame;

  return (
    <main className="game-page">
      <header className="game-header">
        <Link href="/" className="game-logo">Побег <span>из медцентра</span></Link>
        <p className="game-chapter">
          {game.level === 'school' && 'Глава 1 · Медицинский офис'}
          {game.level === 'yard' && 'Глава 2 · Двор медцентра'}
          {game.level === 'medblock' && 'Глава 3 · Медблок'}
          {game.level === 'staff' && 'Здание персонала'}
          {game.level === 'warehouse' && 'Склад медикаментов'}
        </p>
        <button className="game-restart" onClick={restart}>↻ Начать заново</button>
      </header>

      <div className="game-shell">
        <GameHud game={game} />
        <section className="game-stage">
          {game.status === 'playing' ? (
            <>
              <SchoolCanvas
                worldRef={schoolGame.worldRef}
                keysRef={schoolGame.keysRef}
                restartKey={schoolGame.restartKey}
                onUpdate={schoolGame.sync}
              />
              <div className="dialogue-bar">
                <span className="dialogue-avatar">💬</span>
                <p>{game.message}</p>
              </div>
            </>
          ) : game.status === 'won'
            ? <GoodEnding onRestart={restart} />
            : game.status === 'poisonEnding'
              ? <PoisonEnding onRestart={restart} />
            : <GameResult status="lost" alert={game.alert} onRestart={restart} />}
        </section>
      </div>
      {game.status === 'playing' && <MobileControls onDirection={setDirection} onAction={act} />}
      {game.showCodeLock && (
        <CodeLock
          foundCode={game.foundGateCode}
          onSubmit={schoolGame.submitCode}
          onClose={schoolGame.closeCodeLock}
        />
      )}
      {game.showPanel && (
        <PanelMinigame onComplete={schoolGame.disablePanel} onClose={schoolGame.closePanel} />
      )}
      {game.showCoffeeChoice && (
        <CoffeeChoice
          hasPoison={game.items.includes('poison')}
          hasSleepingPowder={game.items.includes('sleepingPowder')}
          onChoose={schoolGame.chooseCoffeeAdditive}
          onClose={schoolGame.closeCoffeeChoice}
        />
      )}
      {game.showPocketGame && (
        <PocketMinigame
          onFound={schoolGame.findGateCode}
          onClose={schoolGame.closePocketGame}
        />
      )}
      {game.showShop && (
        <AishkaShop
          balance={game.money}
          hasTaser={game.items.includes('taser')}
          onBuyTaser={schoolGame.buyTaser}
          onClose={schoolGame.closeShop}
        />
      )}
    </main>
  );
}
