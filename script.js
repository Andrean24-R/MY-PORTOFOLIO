const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v)), lerp = (a, b, t) => a + (b - a) * t;

const playlist = [
  { title: "Typeku", artist: "Fani Rahmansyah", src: "musik/typeku.mp3" },
  { title: "Hrny", artist: "Bukan WG", src: "musik/hrny.mp3" },
  { title: "Ain't In LA", artist: "Adéla", src: "musik/ADÉLA - Ain't In LA.mp3" },
  { title: "Bad Blood", artist: "Taylor Swift ft. Kendrick Lamar", src: "musik/Taylor Swift - Bad Blood ft. Kendrick Lamar.mp3" },
  { title: "Songon Biang Na Hodal", artist: "Pangalo!", src: "musik/songon biang na hodal.mp3" },
  { title: "The Cure", artist: "Olivia Rodrigo", src: "musik/the cure.mp3" }
];

let currentTrackIndex = 0;
const audio = new Audio(playlist[currentTrackIndex].src);
audio.preload = 'metadata';

const playBtn = $('#playBtn');
const prevBtn = $('#prevBtn');
const nextBtn = $('#nextBtn');
const currentTitle = $('#currentTitle');
const currentArtist = $('#currentArtist');
const musicWidget = $('#musicWidget');
const cdToggle = $('#cdToggle');
const cdDisc = $('#cdDisc');
const playlistToggleBtn = $('#playlistToggleBtn');
const playlistContainer = $('#playlistContainer');

function renderPlaylist() {
  playlistContainer.innerHTML = playlist.map((track, i) => `
    <div class="playlist-item ${i === currentTrackIndex ? 'active' : ''}" data-index="${i}">
      <span>${track.title}</span>
      <small style="opacity:0.6">${track.artist}</small>
    </div>
  `).join('');
}
renderPlaylist();

function updateTrackInfo() {
  currentTitle.textContent = playlist[currentTrackIndex].title;
  currentArtist.textContent = playlist[currentTrackIndex].artist;
  audio.src = playlist[currentTrackIndex].src;
  $$('.playlist-item').forEach((item, i) => {
    item.classList.toggle('active', i === currentTrackIndex);
  });
}

let isPlaying = false;

function togglePlay() {
  if (isPlaying) {
    audio.pause();
    playBtn.textContent = '▶';
    cdDisc.classList.remove('playing');
    isPlaying = false;
  } else {
    audio.play().then(() => {
      playBtn.textContent = '⏸';
      cdDisc.classList.add('playing');
      isPlaying = true;
    }).catch(() => {
    });
  }
}

playBtn.onclick = (e) => { e.stopPropagation(); togglePlay(); };
cdToggle.onclick = (e) => { e.stopPropagation(); togglePlay(); };

nextBtn.onclick = (e) => {
  e.stopPropagation();
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  updateTrackInfo();
  if (isPlaying) {
    audio.play().catch(() => { });
    cdDisc.classList.add('playing');
  }
};

prevBtn.onclick = (e) => {
  e.stopPropagation();
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  updateTrackInfo();
  if (isPlaying) {
    audio.play().catch(() => { });
    cdDisc.classList.add('playing');
  }
};

playlistContainer.onclick = (e) => {
  const item = e.target.closest('.playlist-item');
  if (!item) return;
  currentTrackIndex = +item.dataset.index;
  updateTrackInfo();
  audio.play().then(() => {
    playBtn.textContent = '⏸';
    cdDisc.classList.add('playing');
    isPlaying = true;
  }).catch(() => { });
  musicWidget.classList.remove('playlist-open');
};

playlistToggleBtn.onclick = (e) => {
  e.stopPropagation();
  musicWidget.classList.toggle('playlist-open');
};

