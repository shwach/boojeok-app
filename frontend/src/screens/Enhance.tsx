import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEnhanceInfo, enhance } from '../lib/api';
import { C, CATEGORY_LABEL } from '../lib/theme';
import Layout from '../components/Layout';

const SUCCESS_RATES: Record<number, number> = { 0:.9, 1:.75, 2:.6, 3:.45, 4:.3, 5:.2, 6:.12, 7:.07, 8:.03 };
const DESTROY_RATES: Record<number, number> = { 7:.35, 8:.5 };

type Result = { success: boolean; destroyed: boolean; newLevel: number; fromLevel: number; ashPieces: number; talisman: any };

export default function Enhance() {
  const { id } = useParams<{ id: string }>();
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [shake, setShake] = useState(false);
  const nav = useNavigate();

  useEffect(() => { if (id) getEnhanceInfo(id).then(setInfo); }, [id]);

  async function handleEnhance(useSafeTicket = false) {
    if (!id) return;
    setLoading(true);
    try {
      const r = await enhance(id, useSafeTicket);
      setResult(r);
      if (!r.success) { setShake(true); setTimeout(() => setShake(false), 600); }
    } finally {
      setLoading(false);
    }
  }

  if (!info) return (
    <Layout><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, color: C.inkLight }}>불러오는 중...</div></Layout>
  );

  const { userTalisman: ut } = info;
  const level = ut.level;
  const successPct = Math.round((SUCCESS_RATES[level] ?? 0) * 100);
  const destroyPct = Math.round((DESTROY_RATES[level] ?? 0) * 100);
  const cat = C[ut.category as keyof typeof C] as any;

  // ring
  const r = 48, cx = 58, cy = 58;
  const circ = 2 * Math.PI * r;
  const filled = (level / 9) * circ;

  return (
    <Layout>
      <div style={{ padding: '16px 20px 24px' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <button onClick={() => nav(-1)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: C.inkLight }}>←</button>
          <div style={{ fontFamily: 'Noto Serif KR, serif', fontSize: 20, fontWeight: 700, color: C.ink }}>강화하기</div>
        </div>

        {/* talisman + ring */}
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.inkLight, marginBottom: 10 }}>{ut.base_name}</div>
          <div style={{ position: 'relative', width: 116, height: 116, margin: '0 auto 10px' }}>
            <svg width="116" height="116" viewBox="0 0 116 116">
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.parchment} strokeWidth={10} />
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.red} strokeWidth={10}
                strokeDasharray={circ} strokeDashoffset={circ - filled}
                strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: C.red, lineHeight: 1, letterSpacing: -1 }}>+{level}</div>
              <div style={{ fontSize: 10, color: C.inkLight, fontWeight: 500, marginTop: 2 }}>현재 단계</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>{ut.emoji}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.rare }}>→ +{level + 1} 도전</span>
          </div>
        </div>

        {/* probability card */}
        <div style={{ background: 'white', borderRadius: 16, padding: 16, border: `1.5px solid ${C.parchment}`, marginBottom: 10, boxShadow: `0 2px 8px ${C.shadow}` }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
              <span style={{ color: C.inkLight }}>성공 확률</span>
              <span style={{ fontWeight: 700, color: C.red }}>{successPct}%</span>
            </div>
            <div style={{ height: 8, background: C.parchment, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${successPct}%`, height: '100%', background: `linear-gradient(to right, ${C.red}, #E5502A)`, borderRadius: 4 }} />
            </div>
          </div>
          {destroyPct > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: C.inkLight }}>실패 시 파괴 확률</span>
                <span style={{ fontWeight: 700, color: '#C0392B' }}>{destroyPct}%</span>
              </div>
              <div style={{ height: 8, background: C.parchment, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${destroyPct}%`, height: '100%', background: 'linear-gradient(to right, #8B1A1A, #C0392B)', borderRadius: 4 }} />
              </div>
            </div>
          )}
          {level >= 4 && level < 7 && (
            <div style={{ fontSize: 11, color: C.inkLight, marginTop: 8 }}>실패 시 1단계 하락</div>
          )}
        </div>

        {/* cost */}
        <div style={{ background: 'white', borderRadius: 16, padding: '12px 14px', border: `1.5px solid ${C.parchment}`, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: `0 2px 6px ${C.shadow}` }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.inkLight, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 }}>강화 비용</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>🔮 강화석 × {(level + 1) * 20}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.inkLight, letterSpacing: 0.5, marginBottom: 2 }}>보유량</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: C.ink }}>280개</div>
          </div>
        </div>

        <button onClick={() => handleEnhance(false)} disabled={loading}
          style={{ display: 'block', width: '100%', background: C.red, color: 'white', border: 'none', borderRadius: 14, padding: 16, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'Noto Sans KR, sans-serif', marginBottom: 8, opacity: loading ? 0.7 : 1, animation: shake ? 'shake 0.4s' : undefined }}>
          {loading ? '강화 중...' : '⚡ 강화하기'}
        </button>
        <button onClick={() => handleEnhance(true)} disabled={loading}
          style={{ display: 'block', width: '100%', background: C.parchment, color: C.ink, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Noto Sans KR, sans-serif', marginBottom: 8 }}>
          🛡 안전강화권 사용
        </button>
        <div style={{ textAlign: 'center', fontSize: 11, color: C.inkLight, lineHeight: 1.5 }}>안전강화권: 실패 시 파괴 면제, 1단계 하락</div>
      </div>

      {/* Result Modal */}
      {result && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', borderRadius: 40, zIndex: 10 }}>
          <div style={{ width: '100%', background: C.cream, borderRadius: '22px 22px 0 0', padding: '14px 20px 32px' }}>
            <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: '0 auto 18px' }} />

            {result.success ? (
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 60, marginBottom: 8 }}>⚡</div>
                <div style={{ fontFamily: 'Noto Serif KR, serif', fontSize: 22, fontWeight: 700, color: C.success, marginBottom: 4 }}>강화 성공!</div>
                <div style={{ fontSize: 44, fontWeight: 900, color: C.red, fontFamily: 'Noto Serif KR, serif', lineHeight: 1, marginBottom: 8 }}>+{result.newLevel}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 8 }}>{result.talisman.base_name}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ background: (C[result.talisman.category as keyof typeof C] as any)?.chip, color: (C[result.talisman.category as keyof typeof C] as any)?.accent, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                    {CATEGORY_LABEL[result.talisman.category]}
                  </span>
                  <span style={{ background: '#D0F0DC', color: C.success, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                    ↑ +{result.newLevel} 달성
                  </span>
                </div>
                {result.newLevel >= 7 && <div style={{ fontSize: 12, color: C.inkLight, fontStyle: 'italic' }}>"상위 강화자 달성!"</div>}
              </div>
            ) : result.destroyed ? (
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 60, marginBottom: 8 }}>💥</div>
                <div style={{ fontFamily: 'Noto Serif KR, serif', fontSize: 20, fontWeight: 700, color: C.destroyed ?? C.red, marginBottom: 4 }}>부적이 파괴되었습니다</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 4 }}>+{result.fromLevel} {result.talisman.base_name}</div>
                <div style={{ fontSize: 12, color: C.inkLight, marginBottom: 12, lineHeight: 1.5 }}>+{result.fromLevel + 1} 도전에서 터졌어요 😭</div>
                <div style={{ background: `linear-gradient(135deg, #2C1810, #4A2918)`, borderRadius: 12, padding: '12px 14px', color: 'white', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 24 }}>🌑</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>파괴 보상</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>재의 조각 × {result.ashPieces}개 획득</div>
                  </div>
                </div>
                <div style={{ background: C.parchment, borderRadius: 10, padding: '8px 12px', fontSize: 11, color: C.inkLight }}>
                  💡 조각 20개 = 랜덤 부적 재뽑기
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 60, marginBottom: 8 }}>😓</div>
                <div style={{ fontFamily: 'Noto Serif KR, serif', fontSize: 20, fontWeight: 700, color: C.inkLight, marginBottom: 4 }}>강화 실패</div>
                <div style={{ fontSize: 13, color: C.inkLight, marginBottom: 12, lineHeight: 1.5 }}>
                  {result.newLevel < result.fromLevel ? `+${result.fromLevel} → +${result.newLevel} 하락` : `+${result.fromLevel} 유지`}
                </div>
              </div>
            )}

            <button onClick={() => { setResult(null); if (result.destroyed) nav('/home'); else if (id) getEnhanceInfo(id).then(setInfo); }}
              style={{ display: 'block', width: '100%', background: C.red, color: 'white', border: 'none', borderRadius: 14, padding: 15, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Noto Sans KR, sans-serif', marginBottom: result.success ? 8 : 0 }}>
              {result.destroyed ? '🧧 다시 뽑으러 가기' : result.success ? '⚡ 한 번 더 강화!' : '다시 도전'}
            </button>
            {result.success && (
              <button onClick={() => nav('/home')} style={{ display: 'block', width: '100%', background: C.parchment, color: C.ink, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Noto Sans KR, sans-serif' }}>
                홈으로 돌아가기
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }`}</style>
    </Layout>
  );
}
