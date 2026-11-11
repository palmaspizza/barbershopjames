(function () {
  'use strict';

  const brand = window.DEMO_BRAND;
  if (!brand) return;

  const storedTheme = localStorage.getItem('demo_theme') || 'clasico';
  const storedOverrides = JSON.parse(localStorage.getItem('demo_theme_overrides') || '{}');
  const theme = brand.themes[storedTheme] || brand.themes.clasico;

  function applyTheme(name, overrides) {
    const selected = brand.themes[name] || brand.themes.clasico;
    const values = { ...selected, ...(overrides || {}) };
    const root = document.documentElement;
    root.dataset.demoTheme = name;
    root.style.setProperty('--demo-bg', values.bg);
    root.style.setProperty('--demo-surface', values.surface);
    root.style.setProperty('--demo-text', values.text);
    root.style.setProperty('--demo-muted', values.muted);
    root.style.setProperty('--demo-accent', values.accent);
    root.style.setProperty('--demo-accent-text', values.accentText);
    root.style.setProperty('--demo-danger', values.danger);
    localStorage.setItem('demo_theme', name);
    localStorage.setItem('demo_theme_overrides', JSON.stringify(overrides || {}));
  }

  function addStyle() {
    const style = document.createElement('style');
    style.textContent = `
      :root { color-scheme: light; }
      body { background: var(--demo-bg, #111) !important; color: var(--demo-text, #fff) !important; }
      button, input, textarea, select { font: inherit; }
      button, input, textarea, select { border-radius: 8px; }
      button { min-height: 42px; }
      button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible { outline: 3px solid var(--demo-accent); outline-offset: 2px; }
      .demo-theme-surface, .card, .panel, .modal-content, .box { background: var(--demo-surface) !important; color: var(--demo-text) !important; }
      a, .btn-login, .btn-primary, button:not([disabled]) { --demo-button-bg: var(--demo-accent); }
      .demo-theme-accent { background: var(--demo-accent) !important; color: var(--demo-accent-text) !important; }
      .demo-theme-muted { color: var(--demo-muted) !important; }
      .demo-theme-panel { position: fixed; z-index: 2147483000; right: 16px; bottom: 16px; width: min(340px, calc(100vw - 32px)); padding: 16px; border: 1px solid color-mix(in srgb, var(--demo-accent) 60%, transparent); border-radius: 10px; background: var(--demo-surface); color: var(--demo-text); box-shadow: 0 18px 50px #0008; font: 14px/1.4 system-ui, sans-serif; }
      .demo-theme-panel h2 { margin: 0 0 12px; font-size: 1rem; }
      .demo-theme-panel label { display: grid; gap: 5px; margin: 9px 0; }
      .demo-theme-panel select, .demo-theme-panel input[type=color] { width: 100%; min-height: 40px; padding: 5px; background: var(--demo-bg); color: var(--demo-text); border: 1px solid var(--demo-muted); }
      .demo-theme-panel .demo-actions { display: flex; gap: 8px; margin-top: 12px; }
      .demo-theme-panel button { flex: 1; border: 0; background: var(--demo-accent); color: var(--demo-accent-text); cursor: pointer; }
      .demo-theme-panel button:last-child { background: transparent; color: var(--demo-text); border: 1px solid var(--demo-muted); }
      .demo-logo-preview { display: grid; place-items: center; min-height: 54px; margin-top: 8px; border: 1px dashed var(--demo-muted); background: var(--demo-bg); overflow: hidden; }
      .demo-logo-preview img { max-width: 100%; max-height: 64px; object-fit: contain; }
      @media (max-width: 480px) { .demo-theme-panel { right: 8px; bottom: 8px; width: calc(100vw - 16px); } }
    `;
    document.head.appendChild(style);
  }

  function addPresentationPanel() {
    if (new URLSearchParams(location.search).get('demo') !== '1') return;
    const panel = document.createElement('aside');
    panel.className = 'demo-theme-panel';
    panel.setAttribute('aria-label', 'Personalizacion de demo');
    panel.innerHTML = `
      <h2>Presentacion de demo</h2>
      <label>Tema<select id="demoThemeSelect">${Object.keys(brand.themes).map((name) => `<option value="${name}">${name}</option>`).join('')}</select></label>
      <label>Color principal<input id="demoAccent" type="color"></label>
      <label>Color de fondo<input id="demoBg" type="color"></label>
      <label>Logo<input id="demoLogo" type="file" accept="image/*"></label>
      <div class="demo-logo-preview" id="demoLogoPreview">Sin logo cargado</div>
      <div class="demo-actions"><button id="demoReset" type="button">Restablecer</button><button id="demoClose" type="button">Cerrar</button></div>
    `;
    document.body.appendChild(panel);

    const select = panel.querySelector('#demoThemeSelect');
    const accent = panel.querySelector('#demoAccent');
    const bg = panel.querySelector('#demoBg');
    const logo = panel.querySelector('#demoLogo');
    const preview = panel.querySelector('#demoLogoPreview');
    select.value = storedTheme;
    accent.value = storedOverrides.accent || theme.accent;
    bg.value = storedOverrides.bg || theme.bg;

    function update() {
      applyTheme(select.value, { accent: accent.value, bg: bg.value });
    }
    select.addEventListener('change', update);
    accent.addEventListener('input', update);
    bg.addEventListener('input', update);
    logo.addEventListener('change', () => {
      const file = logo.files && logo.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem('demo_logo_data', String(reader.result));
        preview.innerHTML = `<img src="${reader.result}" alt="Logo de demo">`;
      };
      reader.readAsDataURL(file);
    });
    panel.querySelector('#demoReset').addEventListener('click', () => {
      localStorage.removeItem('demo_theme');
      localStorage.removeItem('demo_theme_overrides');
      localStorage.removeItem('demo_logo_data');
      location.reload();
    });
    panel.querySelector('#demoClose').addEventListener('click', () => panel.remove());
    const savedLogo = localStorage.getItem('demo_logo_data');
    if (savedLogo) preview.innerHTML = `<img src="${savedLogo}" alt="Logo de demo">`;
  }

  applyTheme(storedTheme, storedOverrides);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addPresentationPanel, { once: true });
  } else {
    addPresentationPanel();
  }
  addStyle();
})();
