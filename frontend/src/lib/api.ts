const BASE = 'http://localhost:3461/api';

function headers() {
  const userId = localStorage.getItem('userId') ?? '';
  return { 'Content-Type': 'application/json', 'x-user-id': userId };
}

export async function guestLogin(nickname: string) {
  const r = await fetch(`${BASE}/auth/guest`, {
    method: 'POST', headers: headers(),
    body: JSON.stringify({ nickname }),
  });
  if (!r.ok) throw new Error((await r.json()).error);
  return r.json();
}

export async function getDrawStatus() {
  const r = await fetch(`${BASE}/draw/status`, { headers: headers() });
  return r.json();
}

export async function draw() {
  const r = await fetch(`${BASE}/draw`, { method: 'POST', headers: headers() });
  if (!r.ok) throw new Error((await r.json()).error);
  return r.json();
}

export async function getInventory() {
  const r = await fetch(`${BASE}/inventory`, { headers: headers() });
  return r.json();
}

export async function getEnhanceInfo(id: string) {
  const r = await fetch(`${BASE}/enhance/${id}/info`, { headers: headers() });
  return r.json();
}

export async function enhance(id: string, useSafeTicket = false) {
  const r = await fetch(`${BASE}/enhance/${id}`, {
    method: 'POST', headers: headers(),
    body: JSON.stringify({ useSafeTicket }),
  });
  if (!r.ok) throw new Error((await r.json()).error);
  return r.json();
}
