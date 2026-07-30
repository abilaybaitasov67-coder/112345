export interface ShooterPoint {
  x: number;
  y: number;
}

export interface ShooterUnit extends ShooterPoint {
  health: number;
  cooldown: number;
  weapon?: WeaponId;
}

export interface RemoteShooter extends ShooterUnit {
  id: string;
  angle: number;
  name: string;
  lastSeen: number;
}

export interface ShooterBullet extends ShooterPoint {
  dx: number;
  dy: number;
  speed: number;
  enemy: boolean;
}

export interface ShooterCover extends ShooterPoint {
  width: number;
  height: number;
}

export interface DroppedWeapon extends ShooterPoint {
  weapon: WeaponId;
}

export interface ShooterBomb extends ShooterPoint {
  site: 'A' | 'B' | null;
  timer: number;
  defuseTimer: number;
  defuser: 'player' | 'bot' | 'remote' | null;
  updatedAt: number;
  planted: boolean;
  exploded: boolean;
  defused: boolean;
}

export type ShooterStatus = 'playing' | 'won' | 'lost';
export type WeaponId = 'knife' | 'pistol' | 'revolver' | 'smg' | 'rifle' | 'shotgun' | 'sniper';

export interface ShooterWorld {
  player: ShooterUnit;
  angle: number;
  pitch: number;
  recoil: number;
  moving: boolean;
  money: number;
  weapon: WeaponId | null;
  inventory: WeaponId[];
  aiming: boolean;
  pvpMode: boolean;
  enemies: ShooterUnit[];
  remotePlayers: RemoteShooter[];
  bullets: ShooterBullet[];
  droppedWeapons: DroppedWeapon[];
  bomb: ShooterBomb;
  covers: ShooterCover[];
  aim: ShooterPoint;
  status: ShooterStatus;
  message: string;
}
