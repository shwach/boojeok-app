import React from 'react';
import { C, CATEGORY_LABEL, RARITY_LABEL, RARITY_COLOR, levelName } from '../lib/theme';

interface Props {
  talisman: { category: string; base_name: string; rarity: string; emoji: string; quote: string };
  level: number;
  large?: boolean;
}

export default function TalismanCard({ talisman, level, large }: Props) {
  const cat = C[talisman.category as keyof typeof C] as { bg: string; accent: string; chip: string };
  const pad = large ? '28px 20px' : '18px 16px';
  const iconSize = large ? 64 : 48;
  const nameSize = large ? 20 : 16;
  const lvSize = large ? 38 : 28;

  return (
    <div style={{
      borderRadius: 20, padding: pad, textAlign: 'center',
      background: cat.bg, border: `1.5px solid ${cat.accent}22`,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* inner dashed border */}
      <div style={{ position: 'absolute', inset: 8, borderRadius: 14, border: `1px dashed ${cat.accent}30`, pointerEvents: 'none' }} />

      <div style={{ fontSize: iconSize, marginBottom: 10 }}>{talisman.emoji}</div>
      <div style={{ fontFamily: 'Noto Serif KR, serif', fontSize: nameSize, fontWeight: 700, color: cat.accent, marginBottom: 6, lineHeight: 1.3 }}>
        {talisman.base_name}
      </div>
      <div style={{ fontSize: lvSize, fontWeight: 900, color: cat.accent, lineHeight: 1, marginBottom: 8 }}>
        {level === 0 ? '+0' : `+${level}`}
      </div>

      {/* rarity + category chips */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: large ? 10 : 0 }}>
        <span style={{ background: cat.chip, color: cat.accent, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
          {CATEGORY_LABEL[talisman.category]}
        </span>
        <span style={{ background: '#F0EAFC', color: RARITY_COLOR[talisman.rarity], borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
          {RARITY_LABEL[talisman.rarity]}
        </span>
      </div>

      {large && talisman.quote && (
        <div style={{ fontSize: 12, color: `${cat.accent}99`, fontStyle: 'italic', marginTop: 10, lineHeight: 1.5 }}>
          {talisman.quote}
        </div>
      )}
    </div>
  );
}
