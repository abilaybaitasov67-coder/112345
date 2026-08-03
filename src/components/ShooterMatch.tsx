import { CSSProperties, useState } from 'react';
import { useShooterGame } from '../hooks/useShooterGame';
import { useShooterHotkeys } from '../hooks/useShooterHotkeys';
import { useShooterMultiplayer } from '../hooks/useShooterMultiplayer';
import { WeaponId } from '../lib/shooterTypes';
import { weaponInfo } from '../lib/shooterWeapons';
import { ShooterCanvas } from './ShooterCanvas';
import { ShooterControls } from './ShooterControls';
import { ShooterInventory } from './ShooterInventory';
import { ShooterMinimap } from './ShooterMinimap';
import { ShooterMultiplayer } from './ShooterMultiplayer';
import { WeaponShop } from './WeaponShop';
import { ShooterGrenades } from './ShooterGrenades';

interface Props {
  primary: WeaponId;
  onLobby: () => void;
}

export function ShooterMatch({ primary, onLobby }: Props) {
  const shooter = useShooterGame(primary);
  const multiplayer = useShooterMultiplayer(shooter.worldRef);
  const { game } = shooter;
  const [shopOpen, setShopOpen] = useState(false);
  useShooterHotkeys(
    shooter.worldRef, shooter.selectWeapon, setShopOpen, shooter.selectGrenade,
  );
  const restart = () => {
    setShopOpen(false);
    shooter.restart();
    multiplayer.resetRound();
    shooter.sync();
  };
  const fire = () => {
    const threwGrenade = shooter.fire();
    if (!threwGrenade) multiplayer.fire();
    return threwGrenade;
  };
  return (
    <main className="shooter-page">
      <header className="shooter-header">
        <button onClick={onLobby}>← Лобби</button>
        <strong>КАРТА «ПЫЛЬНЫЙ РУБЕЖ»</strong>
        <div className="shooter-header__actions">
          <button onClick={() => setShopOpen(true)}>Магазин</button>
          <button onClick={restart}>↻ Заново</button>
        </div>
      </header>
      <section className="shooter-hud">
        <span className="shooter-hud__team">
          {game.team === 'counter' ? 'СПЕЦНАЗ' : 'ТЕРРОРИСТЫ'}
        </span>
        <span>♥ <b>{game.health}</b></span>
        <span className="shooter-hud__mission">РАУНД 1 · ЦЕЛЕЙ <b>{game.enemies}</b></span>
        <span className="shooter-hud__bomb">{game.bomb}</span>
        <span>⌁ <b>{game.weapon ? weaponInfo[game.weapon].name : 'арсенал'}</b></span>
        <span className="shooter-hud__help">
          WASD · SPACE — прыжок · 1/2/3 — оружие · B — магазин · E — действие
        </span>
      </section>
      <div className="shooter-stage">
        <ShooterCanvas
          worldRef={shooter.worldRef}
          keysRef={shooter.keysRef}
          mobileRef={shooter.mobileRef}
          restartKey={shooter.restartKey}
          onUpdate={shooter.sync}
          onFire={fire}
          onAim={shooter.setAiming}
          onJump={shooter.jump}
          onPickup={shooter.pickUpWeapon}
          onActionEnd={shooter.stopAction}
        />
        <ShooterMinimap worldRef={shooter.worldRef} />
        <ShooterMultiplayer
          room={multiplayer.room}
          status={multiplayer.status}
          error={multiplayer.error}
          players={multiplayer.players}
          team={game.team}
          onJoin={multiplayer.join}
          onLeave={multiplayer.leave}
        />
        {game.aiming ? (
          <div className="shooter-scope" aria-hidden="true">
            <span className="shooter-scope__horizontal" />
            <span className="shooter-scope__vertical" />
          </div>
        ) : game.weapon !== 'sniper' ? (
          <div
            className="shooter-crosshair"
            style={{ '--spread': `${game.spread}px` } as CSSProperties}
            aria-hidden="true"
          >
            <span /><span /><span /><span /><i />
          </div>
        ) : null}
        {game.weapon && (
          <ShooterInventory
            weapons={game.inventory}
            active={game.weapon}
            onSelect={shooter.selectWeapon}
          />
        )}
        <ShooterGrenades
          counts={game.grenadeCounts}
          selected={game.selectedGrenade}
          onSelect={shooter.selectGrenade}
        />
        {game.status !== 'playing' && (
          <div className="shooter-result">
            <h1>{game.status === 'won' ? 'МИССИЯ ВЫПОЛНЕНА' : 'МИССИЯ ПРОВАЛЕНА'}</h1>
            <p>{game.message}</p>
            <button onClick={restart}>Играть снова</button>
          </div>
        )}
        {shopOpen && (
          <WeaponShop
            money={game.money}
            team={game.team}
            onClose={() => setShopOpen(false)}
            onBuy={(weapon, price) => {
              shooter.buyWeapon(weapon, price);
              setShopOpen(false);
            }}
            onBuyGrenade={(kind, price) => {
              shooter.buyGrenade(kind, price);
              setShopOpen(false);
            }}
          />
        )}
      </div>
      <p className="shooter-message">{game.message}</p>
      <p className="shooter-credit">
        Планировка вдохновлена Dust II · автор оригинальной карты — Dave Johnston
        <br />
        Модель M4 — <a href="https://poly.pizza/m/9c_2lPvKB8u" target="_blank" rel="noreferrer">Kristian M</a>
        {' · '}
        <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noreferrer">CC BY 3.0</a>
      </p>
      <ShooterControls
        aiming={game.aiming}
        onMove={shooter.setMobile}
        onFire={fire}
        onAim={shooter.setAiming}
        onJump={shooter.jump}
        onPickup={shooter.pickUpWeapon}
        onActionEnd={shooter.stopAction}
      />
    </main>
  );
}
