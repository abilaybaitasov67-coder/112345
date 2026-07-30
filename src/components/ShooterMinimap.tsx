import { MutableRefObject } from 'react';
import { shooterBombSites, shooterMapBlocks, shooterTeamSpawns } from '../lib/shooterMapLayout';
import { ShooterWorld } from '../lib/shooterTypes';
import { SHOOTER_WORLD_HEIGHT, SHOOTER_WORLD_WIDTH } from '../lib/shooterWorld';

interface Props {
  worldRef: MutableRefObject<ShooterWorld>;
}

const blockColors = {
  building: '#26302d',
  stone: '#1b2220',
  cover: '#594333',
};

const routeAreas = [
  { x: 150, y: 0, width: 130, height: 180 },
  { x: 150, y: 100, width: 450, height: 310 },
  { x: 600, y: 300, width: 220, height: 110 },
  { x: 180, y: 410, width: 370, height: 410 },
  { x: 420, y: 820, width: 230, height: 140 },
  { x: 180, y: 960, width: 600, height: 220 },
  { x: 600, y: 1180, width: 220, height: 260 },
  { x: 820, y: 240, width: 300, height: 540 },
  { x: 850, y: 740, width: 230, height: 620 },
  { x: 1120, y: 620, width: 360, height: 160 },
  { x: 1320, y: 300, width: 200, height: 480 },
  { x: 1480, y: 100, width: 320, height: 300 },
  { x: 1600, y: 400, width: 200, height: 880 },
  { x: 1400, y: 1120, width: 400, height: 320 },
  { x: 1120, y: 1280, width: 480, height: 160 },
  { x: 600, y: 1360, width: 800, height: 220 },
];

const callouts = [
  { label: 'ТЕМКА', x: 430, y: 1050 },
  { label: 'МИД', x: 960, y: 900 },
  { label: 'ШОРТ', x: 1300, y: 690 },
  { label: 'ЛОНГ', x: 1700, y: 850 },
];

export function ShooterMinimap({ worldRef }: Props) {
  const world = worldRef.current;
  const rotation = world.angle * 180 / Math.PI + 90;
  return (
    <aside className="shooter-minimap" aria-label="Мини-карта">
      <svg viewBox={`0 0 ${SHOOTER_WORLD_WIDTH} ${SHOOTER_WORLD_HEIGHT}`}>
        <rect width={SHOOTER_WORLD_WIDTH} height={SHOOTER_WORLD_HEIGHT} fill="#111816" />
        {routeAreas.map((area, index) => (
          <rect
            key={`route-${index}`}
            {...area}
            rx="24"
            fill="#8d7656"
            stroke="#8d7656"
            strokeWidth="7"
          />
        ))}
        {shooterMapBlocks.map((block, index) => (
          <rect
            key={`${block.x}-${block.y}-${index}`}
            x={block.x}
            y={block.y}
            width={block.width}
            height={block.height}
            fill={blockColors[block.kind]}
            stroke="#836f51"
            strokeWidth="6"
          />
        ))}
        {callouts.map((callout) => (
          <text
            key={callout.label}
            x={callout.x}
            y={callout.y}
            className="callout"
          >
            {callout.label}
          </text>
        ))}
        {world.enemies.map((enemy, index) => (
          <circle key={index} cx={enemy.x} cy={enemy.y} r="24" fill="#d45b4f" />
        ))}
        {world.remotePlayers.filter((player) => player.health > 0).map((player) => (
          <circle key={player.id} cx={player.x} cy={player.y} r="22" fill="#63b7d1" />
        ))}
        {world.bomb.planted && !world.bomb.exploded && (
          <circle cx={world.bomb.x} cy={world.bomb.y} r="30" fill="#ffcf48" stroke="#2a1d16" strokeWidth="10" />
        )}
        <polygon
          points="0,-42 29,32 -29,32"
          fill="#f5dc6b"
          stroke="#151a18"
          strokeWidth="8"
          transform={`translate(${world.player.x} ${world.player.y}) rotate(${rotation})`}
        />
        <text x={shooterBombSites.A.x} y={shooterBombSites.A.y - 70} className="site site--a">A</text>
        <text x={shooterBombSites.B.x} y={shooterBombSites.B.y - 70} className="site site--b">B</text>
        <text x={shooterTeamSpawns.terrorists.x} y={shooterTeamSpawns.terrorists.y + 48}>T</text>
        <text x={shooterTeamSpawns.counter.x} y={shooterTeamSpawns.counter.y - 48}>CT</text>
      </svg>
    </aside>
  );
}
