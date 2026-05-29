export const SUCCESS_RATES: Record<number, number> = {
  0: 0.90, 1: 0.75, 2: 0.60, 3: 0.45,
  4: 0.30, 5: 0.20, 6: 0.12, 7: 0.07, 8: 0.03,
};

export const DESTROY_RATES: Record<number, number> = {
  7: 0.35, 8: 0.50, 9: 0.65,
};

export function attempt(level: number, useSafeTicket: boolean): {
  success: boolean;
  destroyed: boolean;
  newLevel: number;
} {
  const successRate = SUCCESS_RATES[level] ?? 0;
  const success = Math.random() < successRate;

  if (success) {
    return { success: true, destroyed: false, newLevel: level + 1 };
  }

  // failure
  if (useSafeTicket) {
    const newLevel = Math.max(0, level - 1);
    return { success: false, destroyed: false, newLevel };
  }

  const destroyRate = DESTROY_RATES[level] ?? 0;
  const destroyed = Math.random() < destroyRate;

  if (destroyed) {
    return { success: false, destroyed: true, newLevel: level };
  }

  // no destroy: level stays or drops
  const drops = level >= 4;
  const newLevel = drops ? Math.max(0, level - 1) : level;
  return { success: false, destroyed: false, newLevel };
}
