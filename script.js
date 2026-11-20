const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v)), lerp = (a, b, t) => a + (b - a) * t;

function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

const {
  profile,
  socials,
  marqueeTech,
  extraStats,
  skills,
  education,
  projects,
  certs,
  quotes
} = PORTFOLIO_DATA;

// Badge ketersediaan freelance
const availBadge = $('#availBadge');
if (profile.availableForFreelance) {
  $('#availText').textContent = profile.availabilityText;
} else {
  availBadge.hidden = true;
}

// Set Spotify Playlist dari data.js
const spotifyFrame = $('#spotifyFrame');
if (spotifyFrame && profile.spotifyPlaylistId) {
  spotifyFrame.src = `https://open.spotify.com/embed/playlist/${encodeURIComponent(profile.spotifyPlaylistId)}?utm_source=generator&theme=0`;
}

// Suara klik bisa dimatikan & default mati
let soundEnabled = false;
try {
  soundEnabled = localStorage.getItem('clickSound') === 'true';
} catch (e) { }

const soundToggle = $('#soundToggle');
function updateSoundBtn() {
  soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
  soundToggle.setAttribute('aria-pressed', String(soundEnabled));
  soundToggle.title = soundEnabled ? 'Suara klik: Aktif' : 'Suara klik: Mati';
  soundToggle.setAttribute('aria-label', soundEnabled ? 'Matikan suara klik' : 'Aktifkan suara klik');
}
updateSoundBtn();

soundToggle.onclick = () => {
  soundEnabled = !soundEnabled;
  try { localStorage.setItem('clickSound', String(soundEnabled)); } catch (e) { }
  updateSoundBtn();
  if (soundEnabled) playClickSound();
  showToast(soundEnabled ? '🔊 Suara klik aktif' : '🔇 Suara klik dimatikan');
};

function playClickSound() {
  if (!soundEnabled) return;
  try {
    window._ac = window._ac || new (window.AudioContext || window.webkitAudioContext)();
    const audioCtx = window._ac;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch (e) { }
}

document.addEventListener('click', e => {
  if (e.target.closest('button, a, .chip, .card, .sk')) {
    playClickSound();
  }
});

const isFinePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

// Foto Profil
const me = $('#me');
const defaultAvatar = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a84ff"/><stop offset="1" stop-color="#bf5af2"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><circle cx="200" cy="190" r="78" fill="rgba(255,255,255,.85)"/><path d="M60 500c0-110 62-170 140-170s140 60 140 170z" fill="rgba(255,255,255,.85)"/></svg>');
me.src = profile.avatar;
me.onerror = () => { me.src = defaultAvatar; };
me.draggable = false;
['contextmenu', 'dragstart'].forEach(ev => me.addEventListener(ev, e => e.preventDefault()));

$('#slot').textContent = profile.name;
$('#nm').textContent = profile.name;

['💻', '🎨', '⚡', '🚀', '✨', '🧩'].forEach((e, i) => {
  const b = document.createElement('div');
  b.className = 'fb';
  b._a = [-2.7, -1.6, -0.4, 0.35, 2.8, 3.5][i];
  b.innerHTML = `<span class="glass" style="animation-delay:${-i * .7}s">${esc(e)}</span>`;
  $('#fl').appendChild(b);
});

$('#soc').innerHTML = socials.map(s =>
  `<a class="chip" style="text-decoration:none" target="_blank" rel="noopener noreferrer" href="${esc(s.url)}">${s.icon} ${esc(s.name)}</a>`
).join('');

$('#mqt').innerHTML = [...marqueeTech, ...marqueeTech].map(t => `<span>${esc(t)}</span>`).join('');

// Kanvas Partikel
const cv = $('#cv'), c2 = cv.getContext('2d');
let pts = [];
let lastCanvasWidth = 0;
let canvasRafId = null;

function isLightMode() {
  const t = document.documentElement.dataset.theme;
  if (t === 'light') return true;
  if (t === 'dark') return false;
  return matchMedia('(prefers-color-scheme: light)').matches;
}

function initParticles(force = false) {
  const w = innerWidth, h = innerHeight;
  cv.width = w;
  cv.height = h;
  if (force || Math.abs(w - lastCanvasWidth) > 50 || !pts.length) {
    lastCanvasWidth = w;
    pts = Array.from({ length: Math.round(w / 14) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.5,
      s: Math.random() * 0.4 + 0.1,
      t: Math.random() * 6
    }));
  }
}