function playClickSound() {
  try {
    window._ac = window._ac || new (window.AudioContext || window.webkitAudioContext)(); const audioCtx = window._ac;
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

const cursor = $('#custom-cursor');
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
addEventListener('pointermove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  const g = $('#glow'); g.style.left = mouseX + 'px'; g.style.top = mouseY + 'px';
});
(function renderCursor() {
  cursorX = lerp(cursorX, mouseX, 0.2);
  cursorY = lerp(cursorY, mouseY, 0.2);
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(renderCursor);
})();

const me = $('#me');
const defaultAvatar = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a84ff"/><stop offset="1" stop-color="#bf5af2"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><circle cx="200" cy="190" r="78" fill="rgba(255,255,255,.85)"/><path d="M60 500c0-110 62-170 140-170s140 60 140 170z" fill="rgba(255,255,255,.85)"/></svg>');
me.src = 'DSCF2403.jpg';
me.onerror = () => { me.src = defaultAvatar; };

try { localStorage.removeItem('foto'); } catch (e) { }
me.draggable = false;
['contextmenu', 'dragstart'].forEach(ev => me.addEventListener(ev, e => e.preventDefault()));

const NAME = 'Andrean Rajagukguk';
$('#slot').textContent = NAME;
$('#nm').textContent = NAME;

['💻', '🎨', '⚡', '🚀', '✨', '🧩'].forEach((e, i) => {
  const b = document.createElement('div');
  b.className = 'fb';
  b._a = [-2.7, -1.6, -0.4, 0.35, 2.8, 3.5][i];
  b.innerHTML = '<span class="glass" style="animation-delay:' + (-i * .7) + 's">' + e + '</span>';
  $('#fl').appendChild(b);
});

const igSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.51"></line></svg>';
const ghSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>';
const ttSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>';
const waSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>';

const SOCIALS = [
  [igSvg, 'Instagram', 'https://www.instagram.com/hisar_r_?mdxt=MWJseGozZ2FnaTFyNA=='],
  [ghSvg, 'GitHub', 'https://github.com/Andrean24-R'],
  [ttSvg, 'TikTok', 'https://www.tiktok.com/@not_here_2408?_r=1&_t=ZS-9BSTMjTU6FD'],
  [waSvg, 'WhatsApp', 'https://wa.me/6281373284741'],
];
$('#soc').innerHTML = SOCIALS.map(s => '<a class="chip" style="text-decoration:none" target="_blank" rel="noopener" href="' + s[2] + '">' + s[0] + ' ' + s[1] + '</a>').join('');

const tech = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Figma', 'Git', 'UI/UX', 'Information Systems', 'IT Governance'];
$('#mqt').innerHTML = [...tech, ...tech].map(t => '<span>' + t + '</span>').join('');

const cv = $('#cv'), c2 = cv.getContext('2d'); let pts = [];
function rs() {
  cv.width = innerWidth; cv.height = innerHeight;
  pts = Array.from({ length: Math.round(innerWidth / 14) }, () => ({
    x: Math.random() * cv.width, y: Math.random() * cv.height,
    r: Math.random() * 1.6 + .4, s: Math.random() * .4 + .1, t: Math.random() * 6
  }));
}
rs(); addEventListener('resize', rs);
(function dr() {
  c2.clearRect(0, 0, cv.width, cv.height);
  pts.forEach(q => {
    q.t += .02; q.y -= q.s; if (q.y < 0) q.y = cv.height;
    c2.globalAlpha = .25 + .5 * Math.abs(Math.sin(q.t));
    c2.fillStyle = '#fff'; c2.beginPath(); c2.arc(q.x, q.y, q.r, 0, 7); c2.fill();
  });
  requestAnimationFrame(dr);
})();

let txH = 0, padB = 120;
function measure() {
  txH = $('#heroTx').offsetHeight;
  padB = parseFloat(getComputedStyle($('.stage')).paddingBottom) || 120;
}
function onScroll() {
  const vh = innerHeight, vw = innerWidth, y = scrollY;
  const p = clamp(y / (vh * .85), 0, 1), e = 1 - Math.pow(1 - p, 3);
  const h0 = clamp(vh - 64 - txH - padB - 24, 200, Math.min(vw * .78, 380) * 1.25), w0 = h0 / 1.25, x0 = (vw - w0) / 2, y0 = 64;
  const sz = 44, x1 = 12, y1 = 12;
  me.style.width = lerp(w0, sz, e) + 'px'; me.style.height = lerp(h0, sz, e) + 'px';
  me.style.left = lerp(x0, x1, e) + 'px'; me.style.top = lerp(y0, y1, e) + 'px';
  me.style.borderRadius = lerp(44, 22, e) + 'px';

  const sl = $('#slot'), nm = $('#nm'), sr = sl.getBoundingClientRect(), f0 = parseFloat(getComputedStyle(sl).fontSize), s1 = 18 / f0;
  nm.style.fontSize = f0 + 'px';
  const sc = lerp(1, s1, e), th = nm.offsetHeight * sc;
  nm.style.transform = `translate(${lerp(sr.left, 66, e)}px, ${lerp(sr.top, 34 - th / 2, e)}px) scale(${sc})`;

  const bx = x0 + w0 / 2, by = y0 + h0 / 2;
  $$('.fb').forEach(b => {
    const a = b._a, X = clamp(bx + Math.cos(a) * (w0 * .62 + 28) - 26, 6, vw - 58), Y = by + Math.sin(a) * (h0 * .5 + 6) - 26;
    b.style.transform = `translate(${X}px, ${Y}px)`;
    b.style.opacity = 1 - clamp(p * 2.5, 0, 1);
  });
  me.style.transform = `rotate(${Math.sin(p * Math.PI) * -4}deg)`;
  $('#heroTx').style.opacity = 1 - clamp(p * 2, 0, 1);

  const max = document.documentElement.scrollHeight - vh;
  $('#bar').style.width = (y / max * 100) + '%';

  const secs = ['home', 'about', 'skills', 'music-section', 'work', 'exp', 'contact']; let cur = 0;
  secs.forEach((id, i) => { if ($('#' + id) && $('#' + id).getBoundingClientRect().top < vh * .4) cur = i; });
  $$('#dock a').forEach((a, i) => a.classList.toggle('act', i === cur));
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);

const skillList = [
  ['HTML', 95, 'Hasil AI.'],
  ['CSS', 90, 'Hasil AI.'],
  ['JavaScript', 88, 'Hasil AI.'],
  ['UI/UX', 80, 'Hasil AI.'],
  ['IT Audit', 75, 'Hasil AI.'],
  ['Node.js', 70, 'Hasil AI.']
];

$('#skl').innerHTML = skillList.map((s, i) => `
  <div class="glass sk rv" data-index="${i}">
    <div class="ring" data-p="${s[1]}"><span>0%</span></div>
    ${s[0]}
  </div>
`).join('');

const GITHUB_USER = 'Andrean24-R';
const CV_FILE = 'cv/CV-Andrean-Rajagukguk.jpg';
const repoUrl = name => 'https://github.com/' + GITHUB_USER + (name ? '/' + name : '?tab=repositories');

const prj = [
  ['🛍️', 'PulihDigital', 'Proyek', 'Simulasi interaktif verifikasi pesan dan file APK mencurigakan.', ['React', 'Tailwind', 'Security'], repoUrl('KELOMPOK-KOMINFO')],
  ['📱', 'Web katalog Sparepart', 'Proyek', 'Web belanja kebutuhan otomotif.', ['JavaScript', 'HTML5', 'CSS Grid'], repoUrl('')],
  ['📄', 'Curriculum Vitae (CV)', 'CV', 'Curriculum Vitae Andrean Rajagukguk — ringkasan profil, riwayat pendidikan, pengalaman proyek, dan keahlian teknis.', ['Universitas Mikroskil', 'Information Systems', '2026'], CV_FILE, CV_FILE],
  ['🎓', 'Riwayat Pendidikan', 'Pendidikan', 'Dari SD hingga kuliah di Universitas Mikroskil. Ketuk untuk melihat daftarnya.', [], '', null, [
    { e: '🎓', t: 'Universitas Mikroskil (S1)', d: 'Sedang berkuliah di Mikroskil dengan program studi Information Systems (Sistem Informasi). Mulai belajar IT dan memiliki sertifikat SAP.', m: ['Information Systems', '2024 - Sekarang'] },
    { e: '🏫', t: 'SMA Santa Maria Tarutung', d: 'Jurusan IPA / MIPA. Pernah ikut pembuatan film dokumenter dan olimpiade informatika.', m: ['IPA / MIPA', '2021 - 2024'] },
    { e: '📘', t: 'SMP Santa Maria Tarutung', d: 'Melanjutkan pendidikan di SMP Swasta.', m: ['2018 - 2021'] },
    { e: '✏️', t: 'SD Negeri 178492 Pagarbatu', d: 'Awal pembelajaran dimulai di sini.', m: ['2012 - 2018'] }
  ]],
  ['🎸', 'Hobi & Minat', 'Hobi', 'Musik, kopi, dan game strategi. Ketuk untuk melihat daftarnya.', [], '', null, [
    { e: '🎸', t: 'Bermain Gitar & Musik', d: 'Menyukai eksplorasi chord instrumen (seperti akor BM), aransemen akustik, dan menikmati ketukan ritmis lofi.', m: ['Musik', 'Kreativitas', 'Relaksasi'] },
    { e: '☕', t: 'Eksplorasi Kopi & Ngoding', d: 'Menikmati meracik cangkir kopi manual brew sambil membangun baris kode aplikasi web di malam hari.', m: ['Kopi', 'Lifestyle'] },
    { e: '🎮', t: 'Game Strategi & Puzzle', d: 'Bermain game seperti Mobile Legends dan Valorant.', m: ['Strategi dan kerjasama'] }
  ]]
];
const gr = ['#0a84ff,#5e5ce6', '#ff375f,#ff9f0a', '#30d158,#0a84ff', '#bf5af2,#ff375f'];

const certs = [
  {
    title: 'Career Talk: Be Seen, Be Known, Be Chosen',
    issuer: 'Universitas Mikroskil',
    date: '22 Mei 2026',
    img: 'sertifikat/career-talk-mikroskil.jpg',
    desc: 'Career Seminar bersama PT Capella Dinamik Nusantara.'
  },
  {
    title: 'Webinar Nasional: Visibilitas & Dampak Publikasi Ilmiah',
    issuer: 'Edukarya',
    date: '18–19 Nov 2026',
    img: 'sertifikat/webinar-publikasi-ilmiah.jpg',
    desc: 'Peserta webinar nasional via Zoom & YouTube (20 JP): penguatan sitasi, profil peneliti, dan reputasi akademik.'
  }
];
prj.push(['🏅', 'Sertifikat & Seminar', 'Sertifikat',
  'Sertifikat partisipasi seminar dan webinar. Ketuk lalu geser untuk melihat semuanya.', [], '',
  certs[certs.length - 1].img,
  certs.map(c => ({ e: '🏅', t: c.title, d: c.desc, m: [c.issuer, c.date], img: c.img }))]);

function certCarousel(items) {
  const slides = items.map(it => `
    <figure class="cz-slide">
      <a href="${it.img}" target="_blank" rel="noopener" title="Buka gambar penuh"><img src="${it.img}" alt="${it.t}" loading="lazy" draggable="false"></a>
      <figcaption>
        <h4>${it.t}</h4>
        <p>${it.d}</p>
        <div class="chips">${it.m.map(m => `<span class="chip">${m}</span>`).join('')}</div>
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
  const tr = $('#czTrack'); if (!tr) return;
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
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    el.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-4px)`;
  });
  el.addEventListener('pointerleave', () => el.style.transform = '');
}

