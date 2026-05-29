import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { draw, getDrawStatus } from '../lib/api';
import { C } from '../lib/theme';
import Layout from '../components/Layout';
import TalismanCard from '../components/TalismanCard';

export default function Draw() {
  const [canDraw, setCanDraw] = useState<boolean | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animIn, setAnimIn] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    getDrawStatus().then(d => setCanDraw(d.canFreeDraw));
  }, []);

  async function handleDraw() {
    setLoading(true); setError('');
    try {
      const data = await draw();
      setResult(data.userTalisman);
      setTimeout(() => setAnimIn(true), 50);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <Layout>
        <div style={{ padding: '20px 20px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.inkLight, letterSpacing: 0.5, marginBottom: 6 }}>뽑기 결과</div>
            <div style={{ fontFamily: 'Noto Serif KR, serif', fontSize: 24, fontWeight: 900, color: C.ink, marginBottom: 8, lineHeight: 1.2 }}>
              {result.talisman.base_name}
            </div>
          </div>

          <div style={{ transform: animIn ? 'scale(1)' : 'scale(0.8)', opacity: animIn ? 1 : 0, transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', marginBottom: 16 }}>
            <TalismanCard talisman={result.talisman} level={0} large />
          </div>

          {/* stat row */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[['시작 단계', '+0'], ['성공률', '90%'], ['등급', result.talisman.rarity === 'legendary' ? '전설' : result.talisman.rarity === 'rare' ? '희귀' : '일반']].map(([l, v]) => (
              <div key={l} style={{ flex: 1, background: 'white', borderRadius: 14, padding: '10px 8px', textAlign: 'center', border: `1.5px solid ${C.parchment}`, boxShadow: `0 2px 6px ${C.shadow}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.inkLight, letterSpacing: 0.5, marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: C.ink }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button onClick={() => nav(`/enhance/${result.id}`)} style={{ flex: 1, background: C.red, color: 'white', border: 'none', borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Noto Sans KR, sans-serif' }}>
              ⚡ 강화하기
            </button>
            <button onClick={() => nav('/home')} style={{ flex: 1, background: C.parchment, color: C.ink, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Noto Sans KR, sans-serif' }}>
              📦 보관하기
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Noto Serif KR, serif', fontSize: 22, fontWeight: 700, color: C.ink, marginBottom: 6, textAlign: 'center' }}>부적 뽑기</div>
        <div style={{ fontSize: 13, color: C.inkLight, marginBottom: 28, textAlign: 'center' }}>오늘의 운명을 뽑아보세요</div>

        {/* draw box */}
        <div style={{
          width: '100%', borderRadius: 20,
          background: `linear-gradient(160deg, ${C.parchment}, ${C.cream})`,
          border: `1.5px solid ${C.border}`, padding: '36px 20px',
          textAlign: 'center', marginBottom: 20,
          position: 'relative', overflow: 'hidden',
          boxShadow: `0 4px 20px ${C.shadow}`,
        }}>
          <div style={{ position: 'absolute', inset: 8, borderRadius: 14, border: `1px dashed ${C.border}60`, pointerEvents: 'none' }} />
          <div style={{ fontSize: 80, marginBottom: 16, filter: 'drop-shadow(0 4px 12px rgba(196,146,42,0.3))' }}>🧧</div>
          <div style={{ fontFamily: 'Noto Serif KR, serif', fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
            {canDraw ? '무료 부적 1장 남았어요!' : '오늘 무료 뽑기를 사용했어요'}
          </div>
          <div style={{ fontSize: 13, color: C.inkLight, lineHeight: 1.5 }}>
            직장인 · 일상/생활 · 연애/친목<br />중 랜덤으로 나와요
          </div>
        </div>

        {error && <div style={{ fontSize: 13, color: '#C0392B', marginBottom: 12, textAlign: 'center' }}>{error}</div>}

        <button onClick={handleDraw} disabled={loading || !canDraw}
          style={{
            width: '100%', background: (loading || !canDraw) ? C.parchment : C.red,
            color: (loading || !canDraw) ? C.inkLight : 'white',
            border: 'none', borderRadius: 14, padding: 16,
            fontSize: 16, fontWeight: 700, cursor: (loading || !canDraw) ? 'not-allowed' : 'pointer',
            fontFamily: 'Noto Sans KR, sans-serif', marginBottom: 8,
            transition: 'all 0.2s',
          }}>
          {loading ? '뽑는 중...' : canDraw ? '🧧 무료 뽑기' : '오늘 이미 뽑았어요'}
        </button>

        {!canDraw && (
          <div style={{ fontSize: 12, color: C.inkLight, textAlign: 'center', marginTop: 4 }}>
            내일 자정에 무료 뽑기가 충전돼요
          </div>
        )}
      </div>
    </Layout>
  );
}