initParticles(true);
addEventListener('resize', () => initParticles(false));

function drawParticles() {
  if (document.hidden) {
    canvasRafId = null;
    return;
  }
  c2.clearRect(0, 0, cv.width, cv.height);
  const particleColor = isLightMode() ? '#12122a' : '#ffffff';
  pts.forEach(q => {
    q.t += 0.02;
    q.y -= q.s;
    if (q.y < 0) q.y = cv.height;
    if (q.x > cv.width) q.x = Math.random() * cv.width;
    c2.globalAlpha = (isLightMode() ? 0.18 : 0.25) + 0.45 * Math.abs(Math.sin(q.t));
    c2.fillStyle = particleColor;
    c2.beginPath();
    c2.arc(q.x, q.y, q.r, 0, Math.PI * 2);
    c2.fill();
  });
  canvasRafId = requestAnimationFrame(drawParticles);
}
canvasRafId = requestAnimationFrame(drawParticles);

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && !canvasRafId) {
    canvasRafId = requestAnimationFrame(drawParticles);
  }
});

// Scroll & Hero Animation
let txH = 0, padB = 120;
function measure() {
  txH = $('#heroTx').offsetHeight;
  padB = parseFloat(getComputedStyle($('.stage')).paddingBottom) || 120;
}

function onScroll() {
  const vh = innerHeight, vw = innerWidth, y = scrollY;
  const p = clamp(y / (vh * 0.85), 0, 1), e = 1 - Math.pow(1 - p, 3);
  const h0 = clamp(vh - 64 - txH - padB - 24, 200, Math.min(vw * 0.78, 380) * 1.25), w0 = h0 / 1.25, x0 = (vw - w0) / 2, y0 = 64;
  const sz = 44, x1 = 12, y1 = 12;
  me.style.width = lerp(w0, sz, e) + 'px';
  me.style.height = lerp(h0, sz, e) + 'px';
  me.style.left = lerp(x0, x1, e) + 'px';
  me.style.top = lerp(y0, y1, e) + 'px';
  me.style.borderRadius = lerp(44, 22, e) + 'px';

  const sl = $('#slot'), nm = $('#nm'), sr = sl.getBoundingClientRect(), f0 = parseFloat(getComputedStyle(sl).fontSize), s1 = 18 / f0;
  nm.style.fontSize = f0 + 'px';
  const sc = lerp(1, s1, e), th = nm.offsetHeight * sc;
  nm.style.transform = `translate(${lerp(sr.left, 66, e)}px, ${lerp(sr.top, 34 - th / 2, e)}px) scale(${sc})`;

  const bx = x0 + w0 / 2, by = y0 + h0 / 2;
  $$('.fb').forEach(b => {
    const a = b._a, X = clamp(bx + Math.cos(a) * (w0 * 0.62 + 28) - 26, 6, vw - 58), Y = by + Math.sin(a) * (h0 * 0.5 + 6) - 26;
    b.style.transform = `translate(${X}px, ${Y}px)`;
    b.style.opacity = 1 - clamp(p * 2.5, 0, 1);
  });
  me.style.transform = `rotate(${Math.sin(p * Math.PI) * -4}deg)`;
  $('#heroTx').style.opacity = 1 - clamp(p * 2, 0, 1);

  const max = document.documentElement.scrollHeight - vh;
  $('#bar').style.width = (max > 0 ? (y / max * 100) : 0) + '%';

  const secs = ['home', 'about', 'skills', 'music-section', 'work', 'exp', 'contact'];
  let cur = 0;
  secs.forEach((id, i) => {
    if ($('#' + id) && $('#' + id).getBoundingClientRect().top < vh * 0.4) cur = i;
  });
  $$('#dock a').forEach((a, i) => a.classList.toggle('act', i === cur));
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);

// Statistik otomatis
const projectCount = projects.filter(p => p.category === 'Proyek').length;
const certCount = certs.length;
const computedStats = [
  { value: projectCount, label: 'Proyek & tugas' },
  { value: certCount, label: 'Sertifikat & seminar' },
  ...extraStats
];

