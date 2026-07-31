import { useState } from 'react';
import { Link } from 'wouter';
import {
  LobbyTab,
  WeaponCase,
  lobbyTabs,
  weaponCases,
} from '../lib/shooterLobby';
import { WeaponId } from '../lib/shooterTypes';
import { weaponInfo } from '../lib/shooterWeapons';
import { CaseShop } from './CaseShop';
import { LobbyInventory } from './LobbyInventory';
import { LobbyLoadout } from './LobbyLoadout';

interface Props {
  primary: WeaponId;
  credits: number;
  owned: string[];
  equipped: string | null;
  reward: string | null;
  onPrimaryChange: (weapon: WeaponId) => void;
  onEquip: (itemId: string) => void;
  onOpenCase: (weaponCase: WeaponCase) => void;
  onPlay: () => void;
}

export function ShooterLobby(props: Props) {
  const [tab, setTab] = useState<LobbyTab>('play');
  const weapon = weaponInfo[props.primary];
  return (
    <main className="game-lobby">
      <header className="game-lobby__topbar">
        <Link href="/">← Все игры</Link>
        <strong>ПЫЛЬНЫЙ РУБЕЖ</strong>
        <span>◈ {props.credits}</span>
      </header>
      <nav className="game-lobby__nav" aria-label="Разделы лобби">
        {lobbyTabs.map((item) => (
          <button
            className={tab === item.id ? 'is-active' : ''}
            key={item.id}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="game-lobby__content">
        {tab === 'play' && (
          <section className="lobby-hero">
            <div className="lobby-hero__copy">
              <small>БЫСТРЫЙ МАТЧ · ПЫЛЬНЫЙ РУБЕЖ</small>
              <h1>Готов к операции?</h1>
              <p>Установи бомбу на точке A или B и не дай спецназу её обезвредить.</p>
              <button onClick={props.onPlay}>НАЧАТЬ ИГРУ</button>
            </div>
            <div className="lobby-weapon-card">
              <small>ТВОЙ ЛОДАУТ</small>
              <span>{weapon.icon}</span>
              <h2>{weapon.name}</h2>
              <p>{weapon.detail}</p>
              <button onClick={() => setTab('loadout')}>Изменить</button>
            </div>
          </section>
        )}
        {tab === 'loadout' && (
          <LobbyLoadout primary={props.primary} onChange={props.onPrimaryChange} />
        )}
        {tab === 'inventory' && (
          <LobbyInventory
            owned={props.owned}
            equipped={props.equipped}
            onEquip={props.onEquip}
          />
        )}
        {tab === 'cases' && (
          <CaseShop cases={weaponCases} credits={props.credits} onOpen={props.onOpenCase} />
        )}
      </div>
      {props.reward && <div className="case-reward">Получено: <b>{props.reward}</b></div>}
    </main>
  );
}
