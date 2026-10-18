/*
 * Mochi, the cat of Happy Japanese: line drawings in a few moods.
 * Colours come from CSS (--cat-line, --cat-fill, --cat-ear, --accent), so
 * the cat follows the light and dark theme.
 */
import { raw } from './ui.js';

const LABELS = {
  sit: 'Katze Mochi sitzt und schaut dich an',
  happy: 'Katze Mochi freut sich',
  sleep: 'Katze Mochi schläft',
  think: 'Katze Mochi überlegt',
  wave: 'Katze Mochi winkt',
  peek: 'Katze Mochi schaut über den Rand',
};

const ears = (tilt = 0) => `
  <g transform="rotate(${tilt} 60 46)">
    <path class="cat-body" d="M41 40 L43 17 L58 30 Z"/><path class="cat-ear" d="M45 33 L46 23 L53 30 Z"/>
    <path class="cat-body" d="M79 40 L77 17 L62 30 Z"/><path class="cat-ear" d="M75 33 L74 23 L67 30 Z"/>
  </g>`;

const face = (eyes, tilt = 0) => `
  <g transform="rotate(${tilt} 60 46)">
    <ellipse class="cat-body" cx="60" cy="46" rx="22" ry="19"/>
    ${eyes}
    <path class="cat-nose" d="M57.5 51.5h5l-2.5 2.6z"/>
    <path class="cat-stroke thin" d="M60 54.2c-.6 2.4-3.4 3.2-5.4 1.8M60 54.2c.6 2.4 3.4 3.2 5.4 1.8"/>
    <path class="cat-stroke thin" d="M41 51l-10-1.5M41 55l-10 1.5M79 51l10-1.5M79 55l10 1.5"/>
  </g>`;

const EYES = {
  open: '<circle class="cat-eye" cx="51.5" cy="46" r="2.6"/><circle class="cat-eye" cx="68.5" cy="46" r="2.6"/>',
  happy: '<path class="cat-stroke" d="M48 47.5c1.6-3.2 5.4-3.2 7 0M65 47.5c1.6-3.2 5.4-3.2 7 0"/>',
  closed: '<path class="cat-stroke" d="M48 46c1.6 2.6 5.4 2.6 7 0M65 46c1.6 2.6 5.4 2.6 7 0"/>',
  wink: '<circle class="cat-eye" cx="51.5" cy="46" r="2.6"/><path class="cat-stroke" d="M65 47.5c1.6-3.2 5.4-3.2 7 0"/>',
};

const collar = '<path class="cat-collar" d="M45 62c9 5 21 5 30 0"/><circle class="cat-bell" cx="60" cy="66.5" r="3"/>';

function sitting({ eyes = 'open', tilt = 0, paw = false, extra = '' } = {}) {
  return `
    <path class="cat-stroke tail" d="M83 101c16-1 22-14 16-24-3-5-9-5-10 0"/>
    <path class="cat-body" d="M37 103c-3-22 6-40 23-42 17 2 26 20 23 42z"/>
    <path class="cat-stroke thin" d="M60 80v18"/>
    <ellipse class="cat-body" cx="51" cy="102" rx="7.5" ry="4.2"/>
    ${paw ? '' : '<ellipse class="cat-body" cx="69" cy="102" rx="7.5" ry="4.2"/>'}
    ${ears(tilt)}${face(EYES[eyes], tilt)}${collar}
    ${paw ? `<path class="cat-body" d="M76 84c6-6 9-16 12-26 1-3 6-3 7 0 1 4-2 14-7 24z"/>
      <path class="cat-stroke thin" d="M88.5 57.5v3M91.5 57.5v3"/>` : ''}
    ${extra}`;
}

const DRAWINGS = {
  sit: () => sitting(),
  happy: () => sitting({ eyes: 'happy', paw: true, extra: '<path class="cat-spark" d="M18 30l3-7 3 7-7-3 7 0zM98 22l2-5 2 5-5-2 5 0z"/>' }),
  wave: () => sitting({ eyes: 'wink', paw: true }),
  think: () => sitting({ tilt: -10, extra: '<text class="cat-mark" x="88" y="26">?</text>' }),
  sleep: () => `
    <path class="cat-body" d="M22 100c0-17 18-28 40-28s38 9 38 24c0 5-3 8-8 8H30c-5 0-8-1-8-4z"/>
    <path class="cat-stroke tail" d="M96 100c-6 6-30 7-52 4"/>
    <g transform="translate(-14 40) scale(.8)">${ears(0)}${face(EYES.closed)}</g>
    <text class="cat-mark small" x="72" y="62">z</text><text class="cat-mark" x="84" y="48">Z</text>`,
  peek: () => `
    <g transform="translate(0 18)">${ears(0)}${face(EYES.open)}</g>
    <path class="cat-ledge" d="M4 86h112"/>
    <ellipse class="cat-body" cx="45" cy="84" rx="8" ry="5"/><ellipse class="cat-body" cx="75" cy="84" rx="8" ry="5"/>
    <path class="cat-stroke thin" d="M42 82v3M46 82v3M72 82v3M76 82v3"/>`,
};

export function cat(mood = 'sit', { size = 120, cls = '' } = {}) {
  const peek = mood === 'peek';
  return raw(`<svg class="cat ${cls}" width="${size}" height="${peek ? size * 0.78 : size}" viewBox="0 0 120 ${peek ? 94 : 120}" role="img" aria-label="${LABELS[mood] ?? LABELS.sit}">${(DRAWINGS[mood] ?? DRAWINGS.sit)()}</svg>`);
}
