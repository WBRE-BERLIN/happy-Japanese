/* Small UI toolkit: escaped HTML templates, furigana, icons, toasts, dialogs, speech. */
import { furiHtml } from './furi.js';

export class Html {
  constructor(text) { this.text = text; }
  toString() { return this.text; }
}

export const raw = (text) => new Html(String(text));
export const esc = (value) => String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function toHtml(value) {
  if (value instanceof Html) return value.text;
  if (Array.isArray(value)) return value.map(toHtml).join('');
  if (value === null || value === undefined || value === false || value === true) return '';
  return esc(value);
}

/** Tagged template: interpolated values are escaped unless they are Html. */
export function html(strings, ...values) {
  let out = strings[0];
  values.forEach((value, i) => { out += toHtml(value) + strings[i + 1]; });
  return raw(out);
}

export const prefs = { furigana: true };

/** Japanese text in furigana notation as HTML (<ruby> when furigana are on). */
export const jp = (text, { ruby = prefs.furigana } = {}) => raw(`<span class="jp" lang="ja">${furiHtml(text, { ruby })}</span>`);

const ICONS = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M2.5 12h3M18.5 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  next: '<path d="m9 18 6-6-6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  play: '<path d="M7 4.5v15l12-7.5z"/>',
  sound: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  flame: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.4-5.2 3.6-8.3.4 1.9 1.4 3 2.6 3.6C12 6.6 13.6 4.4 15.6 3c-.3 2.8.6 4.7 1.9 6.6 1 1.4 1.5 3 1.5 5.2C19 18.4 15.9 21 12 21z"/>',
  paw: '<ellipse cx="12" cy="16" rx="4.5" ry="3.8"/><circle cx="6.5" cy="10.5" r="1.9"/><circle cx="10" cy="7" r="1.9"/><circle cx="14" cy="7" r="1.9"/><circle cx="17.5" cy="10.5" r="1.9"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.6L20 8.5"/><path d="M20 3.5v5h-5"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  cards: '<rect x="6" y="3.5" width="13" height="17" rx="2.5"/><path d="M3.5 7.5v10.5A2.5 2.5 0 0 0 6 20.5"/>',
  pen: '<path d="M4 20l1-4.5L16 4.5a2.1 2.1 0 0 1 3 3L8 18.5z"/><path d="m14 6.5 3 3"/>',
  kana: '<path d="M5 7h9M9.5 4v6c0 4-2 7-5 9"/><path d="M14.5 11c3 0 4.5 2 4.5 4s-1.5 4-5 4"/>',
  kanji: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M12 7v10M8.5 14h7"/>',
  sign: '<rect x="3.5" y="5" width="17" height="10" rx="2"/><path d="M12 15v5M8.5 20h7"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  verb: '<path d="M4 12h12"/><path d="m12 6 6 6-6 6"/>',
  wave: '<path d="M3 14c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3 2.5 3 3 3"/><path d="M3 19c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3 2.5 3 3 3"/>',
  blocks: '<rect x="3.5" y="13" width="7" height="7" rx="1.5"/><rect x="13.5" y="13" width="7" height="7" rx="1.5"/><rect x="8.5" y="4" width="7" height="7" rx="1.5"/>',
  quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.6v.6"/><path d="M12 17.2h.01"/>',
  hash: '<path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/>',
  yen: '<path d="M6 4l6 8 6-8M12 12v8M7.5 13h9M7.5 16.5h9"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  hourglass: '<path d="M6.5 3.5h11M6.5 20.5h11M7.5 3.5c0 5 9 6 9 8.5s-9 3.5-9 8.5M16.5 3.5c0 5-9 6-9 8.5s9 3.5 9 8.5"/>',
  abacus: '<path d="M4 4v16M20 4v16M4 8h16M4 16h16"/><circle cx="8" cy="8" r="1.6"/><circle cx="12" cy="8" r="1.6"/><circle cx="15" cy="16" r="1.6"/><circle cx="10" cy="16" r="1.6"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  family: '<circle cx="8" cy="7" r="2.6"/><circle cx="16" cy="7" r="2.6"/><path d="M3.5 19.5c0-3 2-5 4.5-5s4.5 2 4.5 5M11.5 19.5c0-3 2-5 4.5-5s4.5 2 4.5 5"/>',
  train: '<rect x="5" y="3.5" width="14" height="13" rx="3"/><path d="M5 10h14M8.5 20.5 10 16.5M15.5 20.5 14 16.5"/><circle cx="9" cy="13.3" r=".8"/><circle cx="15" cy="13.3" r=".8"/>',
  question: '<path d="M8 8.5a4 4 0 1 1 5.6 3.7c-1 .4-1.6 1.3-1.6 2.4v.4"/><path d="M12 19h.01"/>',
  swap: '<path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/>',
  shuffle: '<path d="M3 7h3.5c5 0 6 10 11 10H21M3 17h3.5c2 0 3.2-1.6 4.3-3.6M13.2 9.6C14.3 8 15.5 7 17.5 7H21"/><path d="m18.5 4 2.5 3-2.5 3M18.5 14l2.5 3-2.5 3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/>',
  logout: '<path d="M9.5 20.5H5a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 5 3.5h4.5"/><path d="M16 16.5 20.5 12 16 7.5M20.5 12H9"/>',
  download: '<path d="M12 3.5v12M7 10.5l5 5 5-5M4.5 20.5h15"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  cloud: '<path d="M7 18.5a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.5 1.6A3.8 3.8 0 0 1 17.5 18.5z"/>',
};

