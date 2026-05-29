import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { guestLogin } from '../lib/api';
import { C } from '../lib/theme';

export default function Onboarding() {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  async function handleSubmit() {
    if (!nickname.trim()) { setError('닉네임을 입력해주세요'); return; }
    setLoading(true); setError('');
    try {
      const { user } = await guestLogin(nickname.trim());
      localStorage.setItem('userId', user.id);
      localStorage.setItem('nickname', user.nickname);
      nav('/home');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '20px 24px 32px', flex: 1 }}>
      {/* hero visual */}
      <div style={{
        margin: '8px 0 18px', borderRadius: 18,
        background: `linear-gradient(160deg, ${C.parchment}, ${C.cream})`,
        border: `1.5px solid ${C.border}`,
        padding: '28px 20px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 7, borderRadius: 13, border: `1px dashed ${C.border}80`, pointerEvents: 'none' }} />
        <div style={{ fontSize: 56, marginBottom: 12 }}>🧧</div>
        <div style={{ fontFamily: 'Noto Serif KR, serif', fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 6, lineHeight: 1.35 }}>
          오늘의 스트레스,<br />부적 한 장으로 해결
        </div>
        <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.6 }}>
          상황별 밈 부적을 뽑고<br />강화해서 친구에게 자랑하세요
        </div>
      </div>

      {/* dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: 22 }}>
        {[true, false, false].map((on, i) => (
          <div key={i} style={{ width: on ? 22 : 8, height: 8, borderRadius: on ? 4 : 50, background: on ? C.red : C.border, transition: 'width .2s' }} />
        ))}
      </div>

      <div style={{ fontFamily: 'Noto Serif KR, serif', fontSize: 22, fontWeight: 700, color: C.ink, lineHeight: 1.25, marginBottom: 6 }}>
        부적발급소에<br />오신 것을 환영합니다
      </div>
      <div style={{ fontSize: 13, color: C.inkLight, marginBottom: 18 }}>닉네임을 정해주세요</div>

      <input
        value={nickname} onChange={e => setNickname(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder="예: 직장인무당, 월급루팡"
        maxLength={12}
        style={{
          width: '100%', background: 'white', border: `1.5px solid ${error ? '#C0392B' : C.border}`,
          borderRadius: 14, padding: '13px 16px', fontSize: 15,
          fontFamily: 'Noto Sans KR, sans-serif', color: C.ink,
          marginBottom: error ? 6 : 12, outline: 'none',
        }}
      />
      {error && <div style={{ fontSize: 12, color: '#C0392B', marginBottom: 10 }}>{error}</div>}

      {/* terms */}
      <div style={{ marginBottom: 20 }}>
        {[
          { label: '[필수] 오락용 콘텐츠 고지 동의', checked: true },
          { label: '[필수] 이용약관 및 개인정보처리', checked: true },
          { label: '[선택] 마케팅 수신 동의', checked: false },
        ].map(t => (
          <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: `1px solid ${C.parchment}`, fontSize: 12, color: t.checked ? C.ink : C.inkLight }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${t.checked ? C.red : C.border}`, background: t.checked ? C.red : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, flexShrink: 0 }}>
              {t.checked && '✓'}
            </div>
            {t.label}
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={loading} style={{
        display: 'block', width: '100%', background: C.red, color: '#FFF8F0',
        border: 'none', borderRadius: 14, padding: 16,
        fontSize: 16, fontWeight: 700, fontFamily: 'Noto Sans KR, sans-serif',
        cursor: 'pointer', opacity: loading ? 0.7 : 1,
      }}>
        {loading ? '잠시만요...' : '부적 받으러 가기 🔥'}
      </button>
    </div>
  );
}
