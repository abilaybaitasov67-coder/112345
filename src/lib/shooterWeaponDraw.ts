import { WeaponId } from './shooterTypes';

function body(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color = '#252b29',
) {
  const metal = context.createLinearGradient(x, y, x, y + height);
  metal.addColorStop(0, '#66716c');
  metal.addColorStop(.22, color);
  metal.addColorStop(1, '#101513');
  context.fillStyle = metal;
  context.strokeStyle = '#0b0f0d';
  context.lineWidth = 2;
  context.beginPath();
  context.roundRect(x, y, width, height, Math.min(5, height / 3));
  context.fill();
  context.stroke();
  context.strokeStyle = 'rgba(255,255,255,.2)';
  context.beginPath();
  context.moveTo(x + 5, y + 4);
  context.lineTo(x + width - 5, y + 4);
  context.stroke();
}

function bolt(context: CanvasRenderingContext2D, x: number, y: number) {
  context.fillStyle = '#9aa39f';
  context.beginPath();
  context.arc(x, y, 3, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = '#252b28';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(x - 2, y); context.lineTo(x + 2, y);
  context.stroke();
}

function muzzleFlash(context: CanvasRenderingContext2D, x: number, y: number) {
  context.save();
  context.shadowColor = '#ff9f1c';
  context.shadowBlur = 24;
  context.fillStyle = '#ffd45c';
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x - 28, y - 17);
  context.lineTo(x - 20, y);
  context.lineTo(x - 29, y + 16);
  context.fill();
  context.fillStyle = '#fff7c2';
  context.beginPath();
  context.arc(x - 8, y, 7, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawGun(context: CanvasRenderingContext2D, weapon: WeaponId) {
  if (weapon === 'pistol') {
    body(context, 746, 405, 105, 26);
    body(context, 815, 427, 28, 70, '#1b201e');
    body(context, 735, 412, 16, 10);
    bolt(context, 820, 417);
    return { x: 735, y: 417 };
  }
  if (weapon === 'revolver') {
    body(context, 735, 408, 120, 23, '#4a4d49');
    context.fillStyle = '#303532';
    context.beginPath(); context.arc(820, 430, 26, 0, Math.PI * 2); context.fill();
    context.strokeStyle = '#111714'; context.lineWidth = 3; context.stroke();
    bolt(context, 820, 430);
    body(context, 832, 442, 28, 62, '#332b25');
    return { x: 735, y: 418 };
  }
  if (weapon === 'smg') {
    body(context, 665, 405, 190, 38);
    body(context, 782, 440, 25, 90, '#151a18');
    body(context, 690, 440, 22, 55);
    body(context, 650, 415, 25, 12);
    bolt(context, 765, 420);
    return { x: 650, y: 421 };
  }
  if (weapon === 'rifle') {
    body(context, 610, 402, 250, 36, '#202825');
    body(context, 725, 438, 28, 96, '#151a18');
    body(context, 630, 412, 32, 60, '#37443d');
    body(context, 585, 414, 35, 11);
    body(context, 845, 430, 50, 24, '#34443b');
    body(context, 665, 392, 105, 9, '#161b19');
    bolt(context, 790, 419);
    return { x: 585, y: 419 };
  }
  if (weapon === 'shotgun') {
    body(context, 580, 405, 280, 24, '#453429');
    body(context, 585, 397, 225, 10, '#171c1a');
    body(context, 770, 425, 35, 94, '#33271f');
    body(context, 555, 399, 30, 10);
    context.strokeStyle = '#8d684c'; context.lineWidth = 2;
    for (let x = 610; x < 730; x += 14) {
      context.beginPath(); context.moveTo(x, 408); context.lineTo(x + 7, 426); context.stroke();
    }
    return { x: 555, y: 404 };
  }
  body(context, 545, 403, 315, 25, '#252c29');
  body(context, 680, 427, 26, 105, '#161b19');
  body(context, 565, 395, 205, 9, '#111614');
  body(context, 625, 374, 112, 20, '#151a18');
  context.fillStyle = '#3b4540';
  context.beginPath(); context.arc(680, 384, 25, 0, Math.PI * 2); context.fill();
  context.strokeStyle = '#111714'; context.lineWidth = 4; context.stroke();
  context.fillStyle = '#6b8b78';
  context.beginPath(); context.arc(680, 384, 13, 0, Math.PI * 2); context.fill();
  body(context, 520, 397, 30, 9);
  bolt(context, 775, 415);
  return { x: 520, y: 402 };
}

export function drawFirstPersonWeapon(
  context: CanvasRenderingContext2D,
  weapon: WeaponId | null,
  firing: boolean,
) {
  if (!weapon) return;
  context.save();
  context.translate(845, 520);
  context.rotate(0.16);
  context.translate(-845, -520);
  const skin = context.createLinearGradient(680, 480, 880, 560);
  skin.addColorStop(0, '#e0b08a');
  skin.addColorStop(1, '#8f5f43');
  context.fillStyle = skin;
  context.beginPath();
  context.ellipse(820, 535, 115, 42, -.35, 0, Math.PI * 2);
  context.ellipse(700, 522, 82, 32, -.55, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#315b45';
  context.beginPath();
  context.moveTo(760, 560); context.lineTo(680, 470);
  context.lineTo(735, 448); context.lineTo(875, 560);
  context.fill();
  const muzzle = drawGun(context, weapon);
  if (firing) muzzleFlash(context, muzzle.x, muzzle.y);
  context.restore();
}
