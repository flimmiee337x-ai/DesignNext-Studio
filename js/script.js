/* =========================================================
   DesignNext Studio — Shared UI + Public Pages
   ---------------------------------------------------------
   ทุกหน้าใส่ <body data-page="..." data-root="../">
   data-root = path กลับไปยังโฟลเดอร์หลัก ('' สำหรับ index.html)
   ========================================================= */

const ROOT = document.body.dataset.root || '';
const PAGE = document.body.dataset.page || '';

const LOGO_SVG = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><linearGradient id="lg" x1="0" y1="0" x2="48" y2="48"><stop stop-color="#7667FF"/><stop offset=".55" stop-color="#A78BFA"/><stop offset="1" stop-color="#38BDF8"/></linearGradient></defs>
  <rect width="48" height="48" rx="14" fill="url(#lg)"/>
  <path d="M14 13h10.5C32 13 36 18 36 24s-4 11-11.5 11H14V13z" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"/>
  <path d="M21 20l5 4-5 4" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

/* ---------------- UI helpers ---------------- */
const UI = {
  esc(s) { return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); },
  money(n) { return '฿' + Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 }); },
  num(n) { return Number(n || 0).toLocaleString('en-US'); },
  date(iso) {
    if (!iso) return '-';
    const d = new Date(iso.length <= 10 ? iso + 'T00:00:00' : iso);
    return isNaN(d) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  },
  dateShort(iso) {
    if (!iso) return '-';
    const d = new Date(iso.length <= 10 ? iso + 'T00:00:00' : iso);
    return isNaN(d) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  },
  dateTime(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    return isNaN(d) ? iso : d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  },
  fileSize(b) {
    if (!b) return '-';
    const u = ['B', 'KB', 'MB', 'GB']; let i = 0; let n = b;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return n.toFixed(i ? 1 : 0) + ' ' + u[i];
  },
  initials(name) { return String(name || '?').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase(); },
  status(s) { return `<span class="status" data-s="${UI.esc(s)}">${UI.esc(s)}</span>`; },
  progress(p) { return `<div class="progress"><span style="width:${Math.max(0, Math.min(100, p || 0))}%"></span></div>`; },
  param(key) { return new URLSearchParams(location.search).get(key); },
  logo(href) { return `<a href="${href ?? ROOT + 'index.html'}" class="logo">${LOGO_SVG}<span>Design<b>Next</b></span></a>`; },

  toast(msg, type = 'info', ms = 3500) {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, ms);
  },

  modal(html, opts = {}) {
    let m = document.getElementById('dn-modal');
    if (!m) {
      m = document.createElement('div');
      m.id = 'dn-modal'; m.className = 'modal';
      m.innerHTML = '<div class="modal-box"><button class="modal-close" aria-label="ปิด">✕</button><div class="modal-content"></div></div>';
      document.body.appendChild(m);
      m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('.modal-close')) UI.closeModal(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') UI.closeModal(); });
    }
    m.querySelector('.modal-box').classList.toggle('wide', !!opts.wide);
    m.querySelector('.modal-content').innerHTML = html;
    requestAnimationFrame(() => m.classList.add('open'));
    document.body.style.overflow = 'hidden';
    UI.initDropzones(m);
    return m.querySelector('.modal-content');
  },
  closeModal() {
    const m = document.getElementById('dn-modal');
    if (m) m.classList.remove('open');
    document.body.style.overflow = '';
  },
  /* Promise-based confirm dialog */
  confirm(title, text, okLabel = 'ยืนยัน') {
    return new Promise((res) => {
      const box = UI.modal(`<h3>${UI.esc(title)}</h3><p>${UI.esc(text)}</p>
        <div class="flex mt-2" style="justify-content:flex-end"><button class="btn btn-ghost btn-sm" data-no>ยกเลิก</button><button class="btn btn-primary btn-sm" data-yes>${UI.esc(okLabel)}</button></div>`);
      box.querySelector('[data-yes]').onclick = () => { UI.closeModal(); res(true); };
      box.querySelector('[data-no]').onclick = () => { UI.closeModal(); res(false); };
    });
  },

  busy(btn, on, label = 'กำลังบันทึก...') {
    if (!btn) return;
    if (on) { btn.dataset.label = btn.innerHTML; btn.innerHTML = label; btn.disabled = true; }
    else { btn.innerHTML = btn.dataset.label || btn.innerHTML; btn.disabled = false; }
  },

  initDropzones(scope = document) {
    scope.querySelectorAll('.dropzone').forEach((dz) => {
      if (dz.dataset.ready) return; dz.dataset.ready = 1;
      const input = dz.querySelector('input[type=file]');
      const out = dz.querySelector('.dz-file');
      const show = () => { if (out) out.textContent = input.files.length ? [...input.files].map((f) => `${f.name} (${UI.fileSize(f.size)})`).join(', ') : ''; };
      input.addEventListener('change', show);
      ['dragenter', 'dragover'].forEach((ev) => dz.addEventListener(ev, () => dz.classList.add('drag')));
      ['dragleave', 'drop'].forEach((ev) => dz.addEventListener(ev, () => dz.classList.remove('drag')));
    });
  },

  /* Scroll reveal + progress bars + counters */
  reveal(scope = document) {
    const els = scope.querySelectorAll('.reveal:not(.in), .progress > span, [data-count]');
    if (!('IntersectionObserver' in window)) { els.forEach((el) => UI._show(el)); return; }
    UI._io = UI._io || new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { UI._show(en.target); UI._io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => UI._io.observe(el));
  },
  _show(el) {
    if (el.classList.contains('reveal')) el.classList.add('in');
    if (el.parentElement && el.parentElement.classList.contains('progress')) {
      const w = el.style.width; el.style.width = '0'; requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = w; }));
    }
    if (el.dataset.count) {
      const end = Number(el.dataset.count); const suf = el.dataset.suffix || ''; const t0 = performance.now();
      const step = (t) => { const p = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US') + suf; if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }
  },

  /* Mouse spotlight on .card-hover */
  spotlight() {
    document.addEventListener('mousemove', (e) => {
      const c = e.target.closest && e.target.closest('.card-hover');
      if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', e.clientX - r.left + 'px');
      c.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  },

  /* ---------- Dashboard shell (Client / Admin) ---------- */
  appShell({ area, active, title, subtitle = '', user }) {
    const nav = area === 'admin'
      ? [['dashboard', '📊', 'Dashboard'], ['customers', '👤', 'Customers'], ['projects', '📁', 'Projects'], ['bookings', '📅', 'Bookings'], ['employees', '👥', 'Employees'], ['applications', '📝', 'Applications'], ['finance', '💰', 'Finance']]
      : [['dashboard', '🏠', 'Dashboard'], ['projects', '📁', 'โปรเจกต์ของฉัน'], ['quotation', '🧾', 'ใบเสนอราคา'], ['files', '🗂️', 'ไฟล์งาน'], ['messages', '💬', 'ข้อความ']];
    const app = document.getElementById('app');
    app.className = 'app';
    app.innerHTML = `
      <aside class="sidebar">
        ${UI.logo(ROOT + 'index.html')}
        <div class="side-label">${area === 'admin' ? 'Admin Panel' : 'Client Area'}</div>
        <ul class="side-nav">
          ${nav.map(([k, ic, lb]) => `<li><a href="${k}.html" class="${k === active ? 'active' : ''}"><span class="ic">${ic}</span>${lb}</a></li>`).join('')}
        </ul>
        <div class="side-label">Website</div>
        <ul class="side-nav">
          <li><a href="${ROOT}index.html"><span class="ic">🌐</span>กลับหน้าเว็บไซต์</a></li>
          ${area === 'client' ? `<li><a href="${ROOT}pages/booking.html"><span class="ic">📅</span>จองคิวปรึกษา</a></li>` : ''}
        </ul>
        <div class="side-foot">
          <div class="user-chip"><div class="av">${UI.esc(UI.initials(user?.name || user?.email))}</div>
            <div><div class="nm">${UI.esc(user?.name || user?.email || '')}</div><div class="rl">${area === 'admin' ? 'Administrator' : 'Client'}</div></div></div>
          <button class="btn btn-ghost btn-sm btn-block" id="logoutBtn">ออกจากระบบ</button>
        </div>
      </aside>
      <div class="side-backdrop"></div>
      <main class="app-main">
        <div class="topbar">
          <div class="flex"><button class="app-toggle" aria-label="เมนู">☰</button>
            <div><h1>${UI.esc(title)}</h1>${subtitle ? `<p>${subtitle}</p>` : ''}</div></div>
          <div class="flex"><span class="mode-pill ${DN.mode === 'firebase' ? 'live' : 'demo'}">${DN.mode === 'firebase' ? '● Firebase Live' : '● Demo Mode'}</span><div id="topActions" class="flex"></div></div>
        </div>
        <div id="view"><div class="loader"></div></div>
      </main>`;
    const toggle = () => app.classList.toggle('side-open');
    app.querySelector('.app-toggle').onclick = toggle;
    app.querySelector('.side-backdrop').onclick = toggle;
    app.querySelector('#logoutBtn').onclick = async () => { await Auth.logout(); location.href = 'login.html'; };
    return app.querySelector('#view');
  }
};

/* ---------------- Layout: Navbar + Footer ---------------- */
function renderLayout() {
  const P = ROOT + 'pages/';
  const links = [
    ['home', 'Home', ROOT + 'index.html'],
    ['services', 'Services', P + 'services.html'],
    ['packages', 'Packages', P + 'packages.html'],
    ['portfolio', 'Portfolio', P + 'portfolio.html'],
    ['about', 'About', P + 'about.html', [['about', 'About Us', P + 'about.html'], ['team', 'Team', P + 'team.html'], ['process', 'Process', P + 'process.html'], ['faq', 'FAQ', P + 'faq.html']]],
    ['careers', 'Careers', P + 'careers.html'],
    ['contact', 'Contact', P + 'contact.html']
  ];
  const isActive = (k, sub) => k === PAGE || (sub && sub.some(([s]) => s === PAGE));
  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `
      <div class="scroll-progress"></div>
      <nav class="nav"><div class="container">
        ${UI.logo()}
        <ul class="nav-links">
          ${links.map(([k, label, href, sub]) => sub
            ? `<li class="nav-dropdown"><a href="${href}" class="${isActive(k, sub) ? 'active' : ''}">${label}</a>
                 <ul class="dropdown glass">${sub.map(([sk, sl, sh]) => `<li><a href="${sh}" class="${sk === PAGE ? 'active' : ''}">${sl}</a></li>`).join('')}</ul></li>`
            : `<li><a href="${href}" class="${isActive(k) ? 'active' : ''}">${label}</a></li>`).join('')}
        </ul>
        <div class="nav-cta">
          <a href="${ROOT}client/login.html" class="btn btn-ghost btn-sm">Login</a>
          <a href="${P}booking.html" class="btn btn-primary btn-sm">เริ่มต้นโปรเจกต์</a>
          <button class="menu-toggle" aria-label="เปิดเมนู"><span></span><span></span><span></span></button>
        </div>
      </div></nav>
      <div class="mobile-menu">
        ${links.flatMap(([k, label, href, sub]) => sub ? sub : [[k, label, href]]).map(([k, label, href], i) => `<a href="${href}" class="${k === PAGE ? 'active' : ''}" style="transition-delay:${i * 0.04}s">${label}</a>`).join('')}
        <a href="${P}booking.html" style="transition-delay:.4s">Booking</a>
        <a href="${ROOT}client/login.html" style="transition-delay:.44s">Customer Login</a>
        <a href="${P}booking.html" class="btn btn-primary">เริ่มต้นโปรเจกต์</a>
      </div>`;
    header.querySelector('.menu-toggle').onclick = () => document.body.classList.toggle('menu-open');
    header.querySelectorAll('.mobile-menu a').forEach((a) => a.addEventListener('click', () => document.body.classList.remove('menu-open')));
    const nav = header.querySelector('.nav');
    const bar = header.querySelector('.scroll-progress');
    const onScroll = () => {
      nav.classList.toggle('scrolled', scrollY > 20);
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
      const bt = document.querySelector('.back-top'); if (bt) bt.classList.toggle('show', scrollY > 600);
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.className = 'footer';
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            ${UI.logo()}
            <div class="slogan gradient-text">${COMPANY.slogan}</div>
            <p class="small">บริษัทด้าน Graphic Design และ Digital Technology ที่พร้อมเปลี่ยนไอเดียของคุณให้เป็นแบรนด์และประสบการณ์ดิจิทัลที่โดดเด่น</p>
            <div class="socials"><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">ig</a><a href="#" aria-label="Behance">Bē</a><a href="#" aria-label="LinkedIn">in</a></div>
          </div>
          <div><h5>Company</h5><ul>
            <li><a href="${P}about.html">About Us</a></li><li><a href="${P}team.html">Team</a></li>
            <li><a href="${P}process.html">Process</a></li><li><a href="${P}careers.html">Careers</a></li><li><a href="${P}faq.html">FAQ</a></li></ul></div>
          <div><h5>Services</h5><ul>
            ${SERVICES.map((s) => `<li><a href="${P}services.html#${s.id}">${s.name}</a></li>`).join('')}</ul></div>
          <div><h5>Contact</h5><ul class="small">
            <li><a href="mailto:${COMPANY.email}">${COMPANY.email}</a></li>
            <li><a href="tel:${COMPANY.phone.replace(/-/g, '')}">${COMPANY.phone}</a></li>
            <li class="muted">${COMPANY.hours}</li>
            <li><a href="${ROOT}client/login.html">Customer Login</a></li>
            <li><a href="${ROOT}admin/login.html">Staff / Admin</a></li></ul></div>
        </div>
        <div class="footer-bottom"><span>© ${new Date().getFullYear()} ${COMPANY.name}. All rights reserved.</span><span>Made with HTML · CSS · JavaScript · Firebase</span></div>
      </div>`;
    const bt = document.createElement('button');
    bt.className = 'back-top'; bt.innerHTML = '↑'; bt.setAttribute('aria-label', 'กลับขึ้นด้านบน');
    bt.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(bt);
  }
}

/* ---------------- Reusable section renderers ---------------- */
const Render = {
  serviceCard(s, i, full) {
    return `<article class="card card-hover service-card reveal delay-${(i % 3) + 1}" id="${s.id}">
      <span class="service-num">0${i + 1}</span>
      <div class="icon-box">${s.icon}</div>
      <h3>${s.name}</h3>
      <p>${s.short}</p>
      ${full ? `<div class="meta"><span>⏱ ${s.duration}</span><span>💰 เริ่มต้น ${UI.money(s.startPrice)}</span></div>
        <ul class="check">${s.deliverables.slice(0, 3).map((d) => `<li>${d}</li>`).join('')}</ul>` : ''}
      <button class="link-arrow" data-service="${s.id}">ดูรายละเอียดเพิ่มเติม →</button>
    </article>`;
  },
  serviceModal(id) {
    const s = SERVICES.find((x) => x.id === id); if (!s) return;
    UI.modal(`<div class="icon-box">${s.icon}</div>
      <h2 style="font-size:1.8rem">${s.name}</h2>
      <p>${s.detail}</p>
      <div class="grid grid-2 mt-2">
        <div><h4>สิ่งที่ลูกค้าจะได้รับ</h4><ul class="check">${s.deliverables.map((d) => `<li>${d}</li>`).join('')}</ul></div>
        <div><h4>ระยะเวลา</h4><p>${s.duration}</p><h4>ราคาเริ่มต้น</h4><p class="gradient-text" style="font-size:1.6rem;font-weight:800;font-family:var(--font-head)">${UI.money(s.startPrice)}</p></div>
      </div>
      <div class="flex flex-wrap mt-2">
        <a href="${ROOT}pages/booking.html?service=${encodeURIComponent(s.name)}" class="btn btn-primary">เริ่มต้นโปรเจกต์</a>
        <a href="${ROOT}pages/contact.html?service=${encodeURIComponent(s.name)}" class="btn btn-ghost">ขอใบเสนอราคา</a>
      </div>`);
  },
  packageCard(p, i) {
    return `<article class="card card-hover pricing-card reveal delay-${i + 1} ${p.featured ? 'featured' : ''}">
      ${p.featured ? '<span class="ribbon">⭐ ยอดนิยม</span>' : ''}
      <h3>${p.name}</h3>
      <p class="small mb-0">${p.tagline}</p>
      <div class="price">${p.priceNote ? `<small>${p.priceNote} </small>` : ''}${UI.money(p.price)}</div>
      <div class="duration">${p.unit} · ⏱ ${p.duration}</div>
      <ul class="check">${p.features.map((f) => `<li>${f}</li>`).join('')}</ul>
      <a href="${ROOT}pages/booking.html?package=${p.id}" class="btn ${p.featured ? 'btn-primary' : 'btn-ghost'} btn-block">เริ่มต้นโปรเจกต์</a>
    </article>`;
  },
  /* Thumbnail = animated WebGL background (js/portfolio-gl.js) + category mockup on top.
     The CSS gradient in .art is the fallback when WebGL is unavailable. */
  workThumb(w, i, label = 'CONCEPT PROJECT') {
    const [a, b] = w.g;
    return `<div class="work-thumb" style="--c1:${a};--c2:${b}">
        <div class="art" style="background:radial-gradient(circle at 20% 20%, ${b}cc, transparent 55%),radial-gradient(circle at 80% 85%, ${a}, transparent 60%),linear-gradient(135deg, ${a}, ${b});"></div>
        <canvas class="gl" data-c1="${a}" data-c2="${b}" data-style="${w.cat}" data-seed="${i}"></canvas>
        ${Render.mockup(w)}
        <span class="concept">${label}</span>
      </div>`;
  },
  /* Mockup per category: brand card / poster / phone / browser / social posts / packaging */
  mockup(w) {
    const t = UI.esc(w.title);
    const words = w.title.split(/\s+/);
    const mono = UI.esc(words.map((x) => x[0]).slice(0, 2).join('').toUpperCase());
    switch (w.cat) {
      case 'Branding':
        return `<div class="mk mk-brand"><div class="mk-logo">${mono}</div><b>${t}</b><small>BRAND IDENTITY</small>
          <div class="mk-sw"><i style="background:var(--c1)"></i><i style="background:var(--c2)"></i><i style="background:#fff"></i><i style="background:#0B0B0F"></i></div></div>`;
      case 'Graphic Design':
        return `<div class="mk mk-poster"><span>2026 · BKK</span><b>${UI.esc(words.slice(0, 2).join(' '))}</b><i></i><small>DESIGN BEYOND IDEAS</small></div>`;
      case 'UI/UX':
        return `<div class="mk mk-phone"><div class="notch"></div><small>Balance</small><b>฿24,580</b>
          <svg viewBox="0 0 100 34" preserveAspectRatio="none"><path d="M0 28 C15 24 20 10 35 14 S55 30 68 16 S88 4 100 8" fill="none" stroke="var(--c2)" stroke-width="3" stroke-linecap="round"/></svg>
          <div class="rows"><i></i><i></i><i></i></div></div>`;
      case 'Website':
        return `<div class="mk mk-browser"><div class="bar"><i></i><i></i><i></i><span></span></div>
          <div class="bw"><div class="nv"><em></em><em></em><em></em></div><b>${t}</b><span class="ln"></span><span class="ln s"></span><span class="cta"></span></div></div>`;
      case 'Social Media':
        return `<div class="mk mk-social"><div class="post p1"></div><div class="post p2"></div>
          <div class="post p3"><div class="ph"></div><div class="meta"><b>${t}</b><span>♥ 2.4k</span></div></div></div>`;
      case 'Packaging':
        return `<div class="mk mk-pack"><div class="box"><small>ORGANIC · 250g</small><b>${UI.esc(words[0])}</b><i></i></div><div class="can"><b>${mono}</b></div></div>`;
      default: return '';
    }
  },
  workCard(w, i) {
    return `<article class="work-card reveal zoom delay-${(i % 3) + 1}" data-cat="${w.cat}" data-i="${i}">
      ${Render.workThumb(w, i)}
      <div class="work-body"><div class="flex between"><h3>${UI.esc(w.title)}</h3><span class="tag">${w.cat}</span></div><p>${UI.esc(w.desc)}</p></div>
    </article>`;
  },
  workModal(i) {
    const w = PORTFOLIO[i];
    const box = UI.modal(`<div class="work-card modal-thumb" style="margin-bottom:22px;cursor:default">${Render.workThumb(w, i, 'CONCEPT / DEMO PROJECT')}</div>
      <h2 style="font-size:1.6rem">${UI.esc(w.title)}</h2>
      <div class="tags" style="margin-bottom:14px"><span class="tag">${w.cat}</span><span class="tag">Concept Project</span></div>
      <p>${UI.esc(w.desc)}</p>
      <div class="notice">ℹ️ ผลงานนี้เป็น <b>Concept Project / Demo Project</b> ที่ทีม DesignNext จัดทำขึ้นเพื่อแสดงแนวทางและศักยภาพการออกแบบ ไม่ใช่ผลงานของลูกค้าจริง</div>`, { wide: true });
    if (typeof PortfolioGL !== 'undefined') requestAnimationFrame(() => PortfolioGL.scan(box));
  },
  teamCard(e, i, full) {
    return `<article class="card card-hover team-card reveal delay-${(i % 4) + 1}">
      <div class="avatar" style="background:linear-gradient(135deg, ${e.color}, #0B0B0F)">${UI.esc(e.initials || UI.initials(e.name))}</div>
      <div class="emp-id">${e.employeeId}</div>
      <h3 style="margin:4px 0 2px">${full && e.prefix ? `<small style="font-weight:500;color:var(--muted)">${UI.esc(e.prefix)}</small>` : ''}${UI.esc(e.name)}</h3>
      <div class="role">${UI.esc(e.position)}</div>
      <div class="dept">ฝ่าย ${UI.esc(e.department)}</div>
      ${full ? `<p class="duty"><b style="color:#fff">หน้าที่:</b> ${UI.esc(e.duty)}</p>` : ''}
      <div class="tags">${e.skills.map((s) => `<span class="tag">${UI.esc(s)}</span>`).join('')}</div>
    </article>`;
  },
  processRow() {
    return `<div class="process-row">${PROCESS.map((p, i) => `<div class="step reveal delay-${i % 6}"><div class="step-num">${p.n}</div><h4>${p.name}</h4><p>${p.th}</p></div>`).join('')}</div>`;
  },
  faqList(items) {
    return `<div class="faq-list">${items.map((f, i) => `<div class="faq-item reveal delay-${(i % 4) + 1}">
      <button class="faq-q" aria-expanded="false">${UI.esc(f.q)}<span class="plus">+</span></button>
      <div class="faq-a"><div>${UI.esc(f.a)}</div></div></div>`).join('')}</div>`;
  },
  cta() {
    return `<section class="section-sm"><div class="container"><div class="cta-band reveal zoom">
      <span class="eyebrow">Let's work together</span>
      <h2>พร้อมเปลี่ยนไอเดียให้เป็น<br><span class="gradient-text">แบรนด์ที่โดดเด่น</span> แล้วหรือยัง?</h2>
      <p>ปรึกษาฟรี ไม่มีค่าใช้จ่าย ทีมงานพร้อมตอบกลับภายใน 24 ชั่วโมง</p>
      <div class="hero-actions" style="justify-content:center">
        <a href="${ROOT}pages/booking.html" class="btn btn-primary">🚀 เริ่มต้นโปรเจกต์</a>
        <a href="${ROOT}pages/contact.html?type=quote" class="btn btn-ghost">🧾 ขอใบเสนอราคา</a>
        <a href="${ROOT}pages/contact.html" class="btn btn-ghost">📞 ติดต่อเรา</a>
      </div></div></div></section>`;
  }
};

function bindCommon(scope = document) {
  scope.querySelectorAll('[data-service]').forEach((b) => b.addEventListener('click', () => Render.serviceModal(b.dataset.service)));
  scope.querySelectorAll('.work-card').forEach((c) => c.addEventListener('click', () => Render.workModal(+c.dataset.i)));
  scope.querySelectorAll('.faq-q').forEach((q) => q.addEventListener('click', () => {
    const item = q.parentElement; const a = item.querySelector('.faq-a');
    const open = !item.classList.contains('open');
    item.classList.toggle('open', open); q.setAttribute('aria-expanded', open);
    a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
  }));
}

function portfolioFilter(root) {
  const btns = root.querySelectorAll('.filter-btn');
  btns.forEach((b) => b.addEventListener('click', () => {
    btns.forEach((x) => x.classList.remove('active')); b.classList.add('active');
    const cat = b.dataset.filter;
    root.querySelectorAll('.work-card').forEach((c) => {
      const show = cat === 'all' || c.dataset.cat === cat;
      c.classList.toggle('hide', !show);
      if (show) { c.classList.remove('in'); requestAnimationFrame(() => c.classList.add('in')); }
    });
  }));
}

/* ---------------- Page: Home ---------------- */
function pageHome() {
  const el = document.getElementById('home');
  el.innerHTML = `
  <section class="hero">
    <div class="grid-bg"></div><div class="orb orb-1"></div><div class="orb orb-2"></div>
    <div class="container hero-grid">
      <div>
        <span class="eyebrow fade-up">Graphic Design × Digital Technology</span>
        <h1 class="fade-up d1">DesignNext Studio<br><span class="gradient-text animated">Design Beyond Ideas.</span></h1>
        <p class="lead fade-up d2">${COMPANY.intro}</p>
        <div class="hero-actions fade-up d3">
          <a href="pages/booking.html" class="btn btn-primary">🚀 เริ่มต้นโปรเจกต์</a>
          <a href="pages/contact.html?type=quote" class="btn btn-ghost">ขอใบเสนอราคา</a>
          <a href="pages/contact.html" class="btn btn-ghost">ติดต่อเรา</a>
        </div>
        <div class="hero-stats fade-up d4">
          <div><div class="num" data-count="6">0</div><div class="lbl">บริการครบวงจร</div></div>
          <div><div class="num" data-count="7">0</div><div class="lbl">ทีมมืออาชีพ</div></div>
          <div><div class="num" data-count="100" data-suffix="%">0</div><div class="lbl">Responsive & Modern</div></div>
        </div>
      </div>
      <div class="hero-visual fade-up d2">
        <div class="ring"></div><div class="ring r2"></div>
        <div class="core">${LOGO_SVG.replace('<rect width="48" height="48" rx="14" fill="url(#lg)"/>', '')}</div>
        <div class="float-card glass fc-1 float"><div class="dot">🎨</div><div><b>Branding</b>Brand Identity</div></div>
        <div class="float-card glass fc-2 float d2"><div class="dot">💻</div><div><b>Web & App</b>UI/UX · Development</div></div>
        <div class="float-card glass fc-3 float d3"><div class="dot">📈</div><div><b>+ Growth</b>Digital Marketing</div></div>
      </div>
    </div>
  </section>

  <div class="marquee"><div class="marquee-track">
    ${[...SERVICES, ...SERVICES].map((s) => `<span>${s.name}</span>`).join('')}
  </div></div>

  <section class="section">
    <div class="container grid grid-2" style="align-items:center;gap:60px">
      <div class="reveal from-left">
        <span class="eyebrow">About DesignNext</span>
        <h2>สตูดิโอที่รวม <span class="gradient-text">Design</span> และ <span class="gradient-text">Technology</span> ไว้ในที่เดียว</h2>
        <p>${COMPANY.history.slice(0, 230)}...</p>
        <a href="pages/about.html" class="link-arrow">รู้จักเรามากขึ้น →</a>
      </div>
      <div class="grid grid-2">
        ${COMPANY.highlights.map((h, i) => `<div class="card card-hover reveal delay-${i + 1}"><div class="icon-box">${h.icon}</div><h3 style="font-size:1.05rem">${h.title}</h3><p class="small mb-0">${h.desc}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="section-head center reveal"><span class="eyebrow">Our Services</span><h2>บริการของเรา</h2><p>ครบทุกความต้องการด้านการออกแบบและดิจิทัล ตั้งแต่สร้างแบรนด์จนถึงระบบออนไลน์</p></div>
      <div class="grid grid-3">${SERVICES.map((s, i) => Render.serviceCard(s, i)).join('')}</div>
      <div class="center mt-3"><a href="pages/services.html" class="btn btn-ghost">ดูบริการทั้งหมด →</a></div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="section-head center reveal"><span class="eyebrow">Portfolio</span><h2>ผลงานตัวอย่าง</h2><p>Concept Project ที่แสดงแนวทางการออกแบบของทีม DesignNext</p></div>
      <div class="grid grid-3">${PORTFOLIO.slice(0, 6).map((w, i) => Render.workCard(w, i)).join('')}</div>
      <div class="center mt-3"><a href="pages/portfolio.html" class="btn btn-ghost">ดูผลงานทั้งหมด →</a></div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="section-head center reveal"><span class="eyebrow">Packages</span><h2>แพ็กเกจบริการ</h2><p>เลือกแพ็กเกจที่เหมาะกับธุรกิจของคุณ หรือปรึกษาเพื่อออกแบบแพ็กเกจเฉพาะ</p></div>
      <div class="grid grid-4">${PACKAGES.map((p, i) => Render.packageCard(p, i)).join('')}</div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="section-head center reveal"><span class="eyebrow">Work Process</span><h2>ขั้นตอนการทำงาน</h2><p>6 ขั้นตอนที่ชัดเจน โปร่งใส ติดตามได้ทุกขั้น</p></div>
      ${Render.processRow()}
      <div class="center mt-3"><a href="pages/process.html" class="link-arrow">ดูรายละเอียดแต่ละขั้นตอน →</a></div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="section-head center reveal"><span class="eyebrow">Our Team</span><h2>ทีมงานของเรา</h2><p>ทีมมืออาชีพ 7 คน ที่พร้อมขับเคลื่อนไอเดียของคุณ</p></div>
      <div class="grid grid-4">${EMPLOYEES.slice(0, 4).map((e, i) => Render.teamCard(e, i)).join('')}</div>
      <div class="center mt-3"><a href="pages/team.html" class="btn btn-ghost">ดูทีมงานทั้งหมด →</a></div>
    </div>
  </section>
  ${Render.cta()}`;
}

/* ---------------- Page: Services ---------------- */
function pageServices() {
  document.getElementById('servicesGrid').innerHTML = SERVICES.map((s, i) => Render.serviceCard(s, i, true)).join('');
  const h = location.hash.slice(1);
  if (h && SERVICES.some((s) => s.id === h)) setTimeout(() => Render.serviceModal(h), 500);
}

/* ---------------- Page: Packages ---------------- */
function pagePackages() {
  document.getElementById('packagesGrid').innerHTML = PACKAGES.map((p, i) => Render.packageCard(p, i)).join('');
  const rows = [
    ['ระยะเวลาทำงาน', ...PACKAGES.map((p) => p.duration)],
    ['จำนวนครั้งที่แก้ไข', '2 ครั้ง', '3 ครั้ง', '3 ครั้ง', 'ไม่จำกัด*'],
    ['Logo / Brand Identity', '✓', '✓', '—', '✓'],
    ['Brand Guideline', '—', '✓', '—', '✓'],
    ['กราฟิก Social Media', '5 ชิ้น', '15 ชิ้น', 'Content Plan', '3 เดือน'],
    ['เว็บไซต์', '—', 'Landing Page', '✓ สูงสุด 8 หน้า', 'Web App'],
    ['Source File', '—', '✓', '✓', '✓'],
    ['ดูแลหลังส่งมอบ', '—', '—', '30 วัน', '90 วัน']
  ];
  document.getElementById('compareTable').innerHTML = `<table class="table"><thead><tr><th>รายละเอียด</th>${PACKAGES.map((p) => `<th>${p.name}<br><span style="color:#C4BCFF;text-transform:none;letter-spacing:0">${UI.money(p.price)}</span></th>`).join('')}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c, i) => i ? `<td>${c}</td>` : `<td><b>${c}</b></td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

/* ---------------- Page: Portfolio ---------------- */
function pagePortfolio() {
  const root = document.getElementById('portfolioRoot');
  root.innerHTML = `<div class="filters reveal">
      <button class="filter-btn active" data-filter="all">ทั้งหมด</button>
      ${PORTFOLIO_CATS.map((c) => `<button class="filter-btn" data-filter="${c}">${c}</button>`).join('')}
    </div>
    <div class="grid grid-3">${PORTFOLIO.map((w, i) => Render.workCard(w, i)).join('')}</div>`;
  portfolioFilter(root);
}

/* ---------------- Page: About ---------------- */
function pageAbout() {
  document.getElementById('about').innerHTML = `
  <section class="section" style="padding-top:20px"><div class="container grid grid-2" style="gap:50px;align-items:start">
    <div class="reveal from-left"><span class="eyebrow">Our Story</span><h2>ความเป็นมาของบริษัท</h2><p>${COMPANY.history}</p>
      <div class="kv mt-2"><dt>ชื่อบริษัท</dt><dd>${COMPANY.legalName}</dd><dt>ก่อตั้ง</dt><dd>${COMPANY.founded}</dd><dt>ธุรกิจ</dt><dd>Graphic Design & Digital Technology</dd><dt>ที่ตั้ง</dt><dd>${COMPANY.address}</dd></div></div>
    <div class="card reveal from-right"><span class="eyebrow">Founding Concept</span><h3>แนวคิดในการก่อตั้ง</h3><p class="mb-0">${COMPANY.concept}</p></div>
  </div></section>

  <section class="section" style="padding-top:0"><div class="container grid grid-2">
    <div class="card card-hover reveal" style="background:var(--grad-soft)"><div class="icon-box">🔭</div><h3>Vision — วิสัยทัศน์</h3><p class="mb-0" style="color:var(--text);font-size:1.08rem">${COMPANY.vision}</p></div>
    <div class="card card-hover reveal delay-2"><div class="icon-box">🎯</div><h3>Mission — พันธกิจ</h3><ul class="check">${COMPANY.mission.map((m) => `<li>${m}</li>`).join('')}</ul></div>
  </div></section>

  <section class="section" style="padding-top:0"><div class="container">
    <div class="section-head center reveal"><span class="eyebrow">Core Values</span><h2>ค่านิยมองค์กร</h2></div>
    <div class="grid grid-3">${COMPANY.values.map((v, i) => `<div class="card card-hover value-card reveal delay-${(i % 3) + 1}"><div class="n">0${i + 1}</div><h3 style="margin-top:6px">${v.name}</h3><div style="color:#C4BCFF;font-size:.9rem;margin-bottom:8px">${v.th}</div><p class="mb-0 small">${v.desc}</p></div>`).join('')}</div>
  </div></section>

  <section class="section" style="padding-top:0"><div class="container">
    <div class="section-head center reveal"><span class="eyebrow">Why DesignNext</span><h2>จุดเด่นของบริษัท</h2></div>
    <div class="grid grid-4">${COMPANY.highlights.map((h, i) => `<div class="card card-hover reveal delay-${i + 1}"><div class="icon-box">${h.icon}</div><h3 style="font-size:1.05rem">${h.title}</h3><p class="small mb-0">${h.desc}</p></div>`).join('')}</div>
  </div></section>

  <section class="section" style="padding-top:0"><div class="container">
    <div class="section-head center reveal"><span class="eyebrow">Technology Stack</span><h2>เทคโนโลยีที่ใช้</h2><p>เครื่องมือมาตรฐานสากลสำหรับงานออกแบบและพัฒนา</p></div>
    <div class="grid grid-4">${COMPANY.tech.map((t, i) => `<div class="tech-chip reveal delay-${(i % 4) + 1}"><span class="t-ic">${t.short}</span>${t.name}</div>`).join('')}</div>
  </div></section>
  ${Render.cta()}`;
}

/* ---------------- Page: Team ---------------- */
function pageTeam() {
  document.getElementById('teamGrid').innerHTML = EMPLOYEES.map((e, i) => Render.teamCard(e, i, true)).join('');
}

/* ---------------- Page: Process ---------------- */
function pageProcess() {
  document.getElementById('processRow').innerHTML = Render.processRow();
  document.getElementById('timeline').innerHTML = PROCESS.map((p, i) => `
    <div class="tl-item reveal ${i % 2 ? 'from-right' : 'from-left'}">
      <div class="step-num">${p.n}</div>
      <div class="card card-hover"><h3>${p.name} — ${p.th} <small>⏱ ${p.days}</small></h3><p>${p.desc}</p>
        <div class="tags">${p.out.map((o) => `<span class="tag">📦 ${o}</span>`).join('')}</div></div>
    </div>`).join('');
}

/* ---------------- Page: FAQ ---------------- */
function pageFaq() {
  document.getElementById('faqRoot').innerHTML = Render.faqList(FAQS);
}

/* ---------------- Page: Contact ---------------- */
function pageContact() {
  const form = document.getElementById('contactForm');
  const sel = form.querySelector('[name=service]');
  sel.innerHTML = '<option value="">— เลือกบริการ —</option>' + SERVICES.map((s) => `<option>${s.name}</option>`).join('') + PACKAGES.map((p) => `<option>Package: ${p.name}</option>`).join('') + '<option>อื่น ๆ</option>';
  form.querySelector('[name=budget]').innerHTML = '<option value="">— เลือกงบประมาณ —</option>' + BUDGETS.map((b) => `<option>${b}</option>`).join('');
  const pre = UI.param('service'); if (pre) sel.value = pre;
  if (UI.param('type') === 'quote') form.querySelector('[name=details]').placeholder = 'ต้องการขอใบเสนอราคาสำหรับ... (อธิบายขอบเขตงาน จำนวนชิ้นงาน และกำหนดส่งที่ต้องการ)';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const fd = new FormData(form);
    const data = Object.fromEntries(['name', 'company', 'email', 'phone', 'service', 'budget', 'details'].map((k) => [k, (fd.get(k) || '').trim()]));
    if (!data.name || !data.email || !data.phone || !data.service || !data.details) return UI.toast('กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบ', 'error');
    if (!/^\S+@\S+\.\S+$/.test(data.email)) return UI.toast('รูปแบบอีเมลไม่ถูกต้อง', 'error');
    UI.busy(btn, true, 'กำลังส่งข้อมูล...');
    try {
      const file = form.querySelector('[name=file]').files[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) throw new Error('ไฟล์ต้องมีขนาดไม่เกิน 10MB');
        const up = await Storage.upload('contacts', file);
        Object.assign(data, { fileUrl: up.url, fileName: up.name, filePath: up.path, fileSize: up.size });
      }
      data.type = UI.param('type') === 'quote' ? 'Quotation Request' : 'Contact';
      data.status = 'New';
      await DB.add('contacts', data);
      form.reset(); form.querySelector('.dz-file').textContent = '';
      UI.modal(`<div class="center"><div class="pop" style="font-size:3.4rem">✅</div><h2 style="font-size:1.6rem">ส่งข้อมูลเรียบร้อยแล้ว</h2>
        <p>ขอบคุณคุณ${UI.esc(data.name)} ทีมงาน DesignNext จะติดต่อกลับภายใน 24 ชั่วโมง ทางอีเมล ${UI.esc(data.email)}</p>
        <div class="flex" style="justify-content:center"><a href="booking.html" class="btn btn-primary">จองคิวปรึกษา</a><button class="btn btn-ghost" onclick="UI.closeModal()">ปิด</button></div></div>`);
    } catch (err) { console.error(err); UI.toast(err.message || 'ส่งข้อมูลไม่สำเร็จ', 'error'); }
    UI.busy(btn, false);
  });
}

/* ---------------- Page: Careers + Application ---------------- */
function pageCareers() {
  document.getElementById('jobsGrid').innerHTML = CAREERS.map((j, i) => `
    <article class="card card-hover reveal delay-${(i % 3) + 1}" style="display:flex;flex-direction:column">
      <div class="flex between" style="margin-bottom:12px"><span class="tag">${j.type}</span><span class="small muted">${j.dept}</span></div>
      <h3>${j.title}</h3>
      <p class="small">${j.desc}</p>
      <div class="small" style="margin-bottom:16px;color:#C4BCFF;font-weight:600">💰 ${j.salary}</div>
      <div class="tags" style="margin-bottom:22px">${j.skills.map((s) => `<span class="tag">${s}</span>`).join('')}</div>
      <div class="flex" style="margin-top:auto"><button class="btn btn-ghost btn-sm" data-job="${j.id}">รายละเอียด</button><button class="btn btn-primary btn-sm" data-apply="${j.id}">Apply Now</button></div>
    </article>`).join('');
  document.getElementById('benefits').innerHTML = BENEFITS.map((b, i) => `<div class="tech-chip reveal delay-${(i % 4) + 1}"><span class="t-ic">✓</span>${b}</div>`).join('');

  document.getElementById('jobsGrid').addEventListener('click', (e) => {
    const d = e.target.closest('[data-job]'); const a = e.target.closest('[data-apply]');
    if (d) jobModal(d.dataset.job);
    if (a) applyModal(a.dataset.apply);
  });
  const pre = UI.param('apply'); if (pre) applyModal(pre);
}

function jobModal(id) {
  const j = CAREERS.find((x) => x.id === id);
  const box = UI.modal(`<span class="tag">${j.type} · ${j.dept}</span>
    <h2 style="font-size:1.8rem;margin-top:12px">${j.title}</h2><p>${j.desc}</p>
    <div class="grid grid-2">
      <div><h4>หน้าที่ความรับผิดชอบ</h4><ul class="check">${j.duties.map((x) => `<li>${x}</li>`).join('')}</ul></div>
      <div><h4>คุณสมบัติ</h4><ul class="check">${j.quals.map((x) => `<li>${x}</li>`).join('')}</ul></div>
    </div>
    <h4 class="mt-1">Skills</h4><div class="tags">${j.skills.map((s) => `<span class="tag">${s}</span>`).join('')}</div>
    <h4 class="mt-2">เงินเดือน</h4><p style="color:#C4BCFF;font-weight:700">${j.salary}</p>
    <h4>สวัสดิการ</h4><div class="tags">${BENEFITS.map((b) => `<span class="tag">${b}</span>`).join('')}</div>
    <button class="btn btn-primary mt-2" data-go>Apply Now →</button>`, { wide: true });
  box.querySelector('[data-go]').onclick = () => applyModal(id);
}

function applyModal(id) {
  const j = CAREERS.find((x) => x.id === id) || CAREERS[0];
  const box = UI.modal(`<span class="eyebrow">Job Application</span><h2 style="font-size:1.6rem">สมัครงาน</h2>
    <form id="applyForm" class="form-grid mt-1" novalidate>
      <div class="field"><label>ชื่อ-นามสกุล <span class="req">*</span></label><input name="name" required></div>
      <div class="field"><label>ตำแหน่งที่สมัคร <span class="req">*</span></label><select name="position">${CAREERS.map((c) => `<option ${c.id === j.id ? 'selected' : ''}>${c.title}</option>`).join('')}</select></div>
      <div class="field"><label>Email <span class="req">*</span></label><input name="email" type="email" required></div>
      <div class="field"><label>เบอร์โทร <span class="req">*</span></label><input name="phone" type="tel" required></div>
      <div class="field full"><label>การศึกษา <span class="req">*</span></label><input name="education" placeholder="เช่น ปริญญาตรี สาขา... มหาวิทยาลัย..." required></div>
      <div class="field full"><label>Skills <span class="req">*</span></label><input name="skills" placeholder="เช่น Illustrator, Figma, JavaScript" required></div>
      <div class="field full"><label>Portfolio (ลิงก์)</label><input name="portfolio" type="url" placeholder="https://behance.net/yourname"></div>
      <div class="field full"><label>Resume (PDF / DOC / รูปภาพ, ไม่เกิน 5MB) <span class="req">*</span></label>
        <div class="dropzone"><input type="file" name="resume" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"><div class="dz-icon">📄</div><div>ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์</div><div class="dz-file"></div></div></div>
      <div class="full"><button type="submit" class="btn btn-primary btn-block">ส่งใบสมัคร</button></div>
    </form>`, { wide: true });
  const form = box.querySelector('#applyForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(['name', 'email', 'phone', 'position', 'education', 'skills', 'portfolio'].map((k) => [k, (fd.get(k) || '').trim()]));
    const resume = form.querySelector('[name=resume]').files[0];
    if (!data.name || !data.email || !data.phone || !data.education || !data.skills) return UI.toast('กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบ', 'error');
    if (!/^\S+@\S+\.\S+$/.test(data.email)) return UI.toast('รูปแบบอีเมลไม่ถูกต้อง', 'error');
    if (!resume) return UI.toast('กรุณาแนบไฟล์ Resume', 'error');
    if (resume.size > 5 * 1024 * 1024) return UI.toast('ไฟล์ Resume ต้องไม่เกิน 5MB', 'error');
    const btn = form.querySelector('button[type=submit]');
    UI.busy(btn, true, 'กำลังส่งใบสมัคร...');
    try {
      const up = await Storage.upload('resumes', resume);
      const applicationId = await DB.nextId('application');
      await DB.add('applications', { ...data, applicationId, resumeUrl: up.url, resumeName: up.name, resumePath: up.path, status: 'New' });
      UI.modal(`<div class="center"><div class="pop" style="font-size:3.4rem">🎉</div><h2 style="font-size:1.6rem">ส่งใบสมัครสำเร็จ!</h2>
        <p>หมายเลขใบสมัครของคุณคือ</p><div class="id-big gradient-text">${applicationId}</div>
        <p class="mt-1">ตำแหน่ง <b style="color:#fff">${UI.esc(data.position)}</b> · สถานะ ${UI.status('New')}</p>
        <p class="small">ทีม HR จะติดต่อกลับทางอีเมล ${UI.esc(data.email)} ภายใน 7 วันทำการ<br>กรุณาเก็บหมายเลขนี้ไว้เพื่อใช้ติดตามสถานะ</p>
        <button class="btn btn-primary" onclick="UI.closeModal()">เสร็จสิ้น</button></div>`);
    } catch (err) { console.error(err); UI.toast(err.message || 'ส่งใบสมัครไม่สำเร็จ', 'error'); UI.busy(btn, false); }
  });
}

/* ---------------- Boot ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderLayout();
  const pages = { home: pageHome, services: pageServices, packages: pagePackages, portfolio: pagePortfolio, about: pageAbout, team: pageTeam, process: pageProcess, faq: pageFaq, contact: pageContact, careers: pageCareers };
  if (pages[PAGE]) pages[PAGE]();
  bindCommon();
  if (typeof PortfolioGL !== 'undefined') PortfolioGL.scan();
  UI.initDropzones();
  UI.spotlight();
  UI.reveal();
});
