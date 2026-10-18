/* Sign in and registration. */
import { post, errorText } from '../lib/api.js';
import { cat } from '../lib/cat.js';
import { html } from '../lib/ui.js';

export function renderAuth(app, main) {
  let mode = 'login';
  const needsCode = app.auth?.registration === 'code';
  const closed = app.auth?.registration === 'closed';

  const draw = (error = '') => {
    main.innerHTML = html`
      <section class="auth">
        <div class="auth-hero">
          ${cat('wave', { size: 132 })}
          <h1 class="brand">Happy Japanese <span class="brand-jp" lang="ja">にほんご</span></h1>
          <p class="muted">Dein Begleiter zu Minna no Nihongo – Vokabeln, Grammatik, Zahlen und alles für die nächste Japanreise.</p>
        </div>
        ${app.auth?.offline ? html`<p class="notice">Keine Verbindung zum Server. Zum ersten Anmelden brauchst du Internet.</p>` : ''}
        <div class="segmented auth-switch" role="tablist">
          <button role="tab" class="${mode === 'login' ? 'on' : ''}" data-mode="login">Anmelden</button>
          ${closed ? '' : html`<button role="tab" class="${mode === 'register' ? 'on' : ''}" data-mode="register">Registrieren</button>`}
        </div>
        <form class="card form auth-form" novalidate>
          <label>Benutzername
            <input name="username" autocomplete="username" autocapitalize="off" autocorrect="off" spellcheck="false" required minlength="2" maxlength="40">
          </label>
          ${mode === 'register' ? html`<label>Anzeigename <span class="muted small">(optional)</span>
            <input name="display_name" autocomplete="nickname" maxlength="40"></label>` : ''}
          <label>Passwort
            <input name="password" type="password" autocomplete="${mode === 'login' ? 'current-password' : 'new-password'}" required minlength="8">
          </label>
          ${mode === 'register' && needsCode ? html`<label>Einladungscode
            <input name="code" autocomplete="off" autocapitalize="off" required></label>` : ''}
          ${error ? html`<p class="form-error" role="alert">${error}</p>` : ''}
          <button class="btn btn-primary wide" type="submit">${mode === 'login' ? 'Anmelden' : 'Konto anlegen'}</button>
          ${mode === 'register' ? html`<p class="muted small">Mindestens 8 Zeichen. Es gibt keine E-Mail und kein Zurücksetzen per Mail – merk dir dein Passwort gut.</p>` : ''}
        </form>
      </section>`.text;
    main.querySelector('input[name="username"]').focus({ preventScroll: true });
  };

  main.addEventListener('click', (event) => {
    const button = event.target.closest('[data-mode]');
    if (!button) return;
    mode = button.dataset.mode;
    draw();
  });

  main.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const data = Object.fromEntries(new FormData(form));
    if (!String(data.username ?? '').trim() || !data.password) {
      draw('Bitte Benutzername und Passwort eingeben.');
      return;
    }
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    submit.classList.add('busy');
    try {
      const session = await post(mode === 'login' ? 'login' : 'register', data);
      await app.signedIn(session);
    } catch (err) {
      draw(errorText(err));
      const again = main.querySelector('input[name="username"]');
      again.value = data.username ?? '';
    }
  });

  draw();
}
