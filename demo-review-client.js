(function () {
  'use strict';

  function start() {
    if (!window.DEMO_BRAND || !window.firebase || !firebase.apps.length) return;
    const db = firebase.database();
    const profile = readProfile();
    const reviewUrl = getReviewUrl();
    injectStyles();
    addReviewEntryPoint(reviewUrl);
    if (new URLSearchParams(location.search).get('resena') === '1' || location.hash === '#resenas') {
      renderReviewModule(db, profile);
    }
  }

  function waitForFirebase(attempts = 0) {
    if (window.firebase && firebase.apps && firebase.apps.length) return start();
    if (attempts < 80) return window.setTimeout(() => waitForFirebase(attempts + 1), 250);
  }

  function readProfile() {
    try {
      const profile = JSON.parse(localStorage.getItem('jb_perfil') || 'null');
      return profile && profile.clienteId && profile.nombreDisplay ? profile : null;
    } catch (_) { return null; }
  }

  function getReviewUrl() {
    if (window.DEMO_BRAND.reviewUrl) return window.DEMO_BRAND.reviewUrl;
    const url = new URL('bot.html', location.href);
    url.search = '?resena=1';
    url.hash = 'resenas';
    return url.href;
  }

  function injectStyles() {
    if (document.getElementById('demo-review-client-styles')) return;
    const style = document.createElement('style');
    style.id = 'demo-review-client-styles';
    style.textContent = `
      .demo-review-entry { position:fixed; right:18px; bottom:18px; z-index:10000; display:inline-flex; align-items:center; min-height:46px; padding:0 16px; border-radius:999px; background:var(--demo-accent,#c99b45); color:var(--demo-accent-text,#111); font-weight:800; text-decoration:none; box-shadow:0 10px 28px #0006; }
      .demo-review-module { width:min(620px,calc(100% - 28px)); margin:24px auto; padding:24px; border:1px solid var(--demo-accent,#c99b45); border-radius:12px; background:var(--demo-surface,#1d1d1d); color:var(--demo-text,#fff); box-shadow:0 18px 60px #0006; }
      .demo-review-module h2 { margin:0 0 8px; }
      .demo-review-module p { color:var(--demo-muted,#bbb); }
      .demo-review-module label { display:grid; gap:6px; margin:14px 0; color:var(--demo-muted,#bbb); font-weight:700; }
      .demo-review-module textarea,.demo-review-module select { min-height:44px; padding:10px; border:1px solid var(--demo-muted,#aaa); border-radius:7px; background:var(--demo-bg,#111); color:var(--demo-text,#fff); font:inherit; }
      .demo-review-stars { display:flex; gap:7px; flex-wrap:wrap; }
      .demo-review-stars button { min-width:44px; min-height:44px; border:1px solid var(--demo-muted,#aaa); border-radius:7px; background:transparent; color:var(--demo-text,#fff); cursor:pointer; font-size:1.2rem; }
      .demo-review-stars button.is-selected { background:var(--demo-accent,#c99b45); color:var(--demo-accent-text,#111); }
      .demo-review-submit { width:100%; min-height:48px; border:0; border-radius:7px; background:var(--demo-accent,#c99b45); color:var(--demo-accent-text,#111); font-weight:800; cursor:pointer; }
      .demo-review-identity { padding:12px; border-left:4px solid var(--demo-accent,#c99b45); background:color-mix(in srgb,var(--demo-accent,#c99b45) 12%,transparent); }
      .demo-review-error { color:#ffb4b4 !important; }
    `;
    document.head.appendChild(style);
  }

  function addReviewEntryPoint(url) {
    if (document.querySelector('.demo-review-entry') || new URLSearchParams(location.search).get('resena') === '1') return;
    const link = document.createElement('a');
    link.className = 'demo-review-entry';
    link.href = url;
    link.textContent = 'Dejar una resena';
    document.body.appendChild(link);
  }

  function renderReviewModule(db, profile) {
    const module = document.createElement('section');
    module.className = 'demo-review-module';
    module.id = 'demo-review-module';
    module.innerHTML = `<h2>Comparte tu experiencia</h2><p>Tu opinion ayuda a mejorar la atencion de la barberia.</p><div id="demo-review-content"></div>`;
    document.body.prepend(module);
    const content = module.querySelector('#demo-review-content');
    if (!profile) {
      content.innerHTML = `<p class="demo-review-error">Abre este enlace desde el mismo celular y navegador donde hiciste tu reserva. Asi podremos identificar tu cuenta de cliente sin pedirte datos nuevamente.</p><a class="demo-review-submit" style="display:grid;place-items:center;text-decoration:none" href="bot.html">Volver a reservar</a>`;
      return;
    }
    content.innerHTML = `<div class="demo-review-identity"><strong>${escapeHtml(profile.nombreDisplay)}</strong><br><small>ID de cliente: ${escapeHtml(profile.clienteId)}</small></div><form id="demo-review-form"><label>Calificacion<div class="demo-review-stars" role="radiogroup" aria-label="Calificacion"><button type="button" data-stars="1">★</button><button type="button" data-stars="2">★</button><button type="button" data-stars="3">★</button><button type="button" data-stars="4">★</button><button type="button" data-stars="5" class="is-selected">★</button></div></label><label>Tu resena<textarea name="texto" maxlength="500" required placeholder="¿Como fue tu experiencia?"></textarea></label><button class="demo-review-submit" type="submit">Enviar resena</button><p id="demo-review-status" role="status"></p></form>`;
    let stars = 5;
    content.querySelectorAll('[data-stars]').forEach((button) => button.addEventListener('click', () => { stars = Number(button.dataset.stars); content.querySelectorAll('[data-stars]').forEach((item) => item.classList.toggle('is-selected', Number(item.dataset.stars) <= stars)); }));
    content.querySelector('form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = content.querySelector('#demo-review-status');
      const text = new FormData(event.currentTarget).get('texto').toString().trim();
      if (!text) return;
      const localReviewKey = `demo_review_enviada_${profile.clienteId}`;
      if (localStorage.getItem(localReviewKey)) { status.textContent = 'Ya recibimos una resena de este cliente. Gracias.'; return; }
      await db.ref('resenas').push({ clienteId: profile.clienteId, nombre: profile.nombreDisplay, estrellas: stars, texto: text, visible: false, estado: 'pendiente', createdAt: firebase.database.ServerValue.TIMESTAMP });
      localStorage.setItem(localReviewKey, '1');
      event.currentTarget.reset();
      status.textContent = 'Gracias. Tu resena quedo pendiente de publicacion.';
    });
  }

  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', waitForFirebase, { once: true });
  else waitForFirebase();
})();
