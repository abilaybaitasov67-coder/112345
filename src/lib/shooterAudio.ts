import { WeaponId } from './shooterTypes';

interface ShotProfile {
  duration: number;
  noiseFrequency: number;
  noiseVolume: number;
  bodyFrequency: number;
  bodyVolume: number;
}

const shotProfiles: Record<WeaponId, ShotProfile> = {
  knife: {
    duration: .08, noiseFrequency: 3200, noiseVolume: .12,
    bodyFrequency: 700, bodyVolume: .025,
  },
  pistol: {
    duration: .11, noiseFrequency: 1800, noiseVolume: .25,
    bodyFrequency: 140, bodyVolume: .13,
  },
  revolver: {
    duration: .18, noiseFrequency: 1050, noiseVolume: .32,
    bodyFrequency: 85, bodyVolume: .22,
  },
  smg: {
    duration: .075, noiseFrequency: 2200, noiseVolume: .19,
    bodyFrequency: 170, bodyVolume: .08,
  },
  rifle: {
    duration: .13, noiseFrequency: 1450, noiseVolume: .28,
    bodyFrequency: 115, bodyVolume: .15,
  },
  ak47: {
    duration: .15, noiseFrequency: 1200, noiseVolume: .34,
    bodyFrequency: 92, bodyVolume: .2,
  },
  m4a1: {
    duration: .115, noiseFrequency: 1650, noiseVolume: .27,
    bodyFrequency: 125, bodyVolume: .13,
  },
  shotgun: {
    duration: .26, noiseFrequency: 800, noiseVolume: .4,
    bodyFrequency: 65, bodyVolume: .28,
  },
  sniper: {
    duration: .32, noiseFrequency: 650, noiseVolume: .44,
    bodyFrequency: 52, bodyVolume: .32,
  },
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
    const fade = (1 - index / samples.length) ** 2;
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
  const noiseGain = context.createGain();
  const body = context.createOscillator();
  const bodyGain = context.createGain();
  source.buffer = getNoiseBuffer(context, weapon);
  filter.type = 'bandpass';
  filter.frequency.value = profile.noiseFrequency;
  filter.Q.value = .55;
  noiseGain.gain.setValueAtTime(profile.noiseVolume * volumeScale, now);
  noiseGain.gain.exponentialRampToValueAtTime(.0001, now + profile.duration);
  body.type = weapon === 'knife' ? 'triangle' : 'sawtooth';
  body.frequency.setValueAtTime(profile.bodyFrequency * 1.35, now);
  body.frequency.exponentialRampToValueAtTime(
    profile.bodyFrequency * .65,
    now + profile.duration,
  );
  bodyGain.gain.setValueAtTime(profile.bodyVolume * volumeScale, now);
  bodyGain.gain.exponentialRampToValueAtTime(.0001, now + profile.duration);
  source.connect(filter).connect(noiseGain).connect(context.destination);
  body.connect(bodyGain).connect(context.destination);
  source.start(now);
  source.stop(now + profile.duration);
  body.start(now);
  body.stop(now + profile.duration);
}