function renderProjects(filter = 'Semua', search = '') {
  const container = $('#prj');
  const filtered = prj.filter((p) => {
    const matchCat = filter === 'Semua' || p[2] === filter;
    const matchSearch = p[1].toLowerCase().includes(search.toLowerCase()) || p[3].toLowerCase().includes(search.toLowerCase()) ||
      (p[7] || []).some(it => (it.t + ' ' + it.d).toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  container.innerHTML = !filtered.length ? '<p class="empty glass">Tidak ada hasil untuk “' + search.replace(/[<>&]/g, '') + '”. Coba kata kunci lain.</p>' : filtered.map((p) => {
    const originalIdx = prj.indexOf(p);
    return `
      <div class="glass card rv in" data-c="${p[2]}" data-i="${originalIdx}">
        <div class="th" style="background:linear-gradient(135deg,${gr[originalIdx % 4]})">${p[6] ? `<img src="${p[6]}" alt="${p[1]}" loading="lazy">` : p[0]}</div>
        <div class="t">
          <span class="tag">${p[2]}</span>
          <h3>${p[1]}</h3>
          <p>${p[3]}</p>
          ${p[7] ? `<span class="more">${p[7].length} item · lihat daftar ›</span>` : ''}
        </div>
      </div>
    `;
  }).join('');

  $$('#prj .card').forEach(applyTilt);
}

renderProjects();

const cats = ['Semua', 'Proyek', 'Pendidikan', 'Hobi', 'CV', 'Sertifikat'];
$('#flt').innerHTML = cats.map((c, i) => `<button class="chip ${i ? '' : 'act'}">${c}</button>`).join('');

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

const exp = [
  ['2024', 'Sedang Berkuliah di Universitas Mikroskil', 'Mulai belajar IT dan memiliki sertifikat SAP.'],
  ['2021', 'SMA Santa Maria Tarutung', 'Masuk Jurusan IPA/MIPA, dan pernah ikut dalam pembuatan film dokumenter dan olimpiade informatika.'],
  ['2018', 'SMP Santa Maria Tarutung', 'Melanjutkan pendidikan di SMP Swasta.'],
  ['2012', 'SD Negeri 178492 Pagarbatu', 'Awal pembelajaran dimulai di sini.']
];
$('#tl').innerHTML = exp.map((e, i) => `<div class="glass rv ${i % 2 ? 'r' : 'l'}"><small>${e[0]}</small><h3>${e[1]}</h3><p>${e[2]}</p></div>`).join('');

const ts = [
  ['Kau harus jadi polisi!', 'Mamak'],
  ['Kuliah kedokteran lah kau.', 'Mamak'],
  ['Lakukanlah apa yang kau suka jangan karena paksaan.', 'Bapak'],
  ['Banyak duit mu ya!', 'Kawan'],
];
let ti = 0;
$('#dots').innerHTML = ts.map((_, i) => `<i data-i="${i}"></i>`).join('');
function showT(i) {
  ti = i; const q = $('#tq');
  q.style.opacity = 0; q.style.transform = 'translateY(12px)';
  setTimeout(() => {
    q.textContent = '“' + ts[i][0] + '”';
    $('#ta').textContent = ts[i][1];
    q.style.opacity = 1; q.style.transform = 'none';
  }, 300);
  $$('#dots i').forEach((d, k) => d.classList.toggle('on', k === i));
}
$$('#dots i').forEach(d => d.onclick = () => showT(+d.dataset.i));
showT(0); setInterval(() => showT((ti + 1) % ts.length), 5000);

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
      r.style.setProperty('--p', v); r.firstChild.textContent = v + '%';
      if (k < 1) requestAnimationFrame(f);
    })(t0);
  }
  io.unobserve(t);
}), { threshold: .15 });

