/* The JSON API (api.php?r=<route>). Writes carry the X-Happy header against cross-site requests. */

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const isOffline = (err) => !(err instanceof ApiError);

export async function api(route, { method = 'GET', body, params = {}, timeout = 15000 } = {}) {
  const url = new URL('api.php', location.href);
  url.searchParams.set('r', route);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const request = { method, credentials: 'same-origin', headers: {}, signal: controller.signal, cache: 'no-store' };
  if (method !== 'GET') request.headers['X-Happy'] = '1';
  if (body !== undefined) {
    request.headers['Content-Type'] = 'application/json';
    request.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(url, request);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new ApiError(data.error || `Der Server antwortet mit ${response.status}.`, response.status);
    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new Error('Keine Verbindung zum Server.');
  } finally {
    clearTimeout(timer);
  }
}

export const post = (route, body) => api(route, { method: 'POST', body: body ?? {} });

export const errorText = (err) => err?.message || 'Etwas ist schiefgelaufen.';
