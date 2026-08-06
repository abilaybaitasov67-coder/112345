import { useState } from 'react';
import { ShooterLobby } from '../components/ShooterLobby';
import { ShooterMatch } from '../components/ShooterMatch';
import {
  inventoryItems,
  WeaponCase,
} from '../lib/shooterLobby';
import { WeaponId } from '../lib/shooterTypes';
import '../styles/shooter.css';
import '../styles/shooter-aim.css';
import '../styles/shooter-inventory.css';
import '../styles/shooter-lobby.css';
import '../styles/shooter-multiplayer.css';
import '../styles/shooter-mobile.css';
import '../styles/shooter-minimap.css';

export function ShooterPage() {
  const [playing, setPlaying] = useState(false);
  const [primary, setPrimary] = useState<WeaponId>('ak47');
  const [credits, setCredits] = useState(1500);
  const [owned, setOwned] = useState(['ak-sand', 'smg-carbon']);
  const [equipped, setEquipped] = useState<string | null>('ak-sand');
  const [reward, setReward] = useState<string | null>(null);

  const startMatch = () => {
    setPlaying(true);
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      void document.documentElement.requestFullscreen().catch(() => undefined);
    }
  };

  const leaveMatch = () => {
    setPlaying(false);
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    }
  };

  const openCase = (weaponCase: WeaponCase) => {
    if (credits < weaponCase.price) return;
    const rewardId = weaponCase.rewards[Math.floor(Math.random() * weaponCase.rewards.length)];
    const item = inventoryItems.find((candidate) => candidate.id === rewardId);
    if (!item) return;
    const duplicate = owned.includes(rewardId);
    setCredits((value) => value - weaponCase.price + (duplicate ? 100 : 0));
    if (!duplicate) setOwned((items) => [...items, rewardId]);
    setReward(`${item.name} · ${item.finish}${duplicate ? ' (+100 за повтор)' : ''}`);
  };

  if (playing) {
    return <ShooterMatch primary={primary} onLobby={leaveMatch} />;
  }
  return (
    <ShooterLobby
      primary={primary}
      credits={credits}
      owned={owned}
      equipped={equipped}
      reward={reward}
      onPrimaryChange={setPrimary}
      onEquip={setEquipped}
      onOpenCase={openCase}
      onPlay={startMatch}
    />
  );
}
