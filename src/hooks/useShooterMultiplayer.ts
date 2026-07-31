import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { RemoteShooter, ShooterWorld } from '../lib/shooterTypes';
import { weaponInfo } from '../lib/shooterWeapons';
import {
  findVisiblePvpTarget,
  getPvpSpawn,
  placePvpPlayer,
  pvpPlayerId,
  pvpPlayerName,
  PVP_SPAWN_PROTECTION_MS,
  PvpDamageEvent,
  PvpPlayerState,
  syncPvpBomb,
} from '../lib/shooterPvp';

export function useShooterMultiplayer(worldRef: MutableRefObject<ShooterWorld>) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const botsRef = useRef(worldRef.current.enemies);
  const protectedUntilRef = useRef(0);
  const [room, setRoom] = useState('');
  const [status, setStatus] = useState<'offline' | 'connecting' | 'online'>('offline');
  const [playerCount, setPlayerCount] = useState(0);
  const [error, setError] = useState('');

  const leave = useCallback(() => {
    if (channelRef.current) void supabase.removeChannel(channelRef.current);
    channelRef.current = null;
    protectedUntilRef.current = 0;
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
    const spawn = getPvpSpawn(pvpPlayerId);
    worldRef.current.player.x = spawn.x;
    worldRef.current.player.y = spawn.y;
    worldRef.current.player.health = 100;
    worldRef.current.angle = spawn.angle;
    worldRef.current.jumpHeight = 0;
    worldRef.current.jumpVelocity = 0;
    worldRef.current.message = 'Защита спавна действует 8 секунд.';
    protectedUntilRef.current = Date.now() + PVP_SPAWN_PROTECTION_MS;
    setError('');
    setRoom(code);
    setStatus('connecting');
    const channel = supabase.channel(`shooter-pvp:${code}`, {
      config: { presence: { key: pvpPlayerId } },
    });
    const syncSpawn = () => {
      const players = Object.keys(channel.presenceState()).sort();
      const spawnIndex = players.indexOf(pvpPlayerId);
      if (spawnIndex < 0) return;
      placePvpPlayer(worldRef.current, spawnIndex);
      protectedUntilRef.current = Date.now() + PVP_SPAWN_PROTECTION_MS;
    };
    channel
      .on('presence', { event: 'sync' }, syncSpawn)
      .on('broadcast', { event: 'state' }, ({ payload }) => {
        const { bomb, ...player } = payload as PvpPlayerState;
        if (player.id === pvpPlayerId) return;
        syncPvpBomb(worldRef.current, bomb);
        const remote: RemoteShooter = {
          ...player,
          jumpHeight: player.jumpHeight ?? 0,
          cooldown: 0,
          lastSeen: Date.now(),
        };
        const others = worldRef.current.remotePlayers;
        const index = others.findIndex((item) => item.id === player.id);
        if (index >= 0) others[index] = remote;
        else others.push(remote);
        setPlayerCount(others.length);
      })
      .on('broadcast', { event: 'damage' }, ({ payload }) => {
        const hit = payload as PvpDamageEvent;
        if (hit.targetId !== pvpPlayerId) return;
        const world = worldRef.current;
        if (Date.now() < protectedUntilRef.current) {
          world.message = 'Выстрел заблокирован защитой спавна.';
          return;
        }
        world.player.health = Math.max(0, world.player.health - hit.damage);
        world.message = hit.headshot
          ? `${hit.attacker}: ХЕДШОТ! −${hit.damage} HP`
          : `${hit.attacker} попал в тебя: −${hit.damage} HP`;
      })
      .subscribe((nextStatus) => {
        if (nextStatus === 'SUBSCRIBED') {
          setStatus('online');
          void channel.track({ id: pvpPlayerId, name: pvpPlayerName });
        }
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
    const weapon = weaponInfo[world.weapon];
    if (Math.abs(world.player.cooldown - weapon.cooldown) > .001) return;
    if (Date.now() < protectedUntilRef.current) {
      world.message = 'Подожди окончания защиты спавна, затем стреляй.';
      return;
    }
    const shot = world.weapon === 'knife'
      ? undefined
      : world.bullets[world.bullets.length - 1];
    const hit = findVisiblePvpTarget(world, shot);
    if (!hit) return;
    const damage = weapon.damage * (hit.headshot ? 2 : 1);
    if (hit.headshot) world.message = `ХЕДШОТ! −${damage} HP`;
    void channel.send({
      type: 'broadcast',
      event: 'damage',
      payload: {
        targetId: hit.player.id,
        damage,
        attacker: pvpPlayerName,
        headshot: hit.headshot,
      } satisfies PvpDamageEvent,
    });
  }, [status, worldRef]);

  useEffect(() => {
    if (status !== 'online') return undefined;
    const timer = window.setInterval(() => {
      const channel = channelRef.current;
      const world = worldRef.current;
      if (!channel) return;
      const payload: PvpPlayerState = {
        id: pvpPlayerId,
        name: pvpPlayerName,
        x: world.player.x,
        y: world.player.y,
        angle: world.angle,
        jumpHeight: world.jumpHeight,
        health: world.player.health,
        weapon: world.weapon ?? undefined,
        bomb: { ...world.bomb },
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
