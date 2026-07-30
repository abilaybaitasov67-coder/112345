import { MutableRefObject } from 'react';
import { shooterBombSites, shooterMapBlocks, shooterTeamSpawns } from '../lib/shooterMapLayout';
import { ShooterWorld } from '../lib/shooterTypes';
import { SHOOTER_WORLD_HEIGHT, SHOOTER_WORLD_WIDTH } from '../lib/shooterWorld';

interface Props {
  worldRef: MutableRefObject<ShooterWorld>;
}

const blockColors = {
  building: '#c49a65',
  stone: '#826849',
  cover: '#4d3b2d',
};

export function ShooterMinimap({ worldRef }: Props) {
  const world = worldRef.current;
  const rotation = world.angle * 180 / Math.PI + 90;
  return (
    <aside className="shooter-minimap" aria-label="Мини-карта">
      <svg viewBox={`0 0 ${SHOOTER_WORLD_WIDTH} ${SHOOTER_WORLD_HEIGHT}`}>
        <rect width={SHOOTER_WORLD_WIDTH} height={SHOOTER_WORLD_HEIGHT} fill="#202725" />
        {shooterMapBlocks.map((block, index) => (
          <rect
            key={`${block.x}-${block.y}-${index}`}
            x={block.x}
            y={block.y}
            width={block.width}
            height={block.height}
            fill={blockColors[block.kind]}
            stroke="#e0c18d"
            strokeWidth="8"
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
