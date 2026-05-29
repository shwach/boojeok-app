import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { C } from '../lib/theme';

const NAV = [
  { path: '/home',    icon: '🏠', label: '홈' },
  { path: '/draw',    icon: '🧧', label: '뽑기' },
  { path: '/ranking', icon: '🏆', label: '랭킹' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const nav = useNavigate();
  const loc = useLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {children}
      </div>
      <nav style={{
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '10px 0 18px',
        borderTop: `1px solid ${C.parchment}`,
        background: 'rgba(245,237,214,0.97)',
        flexShrink: 0,
      }}>
        {NAV.map(n => {
          const active = loc.pathname.startsWith(n.path);
          return (
            <button key={n.path} onClick={() => nav(n.path)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: active ? C.red : C.inkLight, fontWeight: active ? 700 : 500, fontSize: 10, fontFamily: 'Noto Sans KR, sans-serif' }}>
              <span style={{ fontSize: 22 }}>{n.icon}</span>
              {n.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
