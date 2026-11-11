(function () {
  'use strict';
  window.DEMO_PAGE_SUBSCRIPTION = true;

  function start() {
    if (!window.firebase || !window.DEMO_BRAND) return;
    const auth = firebase.auth();
    const db = firebase.database();
    const developerEmail = window.DEMO_BRAND.supportEmail.toLowerCase();
    const subscriptionRef = db.ref('config/suscripcion');
    const defaultSubscription = { activo: true, monto: 30000, periodoDias: 30, graciaDias: 3, ultimoPago: '', proximoPago: '' };
    let subscription = { ...defaultSubscription };
    let lockElement = null;

    injectStyles();
    organizeExistingSections();
    createNavigation();
    createReviewsSection();
    createTvGalleryControls();
    createSubscriptionSection();
    loadReviews();
    loadSubscription();

    auth.onAuthStateChanged((user) => {
      if (!user) return;
      const isDeveloper = (user.email || '').toLowerCase() === developerEmail;
      document.querySelectorAll('[data-developer-only]').forEach((element) => { element.hidden = !isDeveloper; });
      renderSubscription(subscription, isDeveloper);
    });

    function injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .demo-admin-nav { display:flex; flex-wrap:wrap; gap:8px; margin:0 auto 18px; max-width:1400px; padding:10px; position:sticky; top:8px; z-index:20; background:var(--demo-surface,#1d1d1d); border:1px solid var(--demo-accent,#c99b45); border-radius:10px; box-shadow:0 10px 24px #0005; }
        .demo-admin-nav a { min-height:40px; display:inline-flex; align-items:center; padding:0 12px; border-radius:7px; color:var(--demo-text,#fff); text-decoration:none; background:transparent; border:1px solid color-mix(in srgb,var(--demo-muted,#aaa) 35%,transparent); font-weight:700; font-size:.86rem; }
        .demo-admin-nav a:hover,.demo-admin-nav a:focus-visible { background:var(--demo-accent,#c99b45); color:var(--demo-accent-text,#111); }
        .demo-module { max-width:1400px; margin:18px auto; padding:20px; border:1px solid color-mix(in srgb,var(--demo-accent,#c99b45) 35%,transparent); border-radius:10px; background:var(--demo-surface,#1d1d1d); color:var(--demo-text,#fff); }
        .demo-module h2 { margin:0 0 8px; font-size:1.2rem; }
        .demo-module p { color:var(--demo-muted,#bbb); }
        .demo-module-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; }
        .demo-review { padding:14px; border:1px solid color-mix(in srgb,var(--demo-muted,#aaa) 30%,transparent); border-radius:8px; background:color-mix(in srgb,var(--demo-bg,#111) 75%,transparent); }
        .demo-review strong { display:block; }
        .demo-review small { color:var(--demo-muted,#bbb); }
        .demo-review-actions { display:flex; gap:8px; flex-wrap:wrap; margin-top:10px; }
        .demo-module button { min-height:40px; border:0; border-radius:7px; padding:0 12px; background:var(--demo-accent,#c99b45); color:var(--demo-accent-text,#111); font-weight:700; cursor:pointer; }
        .demo-module button.secondary { background:transparent; color:var(--demo-text,#fff); border:1px solid var(--demo-muted,#aaa); }
        .demo-module input,.demo-module textarea,.demo-module select { width:100%; min-height:40px; margin-top:5px; padding:8px; border:1px solid var(--demo-muted,#aaa); border-radius:6px; background:var(--demo-bg,#111); color:var(--demo-text,#fff); }
        .demo-module label { display:block; color:var(--demo-muted,#bbb); font-weight:700; }
        .demo-subscription-status { padding:14px; border-left:4px solid var(--demo-accent,#c99b45); background:color-mix(in srgb,var(--demo-accent,#c99b45) 12%,transparent); }
        .demo-subscription-status.is-suspended { border-left-color:var(--demo-danger,#c94c4c); }
        .demo-admin-lock { position:fixed; inset:0; z-index:2147482000; display:grid; place-items:center; padding:20px; background:#090b0eeF; color:#fff; }
        .demo-admin-lock-box { width:min(520px,100%); padding:24px; border:1px solid var(--demo-danger,#c94c4c); border-radius:10px; background:var(--demo-surface,#1d1d1d); box-shadow:0 20px 70px #000b; }
        .demo-admin-lock button { min-height:46px; padding:0 16px; border:0; border-radius:7px; background:var(--demo-accent,#c99b45); color:var(--demo-accent-text,#111); font-weight:800; cursor:pointer; }
        @media(max-width:600px) { .demo-admin-nav { top:0; border-radius:0 0 10px 10px; } .demo-module { margin-left:8px; margin-right:8px; padding:15px; } }
      `;
      document.head.appendChild(style);
    }

    function organizeExistingSections() {
      const gallery = document.querySelector('.galeria-card');
      if (gallery) { gallery.hidden = false; gallery.id = 'demo-section-gallery'; }
      const stats = document.getElementById('card-estadisticas');
      if (stats) stats.id = 'demo-section-dashboard';
      const calendar = document.getElementById('calendario-grid');
      if (calendar) (calendar.closest('.card') || calendar).id = 'demo-section-calendar';
      const support = document.getElementById('jbSupportCenter');
      if (support) support.id = 'demo-section-support';
      document.getElementById('jbAbonoCard')?.remove();
      document.querySelectorAll('#jbLicPanel,#jbEstadoCard,.tarjeta-animada,.jbCtl').forEach((element) => element.remove());
      document.querySelectorAll('#jbEstadoReservasSemana').forEach((element) => element.closest('.stat-box')?.remove());
    }

    function createNavigation() {
      const panel = document.getElementById('admin-panel');
      if (!panel || document.getElementById('demo-admin-nav')) return;
      const nav = document.createElement('nav');
      nav.id = 'demo-admin-nav';
      nav.className = 'demo-admin-nav';
      nav.setAttribute('aria-label', 'Secciones del panel');
      nav.innerHTML = [
        ['demo-section-dashboard', 'Resumen'], ['demo-section-calendar', 'Calendario'], ['demo-section-gallery', 'Galeria'], ['demo-section-reviews', 'Resenas'], ['demo-section-subscription', 'Suscripcion'], ['demo-section-support', 'Ayuda']
      ].map(([id, label]) => `<a href="#${id}">${label}</a>`).join('');
      panel.insertBefore(nav, panel.firstChild);
    }

    function createReviewsSection() {
      const panel = document.getElementById('admin-panel');
      if (!panel || document.getElementById('demo-section-reviews')) return;
      const section = document.createElement('section');
      section.id = 'demo-section-reviews';
      section.className = 'demo-module';
      section.innerHTML = `
        <h2>Resenas</h2>
        <p>Modera las opiniones de clientes. Publicar u ocultar una resena no elimina su contenido.</p>
        <form id="demo-review-form" class="demo-module-grid">
          <label>Nombre<input name="nombre" required maxlength="80"></label>
          <label>Estrellas<select name="estrellas"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></label>
          <label style="grid-column:1/-1">Comentario<textarea name="texto" required maxlength="500"></textarea></label>
          <button type="submit">Guardar resena</button>
        </form>
        <div id="demo-reviews-list" class="demo-module-grid" style="margin-top:16px"></div>`;
      panel.appendChild(section);
      section.querySelector('form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        await db.ref('resenas').push({ clienteId: `manual_${Date.now()}`, nombre: String(form.get('nombre')), estrellas: Number(form.get('estrellas')), texto: String(form.get('texto')), visible: false, estado: 'pendiente', createdAt: firebase.database.ServerValue.TIMESTAMP });
        event.currentTarget.reset();
      });
    }

    function loadReviews() {
      db.ref('resenas').on('value', (snapshot) => {
        const list = document.getElementById('demo-reviews-list');
        if (!list) return;
        const reviews = Object.entries(snapshot.val() || {});
        list.innerHTML = reviews.length ? reviews.map(([id, review]) => `
          <article class="demo-review"><strong>${escapeHtml(review.nombre || 'Cliente')}</strong><small>${'★'.repeat(Math.max(1, Math.min(5, Number(review.estrellas) || 5)))} · ${review.visible === false ? 'Oculta' : 'Visible'}</small><p>${escapeHtml(review.texto || review.comentario || '')}</p><div class="demo-review-actions"><button type="button" data-review-visible="${id}">${review.visible === false ? 'Publicar' : 'Ocultar'}</button><button type="button" class="secondary" data-review-delete="${id}">Eliminar</button></div></article>`).join('') : '<p>Aun no hay resenas.</p>';
        list.querySelectorAll('[data-review-visible]').forEach((button) => button.addEventListener('click', () => db.ref(`resenas/${button.dataset.reviewVisible}/visible`).set(snapshot.val()[button.dataset.reviewVisible].visible === false)));
        list.querySelectorAll('[data-review-delete]').forEach((button) => button.addEventListener('click', () => db.ref(`resenas/${button.dataset.reviewDelete}`).remove()));
      });
    }

    function createTvGalleryControls() {
      const gallery = document.getElementById('demo-section-gallery');
      if (!gallery || document.getElementById('demo-tv-gallery-controls')) return;
      const section = document.createElement('div');
      section.id = 'demo-tv-gallery-controls';
      section.style.marginTop = '18px';
      section.innerHTML = `<h3>Mostrar en pantalla TV</h3><p>Marca las imagenes que quieres incluir en el carrusel del TV. Las nuevas imagenes se muestran por defecto.</p><div id="demo-tv-gallery-list" class="demo-module-grid"></div>`;
      gallery.appendChild(section);
      db.ref('galeria').on('value', (snapshot) => {
        const list = section.querySelector('#demo-tv-gallery-list');
        const entries = Object.entries(snapshot.val() || {});
        list.innerHTML = entries.length ? entries.map(([id, image]) => `<label class="demo-review"><img src="${escapeHtml(image.url || '')}" alt="" style="width:100%;height:100px;object-fit:cover;border-radius:6px"><span><input type="checkbox" data-tv-image="${id}" ${image.mostrarTv !== false ? 'checked' : ''}> Mostrar en TV</span></label>`).join('') : '<p>Aun no hay imagenes en la galeria.</p>';
        list.querySelectorAll('[data-tv-image]').forEach((input) => input.addEventListener('change', () => db.ref(`galeria/${input.dataset.tvImage}/mostrarTv`).set(input.checked)));
      });
    }

    function createSubscriptionSection() {
      const panel = document.getElementById('admin-panel');
      if (!panel || document.getElementById('demo-section-subscription')) return;
      const section = document.createElement('section');
      section.id = 'demo-section-subscription';
      section.className = 'demo-module';
      section.innerHTML = `<h2>Suscripcion de la pagina</h2><p>Incluye hosting, base de datos, soporte y mantenimiento. No es un cobro separado por bot, calendario o domicilio.</p><div id="demo-subscription-status" class="demo-subscription-status">Cargando estado...</div><div data-developer-only hidden style="margin-top:16px"><div class="demo-module-grid"><label>Monto CLP<input id="demo-subscription-amount" type="number" min="0" step="1000" value="30000"></label><label>Proximo dia de pago<input id="demo-subscription-date" type="date"></label></div><div class="demo-review-actions"><button id="demo-register-payment" type="button">Registrar pago de hoy</button><button id="demo-save-payment-date" class="secondary" type="button">Guardar fecha de pago</button></div></div>`;
      panel.appendChild(section);
      section.querySelector('#demo-register-payment').addEventListener('click', registerPayment);
      section.querySelector('#demo-save-payment-date').addEventListener('click', savePaymentDate);
    }

    function loadSubscription() {
      subscriptionRef.on('value', (snapshot) => {
        subscription = { ...defaultSubscription, ...(snapshot.val() || {}) };
        const user = auth.currentUser;
        renderSubscription(subscription, user && (user.email || '').toLowerCase() === developerEmail);
      });
    }

    function calculateStatus(value) {
      if (value.activo === false) return { code: 'suspended', label: 'Suspendida', detail: 'La cuenta fue suspendida manualmente.' };
      if (!value.proximoPago) return { code: 'active', label: 'Activa', detail: 'Configura el proximo dia de pago desde la cuenta desarrollador.' };
      const due = new Date(`${value.proximoPago}T23:59:59`);
      const daysLate = Math.floor((Date.now() - due.getTime()) / 86400000);
      if (daysLate <= 0) return { code: 'active', label: 'Activa', detail: `Proximo pago: ${value.proximoPago}.` };
      if (daysLate <= Number(value.graciaDias || 3)) return { code: 'grace', label: 'En periodo de gracia', detail: `Pago vencido. Quedan ${Number(value.graciaDias || 3) - daysLate + 1} dias de gracia.` };
      return { code: 'suspended', label: 'Admin suspendido', detail: `La gracia de ${value.graciaDias || 3} dias termino. La pagina publica sigue activa.` };
    }

    function renderSubscription(value, isDeveloper) {
      const status = calculateStatus(value);
      const element = document.getElementById('demo-subscription-status');
      if (element) { element.className = `demo-subscription-status${status.code === 'suspended' ? ' is-suspended' : ''}`; element.innerHTML = `<strong>${status.label}</strong><br>${status.detail}<br><small>Mensualidad: $${Number(value.monto || 30000).toLocaleString('es-CL')} · Ciclo: ${value.periodoDias || 30} dias + ${value.graciaDias || 3} dias de gracia.</small>`; }
      const date = document.getElementById('demo-subscription-date');
      const amount = document.getElementById('demo-subscription-amount');
      if (date) date.value = value.proximoPago || '';
      if (amount) amount.value = Number(value.monto || 30000);
      if (!isDeveloper && status.code === 'suspended') showAdminLock();
      if (isDeveloper && lockElement) { lockElement.remove(); lockElement = null; }
    }

    async function registerPayment() {
      const today = new Date();
      const next = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);
      await subscriptionRef.set({ activo: true, monto: Number(document.getElementById('demo-subscription-amount').value) || 30000, periodoDias: 30, graciaDias: 3, ultimoPago: isoDate(today), proximoPago: isoDate(next), registradoPor: auth.currentUser.email, actualizadoEn: firebase.database.ServerValue.TIMESTAMP });
    }

    async function savePaymentDate() {
      const date = document.getElementById('demo-subscription-date').value;
      if (!date) return;
      await subscriptionRef.update({ activo: true, monto: Number(document.getElementById('demo-subscription-amount').value) || 30000, periodoDias: 30, graciaDias: 3, proximoPago: date, actualizadoEn: firebase.database.ServerValue.TIMESTAMP });
    }

    function showAdminLock() {
      if (lockElement || !document.getElementById('admin-panel')) return;
      lockElement = document.createElement('div');
      lockElement.className = 'demo-admin-lock';
      lockElement.innerHTML = `<div class="demo-admin-lock-box"><h2>Panel temporalmente suspendido</h2><p>La mensualidad de la pagina vencio y finalizaron los 3 dias de gracia. La pagina publica sigue disponible. El desarrollador puede reactivar el panel al registrar el pago.</p><button type="button" id="demo-admin-logout">Cerrar sesion</button></div>`;
      document.body.appendChild(lockElement);
      lockElement.querySelector('button').addEventListener('click', () => auth.signOut());
    }

    function isoDate(date) { return date.toISOString().slice(0, 10); }
    function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
