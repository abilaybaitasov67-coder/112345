import { MutableRefObject, useEffect, useRef } from 'react';
import { updateShooter } from '../lib/shooterPhysics';
import { ShooterPoint, ShooterWorld } from '../lib/shooterTypes';
import { SHOOTER_HEIGHT, SHOOTER_WIDTH } from '../lib/shooterWorld';
import { Shooter3dRenderer } from '../lib/shooter3dRenderer';

interface Props {
  worldRef: MutableRefObject<ShooterWorld>;
  keysRef: MutableRefObject<Set<string>>;
  mobileRef: MutableRefObject<ShooterPoint>;
  restartKey: number;
  onUpdate: () => void;
  onFire: () => void;
  onAim: (aiming: boolean) => void;
  onPickup: () => void;
}

function movement(keys: Set<string>, mobile: ShooterPoint) {
  const left = keys.has('a');
  const right = keys.has('d');
  const up = keys.has('w') || keys.has('arrowup');
  const down = keys.has('s') || keys.has('arrowdown');
  return { x: Number(right) - Number(left) + mobile.x, y: Number(down) - Number(up) + mobile.y };
}

export function ShooterCanvas(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerX = useRef<number | null>(null);
  const pointerY = useRef<number | null>(null);
  const firingRef = useRef(false);
  const onFireRef = useRef(props.onFire);
  onFireRef.current = props.onFire;

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      props.keysRef.current.add(event.key.toLowerCase());
      if (event.key.toLowerCase() === 'e' && !event.repeat) props.onPickup();
    };
    const up = (event: KeyboardEvent) => props.keysRef.current.delete(event.key.toLowerCase());
    const stopFiring = () => { firingRef.current = false; };
    const mouseLook = (event: MouseEvent) => {
      if (document.pointerLockElement === canvasRef.current) {
        props.worldRef.current.angle += event.movementX * 0.0025;
        props.worldRef.current.pitch = Math.max(
          -150,
          Math.min(150, props.worldRef.current.pitch - event.movementY * 0.65),
        );
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('pointerup', stopFiring);
    document.addEventListener('mousemove', mouseLook);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('pointerup', stopFiring);
      document.removeEventListener('mousemove', mouseLook);
    };
  }, [props.keysRef, props.onPickup, props.worldRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const view = new Shooter3dRenderer(canvas, props.worldRef.current);
    let frame = 0;
    let previous = performance.now();
    let syncTimer = 0;
    const loop = (now: number) => {
      const elapsed = Math.min(32, now - previous);
      if (props.keysRef.current.has('arrowleft')) props.worldRef.current.angle -= elapsed * 0.003;
      if (props.keysRef.current.has('arrowright')) props.worldRef.current.angle += elapsed * 0.003;
      if (firingRef.current) onFireRef.current();
      previous = now;
      updateShooter(props.worldRef.current, elapsed, movement(props.keysRef.current, props.mobileRef.current));
      view.render(props.worldRef.current);
      syncTimer += elapsed;
      if (syncTimer > 100) { props.onUpdate(); syncTimer = 0; }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      view.dispose();
    };
  }, [
    props.keysRef, props.mobileRef, props.onUpdate,
    props.restartKey, props.worldRef,
  ]);

  const turn = (clientX: number, clientY: number) => {
    if (pointerX.current !== null) {
      props.worldRef.current.angle += (clientX - pointerX.current) * 0.008;
    }
    if (pointerY.current !== null) {
      props.worldRef.current.pitch = Math.max(
        -150,
        Math.min(150, props.worldRef.current.pitch - (clientY - pointerY.current) * 0.8),
      );
    }
    pointerX.current = clientX;
    pointerY.current = clientY;
  };

  return (
    <canvas
      ref={canvasRef}
      width={SHOOTER_WIDTH}
      height={SHOOTER_HEIGHT}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse' && event.buttons > 0) {
          turn(event.clientX, event.clientY);
        }
      }}
      onPointerDown={(event) => {
        if (event.button === 2) {
          props.onAim(true);
          return;
        }
        firingRef.current = true;
        if (event.pointerType === 'mouse') {
          void canvasRef.current?.requestPointerLock();
        } else {
          pointerX.current = event.clientX;
          pointerY.current = event.clientY;
          canvasRef.current?.setPointerCapture(event.pointerId);
        }
        onFireRef.current();
      }}
      onPointerUp={(event) => {
        firingRef.current = false;
        if (event.button === 2) props.onAim(false);
        pointerX.current = null;
        pointerY.current = null;
      }}
      onPointerCancel={() => { firingRef.current = false; }}
      onContextMenu={(event) => event.preventDefault()}
    />
  );
}
