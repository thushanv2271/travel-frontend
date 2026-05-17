export const API = 'http://localhost:5000';

function authHeaders() {
  const token = localStorage.getItem('admin_token');
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export async function apiGet(path) {
  const res = await fetch(`${API}${path}`, { headers: authHeaders() });
  if (res.status === 401) { logout(); return null; }
  return res.ok ? res.json() : null;
}

export async function apiPost(path, body) {
  const res = await fetch(`${API}${path}`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
  return { ok: res.ok, data: await res.json().catch(() => null), status: res.status };
}

export async function apiPut(path, body) {
  const res = await fetch(`${API}${path}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) });
  return { ok: res.ok, data: await res.json().catch(() => null) };
}

export async function apiPatch(path, body) {
  const res = await fetch(`${API}${path}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(body) });
  return { ok: res.ok, data: await res.json().catch(() => null) };
}

export async function apiDelete(path) {
  const res = await fetch(`${API}${path}`, { method: 'DELETE', headers: authHeaders() });
  return res.ok;
}

export function logout() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  location.reload();
}
