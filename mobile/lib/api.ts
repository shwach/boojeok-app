import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE = 'https://boojeok-app.onrender.com/api';

async function headers() {
  const userId = (await AsyncStorage.getItem('userId')) ?? '';
  return { 'Content-Type': 'application/json', 'x-user-id': userId };
}

// 앱 첫 실행 시 자동 익명 가입
export async function autoLogin(deviceId: string) {
  const r = await fetch(`${BASE}/auth/auto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId }),
  });
  if (!r.ok) throw new Error((await r.json()).error);
  return r.json();
}

// 닉네임 변경
export async function updateNickname(nickname: string) {
  const r = await fetch(`${BASE}/auth/nickname`, {
    method: 'PATCH',
    headers: await headers(),
    body: JSON.stringify({ nickname }),
  });
  if (!r.ok) throw new Error((await r.json()).error);
  return r.json();
}

export async function guestLogin(nickname: string) {
  const r = await fetch(`${BASE}/auth/guest`, {
    method: 'POST',
    headers: await headers(),
    body: JSON.stringify({ nickname }),
  });
  if (!r.ok) throw new Error((await r.json()).error);
  return r.json();
}

export async function getDrawStatus() {
  const r = await fetch(`${BASE}/draw/status`, { headers: await headers() });
  return r.json();
}

export async function draw(category?: string) {
  const r = await fetch(`${BASE}/draw`, {
    method: 'POST',
    headers: await headers(),
    body: JSON.stringify({ category }),
  });
  if (!r.ok) throw new Error((await r.json()).error);
  return r.json();
}

export async function getInventory() {
  const r = await fetch(`${BASE}/inventory`, { headers: await headers() });
  return r.json();
}

export async function getEnhanceInfo(id: string) {
  const r = await fetch(`${BASE}/enhance/${id}/info`, { headers: await headers() });
  return r.json();
}

export async function enhance(id: string, useSafeTicket = false) {
  const r = await fetch(`${BASE}/enhance/${id}`, {
    method: 'POST',
    headers: await headers(),
    body: JSON.stringify({ useSafeTicket }),
  });
  if (!r.ok) throw new Error((await r.json()).error);
  return r.json();
}
