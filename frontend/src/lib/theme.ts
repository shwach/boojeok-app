export const C = {
  cream: '#F5EDD6',
  parchment: '#EDE0C4',
  ink: '#2C1810',
  inkLight: '#5C3D2E',
  gold: '#C4922A',
  goldLight: '#F0D97A',
  red: '#8B1A1A',
  border: '#C9A87C',
  shadow: 'rgba(44,24,16,0.12)',

  office: { bg: '#FFF8F0', accent: '#7B4A1E', chip: '#F4E4CC' },
  life:   { bg: '#F0F5FF', accent: '#1E3A7B', chip: '#D0DCF8' },
  love:   { bg: '#FFF0F4', accent: '#7B1E3A', chip: '#F8D0DC' },

  rare:      '#4A1E7B',
  legendary: '#8B6914',
  success:   '#1A6B3A',
};

export const CATEGORY_LABEL: Record<string, string> = {
  office: '직장인', life: '일상/생활', love: '연애/친목',
};

export const RARITY_LABEL: Record<string, string> = {
  common: '일반', rare: '희귀', legendary: '전설',
};

export const RARITY_COLOR: Record<string, string> = {
  common:    C.inkLight,
  rare:      C.rare,
  legendary: C.legendary,
};

export function levelName(baseName: string, level: number) {
  if (level === 0) return baseName;
  if (level >= 9) return `+${level} ${baseName.replace('부적', '파괴 부적')}`;
  return `+${level} 강화 ${baseName}`;
}