export const icon = (name, cls = '') => raw(`<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] ?? ICONS.sparkle}</svg>`);

/* ---------- toasts and dialogs ---------- */

export function toast(message, { kind = 'info', timeout = 3200 } = {}) {
  const host = document.getElementById('toasts');
  if (!host) return;
  const el = document.createElement('div');
  el.className = `toast toast-${kind}`;
  el.textContent = message;
  host.append(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, timeout);
}

/** A modal sheet. Returns the element; content is HTML. */
export function sheet(content, { onClose } = {}) {
  closeSheet();
  const backdrop = document.createElement('div');
  backdrop.className = 'sheet-backdrop';
  backdrop.innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><div class="sheet-grip"></div>${content}</div>`;
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop || event.target.closest('[data-close-sheet]')) {
      closeSheet();
      onClose?.();
    }
  });
  document.body.append(backdrop);
  requestAnimationFrame(() => backdrop.classList.add('open'));
  return backdrop.querySelector('.sheet');
}

export function closeSheet() {
  document.querySelectorAll('.sheet-backdrop').forEach((el) => el.remove());
}

export function confirmSheet({ title, text, ok = 'OK', cancel = 'Abbrechen', danger = false }) {
  return new Promise((resolve) => {
    const el = sheet(html`
      <h2 class="sheet-title">${title}</h2>
      ${text ? html`<p class="muted">${text}</p>` : ''}
      <div class="sheet-actions">
        <button class="btn btn-ghost" data-answer="no">${cancel}</button>
        <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-answer="yes">${ok}</button>
      </div>`.text, { onClose: () => resolve(false) });
    el.addEventListener('click', (event) => {
      const button = event.target.closest('[data-answer]');
      if (!button) return;
      closeSheet();
      resolve(button.dataset.answer === 'yes');
    });
  });
}

/* ---------- speech (iOS has Japanese voices built in, they also work offline) ---------- */

const hasWindow = typeof window !== 'undefined';
let voice = null;
function findVoice() {
  if (!hasWindow || !('speechSynthesis' in window)) return null;
  const voices = speechSynthesis.getVoices();
  voice = voices.find((v) => v.lang === 'ja-JP' && /Kyoko|O-ren|Otoya|Hattori/i.test(v.name))
    ?? voices.find((v) => v.lang?.replace('_', '-').startsWith('ja')) ?? null;
  return voice;
}
if (hasWindow && 'speechSynthesis' in window) {
  speechSynthesis.addEventListener?.('voiceschanged', findVoice);
  findVoice();
}

export const canSpeak = () => hasWindow && 'speechSynthesis' in window;

export function speak(text, { rate = 0.9 } = {}) {
  if (!canSpeak() || !text) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = rate;
  if (voice ?? findVoice()) utterance.voice = voice;
  speechSynthesis.speak(utterance);
}

/* ---------- misc ---------- */

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export function formatDuration(ms) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} s`;
  return `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')} s`;
}

export const haptic = (pattern = 12) => (typeof navigator !== 'undefined' ? navigator.vibrate?.(pattern) : undefined);
