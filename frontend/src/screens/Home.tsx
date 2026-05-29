import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInventory, getDrawStatus } from '../lib/api';
import { C, CATEGORY_LABEL, RARITY_LABEL, RARITY_COLOR } from '../lib/theme';
import Layout from '../components/Layout';

const CAT_ICO: Record<string, string> = { office: '💼', life: '🌿', love: '💌' };

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [canDraw, setCanDraw] = useState(false);
  const [filter, setFilter] = useState('all');
  const nav = useNavigate();
  const nickname = localStorage.getItem('nickname') ?? '무명';

  useEffect(() => {
    getInventory().then(d => setItems(d.items ?? []));
    getDrawStatus().then(d => setCanDraw(d.canFreeDraw));
  }, []);

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);

  return (
    <Layout>
      <div style={{ padding: '16px 20px 24px' }}>
        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: C.inkLight, fontWeight: 500 }}>안녕하세요</div>
            <div style={{ fontFamily: 'Noto Serif KR, serif', fontSize: 22, fontWeight: 700, color: C.ink }}>{nickname} 님 👋</div>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 50, background: C.parchment, border: `2px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🧿</div>
        </div>

        {/* draw banner */}
        <div onClick={() => nav('/draw')} style={{
          background: `linear-gradient(135deg, ${C.red}, #6B1111)`,
          borderRadius: 18, padding: '16px 18px', marginBottom: 14,
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 52, opacity: 0.15 }}>🧧</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,248,240,0.7)', letterSpacing: 0.5, marginBottom: 4 }}>
            {canDraw ? '오늘의 무료 뽑기' : '추가 뽑기'}
          </div>
          <div style={{ fontFamily: 'Noto Serif KR, serif', fontSize: 17, fontWeight: 700, color: '#FFF8F0', marginBottom: 10 }}>
            {canDraw ? '무료 부적 1장 남았어요!' : '티켓으로 뽑을 수 있어요'}
          </div>
          <div style={{ background: '#F0D97A', color: C.ink, borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 700, display: 'inline-block' }}>
            {canDraw ? '무료 뽑기 →' : '뽑으러 가기 →'}
          </div>
        </div>

        {/* filter chips */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto' }}>
          {[['all', '전체'], ['office', '직장인'], ['life', '일상/생활'], ['love', '연애/친목']].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)}
              style={{
                border: 'none', cursor: 'pointer', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                background: filter === v ? C.red : C.parchment,
                color: filter === v ? 'white' : C.inkLight,
                fontFamily: 'Noto Sans KR, sans-serif',
              }}>{l}</button>
          ))}
        </div>

        {/* inventory */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>보유 부적</span>
          <span style={{ fontSize: 12, color: C.inkLight }}>{filtered.length}장 보유</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: C.inkLight, fontSize: 14 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🧧</div>
            아직 부적이 없어요<br />
            <span style={{ color: C.red, fontWeight: 700, cursor: 'pointer' }} onClick={() => nav('/draw')}>무료 뽑기</span>를 해보세요!
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.id} onClick={() => nav(`/enhance/${item.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 11, background: 'white',
                borderRadius: 14, padding: '11px 14px', border: `1.5px solid ${C.parchment}`,
                marginBottom: 8, cursor: 'pointer',
                boxShadow: `0 2px 8px ${C.shadow}`,
              }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: (C[item.category as keyof typeof C] as any)?.chip, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {item.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.base_name}</div>
                <div style={{ marginTop: 3, display: 'flex', gap: 5 }}>
                  <span style={{ background: (C[item.category as keyof typeof C] as any)?.chip, color: (C[item.category as keyof typeof C] as any)?.accent, borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>
                    {CATEGORY_LABEL[item.category]}
                  </span>
                  <span style={{ background: '#F0EAFC', color: RARITY_COLOR[item.rarity], borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>
                    {RARITY_LABEL[item.rarity]}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: C.red, flexShrink: 0 }}>+{item.level}</div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