$$('.rv').forEach((el, i) => { el.dataset.d = (i % 4) * 90; io.observe(el); });

$$('.sk, .stat').forEach(applyTilt);

const dock = $('#dock');
dock.addEventListener('pointermove', e => $$('#dock a').forEach(a => {
  const r = a.getBoundingClientRect(), d = Math.abs(e.clientX - (r.left + r.width / 2));
  a.style.transform = `scale(${1 + clamp(1 - d / 90, 0, 1) * .6})`;
}));
dock.addEventListener('pointerleave', () => $$('#dock a').forEach(a => a.style.transform = ''));

const sheet = $('#sheet');
const sList = document.createElement('div'); sList.id = 'sList'; $('#sD').after(sList);

$('#prj').addEventListener('click', e => {
  const c = e.target.closest('.card'); if (!c) return;
  const p = prj[c.dataset.i];
  const img = $('#sImg'), isCert = p[2] === 'Sertifikat', isCV = p[2] === 'CV', isVisual = isCert || isCV, isGroup = Array.isArray(p[7]), href = p[5] || (isVisual ? p[6] : ''), lk = $('#sLink');
  $('#sE').textContent = isVisual ? '' : p[0];
  $('#sE').style.display = isVisual ? 'none' : '';
  const isCertGroup = isCert && isGroup;
  img.hidden = !p[6] || isGroup; if (p[6] && !isGroup) { img.src = p[6]; img.alt = p[1]; }
  $('#sT').textContent = p[1] + (isVisual || isGroup ? '' : ` (${p[2]})`);
  $('#sD').textContent = p[3];
  lk.style.display = !isGroup && href && href !== '#' && (isVisual || p[2] === 'Proyek') ? 'block' : 'none';
  lk.textContent = isCert ? 'Buka Sertifikat' : isCV ? 'Unduh CV' : 'Buka Repositori GitHub'; lk.href = href;
  isCV ? lk.setAttribute('download', 'CV-Andrean-Rajagukguk.jpg') : lk.removeAttribute('download'); lk.rel = 'noopener noreferrer';
  sList.innerHTML = isCertGroup ? certCarousel(p[7]) : isGroup ? p[7].map(it => `<div class="it"><div class="ie">${it.e}</div><div class="ib"><h4>${it.t}</h4><p>${it.d}</p><div class="chips">${it.m.map(m => `<span class="chip">${m}</span>`).join('')}</div></div></div>`).join('') : '';

  $('#sTech').innerHTML = p[4].map(tag => `<span class="chip" style="font-size:.8rem; padding:4px 12px;">${tag}</span>`).join('');
  sheet.classList.add('open');
  if (isCertGroup) initCarousel();
});

