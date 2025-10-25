// Enhancements: theme (system + toggle + persist), robust quotes (multi-source + fallback),
// image fit fix, filters/sort/search, reveals, nav, toasts, form inline errors, FAB, shortcuts.

document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

  const YEAR = $('#year'); if (YEAR) YEAR.textContent = new Date().getFullYear();

  const KEYS = {
    name: 'aa_name',
    theme: 'aa_theme', // 'light' | 'dark' | 'system'
    filter: 'aa_project_filter',
    sort: 'aa_project_sort',
    search: 'aa_project_search',
    lastSection: 'aa_last_section',
  };

  /* ---------------- Theme: system + toggle ---------------- */
  const root = document.documentElement;
  const toggleBtn = $('#theme-toggle');

  function applyTheme(pref) {
    // 'light', 'dark', or 'system' (system follows prefers-color-scheme)
    root.setAttribute('data-theme', pref);
    // Button label/icon
    const label = toggleBtn?.querySelector('.theme-label');
    const icon = toggleBtn?.querySelector('.theme-icon');
    const isDark = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim().startsWith('#0'); // heuristic
    if (label && icon) {
      if (pref === 'dark' || (pref === 'system' && isSystemDark())) {
        label.textContent = 'Light'; icon.textContent = '☀️';
      } else {
        label.textContent = 'Dark'; icon.textContent = '🌙';
      }
    }
    // meta theme-color for mobile
    const meta = document.querySelector('meta[name="theme-color"]') || Object.assign(document.createElement('meta'), { name: 'theme-color' });
    meta.content = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#ffffff';
    if (!meta.parentNode) document.head.appendChild(meta);
  }
  function isSystemDark(){ return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; }
  function currentTheme(){
    return localStorage.getItem(KEYS.theme) || 'system';
  }
  // init
  applyTheme(currentTheme());
  // listen to system changes when in 'system'
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (currentTheme() === 'system') applyTheme('system');
    });
  }
  // toggle click: light <-> dark (keeps system in storage only if explicitly chosen)
  toggleBtn?.addEventListener('click', () => {
    const cur = currentTheme();
    const next = (cur === 'dark' || (cur === 'system' && isSystemDark())) ? 'light' : 'dark';
    localStorage.setItem(KEYS.theme, next);
    applyTheme(next);
    showToast('Theme updated', `Switched to ${next} mode.`);
  });

  /* ---------------- Greeting + personalize ---------------- */
  const greet = $('#greeting');
  const personalize = $('#personalize');
  function setGreeting(){
    if (!greet) return;
    const hour = new Date().getHours();
    const base = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const name = localStorage.getItem(KEYS.name);
    greet.textContent = name ? `${base}, ${name}!` : `${base}!`;
  }
  setGreeting();

  personalize?.addEventListener('click', () => {
    const current = localStorage.getItem(KEYS.name) || '';
    const name = prompt('What name should I greet you with?', current);
    if (name === null) return;
    const cleaned = name.trim().replace(/\s+/g, ' ');
    if (cleaned) {
      localStorage.setItem(KEYS.name, cleaned);
      setGreeting();
      showToast('Personalized', `I’ll greet you as ${cleaned}.`);
    } else {
      localStorage.removeItem(KEYS.name);
      setGreeting();
      showToast('Reset', 'Greeting personalization cleared.');
    }
  });

  /* ---------------- Scroll progress ---------------- */
  const progress = $('#scroll-progress');
  const updateProgress = () => {
    const t = window.scrollY;
    const d = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (d > 0 ? (t/d)*100 : 0) + '%';
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive:true });
  window.addEventListener('resize', updateProgress);

  /* ---------------- Reveal on scroll ---------------- */
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = $$('[data-animate]');
  if (reduceMotion) {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------- Active nav + last section ---------------- */
  const navLinks = $$('.site-nav a');
  const sections = navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = navLinks.find(a => a.getAttribute('href') === `#${id}`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('is-active'));
          link.classList.add('is-active');
          localStorage.setItem(KEYS.lastSection, `#${id}`);
        }
      });
    }, { rootMargin: '-50% 0px -40% 0px', threshold: 0.01 });
    sections.forEach(sec => navIO.observe(sec));
  }
  // Back to top FAB
  const toTop = $('#to-top');
  const fabToggle = () => toTop?.classList.toggle('show', window.scrollY > 400);
  fabToggle();
  window.addEventListener('scroll', fabToggle, { passive:true });
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------------- Inspiration (robust) ---------------- */
  const quoteEl = $('#quote');
  const authorEl = $('#quote-author');
  const errEl = $('#quote-error');
  const refreshBtn = $('#refresh-quote');
  const retryBtn = $('#retry-quote');

  const localQuotes = [
    { content: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
    { content: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
    { content: 'Programs must be written for people to read.', author: 'Harold Abelson' },
  ];

  async function getQuoteFromQuotable(){
    const r = await fetch('https://api.quotable.io/random?tags=technology');
    if (!r.ok) throw new Error('quotable fail');
    const d = await r.json();
    return { content: d.content, author: d.author };
    // Sometimes public APIs fail due to rate/CORS—handled by fallbacks below.
  }
  async function getQuoteFromZen(){
    const r = await fetch('https://zenquotes.io/api/random'); // returns [{q:"", a:""}]
    if (!r.ok) throw new Error('zen fail');
    const d = await r.json();
    const item = Array.isArray(d) ? d[0] : d;
    return { content: item.q || item.quote, author: item.a || item.author || 'Unknown' };
  }

  async function fetchQuote() {
    if (!quoteEl || !authorEl || !errEl) return;
    errEl.hidden = true;
    quoteEl.classList.add('skeleton');
    authorEl.classList.add('skeleton-line');
    quoteEl.textContent = ' ';
    authorEl.textContent = ' ';

    try {
      let q;
      try { q = await getQuoteFromQuotable(); }
      catch { q = await getQuoteFromZen(); }
      if (!q) throw new Error('no quote');
      quoteEl.textContent = `“${q.content}”`;
      authorEl.textContent = q.author ? `— ${q.author}` : '';
    } catch {
      // Local fallback
      const q = localQuotes[Math.floor(Math.random()*localQuotes.length)];
      quoteEl.textContent = `“${q.content}”`;
      authorEl.textContent = `— ${q.author}`;
      errEl.hidden = false;
    } finally {
      quoteEl.classList.remove('skeleton');
      authorEl.classList.remove('skeleton-line');
    }
  }
  refreshBtn?.addEventListener('click', fetchQuote);
  retryBtn?.addEventListener('click', fetchQuote);
  fetchQuote();

  /* ---------------- Projects: search + filter + sort ---------------- */
  const grid = $('#project-grid');
  const cards = $$('.project-card', grid);
  const searchInput = $('#project-search');
  const filterBtns = $$('.filter-btn');
  const sortSelect = $('#project-sort');
  const resultsCount = $('#results-count');
  const emptyState = $('#empty-state');

  // Ensure image fit fix even if other CSS interferes
  cards.forEach(c => {
    const img = c.querySelector('.thumb');
    if (img) { img.style.objectFit = 'contain'; img.style.width = '100%'; img.style.height = '100%'; img.style.objectPosition = 'center'; }
  });

  function readCardData(card) {
    return {
      el: card,
      title: (card.dataset.title || card.querySelector('.card__title')?.textContent || '').toLowerCase(),
      tags: (card.dataset.tags || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
      date: new Date(card.dataset.date || '2000-01-01'),
      text: (card.textContent || '').toLowerCase(),
    };
  }
  const model = cards.map(readCardData);

  const state = {
    q: localStorage.getItem(KEYS.search) || '',
    filter: localStorage.getItem(KEYS.filter) || 'all',
    sort: localStorage.getItem(KEYS.sort) || 'newest',
  };

  if (searchInput) searchInput.value = state.q;
  filterBtns.forEach(b => b.classList.toggle('is-active', b.dataset.filter === state.filter));
  if (sortSelect) sortSelect.value = state.sort;

  function applyFilterSort() {
    const q = state.q.trim().toLowerCase();
    const tag = state.filter;
    let filtered = model.filter(m => {
      const matchesQ = !q || m.title.includes(q) || m.text.includes(q);
      const matchesTag = tag === 'all' || m.tags.includes(tag);
      return matchesQ && matchesTag;
    });

    filtered.sort((a, b) => {
      switch (state.sort) {
        case 'newest': return b.date - a.date;
        case 'oldest': return a.date - b.date;
        case 'az': return a.title.localeCompare(b.title);
        case 'za': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });

    const toHide = new Set(model.map(m => m.el));
    filtered.forEach(m => toHide.delete(m.el));
    toHide.forEach(el => { el.classList.add('is-hiding'); setTimeout(() => el.setAttribute('hidden','true'), 140); });

    filtered.forEach(m => { m.el.removeAttribute('hidden'); m.el.classList.remove('is-hiding'); grid?.appendChild(m.el); });

    const count = filtered.length;
    if (resultsCount) resultsCount.textContent = `${count} project${count === 1 ? '' : 's'}`;
    if (emptyState) emptyState.hidden = count !== 0;
  }

  searchInput?.addEventListener('input', debounce(() => {
    state.q = searchInput.value;
    localStorage.setItem(KEYS.search, state.q);
    applyFilterSort();
  }, 120));

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.filter = btn.dataset.filter || 'all';
      localStorage.setItem(KEYS.filter, state.filter);
      applyFilterSort();
    });
  });

  sortSelect?.addEventListener('change', () => {
    state.sort = sortSelect.value;
    localStorage.setItem(KEYS.sort, state.sort);
    applyFilterSort();
  });

  applyFilterSort();

  /* ---------------- Modals ---------------- */
  $$('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-open');
      const dlg = document.getElementById(id);
      if (!dlg) return;
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open','');
    });
  });
  $$('dialog.modal').forEach(dlg => {
    dlg.querySelector('.modal__close')?.addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => {
      const win = dlg.querySelector('.modal__window');
      const r = win.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) dlg.close();
    });
  });

  /* ---------------- Contact form (inline errors + loading + toast) ---------------- */
  const form = $('#contact-form');
  const status = $('#form-status');
  const sendBtn = $('#send-btn');

  const validators = {
    name: v => v.trim().length > 0,
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: v => v.trim().length > 0,
  };

  function fieldError(name, show) {
    const err = $(`.error[data-error-for="${name}"]`); if (err) err.hidden = !show;
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form) return;

    const fd = new FormData(form);
    const name = String(fd.get('name')||'');
    const email = String(fd.get('email')||'');
    const message = String(fd.get('message')||'');

    const ok = { name: validators.name(name), email: validators.email(email), message: validators.message(message) };
    fieldError('name', !ok.name); fieldError('email', !ok.email); fieldError('message', !ok.message);
    if (!ok.name || !ok.email || !ok.message) { showToast('Please fix the errors', 'Some fields are missing or invalid.', 'error'); return; }

    sendBtn?.classList.add('is-loading'); if (status) status.textContent = 'Sending…';

    setTimeout(() => {
      sendBtn?.classList.remove('is-loading');
      form.reset();
      if (status) status.textContent = 'Thanks! Your message has been “sent” (demo only).';
      showToast('Message sent!', 'Thanks for reaching out. I’ll get back to you soon.');
    }, 700);
  });

  $$('#contact-form input, #contact-form textarea').forEach(el => {
    el.addEventListener('blur', () => {
      const name = el.getAttribute('name'); if (!name || !validators[name]) return;
      fieldError(name, !validators[name](el.value));
    });
  });

  /* ---------------- Keyboard shortcuts ---------------- */
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
      e.preventDefault(); $('#project-search')?.focus();
    }
    if (e.key.toLowerCase() === 't') { toggleBtn?.click(); }
    if (e.key.toLowerCase() === 'g') {
      // simple "g then key" navigation
      let next = null;
      const onKey = (ev) => {
        const k = ev.key.toLowerCase();
        if (k === 'h') next = '#hero';
        if (k === 'a') next = '#about';
        if (k === 'p') next = '#projects';
        if (k === 'c') next = '#contact';
        window.removeEventListener('keydown', onKey, true);
        if (next) document.querySelector(next)?.scrollIntoView({ behavior:'smooth' });
      };
      window.addEventListener('keydown', onKey, true);
    }
  });
});

/* ---------------- Toast ---------------- */
function showToast(title, description, type='success'){
  const wrap = document.getElementById('toast-container'); if (!wrap) return;
  const el = document.createElement('div');
  el.className = 'toast' + (type === 'error' ? ' toast--error' : '');
  el.innerHTML = `<div class="toast-title">${title}</div><div class="toast-description">${description}</div>`;
  wrap.appendChild(el);
  setTimeout(() => { el.style.animation = 'fadeOut .25s ease-out forwards'; setTimeout(() => el.remove(), 260); }, 4200);
}

/* ---------------- Debounce ---------------- */
function debounce(fn, wait=120){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; }
b