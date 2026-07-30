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
  { x: 150, y: 100, width: 450, height: 310 },
  { x: 180, y: 410, width: 370, height: 410 },
  { x: 420, y: 820, width: 230, height: 140 },
  { x: 180, y: 960, width: 600, height: 220 },
  { x: 600, y: 1180, width: 220, height: 260 },
  { x: 820, y: 240, width: 300, height: 1200 },
  { x: 1120, y: 620, width: 360, height: 160 },
  { x: 1320, y: 300, width: 160, height: 480 },
  { x: 1400, y: 100, width: 400, height: 300 },
  { x: 1600, y: 400, width: 200, height: 880 },
  { x: 1400, y: 1120, width: 400, height: 320 },
  { x: 600, y: 1360, width: 800, height: 220 },
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
            stroke="#d2b684"
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
        <text x={shooterBombSites.A.x} y={shooterBombSites.A.y} className="site site--a">A</text>
        <text x={shooterBombSites.B.x} y={shooterBombSites.B.y} className="site site--b">B</text>
        <text x={shooterTeamSpawns.terrorists.x} y={shooterTeamSpawns.terrorists.y}>T</text>
        <text x={shooterTeamSpawns.counter.x} y={shooterTeamSpawns.counter.y}>CT</text>
        {world.enemies.map((enemy, index) => (
          <circle key={index} cx={enemy.x} cy={enemy.y} r="24" fill="#d45b4f" />
        ))}
        {world.remotePlayers.map((player) => (
          <circle key={player.id} cx={player.x} cy={player.y} r="22" fill="#63b7d1" />
        ))}
        {world.bomb.planted && (
          <circle cx={world.bomb.x} cy={world.bomb.y} r="30" fill="#ffcf48" stroke="#2a1d16" strokeWidth="10" />
        )}
        <polygon
          points="0,-42 29,32 -29,32"
          fill="#f5dc6b"
          stroke="#151a18"
          strokeWidth="8"
          transform={`translate(${world.player.x} ${world.player.y}) rotate(${rotation})`}
        />
      </svg>
    </aside>
  );
}
