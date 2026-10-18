/* Settings: learning, display, reminders (push), account. */
import { api, post, errorText } from '../lib/api.js';
import { cat } from '../lib/cat.js';
import { closeSheet, confirmSheet, html, icon, sheet, toast } from '../lib/ui.js';
import { AREAS, GROUPS } from '../areas/index.js';

const DAYS = [['1', 'Mo'], ['2', 'Di'], ['3', 'Mi'], ['4', 'Do'], ['5', 'Fr'], ['6', 'Sa'], ['0', 'So']];

const switchRow = (key, title, text, on) => html`<label class="switch-row"><span><strong>${title}</strong>${text ? html`<span class="muted small">${text}</span>` : ''}</span>
  <input type="checkbox" role="switch" data-setting="${key}" ${on ? 'checked' : ''}></label>`;

const segment = (key, choices, value) => html`<div class="segmented">${Object.entries(choices).map(([k, label]) => html`<button type="button" class="${String(value) === k ? 'on' : ''}" data-seg="${key}" data-value="${k}">${label}</button>`)}</div>`;

function base64UrlToBytes(text) {
  const padded = `${text}${'='.repeat((4 - (text.length % 4)) % 4)}`.replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

const pushSupported = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
const standalone = () => navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;

export function renderSettings(app, main) {
  const s = app.settings;
  let reminders = null;
  let reminderError = '';

  const draw = () => {
    const mix = new Set(s.mix);
    main.innerHTML = html`
      <header class="page-head"><h1>Einstellungen</h1></header>

      <section class="card form">
        <h2>Lernen</h2>
        <label class="option"><span class="option-label">Ich bin bei Lektion</span>
          <select data-select="lesson">${Array.from({ length: 25 }, (_, i) => html`<option value="${i + 1}" ${s.lesson === i + 1 ? 'selected' : ''}>Lektion ${i + 1}</option>`)}</select></label>
        <div class="option"><span class="option-label">Aufgaben pro Übung</span>${segment('size', { 10: '10', 20: '20', 30: '30', 50: '50' }, s.size)}</div>
        <div class="option"><span class="option-label">Neue Aufgaben pro Tag</span>${segment('newPerDay', { 5: '5', 10: '10', 15: '15', 25: '25', 40: '40' }, s.newPerDay)}</div>
        <div class="option"><span class="option-label">Tagesziel</span>${segment('goal', { 10: '10', 20: '20', 30: '30', 50: '50', 80: '80' }, s.goal)}</div>
      </section>

      <section class="card">
        <h2>Bereiche im Tagesmix</h2>
        <p class="muted small">Aus diesen Bereichen stellt der Tagesmix deine Übungen zusammen.</p>
        ${GROUPS.map((g) => html`<h3>${g.title}</h3><div class="check-grid">${AREAS.filter((a) => a.group === g.id).map((a) => html`
          <label class="check"><input type="checkbox" data-mix="${a.id}" ${mix.has(a.id) ? 'checked' : ''}><span>${a.title}</span></label>`)}</div>`)}
      </section>

      <section class="card form">
        <h2>Anzeige</h2>
        <div class="option"><span class="option-label">Design</span>${segment('theme', { auto: 'Automatisch', light: 'Hell', dark: 'Dunkel' }, s.theme)}</div>
        <div class="option"><span class="option-label">Schriftgröße</span>${segment('fontSize', { m: 'Normal', l: 'Groß', xl: 'Sehr groß' }, s.fontSize ?? 'm')}</div>
        ${switchRow('furigana', 'Furigana anzeigen', 'Hiragana über den Kanji. In den Kanji- und Schilder-Übungen bleiben sie aus.', s.furigana !== false)}
        ${switchRow('romaji', 'Romaji in Kana umwandeln', 'Beim Eintippen wird „taberu“ automatisch zu たべる.', s.romaji !== false)}
        ${switchRow('autoSpeak', 'Automatisch vorlesen', 'Japanisch wird mit der iPhone-Stimme vorgelesen.', s.autoSpeak === true)}
        ${switchRow('autoNext', 'Nach richtiger Antwort weiter', 'Ohne Erklärung geht es nach einer richtigen Antwort von selbst weiter.', s.autoNext !== false)}
      </section>

      <section class="card form reminders">
        <h2>${icon('bell')} Erinnerungen</h2>
        ${reminderSection()}
      </section>

      <section class="card form">
        <h2>Konto</h2>
        <p>Angemeldet als <strong>${app.user.display_name || app.user.username}</strong> <span class="muted">(${app.user.username})</span></p>
        <p class="muted small">${app.store.persistent ? 'Dein Fortschritt liegt auf diesem Gerät und auf dem Server.' : 'Dieser Browser speichert offline nichts.'}
          ${app.store.pendingCount() ? ` ${app.store.pendingCount()} Änderungen warten auf die Synchronisierung.` : ''}</p>
        <div class="button-row">
          <button class="btn btn-ghost" data-act="sync">${icon('refresh')} Jetzt synchronisieren</button>
          <button class="btn btn-ghost" data-act="password">Passwort ändern</button>
          <a class="btn btn-ghost" href="api.php?r=export" download>${icon('download')} Daten exportieren</a>
          <button class="btn btn-ghost" data-act="logout">${icon('logout')} Abmelden</button>
        </div>
        <button class="link danger small" data-act="delete">Konto löschen</button>
      </section>

      <section class="about">
        ${cat('sleep', { size: 90 })}
        <p class="muted small">Happy Japanese · Begleiter zu Minna no Nihongo I<br>Läuft offline · Furigana immer dabei · にゃん</p>
      </section>`.text;
  };

  function reminderSection() {
    if (!pushSupported()) {
      return html`<p class="muted">Dieser Browser unterstützt keine Mitteilungen.${/iPhone|iPad/.test(navigator.userAgent) ? ' Auf dem iPhone geht das ab iOS 16.4, wenn Happy Japanese über „Zum Home-Bildschirm“ installiert ist.' : ''}</p>`;
    }
    if (!standalone() && /iPhone|iPad/.test(navigator.userAgent)) {
      return html`<p class="muted">Auf dem iPhone gibt es Mitteilungen nur für installierte Web-Apps: In Safari auf <strong>Teilen → Zum Home-Bildschirm</strong> tippen und Happy Japanese von dort öffnen.</p>`;
    }
    if (!reminders) return html`<p class="muted small">${reminderError || 'Lade …'}</p>`;
    const days = new Set(reminders.days.split(''));
    const permission = Notification.permission;
    return html`
      <p class="muted small">Mochi erinnert dich zur gewählten Zeit ans Üben – mit der Zahl der fälligen Aufgaben.</p>
      ${switchRow('rem-enabled', 'Erinnerungen an', permission === 'denied' ? 'Mitteilungen sind für Happy Japanese blockiert: iPhone-Einstellungen → Mitteilungen.' : reminders.devices ? `${reminders.devices} Gerät${reminders.devices > 1 ? 'e' : ''} angemeldet` : 'Dieses Gerät ist noch nicht angemeldet.', reminders.enabled && reminders.devices > 0)}
      <label class="option"><span class="option-label">Uhrzeit</span><input type="time" data-rem="time" value="${reminders.time}" step="900"></label>
      <div class="option"><span class="option-label">Tage</span><div class="day-picks">${DAYS.map(([d, label]) => html`<label class="day-pick"><input type="checkbox" data-rem-day="${d}" ${days.has(d) ? 'checked' : ''}><span>${label}</span></label>`)}</div></div>
      ${switchRow('rem-idle', 'Nur wenn ich noch nicht geübt habe', 'Hast du an dem Tag schon geübt, bleibt Mochi still.', reminders.only_idle)}
      <div class="button-row"><button class="btn btn-ghost small" data-act="push-test" ${reminders.devices ? '' : 'disabled'}>Test-Mitteilung senden</button></div>`;
  }

  async function loadReminders() {
    if (!pushSupported()) return;
    try {
      reminders = await api('reminders');
    } catch (err) {
      reminderError = `Erinnerungen brauchen eine Verbindung zum Server. (${errorText(err)})`;
    }
    draw();
  }

  async function saveReminders(patch) {
    reminders = { ...reminders, ...patch, tz: Intl.DateTimeFormat().resolvedOptions().timeZone };
    try {
      reminders = await post('reminders', reminders);
    } catch (err) {
      toast(errorText(err), { kind: 'error' });
    }
    draw();
  }

  async function enablePush() {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      toast('Ohne Erlaubnis für Mitteilungen geht es leider nicht.', { kind: 'error' });
      draw();
      return;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      const key = app.auth?.vapid_public_key ?? (await api('session')).vapid_public_key;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64UrlToBytes(key) });
      await post('push/subscribe', { subscription: subscription.toJSON() });
      await saveReminders({ enabled: true });
      toast('Erinnerungen sind an. にゃー！', { kind: 'ok' });
    } catch (err) {
      toast(`Anmelden für Mitteilungen ging nicht: ${errorText(err)}`, { kind: 'error' });
      draw();
    }
  }

  main.addEventListener('click', async (event) => {
    const seg = event.target.closest('[data-seg]');
    if (seg) {
      const value = ['theme', 'fontSize'].includes(seg.dataset.seg) ? seg.dataset.value : Number(seg.dataset.value);
      app.saveSettings({ [seg.dataset.seg]: value });
      Object.assign(s, app.settings);
      draw();
      return;
    }
    const act = event.target.closest('[data-act]')?.dataset.act;
    if (act === 'sync') app.sync();
    if (act === 'logout') {
      const pending = app.store.pendingCount();
      const ok = await confirmSheet({ title: 'Abmelden?', text: pending ? `${pending} Änderungen sind noch nicht synchronisiert und gehen auf diesem Gerät verloren.` : 'Dein Fortschritt bleibt auf dem Server gespeichert.', ok: 'Abmelden' });
      if (ok) app.logout();
    }
    if (act === 'password') passwordSheet();
    if (act === 'delete') deleteSheet();
    if (act === 'push-test') {
      try {
        const result = await post('push/test');
        toast(result.sent ? 'Test-Mitteilung ist unterwegs.' : 'Kein Gerät hat die Mitteilung angenommen.', { kind: result.sent ? 'ok' : 'error' });
      } catch (err) {
        toast(errorText(err), { kind: 'error' });
      }
    }
  });

  main.addEventListener('change', async (event) => {
    const target = event.target;
    if (target.dataset.setting) {
      app.saveSettings({ [target.dataset.setting]: target.checked });
      Object.assign(s, app.settings);
    }
    if (target.dataset.select === 'lesson') {
      app.saveSettings({ lesson: Number(target.value) });
      Object.assign(s, app.settings);
    }
    if (target.dataset.mix) {
      const mix = new Set(app.settings.mix);
      if (target.checked) mix.add(target.dataset.mix);
      else mix.delete(target.dataset.mix);
      app.saveSettings({ mix: AREAS.map((a) => a.id).filter((id) => mix.has(id)) });
      Object.assign(s, app.settings);
    }
    if (target.matches('[data-setting="rem-enabled"]')) {
      if (target.checked && (!reminders.devices || Notification.permission !== 'granted')) await enablePush();
      else await saveReminders({ enabled: target.checked });
    }
    if (target.matches('[data-setting="rem-idle"]')) await saveReminders({ only_idle: target.checked });
    if (target.dataset.rem === 'time' && target.value) await saveReminders({ time: target.value });
    if (target.dataset.remDay) {
      const days = [...main.querySelectorAll('[data-rem-day]:checked')].map((el) => el.dataset.remDay).join('');
      await saveReminders({ days });
    }
  });

  function passwordSheet() {
    const el = sheet(html`<h2 class="sheet-title">Passwort ändern</h2>
      <form class="form" data-form="password">
        <label>Aktuelles Passwort<input type="password" name="current" autocomplete="current-password" required></label>
        <label>Neues Passwort<input type="password" name="new" autocomplete="new-password" minlength="8" required></label>
        <p class="form-error" hidden></p>
        <div class="sheet-actions"><button type="button" class="btn btn-ghost" data-close-sheet>Abbrechen</button><button class="btn btn-primary">Speichern</button></div>
      </form>`.text);
    el.querySelector('form').addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        await post('password', Object.fromEntries(new FormData(event.target)));
        closeSheet();
        toast('Passwort geändert. Andere Geräte sind jetzt abgemeldet.', { kind: 'ok' });
      } catch (err) {
        const error = el.querySelector('.form-error');
        error.hidden = false;
        error.textContent = errorText(err);
      }
    });
  }

  function deleteSheet() {
    const el = sheet(html`<h2 class="sheet-title">Konto löschen</h2>
      <p>Dein Konto und dein gesamter Lernfortschritt werden endgültig gelöscht.</p>
      <form class="form" data-form="delete">
        <label>Passwort zur Bestätigung<input type="password" name="password" autocomplete="current-password" required></label>
        <p class="form-error" hidden></p>
        <div class="sheet-actions"><button type="button" class="btn btn-ghost" data-close-sheet>Abbrechen</button><button class="btn btn-danger">Endgültig löschen</button></div>
      </form>`.text);
    el.querySelector('form').addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        await post('account/delete', Object.fromEntries(new FormData(event.target)));
        closeSheet();
        await app.store.destroy();
        location.reload();
      } catch (err) {
        const error = el.querySelector('.form-error');
        error.hidden = false;
        error.textContent = errorText(err);
      }
    });
  }

  draw();
  loadReminders();
}