$('#statsGrid').innerHTML = computedStats.map(st => `
  <div class="glass stat rv"><b data-n="${esc(st.value)}">0</b><span>${esc(st.label)}</span></div>
`).join('');

// Keahlian
function getSkillLevel(percent) {
  if (percent >= 90) return 'Mahir (Expert)';
  if (percent >= 80) return 'Menengah Atas (Advanced)';
  if (percent >= 70) return 'Menengah (Intermediate)';
  return 'Dasar (Beginner)';
}

$('#skl').innerHTML = skills.map((s, i) => `
  <div class="glass sk rv" data-index="${i}" role="button" tabindex="0" aria-label="Lihat detail keahlian ${esc(s.name)}">
    <div class="ring" data-p="${esc(s.percent)}"><span>0%</span></div>
    ${esc(s.name)}
  </div>
`).join('');

// Portfolio & Arsip
const allPortfolioItems = [
  ...projects,
  {
    icon: '🎓',
    title: 'Riwayat Pendidikan',
    category: 'Pendidikan',
    desc: 'Dari SD hingga kuliah di Universitas Mikroskil. Ketuk untuk melihat daftarnya.',
    tags: [],
    repo: '',
    demo: '',
    screenshot: '',
    items: education.map(ed => ({
      icon: ed.icon,
      title: ed.title,
      desc: ed.desc,
      tags: ed.tags
    }))
  },
  {
    icon: '🏅',
    title: 'Sertifikat & Seminar',
    category: 'Sertifikat',
    desc: 'Sertifikat partisipasi seminar dan webinar. Ketuk lalu geser untuk melihat semuanya.',
    tags: [],
    repo: '',
    demo: '',
    screenshot: certs.length ? certs[certs.length - 1].img : '',
    items: certs.map(c => ({
      icon: '🏅',
      title: c.title,
      desc: c.desc,
      tags: [c.issuer, c.date],
      img: c.img
    }))
  }
];

const gr = ['#0a84ff,#5e5ce6', '#ff375f,#ff9f0a', '#30d158,#0a84ff', '#bf5af2,#ff375f'];

