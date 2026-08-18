export type DartThrow = { label: string; score: number; x: number; y: number };

const SECTORS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

export function scoreDart(x: number, y: number): DartThrow {
  const dx = x - 0.5;
  const dy = y - 0.5;
  const radius = Math.hypot(dx, dy) * 2;
  if (radius > 1) return { label: 'Miss', score: 0, x, y };
  if (radius <= 0.07) return { label: 'Bullseye', score: 50, x, y };
  if (radius <= 0.14) return { label: 'Outer bull', score: 25, x, y };

  const angle = (Math.atan2(dx, -dy) + Math.PI * 2) % (Math.PI * 2);
  const sector = SECTORS[Math.floor((angle + Math.PI / 20) / (Math.PI / 10)) % 20];
  const multiplier = radius >= 0.88 ? 2 : radius >= 0.52 && radius <= 0.6 ? 3 : 1;
  const prefix = multiplier === 3 ? 'Triple' : multiplier === 2 ? 'Double' : 'Single';
  return { label: `${prefix} ${sector}`, score: sector * multiplier, x, y };
}

export const dartNumbers = SECTORS;
