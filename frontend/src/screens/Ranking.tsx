import React from 'react';
import { C } from '../lib/theme';
import Layout from '../components/Layout';

export default function Ranking() {
  return (
    <Layout>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Noto Serif KR, serif', fontSize: 22, fontWeight: 700, color: C.ink, marginBottom: 8 }}>랭킹</div>
        <div style={{ fontSize: 13, color: C.inkLight, marginBottom: 40 }}>곧 오픈 예정이에요!</div>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🏆</div>
        <div style={{ fontSize: 14, color: C.inkLight, lineHeight: 1.6 }}>
          강화 고수들의 순위를<br />여기서 볼 수 있어요
        </div>
      </div>
    </Layout>
  );
}