function certCarousel(items) {
  const slides = items.map(it => `
    <figure class="cz-slide">
      <a href="${esc(it.img)}" target="_blank" rel="noopener noreferrer" title="Buka gambar penuh">
        <img src="${esc(it.img)}" alt="${esc(it.title)}" loading="lazy" draggable="false">
      </a>
      <figcaption>
        <h4>${esc(it.title)}</h4>
        <p>${esc(it.desc)}</p>
        <div class="chips">${it.tags.map(m => `<span class="chip">${esc(m)}</span>`).join('')}</div>
      </figcaption>
    </figure>`).join('');
  const multi = items.length > 1;
  return `<div class="cz">
    <div class="cz-track" id="czTrack" tabindex="0" aria-label="Daftar sertifikat, geser untuk melihat berikutnya">${slides}</div>
    ${multi ? `<button type="button" class="cz-nav prev" aria-label="Sebelumnya">‹</button><button type="button" class="cz-nav next" aria-label="Berikutnya">›</button>
    <div class="cz-dots">${items.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>
    <div class="cz-hint">Geser ↔ · <span id="czCount">1</span> / ${items.length}</div>` : ''}
  </div>`;
}

function initCarousel() {
  const tr = $('#czTrack');
  if (!tr) return;
  const dots = $$('.cz-dots i'), cnt = $('#czCount'), prev = $('.cz-nav.prev'), next = $('.cz-nav.next');
  const idx = () => Math.round(tr.scrollLeft / tr.clientWidth);
  const upd = () => {
    const i = idx();
    dots.forEach((d, k) => d.classList.toggle('on', k === i));
    if (cnt) cnt.textContent = i + 1;
    if (prev) prev.disabled = i <= 0;
    if (next) next.disabled = i >= tr.children.length - 1;
  };
  tr.addEventListener('scroll', upd, { passive: true });
  if (prev) prev.onclick = () => tr.scrollBy({ left: -tr.clientWidth, behavior: 'smooth' });
  if (next) next.onclick = () => tr.scrollBy({ left: tr.clientWidth, behavior: 'smooth' });
  dots.forEach((d, k) => d.onclick = () => tr.scrollTo({ left: k * tr.clientWidth, behavior: 'smooth' }));
  upd();
}

function applyTilt(el) {
  if (!isFinePointer) return;
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-4px)`;
  });
  el.addEventListener('pointerleave', () => el.style.transform = '');
}

function renderProjects(filter = 'Semua', search = '') {
  const container = $('#prj');
  const q = search.trim().toLowerCase();
  const filtered = allPortfolioItems.filter(p => {
    const matchCat = filter === 'Semua' || p.category === filter;
    const matchSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q)) ||
      (p.items || []).some(it => (it.title + ' ' + it.desc).toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  if (!filtered.length) {
    container.innerHTML = `<p class="empty glass">Tidak ada hasil untuk “${esc(search)}”. Coba kata kunci lain.</p>`;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const originalIdx = allPortfolioItems.indexOf(p);
    const thumbMedia = p.screenshot
      ? `<img src="${esc(p.screenshot)}" alt="${esc(p.title)}" loading="lazy">`
      : esc(p.icon);
    return `
      <div class="glass card rv in" data-c="${esc(p.category)}" data-i="${originalIdx}" role="button" tabindex="0" aria-label="Buka detail ${esc(p.title)}">
        <div class="th" style="background:linear-gradient(135deg,${gr[originalIdx % 4]})">${thumbMedia}</div>
        <div class="t">
          <span class="tag">${esc(p.category)}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.desc)}</p>
          ${p.items ? `<span class="more">${p.items.length} item · lihat daftar ›</span>` : ''}
        </div>
      </div>
    `;
  }).join('');

  $$('#prj .card').forEach(applyTilt);
}

renderProjects();

const cats = ['Semua', 'Proyek', 'Pendidikan', 'Hobi', 'CV', 'Sertifikat'];
$('#flt').innerHTML = cats.map((c, i) => `<button type="button" class="chip ${i ? '' : 'act'}">${esc(c)}</button>`).join('');

let activeCategory = 'Semua';
let searchQuery = '';

$$('#flt .chip').forEach(b => b.onclick = () => {
  $$('#flt .chip').forEach(x => x.classList.remove('act'));
  b.classList.add('act');
  activeCategory = b.textContent;
  renderProjects(activeCategory, searchQuery);
});

$('#searchPrj').oninput = e => {
  searchQuery = e.target.value;
  renderProjects(activeCategory, searchQuery);
};

// Timeline Perjalanan
$('#tl').innerHTML = education.map((ed, i) => `
  <div class="glass rv ${i % 2 ? 'r' : 'l'}">
    <small>${esc(ed.year)}</small>
    <h3>${esc(ed.timelineTitle)}</h3>
    <p>${esc(ed.desc)}</p>
  </div>
