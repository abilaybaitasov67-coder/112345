import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { RemoteShooter, ShooterWorld } from '../lib/shooterTypes';
import { weaponInfo } from '../lib/shooterWeapons';

interface PlayerState {
  id: string;
  name: string;
  x: number;
  y: number;
  angle: number;
  health: number;
  weapon?: RemoteShooter['weapon'];
}

interface DamageEvent {
  targetId: string;
  damage: number;
  attacker: string;
}

function createPlayerId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const random = Math.random().toString(36).slice(2);
  return `${Date.now().toString(36)}-${random}`;
}

const playerId = createPlayerId();
const playerName = `Игрок ${playerId.slice(0, 4).toUpperCase()}`;

export function useShooterMultiplayer(worldRef: MutableRefObject<ShooterWorld>) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const botsRef = useRef(worldRef.current.enemies);
  const [room, setRoom] = useState('');
  const [status, setStatus] = useState<'offline' | 'connecting' | 'online'>('offline');
  const [playerCount, setPlayerCount] = useState(0);
  const [error, setError] = useState('');

  const leave = useCallback(() => {
    if (channelRef.current) void supabase.removeChannel(channelRef.current);
    channelRef.current = null;
    worldRef.current.remotePlayers = [];
    worldRef.current.pvpMode = false;
    worldRef.current.enemies = botsRef.current;
    setRoom('');
    setStatus('offline');
    setPlayerCount(0);
  }, [worldRef]);

  const join = useCallback((rawCode: string) => {
    const code = rawCode.trim().toUpperCase().replace(/[^A-ZА-Я0-9]/g, '').slice(0, 8);
    if (!isSupabaseConfigured) {
      setError('Сначала подключи Supabase в .env.');
      return;
    }
    if (code.length < 3) {
      setError('Код комнаты должен содержать минимум 3 символа.');
      return;
    }
    leave();
    botsRef.current = worldRef.current.enemies;
    worldRef.current.enemies = [];
    worldRef.current.pvpMode = true;
    setError('');
    setRoom(code);
    setStatus('connecting');
    const channel = supabase.channel(`shooter-pvp:${code}`);
    channel
      .on('broadcast', { event: 'state' }, ({ payload }) => {
        const player = payload as PlayerState;
        if (player.id === playerId) return;
        const remote: RemoteShooter = { ...player, cooldown: 0, lastSeen: Date.now() };
        const others = worldRef.current.remotePlayers;
        const index = others.findIndex((item) => item.id === player.id);
        if (index >= 0) others[index] = remote;
        else others.push(remote);
        setPlayerCount(others.length);
      })
      .on('broadcast', { event: 'damage' }, ({ payload }) => {
        const hit = payload as DamageEvent;
        if (hit.targetId !== playerId) return;
        const world = worldRef.current;
        world.player.health = Math.max(0, world.player.health - hit.damage);
        world.message = `${hit.attacker} попал в тебя: −${hit.damage} HP`;
      })
      .subscribe((nextStatus) => {
        if (nextStatus === 'SUBSCRIBED') setStatus('online');
        if (nextStatus === 'CHANNEL_ERROR' || nextStatus === 'TIMED_OUT') {
          setError('Не удалось подключиться к комнате.');
          setStatus('offline');
        }
      });
    channelRef.current = channel;
  }, [leave, worldRef]);

  const fire = useCallback(() => {
    const channel = channelRef.current;
    const world = worldRef.current;
    if (!channel || status !== 'online' || !world.weapon) return;
    const maxDistance = world.weapon === 'knife' ? 65 : 900;
    const target = world.remotePlayers
      .map((player) => {
        const dx = player.x - world.player.x;
        const dy = player.y - world.player.y;
        const distance = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) - world.angle;
        const difference = Math.abs(Math.atan2(Math.sin(angle), Math.cos(angle)));
        return { player, distance, difference };
      })
      .filter(({ distance, difference }) =>
        distance <= maxDistance && difference < Math.max(.04, 18 / distance))
      .sort((a, b) => a.difference - b.difference)[0];
    if (!target) return;
    void channel.send({
      type: 'broadcast',
      event: 'damage',
      payload: {
        targetId: target.player.id,
        damage: weaponInfo[world.weapon].damage,
        attacker: playerName,
      } satisfies DamageEvent,
    });
  }, [status, worldRef]);

  useEffect(() => {
    if (status !== 'online') return undefined;
    const timer = window.setInterval(() => {
      const channel = channelRef.current;
      const world = worldRef.current;
      if (!channel) return;
      const payload: PlayerState = {
        id: playerId,
        name: playerName,
        x: world.player.x,
        y: world.player.y,
        angle: world.angle,
        health: world.player.health,
        weapon: world.weapon ?? undefined,
      };
      void channel.send({ type: 'broadcast', event: 'state', payload });
      const limit = Date.now() - 2500;
      world.remotePlayers = world.remotePlayers.filter((player) => player.lastSeen > limit);
      setPlayerCount(world.remotePlayers.length);
    }, 100);
    return () => window.clearInterval(timer);
  }, [status, worldRef]);

  useEffect(() => leave, [leave]);

  return { room, status, error, players: playerCount, join, leave, fire };
}
