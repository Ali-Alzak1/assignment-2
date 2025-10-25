
// Assignment 2: interactivity, data handling, animations, error feedback, AI helper.
(function(){
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // Greeting + year
  const greeting = $('#greeting');
  const hour = new Date().getHours();
  greeting && (greeting.textContent = hour < 12 ? 'Good morning!' : hour < 18 ? 'Good afternoon!' : 'Good evening!');
  const year = $('#year'); if (year) year.textContent = new Date().getFullYear();

  // Theme toggle (LocalStorage)
  const themeToggle = $('#themeToggle');
  const THEME_KEY = 'prefers-dark';
  const applyTheme = (dark) => {
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    themeToggle?.setAttribute('aria-pressed', String(!!dark));
    localStorage.setItem(THEME_KEY, String(!!dark));
  };
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved ? saved === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches);
  themeToggle?.addEventListener('click', () => {
    const active = localStorage.getItem(THEME_KEY) === 'true';
    applyTheme(!active);
  });

  // Tabs (About/Projects/Contact)
  const tabButtons = $$('.tab-btn');
  const sections = $$('[data-tab]');
  const showTab = (id) => {
    sections.forEach(s => s.hidden = s.getAttribute('data-tab') !== id);
    tabButtons.forEach(b => b.setAttribute('aria-selected', String(b.getAttribute('aria-controls') === id)));
  };
  tabButtons.forEach(btn => btn.addEventListener('click', () => showTab(btn.getAttribute('aria-controls'))));

  // Reveal on scroll
  const revealEls = $$('.reveal');
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries, ob)=>{
    entries.forEach(e=>{
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        ob.unobserve(e.target);
      }
    });
  }, {threshold:.12}) : null;
  revealEls.forEach(el => io ? io.observe(el) : el.classList.add('is-visible'));

  // Projects data
  const projects = [
    { id:1, title:'Gamify Yourself', type:'game', date:'2025-03-01', tags:['JS','Canvas'], details:'A tiny browser game to stay productive.' },
    { id:2, title:'Student Impact Hub', type:'web', date:'2025-02-10', tags:['HTML','CSS','UX'], details:'A hub for campus community projects.' },
    { id:3, title:'Portfolio V1', type:'web', date:'2024-11-25', tags:['Accessibility','Responsive'], details:'First version of my portfolio.' },
    { id:4, title:'CLI Buddy', type:'other', date:'2024-10-05', tags:['Node','CLI'], details:'A helper CLI that scaffolds projects.' }
  ];

  // Render projects
  const grid = $('#projectGrid');
  const empty = $('#emptyState');
  const search = $('#search');
  const filter = $('#filter');
  const sort = $('#sort');

  const renderProjects = (list=projects) => {
    if (!grid) return;
    grid.innerHTML = '';
    if (!list.length){ empty.hidden = false; return;}
    empty.hidden = true;
    for (const p of list){
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <h3>${p.title}</h3>
        <div class="meta">${new Date(p.date).toLocaleDateString()} • ${p.type}</div>
        <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="details" id="det-${p.id}">${p.details}</div>
        <div style="margin-top:8px; display:flex; gap:8px;">
          <button class="button" data-toggle="${p.id}">Details</button>
        </div>
      `;
      grid.appendChild(card);
    }
    // wire up toggle
    grid.querySelectorAll('[data-toggle]').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const id = e.currentTarget.getAttribute('data-toggle');
        const panel = document.getElementById('det-'+id);
        if (!panel) return;
        const open = panel.style.display === 'block';
        panel.style.display = open ? 'none' : 'block';
      });
    });
  };

  const compute = ()=>{
    const q = (search?.value || '').toLowerCase().trim();
    const ty = filter?.value || 'all';
    const s = sort?.value || 'date-desc';
    let arr = projects.filter(p => (ty === 'all' || p.type === ty) && (p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))));
    const cmp = {
      'title-asc': (a,b)=>a.title.localeCompare(b.title),
      'title-desc': (a,b)=>b.title.localeCompare(a.title),
      'date-asc': (a,b)=> new Date(a.date) - new Date(b.date),
      'date-desc': (a,b)=> new Date(b.date) - new Date(a.date),
    }[s];
    arr.sort(cmp);
    renderProjects(arr);
  };
  search?.addEventListener('input', compute);
  filter?.addEventListener('change', compute);
  sort?.addEventListener('change', compute);
  renderProjects(); // initial

  // GitHub API demo (data handling + error states + loading + retry)
  const ghUser = $('#ghUser');
  const ghFetch = $('#ghFetch');
  const ghStatus = $('#ghStatus');
  const ghList = $('#ghList');
  const ghError = $('#ghError');
  const ghRetry = $('#ghRetry');

  let lastUser = 'octocat';
  ghUser && (ghUser.value = lastUser);

  async function loadRepos(user){
    ghList.innerHTML = '';
    ghError.hidden = true;
    ghStatus.hidden = false;
    ghStatus.textContent = 'Loading…';
    try{
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=12`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      ghStatus.hidden = true;
      if (!data.length){
        ghList.innerHTML = `<p class="empty">No public repos for <strong>${user}</strong>.</p>`;
        return;
      }
      data.forEach(repo=>{
        const item = document.createElement('article');
        item.className = 'card';
        item.innerHTML = `
          <h3><a href="${repo.html_url}" target="_blank" rel="noreferrer">${repo.name}</a></h3>
          <div class="meta">${repo.language ?? '—'} • ★ ${repo.stargazers_count}</div>
          <p>${repo.description ?? ''}</p>
        `;
        ghList.appendChild(item);
      });
    }catch(err){
      console.error('GH error', err);
      ghStatus.hidden = true;
      ghError.hidden = false;
    }
  }
  ghFetch?.addEventListener('click', ()=>{
    lastUser = ghUser.value.trim() || 'octocat';
    loadRepos(lastUser);
  });
  ghRetry?.addEventListener('click', ()=> loadRepos(lastUser));

  // Contact form validation + toast
  const form = $('#contactForm');
  const toast = $('#toast');
  function show(e){ e.style.display='block'; }
  function hide(e){ e.style.display='none'; }

  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = $('#name'); const email = $('#email'); const msg = $('#msg');
    const eName = $('#err-name'); const eEmail = $('#err-email'); const eMsg = $('#err-msg');

    let ok = true;
    if (!name.value.trim()){ show(eName); ok = false; } else hide(eName);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){ show(eEmail); ok = false; } else hide(eEmail);
    if (msg.value.trim().length < 5){ show(eMsg); ok = false; } else hide(eMsg);

    if (!ok) return;

    // pretend to send
    setTimeout(()=>{
      toast.classList.add('show');
      setTimeout(()=> toast.classList.remove('show'), 2000);
      form.reset();
    }, 300);
  });

  form?.addEventListener('reset', ()=>{
    hide($('#err-name')); hide($('#err-email')); hide($('#err-msg'));
  });

  // AI helper (optional). If key provided, call OpenAI-compatible API; else local fallback.
  const aiPanel = document.getElementById('aiPanel');
  const openAiHelper = document.getElementById('openAiHelper');
  const aiKey = document.getElementById('aiKey');
  const aiPrompt = document.getElementById('aiPrompt');
  const aiOutput = document.getElementById('aiOutput');
  const aiGenerate = document.getElementById('aiGenerate');
  const aiClear = document.getElementById('aiClear');

  // Persist key locally
  const KEY_STORE = 'ai_key';
  if (localStorage.getItem(KEY_STORE)) aiKey.value = localStorage.getItem(KEY_STORE);
  aiKey?.addEventListener('change', ()=> localStorage.setItem(KEY_STORE, aiKey.value.trim()));

  openAiHelper?.addEventListener('click', ()=>{
    aiPanel.showModal();
    openAiHelper.setAttribute('aria-expanded', 'true');
  });
  aiPanel?.addEventListener('close', ()=> openAiHelper.setAttribute('aria-expanded', 'false'));

  aiClear?.addEventListener('click', ()=> { aiPrompt.value=''; aiOutput.textContent=''; });

  async function aiLocalFallback(prompt){
    // Very simple rule-based "assist": rewrite as friendly microcopy.
    return `Friendly suggestion based on your prompt:\n\n“${prompt.replace(/[.?!]*$/,'')}!” 🙂\n\n(This is a local fallback. Add an API key to use a real AI service.)`;
  }

  async function aiCall(prompt, key){
    if (!key) return aiLocalFallback(prompt);
    try{
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {role:'system', content:'You write short, friendly UX microcopy.'},
            {role:'user', content: prompt}
          ],
          temperature: 0.7
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      return text || '(No response text)';
    }catch(err){
      console.warn('AI error', err);
      return aiLocalFallback(prompt);
    }
  }

  aiGenerate?.addEventListener('click', async ()=>{
    const prompt = aiPrompt.value.trim() || 'Draft a friendly success message for the contact form.';
    aiOutput.textContent = 'Generating…';
    const text = await aiCall(prompt, aiKey.value.trim());
    aiOutput.textContent = text;
  });
})();
