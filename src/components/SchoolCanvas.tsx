import { MutableRefObject, useEffect, useRef } from 'react';
import { GameWorld, WORLD_HEIGHT, WORLD_WIDTH } from '../lib/game';
import { drawGame } from '../lib/gameDraw';
import {
  movePlayer, updateBossGuards, updateDoctors, updateRepairCrew, updateTeachers,
  updateBossCoffee, updateWarehouseGuards,
} from '../lib/gamePhysics';

interface SchoolCanvasProps {
  worldRef: MutableRefObject<GameWorld>;
  keysRef: MutableRefObject<Set<string>>;
  restartKey: number;
  onUpdate: () => void;
}

export function SchoolCanvas({ worldRef, keysRef, restartKey, onUpdate }: SchoolCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    let animationFrame = 0;
    let lastTime = performance.now();
    let lastSync = 0;

    const frame = (now: number) => {
      const elapsed = Math.min(32, now - lastTime);
      lastTime = now;
      const world = worldRef.current;
      if (world.status === 'playing') {
        updateBossCoffee(world, elapsed);
        const keys = keysRef.current;
        const speed = elapsed * 0.19;
        let dx = 0;
        let dy = 0;
        if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) { dx -= speed; world.direction = 'left'; }
        if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) { dx += speed; world.direction = 'right'; }
        if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) { dy -= speed; world.direction = 'up'; }
        if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) { dy += speed; world.direction = 'down'; }
        if (dx && dy) { dx *= 0.707; dy *= 0.707; }
        if (!world.hiding && !world.showCodeLock && !world.showPanel
          && !world.showCoffeeChoice && !world.showPocketGame
          && !world.showShop) movePlayer(world, dx, dy);
        if (world.level === 'school') updateTeachers(world, elapsed);
        if (world.level === 'medblock') updateDoctors(world, elapsed);
        if (world.level === 'staff') updateBossGuards(world, elapsed);
        if (world.level === 'warehouse') updateWarehouseGuards(world, elapsed);
        if (world.repairPhase) updateRepairCrew(world, elapsed);
      }
      drawGame(context, world);
      if (now - lastSync > 180) { onUpdate(); lastSync = now; }
      animationFrame = requestAnimationFrame(frame);
    };
    animationFrame = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animationFrame);
  }, [keysRef, onUpdate, restartKey, worldRef]);

  return (
    <canvas
      ref={canvasRef}
      className="school-canvas"
      width={WORLD_WIDTH}
      height={WORLD_HEIGHT}
      aria-label="Карта медицинского центра"
    />
  );
}