`).join('');

// Kutipan
let ti = 0;
let quotePaused = false;
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const tstBox = $('#tstBox');

$('#dots').innerHTML = quotes.map((_, i) => `<i data-i="${i}" role="button" tabindex="0" aria-label="Kutipan ${i + 1}"></i>`).join('');

function showQuote(i) {
  ti = i;
  const q = $('#tq');
  q.style.opacity = 0;
  q.style.transform = 'translateY(12px)';
  setTimeout(() => {
    q.textContent = '“' + quotes[i].text + '”';
    $('#ta').textContent = quotes[i].author;
    q.style.opacity = 1;
    q.style.transform = 'none';
  }, prefersReducedMotion ? 0 : 300);
  $$('#dots i').forEach((d, k) => d.classList.toggle('on', k === i));
}

$$('#dots i').forEach(d => {
  d.onclick = () => showQuote(+d.dataset.i);
  d.onkeydown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showQuote(+d.dataset.i);
    }
  };
});

tstBox.addEventListener('mouseenter', () => { quotePaused = true; });
tstBox.addEventListener('mouseleave', () => { quotePaused = false; });
tstBox.addEventListener('focusin', () => { quotePaused = true; });
tstBox.addEventListener('focusout', () => { quotePaused = false; });

showQuote(0);
if (!prefersReducedMotion && quotes.length > 1) {
  setInterval(() => {
    if (!quotePaused && !document.hidden) {
      showQuote((ti + 1) % quotes.length);
    }
  }, 5000);
}

// IntersectionObserver
const io = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  const t = en.target;
  setTimeout(() => t.classList.add('in'), (+t.dataset.d || 0));

  const n = t.querySelector('[data-n]');
  if (n) {
    const to = +n.dataset.n, t0 = performance.now();
    (function f(now) {
      const k = clamp((now - t0) / 1600, 0, 1);
      n.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(f);
    })(t0);
  }

  const r = t.querySelector('.ring');
  if (r) {
    const to = +r.dataset.p, t0 = performance.now();
    (function f(now) {
      const k = clamp((now - t0) / 1400, 0, 1), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
      r.style.setProperty('--p', v);
      r.firstChild.textContent = v + '%';
      if (k < 1) requestAnimationFrame(f);
    })(t0);
  }
  io.unobserve(t);
}), { threshold: 0.15 });

$$('.rv').forEach((el, i) => {
  el.dataset.d = (i % 4) * 90;
  io.observe(el);
});

$$('.sk, .stat').forEach(applyTilt);

// Dock Magnification
const dock = $('#dock');
if (isFinePointer) {
  dock.addEventListener('pointermove', e => $$('#dock a').forEach(a => {
    const r = a.getBoundingClientRect(), d = Math.abs(e.clientX - (r.left + r.width / 2));
    a.style.transform = `scale(${1 + clamp(1 - d / 90, 0, 1) * 0.6})`;
  }));
  dock.addEventListener('pointerleave', () => $$('#dock a').forEach(a => a.style.transform = ''));
}

// Bottom Sheet Dialog
const sheet = $('#sheet');
const sheetBox = $('#sheet .glass');
const sList = document.createElement('div');
sList.id = 'sList';
$('#sD').after(sList);
let lastFocusedElement = null;

function openSheet(triggerEl) {
  lastFocusedElement = triggerEl || document.activeElement;
  sheet.classList.add('open');
  sheet.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => {
    const firstFocusable = sheetBox.querySelector('a[href]:not([style*="display: none"]), button:not([disabled]), [tabindex="0"]');
    (firstFocusable || sheetBox).focus();
  });
}

function closeSheet() {
  if (!sheet.classList.contains('open')) return;
  sheet.classList.remove('open');
  sheet.setAttribute('aria-hidden', 'true');
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

function handleOpenProjectCard(cardEl) {
  const p = allPortfolioItems[cardEl.dataset.i];
  if (!p) return;
  const img = $('#sImg');
  const isCert = p.category === 'Sertifikat';
  const isCV = p.category === 'CV';
  const isVisual = isCert || isCV;
  const isGroup = Array.isArray(p.items);
  const href = p.repo || (isVisual ? p.screenshot : '');
  const lk = $('#sLink');
  const demoBtn = $('#sDemo');

  $('#sE').textContent = isVisual ? '' : p.icon;
  $('#sE').style.display = isVisual ? 'none' : '';

  const isCertGroup = isCert && isGroup;
  img.hidden = !p.screenshot || isGroup;
  if (p.screenshot && !isGroup) {
    img.src = p.screenshot;
    img.alt = p.title;
  }

  $('#sT').textContent = p.title + (isVisual || isGroup ? '' : ` (${p.category})`);
  $('#sD').textContent = p.desc;

  if (!isGroup && p.demo) {
    demoBtn.style.display = 'block';
    demoBtn.href = p.demo;
  } else {
    demoBtn.style.display = 'none';
  }

  lk.style.display = !isGroup && href && href !== '#' && (isVisual || p.category === 'Proyek') ? 'block' : 'none';
  lk.textContent = isCert ? 'Buka Sertifikat' : isCV ? 'Unduh CV' : 'Repositori GitHub';
  lk.href = href;
  if (isCV) {
    lk.setAttribute('download', 'CV-Andrean-Rajagukguk.jpg');
  } else {
    lk.removeAttribute('download');
  }

  sList.innerHTML = isCertGroup
    ? certCarousel(p.items)
    : isGroup
      ? p.items.map(it => `
          <div class="it">
            <div class="ie">${esc(it.icon)}</div>
            <div class="ib">
              <h4>${esc(it.title)}</h4>
              <p>${esc(it.desc)}</p>
              <div class="chips">${it.tags.map(m => `<span class="chip">${esc(m)}</span>`).join('')}</div>
            </div>
          </div>`).join('')
      : '';

  $('#sTech').innerHTML = (p.tags || []).map(tag =>
    `<span class="chip" style="font-size:.8rem; padding:4px 12px;">${esc(tag)}</span>`
  ).join('');

  openSheet(cardEl);
  if (isCertGroup) initCarousel();
}

function handleOpenSkillCard(cardEl) {
  const s = skills[cardEl.dataset.index];
  if (!s) return;
  const level = getSkillLevel(s.percent);
  $('#sE').textContent = '⚡';
  $('#sE').style.display = '';
  $('#sImg').hidden = true;
  $('#sT').textContent = `${s.name} (${s.percent}% Kemahiran)`;
  $('#sD').textContent = s.desc;
  $('#sDemo').style.display = 'none';
  $('#sLink').style.display = 'none';
  sList.innerHTML = '';
  $('#sTech').innerHTML = `<span class="chip" style="font-size:.8rem; padding:4px 12px; background:var(--a); color:#fff;">Tingkat: ${esc(level)}</span>`;
  openSheet(cardEl);
}

$('#prj').addEventListener('click', e => {
  const c = e.target.closest('.card');
  if (c) handleOpenProjectCard(c);
});

$('#prj').addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    const c = e.target.closest('.card');
    if (c) {
      e.preventDefault();
      handleOpenProjectCard(c);
    }
  }
});

$('#skl').addEventListener('click', e => {
  const card = e.target.closest('.sk');
  if (card) handleOpenSkillCard(card);
});

$('#skl').addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    const card = e.target.closest('.sk');
    if (card) {
      e.preventDefault();
      handleOpenSkillCard(card);
    }
  }
});

$('#sC').onclick = closeSheet;
sheet.onclick = e => { if (e.target.id === 'sheet') closeSheet(); };

let toastTimer;
function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3600);
}

// Listener keydown terpadu
addEventListener('keydown', e => {
  if (!sheet.classList.contains('open')) return;

  if (e.key === 'Escape') {
    closeSheet();
    return;
  }

  const tr = $('#czTrack');
  if (tr) {
    if (e.key === 'ArrowRight') tr.scrollBy({ left: tr.clientWidth, behavior: 'smooth' });
    if (e.key === 'ArrowLeft') tr.scrollBy({ left: -tr.clientWidth, behavior: 'smooth' });
  }

  if (e.key === 'Tab') {
    const focusables = [...sheetBox.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')]
      .filter(el => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// Form kontak
$('#frm').onsubmit = async e => {
  e.preventDefault();
  const form = e.target;
  const btn = $('#submitBtn');
  const d = new FormData(form);

  if (d.get('_gotcha')) {
    form.reset();
    return showToast('✨ Pesan berhasil dikirim. Terima kasih!');
  }

  btn.textContent = 'Mengirim…';
  btn.disabled = true;

  try {
    const res = await fetch(profile.formEndpoint, {
      method: 'POST',
      body: d,
      headers: { Accept: 'application/json' }
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      showToast('✨ Pesan berhasil dikirim. Terima kasih!');
      form.reset();
    } else {
      const errMsg = data.errors ? data.errors.map(err => err.message).join(', ') : 'Periksa endpoint Formspree kamu.';
      showToast('⚠️ Gagal mengirim: ' + errMsg);
    }
  } catch {
    showToast('⚠️ Tidak ada koneksi internet. Coba lagi.');
  }

  btn.textContent = 'Kirim Pesan Sekarang';
  btn.disabled = false;
};

// Tema Terang / Gelap
const root = document.documentElement;
try {
  const s = localStorage.getItem('theme');
  if (s) root.dataset.theme = s;
} catch (e) { }

$('#theme').onclick = () => {
  const cur = root.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const next = cur === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) { }
};

function fitHero() {
  measure();
  $('.hero').style.height = (innerHeight * 1.1 + $('.intro > div').offsetHeight + 60) + 'px';
  onScroll();
}
fitHero();
addEventListener('resize', fitHero);
addEventListener('load', fitHero);

onScroll();