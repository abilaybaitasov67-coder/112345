import { WeaponId } from './shooterTypes';

interface ShotProfile {
  duration: number;
  frequency: number;
  volume: number;
}

const shotProfiles: Record<WeaponId, ShotProfile> = {
  knife: { duration: .045, frequency: 900, volume: .035 },
  pistol: { duration: .075, frequency: 1250, volume: .1 },
  revolver: { duration: .13, frequency: 720, volume: .15 },
  smg: { duration: .055, frequency: 1550, volume: .075 },
  rifle: { duration: .09, frequency: 1050, volume: .12 },
  shotgun: { duration: .19, frequency: 520, volume: .18 },
  sniper: { duration: .23, frequency: 430, volume: .2 },
};

let audioContext: AudioContext | null = null;
const noiseBuffers = new Map<WeaponId, AudioBuffer>();

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  audioContext ??= new AudioContext();
  if (audioContext.state === 'suspended') void audioContext.resume();
  return audioContext;
}

function getNoiseBuffer(context: AudioContext, weapon: WeaponId) {
  const cached = noiseBuffers.get(weapon);
  if (cached) return cached;
  const profile = shotProfiles[weapon];
  const length = Math.ceil(context.sampleRate * profile.duration);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) {
    const fade = 1 - index / samples.length;
    samples[index] = (Math.random() * 2 - 1) * fade;
  }
  noiseBuffers.set(weapon, buffer);
  return buffer;
}

export function playWeaponShot(weapon: WeaponId, volumeScale = 1) {
  const context = getAudioContext();
  if (!context) return;
  const profile = shotProfiles[weapon];
  const now = context.currentTime;
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = getNoiseBuffer(context, weapon);
  filter.type = 'bandpass';
  filter.frequency.value = profile.frequency;
  filter.Q.value = .65;
  gain.gain.setValueAtTime(profile.volume * volumeScale, now);
  gain.gain.exponentialRampToValueAtTime(.0001, now + profile.duration);
  source.connect(filter).connect(gain).connect(context.destination);
  source.start(now);
  source.stop(now + profile.duration);
}