$('#skl').addEventListener('click', e => {
  const card = e.target.closest('.sk'); if (!card) return;
  const s = skillList[card.dataset.index];
  $('#sE').textContent = '⚡'; $('#sE').style.display = ''; $('#sImg').hidden = true;
  $('#sT').textContent = s[0] + ` (${s[1]}% Kemahiran)`;
  $('#sD').textContent = s[2];
  $('#sLink').style.display = 'none'; sList.innerHTML = '';
  $('#sTech').innerHTML = `<span class="chip" style="font-size:.8rem; padding:4px 12px; background:var(--a); color:#fff;">Tingkat: Profesional / Mahir</span>`;
  sheet.classList.add('open');
});

$('#sC').onclick = () => sheet.classList.remove('open');
sheet.onclick = e => { if (e.target.id === 'sheet') sheet.classList.remove('open'); };

let toastTimer;
function showToast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 3600);
}

let shuffle = false, repeat = 'all';
const seek = $('#seek'), tCur = $('#tCur'), tDur = $('#tDur'), shufBtn = $('#shufBtn'), repBtn = $('#repBtn');
const fmt = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00';

const _uti = updateTrackInfo;
updateTrackInfo = () => {
  _uti(); seek.value = 0; tCur.textContent = '0:00'; tDur.textContent = '0:00';
  if ('mediaSession' in navigator) {
    const t = playlist[currentTrackIndex];
    navigator.mediaSession.metadata = new MediaMetadata({ title: t.title, artist: t.artist });
  }
};
function setPlaying(v) {
  isPlaying = v; playBtn.textContent = v ? '⏸' : '▶';
  cdDisc.classList.toggle('playing', v); musicWidget.classList.toggle('is-playing', v);
}
function go(dir) {
  const n = playlist.length;
  if (shuffle && n > 1) { let r; do { r = Math.floor(Math.random() * n); } while (r === currentTrackIndex); currentTrackIndex = r; }
  else currentTrackIndex = (currentTrackIndex + dir + n) % n;
  updateTrackInfo();
  if (isPlaying) audio.play().catch(() => { });
}
nextBtn.onclick = e => { e.stopPropagation(); go(1); };
prevBtn.onclick = e => { e.stopPropagation(); audio.currentTime > 3 ? (audio.currentTime = 0) : go(-1); };
audio.addEventListener('play', () => setPlaying(true));
audio.addEventListener('pause', () => setPlaying(false));
audio.addEventListener('ended', () => {
  if (repeat === 'off' && !shuffle && currentTrackIndex === playlist.length - 1) return setPlaying(false);
  go(1);
});
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  if (!seek.dataset.drag) seek.value = audio.currentTime / audio.duration * 100;
  tCur.textContent = fmt(audio.currentTime); tDur.textContent = fmt(audio.duration);
});
audio.addEventListener('error', () => showToast('⚠️ Audio "' + playlist[currentTrackIndex].src + '" tidak ditemukan. Letakkan di folder yang sama dengan index.html.'));
seek.oninput = () => { seek.dataset.drag = 1; if (audio.duration) tCur.textContent = fmt(seek.value / 100 * audio.duration); };
seek.onchange = () => { delete seek.dataset.drag; if (audio.duration) audio.currentTime = seek.value / 100 * audio.duration; };
shufBtn.onclick = e => { e.stopPropagation(); shuffle = !shuffle; shufBtn.setAttribute('aria-pressed', shuffle); shufBtn.classList.toggle('on', shuffle); showToast(shuffle ? '🔀 Acak aktif' : '🔀 Acak mati'); };
repBtn.onclick = e => {
  e.stopPropagation();
  repeat = { all: 'one', one: 'off', off: 'all' }[repeat];
  audio.loop = repeat === 'one';
  repBtn.textContent = { all: '🔁', one: '🔂', off: '➡️' }[repeat];
  repBtn.title = 'Ulangi: ' + { all: 'semua', one: 'satu lagu', off: 'mati' }[repeat];
  showToast(repBtn.title);
};
if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('play', () => audio.play());
  navigator.mediaSession.setActionHandler('pause', () => audio.pause());
  navigator.mediaSession.setActionHandler('nexttrack', () => go(1));
  navigator.mediaSession.setActionHandler('previoustrack', () => go(-1));
}
updateTrackInfo();

