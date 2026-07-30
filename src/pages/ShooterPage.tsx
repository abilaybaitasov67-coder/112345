import { Link } from 'wouter';
import { ShooterCanvas } from '../components/ShooterCanvas';
import { ShooterControls } from '../components/ShooterControls';
import { WeaponShop } from '../components/WeaponShop';
import { ShooterInventory } from '../components/ShooterInventory';
import { ShooterMultiplayer } from '../components/ShooterMultiplayer';
import { useShooterGame } from '../hooks/useShooterGame';
import { useShooterMultiplayer } from '../hooks/useShooterMultiplayer';
import { weaponInfo } from '../lib/shooterWeapons';
import '../styles/shooter.css';
import '../styles/shooter-aim.css';
import '../styles/shooter-inventory.css';
import '../styles/shooter-multiplayer.css';
import '../styles/shooter-mobile.css';

export function ShooterPage() {
  const shooter = useShooterGame();
  const multiplayer = useShooterMultiplayer(shooter.worldRef);
  const { game } = shooter;
  return (
    <main className="shooter-page">
      <header className="shooter-header">
        <Link href="/">← Все игры</Link>
        <strong>КАРТА «ПЫЛЬНЫЙ РУБЕЖ»</strong>
        <button onClick={shooter.restart}>↻ Заново</button>
      </header>
      <section className="shooter-hud">
        <span className="shooter-hud__team">СПЕЦНАЗ</span>
        <span>♥ <b>{game.health}</b></span>
        <span className="shooter-hud__mission">РАУНД 1 · ЦЕЛЕЙ <b>{game.enemies}</b></span>
        <span className="shooter-hud__bomb">{game.bomb}</span>
        <span>⌁ <b>{game.weapon ? weaponInfo[game.weapon].name : 'арсенал'}</b></span>
        <span className="shooter-hud__help">WASD · клик — огонь · E — подобрать</span>
      </section>
      <div className="shooter-stage">
        <ShooterCanvas
          worldRef={shooter.worldRef}
          keysRef={shooter.keysRef}
          mobileRef={shooter.mobileRef}
          restartKey={shooter.restartKey}
          onUpdate={shooter.sync}
          onFire={() => {
            shooter.fire();
            multiplayer.fire();
          }}
          onAim={shooter.setAiming}
          onPickup={shooter.pickUpWeapon}
        />
        <ShooterMultiplayer
          room={multiplayer.room}
          status={multiplayer.status}
          error={multiplayer.error}
          players={multiplayer.players}
          onJoin={multiplayer.join}
          onLeave={multiplayer.leave}
        />
        {game.aiming ? (
          <div className="shooter-scope" aria-hidden="true">
            <span className="shooter-scope__horizontal" />
            <span className="shooter-scope__vertical" />
          </div>
        ) : (
          <div className="shooter-crosshair" aria-hidden="true">
            <span /><span /><span /><span /><i />
          </div>
        )}
        {game.weapon && (
          <ShooterInventory
            weapons={game.inventory}
            active={game.weapon}
            onSelect={shooter.selectWeapon}
          />
        )}
        {game.status !== 'playing' && (
          <div className="shooter-result">
            <h1>{game.status === 'won' ? 'МИССИЯ ВЫПОЛНЕНА' : 'МИССИЯ ПРОВАЛЕНА'}</h1>
            <p>{game.message}</p>
            <button onClick={shooter.restart}>Играть снова</button>
          </div>
        )}
        {!game.weapon && (
          <WeaponShop money={game.money} onBuy={shooter.buyWeapon} />
        )}
      </div>
      <p className="shooter-message">{game.message}</p>
      <p className="shooter-credit">
        Планировка вдохновлена Dust II · автор оригинальной карты — Dave Johnston
      </p>
      <ShooterControls
        onMove={shooter.setMobile}
        onFire={() => {
          shooter.fire();
          multiplayer.fire();
        }}
        onAim={shooter.setAiming}
        onPickup={shooter.pickUpWeapon}
      />
    </main>
  );
}
