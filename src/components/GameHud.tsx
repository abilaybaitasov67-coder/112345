import { AlertMeter } from './AlertMeter';
import { GameSnapshot, itemInfo, ItemId, questText } from '../lib/game';

const inventoryItems: ItemId[] = [
  'notebook', 'cookie', 'pass', 'key', 'taser', 'medicine', 'crowbar',
  'sleepingPowder', 'poison',
  'passwordNote',
];

export function GameHud({ game }: { game: GameSnapshot }) {
  return (
    <aside className="game-hud">
      <div className="quest-card">
        <div className="quest-card__top">
          <span className="hud-label">Текущее задание</span>
          <span className="token-count">🟡 {game.money}</span>
        </div>
        <strong>{questText[game.quest]}</strong>
      </div>
      <AlertMeter value={game.alert} />
      <div className="game-inventory">
        <span className="hud-label">Рюкзак</span>
        <div>
          {inventoryItems.map((item) => (
            <span className={game.items.includes(item) ? 'has-item' : ''} key={item} title={itemInfo[item].name}>
              {game.items.includes(item) ? itemInfo[item].icon : '?'}
            </span>
          ))}
        </div>
      </div>
      <div className="game-help">
        <span><kbd>WASD</kbd> / стрелки — идти</span>
        <span><kbd>E</kbd> — действовать</span>
      </div>
    </aside>
  );
}