document.addEventListener('pointerover', e => cursor.classList.toggle('big', !!e.target.closest('a, button, .card, .sk, .chip, .playlist-item')));

addEventListener('keydown', e => {
  const tr = $('#czTrack');
  if (!tr || !sheet.classList.contains('open')) return;
  if (e.key === 'ArrowRight') tr.scrollBy({ left: tr.clientWidth, behavior: 'smooth' });
  if (e.key === 'ArrowLeft') tr.scrollBy({ left: -tr.clientWidth, behavior: 'smooth' });
});

addEventListener('keydown', e => {
  if (e.key === 'Escape') { sheet.classList.remove('open'); musicWidget.classList.remove('playlist-open'); }
});

const FORM_ENDPOINT = 'https://formspree.io/f/mzereoav';

$('#frm').onsubmit = async e => {
  e.preventDefault();
  const form = e.target, btn = $('#submitBtn'), d = new FormData(form);

  if (!FORM_ENDPOINT || FORM_ENDPOINT.includes('GANTI_ID_FORMSPREE')) {
    return showToast('⚠️ Tempelkan URL endpoint Formspree kamu di script.js terlebih dahulu.');
  }

  btn.textContent = 'Mengirim…';
  btn.disabled = true;

  try {
    const res = await fetch(FORM_ENDPOINT, {
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

const root = document.documentElement;
try { const s = localStorage.getItem('theme'); if (s) root.dataset.theme = s; } catch (e) { }
$('#theme').onclick = () => {
  const cur = root.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const next = cur === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) { }
};

function fitHero() { measure(); $('.hero').style.height = (innerHeight * 1.1 + $('.intro > div').offsetHeight + 60) + 'px'; onScroll(); }
fitHero(); addEventListener('resize', fitHero); addEventListener('load', fitHero);

onScroll();