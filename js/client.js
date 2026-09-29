/* =========================================================
   DesignNext Studio — Client Area
   Login / Register · Dashboard · Projects · Quotation · Files · Messages
   ข้อมูลของลูกค้าผูกด้วย customerId === uid ของผู้ใช้ที่ Login
   ========================================================= */

const Client = {
  user: null,
  customer: null,

  /* ---------- Helpers ---------- */
  authError(err) {
    const map = {
      'auth/invalid-credential': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      'auth/wrong-password': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      'auth/user-not-found': 'ไม่พบบัญชีผู้ใช้นี้',
      'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง',
      'auth/email-already-in-use': 'อีเมลนี้ถูกใช้สมัครแล้ว',
      'auth/weak-password': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
      'auth/too-many-requests': 'พยายามเข้าสู่ระบบบ่อยเกินไป กรุณาลองใหม่ภายหลัง',
      'auth/network-request-failed': 'ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้'
    };
    return map[err && err.code] || (err && err.message) || 'เกิดข้อผิดพลาด';
  },
  /* ยอดรวมใบเสนอราคา */
  quoteTotals(q) {
    const subtotal = (q.items || []).reduce((s, it) => s + Number(it.qty || 0) * Number(it.price || 0), 0);
    const discount = Number(q.discount || 0);
    const net = subtotal - discount;
    const vatRate = q.vat ?? 7;
    const vat = net * vatRate / 100;
    return { subtotal, discount, net, vatRate, vat, total: net + vat };
  },
  byNewest(a, b) { return String(b.createdAt || b.date || '').localeCompare(String(a.createdAt || a.date || '')); },
  statusFlow(status) {
    const flow = ['Pending', 'In Progress', 'Review', 'Completed'];
    if (status === 'Cancelled') return `<div class="notice" style="border-color:rgba(248,113,113,.4);color:#FCA5A5">❌ โปรเจกต์นี้ถูกยกเลิก</div>`;
    const idx = flow.indexOf(status);
    return `<div class="stepper" style="margin:0">${flow.map((s, i) =>
      `<div class="st ${i === idx ? 'active' : ''} ${i < idx || status === 'Completed' ? 'done' : ''}" data-n="${i + 1}">${s}</div>`).join('')}</div>`;
  },
  ext(name) { return String(name || '').split('.').pop().toUpperCase(); },

  /* ใช้ร่วมกันทุกหน้าใน Client Area (ยกเว้น login) */
  async boot(active, title, subtitle) {
    this.user = await Auth.requireClient('login.html');
    await DN.ready;
    this.customer = await DB.get('customers', this.user.uid).catch(() => null);
    const name = this.customer?.name || this.user.name || this.user.email;
    return UI.appShell({ area: 'client', active, title, subtitle, user: { ...this.user, name } });
  },
  async load(col) {
    const docs = await DB.list(col, { where: ['customerId', '==', this.user.uid] });
    return docs.sort(this.byNewest);
  },
  fail(view, err) {
    console.error(err);
    view.innerHTML = `<div class="panel empty"><div class="big">⚠️</div>โหลดข้อมูลไม่สำเร็จ<br><span class="small">${UI.esc(err.message || '')}</span></div>`;
  },

  /* =====================================================
     LOGIN / REGISTER
     ===================================================== */
  async pageLogin() {
    document.getElementById('authLogo').innerHTML = UI.logo('../index.html');
    await DN.ready;
    const cur = await Auth.current();
    if (cur) { location.href = Auth.isAdmin(cur) ? '../admin/dashboard.html' : 'dashboard.html'; return; }

    const loginForm = document.getElementById('loginForm');
    const regForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.tabs button');
    const show = (tab) => {
      tabs.forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
      loginForm.classList.toggle('hidden', tab !== 'login');
      regForm.classList.toggle('hidden', tab !== 'register');
    };
    tabs.forEach((b) => b.addEventListener('click', () => show(b.dataset.tab)));
    if (UI.param('tab') === 'register') show('register');

    if (DN.mode === 'demo') {
      document.getElementById('demoHint').innerHTML = `<div class="demo-hint">🧪 <b>Demo Mode</b> — ยังไม่ได้เชื่อม Firebase ข้อมูลจะถูกเก็บในเบราว์เซอร์<br>
        บัญชีทดสอบ: <b>somchai@kafenomad.co</b> / <b>client1234</b>
        <button type="button" class="btn btn-ghost btn-sm btn-block mt-1" id="fillDemo">ใช้บัญชีทดสอบ</button></div>`;
      document.getElementById('fillDemo').onclick = () => {
        show('login');
        loginForm.email.value = 'somchai@kafenomad.co';
        loginForm.password.value = 'client1234';
      };
    }

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const pass = loginForm.password.value;
      if (!email || !pass) return UI.toast('กรุณากรอก Email และรหัสผ่าน', 'error');
      const btn = loginForm.querySelector('[type=submit]');
      UI.busy(btn, true, 'กำลังเข้าสู่ระบบ...');
      try {
        const u = await Auth.login(email, pass);
        if (Auth.isAdmin(u)) { location.href = '../admin/dashboard.html'; return; }
        UI.toast('เข้าสู่ระบบสำเร็จ', 'success');
        location.href = 'dashboard.html';
      } catch (err) { UI.toast(this.authError(err), 'error'); UI.busy(btn, false); }
    });

    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = Object.fromEntries(['name', 'company', 'phone', 'email', 'password', 'confirm'].map((k) => [k, regForm[k].value.trim()]));
      if (!f.name || !f.phone || !f.email || !f.password) return UI.toast('กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบ', 'error');
      if (!/^\S+@\S+\.\S+$/.test(f.email)) return UI.toast('รูปแบบอีเมลไม่ถูกต้อง', 'error');
      if (f.password.length < 6) return UI.toast('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'error');
      if (f.password !== f.confirm) return UI.toast('รหัสผ่านทั้งสองช่องไม่ตรงกัน', 'error');
      const btn = regForm.querySelector('[type=submit]');
      UI.busy(btn, true, 'กำลังสมัครสมาชิก...');
      try {
        await Auth.register(f.email, f.password, { name: f.name, company: f.company, phone: f.phone });
        UI.toast('สมัครสมาชิกสำเร็จ ยินดีต้อนรับ!', 'success');
        location.href = 'dashboard.html';
      } catch (err) { UI.toast(this.authError(err), 'error'); UI.busy(btn, false); }
    });

    document.getElementById('forgotBtn').addEventListener('click', async () => {
      const email = loginForm.email.value.trim();
      if (!email) return UI.toast('กรอก Email ในช่องด้านบนก่อน แล้วกด "ลืมรหัสผ่าน" อีกครั้ง', 'error');
      try { await Auth.resetPassword(email); UI.toast('ส่งลิงก์รีเซ็ตรหัสผ่านไปที่ ' + email + ' แล้ว', 'success'); }
      catch (err) { UI.toast(this.authError(err), 'error'); }
    });
  },

  /* =====================================================
     DASHBOARD
     ===================================================== */
  async pageDashboard() {
    const view = await this.boot('dashboard', 'Dashboard', 'ภาพรวมโปรเจกต์และบริการของคุณ');
    try {
      const [projects, quotes, files, msgs] = await Promise.all(['projects', 'quotations', 'files', 'messages'].map((c) => this.load(c)));
      const c = this.customer || {};
      const active = projects.filter((p) => ['In Progress', 'Review'].includes(p.status)).length;
      const pendingQ = quotes.filter((q) => q.status === 'Pending').length;
      const outstanding = projects.filter((p) => p.status !== 'Cancelled').reduce((s, p) => s + Math.max(0, Number(p.budget || 0) - Number(p.paid || 0)), 0);
      const latestQ = quotes[0];
      const lastMsgs = msgs.slice(0, 3);
      const name = c.name || this.user.name || this.user.email;

      view.innerHTML = `
        <div class="panel reveal" style="background:linear-gradient(135deg, rgba(118,103,255,.22), rgba(56,189,248,.06))">
          <div class="flex between flex-wrap">
            <div><h2 style="font-size:1.5rem;margin-bottom:4px">สวัสดี, ${UI.esc(name)} 👋</h2>
              <p class="mb-0">ติดตามสถานะงาน ใบเสนอราคา และไฟล์ของคุณได้ที่นี่ตลอด 24 ชั่วโมง</p></div>
            <a href="../pages/booking.html" class="btn btn-primary btn-sm">📅 จองคิวปรึกษา</a>
          </div>
        </div>

        <div class="stats">
          <div class="stat-card reveal delay-1"><div class="lbl">โปรเจกต์ทั้งหมด <span>📁</span></div><div class="val" data-count="${projects.length}">0</div><div class="sub">Projects</div></div>
          <div class="stat-card reveal delay-2"><div class="lbl">กำลังดำเนินการ <span>⚙️</span></div><div class="val" data-count="${active}">0</div><div class="sub">In Progress / Review</div></div>
          <div class="stat-card reveal delay-3"><div class="lbl">ใบเสนอราคารออนุมัติ <span>🧾</span></div><div class="val" data-count="${pendingQ}">0</div><div class="sub">Pending Quotation</div></div>
          <div class="stat-card reveal delay-4"><div class="lbl">ยอดค้างชำระ <span>💳</span></div><div class="val">${UI.money(outstanding)}</div><div class="sub ${outstanding ? 'down' : 'up'}">${outstanding ? 'รอชำระ' : 'ชำระครบแล้ว'}</div></div>
        </div>

        <div class="split">
          <div>
            <div class="panel reveal">
              <div class="panel-head"><h3>📁 โปรเจกต์ของฉัน</h3><a href="projects.html" class="link-arrow small">ดูทั้งหมด →</a></div>
              ${projects.length ? projects.slice(0, 4).map((p) => `
                <div style="padding:14px 0;border-bottom:1px solid var(--border)">
                  <div class="flex between flex-wrap" style="margin-bottom:8px">
                    <div><span class="id small" style="color:#C4BCFF;font-family:var(--font-head)">${UI.esc(p.projectId)}</span>
                      <b style="color:#fff;margin-left:8px">${UI.esc(p.name)}</b></div>
                    ${UI.status(p.status)}
                  </div>
                  ${UI.progress(p.progress)}
                  <div class="flex between small muted" style="margin-top:6px"><span>${p.progress || 0}% · ${UI.esc(p.stage || p.status)}</span><span>Deadline: ${UI.date(p.deadline)}</span></div>
                </div>`).join('') : '<div class="empty"><div class="big">📭</div>ยังไม่มีโปรเจกต์</div>'}
            </div>

            <div class="panel reveal">
              <div class="panel-head"><h3>🔄 สถานะงาน</h3></div>
              <p class="small">ทุกโปรเจกต์จะเดินตามขั้นตอน Pending → In Progress → Review → Completed</p>
              ${projects[0] ? `<p class="small mb-0" style="color:#fff">${UI.esc(projects[0].name)}</p>${this.statusFlow(projects[0].status)}` : this.statusFlow('Pending')}
            </div>

            <div class="panel reveal">
              <div class="panel-head"><h3>💳 สถานะการชำระเงิน</h3></div>
              <div class="table-wrap"><table class="table" style="min-width:560px">
                <thead><tr><th>Project</th><th>งบประมาณ</th><th>ชำระแล้ว</th><th>คงเหลือ</th><th>สถานะ</th></tr></thead>
                <tbody>${projects.length ? projects.map((p) => `<tr>
                  <td><div class="id">${UI.esc(p.projectId)}</div>${UI.esc(p.name)}</td>
                  <td>${UI.money(p.budget)}</td><td>${UI.money(p.paid)}</td>
                  <td>${UI.money(Math.max(0, (p.budget || 0) - (p.paid || 0)))}</td>
                  <td>${UI.status(p.paymentStatus || 'Unpaid')}</td></tr>`).join('') : '<tr><td colspan="5" class="empty">ไม่มีข้อมูล</td></tr>'}</tbody>
              </table></div>
            </div>
          </div>

          <div>
            <div class="panel reveal">
              <div class="panel-head"><h3>👤 ข้อมูลลูกค้า</h3></div>
              <dl class="kv" style="grid-template-columns:110px 1fr">
                <dt>Customer ID</dt><dd class="id" style="font-family:var(--font-head);color:#C4BCFF">${UI.esc(c.customerId || '-')}</dd>
                <dt>ชื่อ</dt><dd>${UI.esc(c.name || name)}</dd>
                <dt>บริษัท</dt><dd>${UI.esc(c.company || '-')}</dd>
                <dt>Email</dt><dd>${UI.esc(c.email || this.user.email)}</dd>
                <dt>เบอร์โทร</dt><dd>${UI.esc(c.phone || '-')}</dd>
                <dt>สถานะ</dt><dd>${UI.status(c.status || 'Active')}</dd>
              </dl>
            </div>

            <div class="panel reveal">
              <div class="panel-head"><h3>🧾 ใบเสนอราคาล่าสุด</h3><a href="quotation.html" class="link-arrow small">ดู →</a></div>
              ${latestQ ? `<div class="flex between"><b style="color:#fff">${UI.esc(latestQ.quotationNo)}</b>${UI.status(latestQ.status)}</div>
                <p class="small mb-0">${UI.date(latestQ.date)}</p>
                <div class="gradient-text" style="font-family:var(--font-head);font-size:1.6rem;font-weight:800">${UI.money(this.quoteTotals(latestQ).total)}</div>
                <a href="quotation.html?id=${encodeURIComponent(latestQ.id)}" class="btn btn-ghost btn-sm btn-block mt-1">เปิดใบเสนอราคา</a>`
                : '<div class="empty" style="padding:20px">ยังไม่มีใบเสนอราคา</div>'}
            </div>

            <div class="panel reveal">
              <div class="panel-head"><h3>🗂️ ไฟล์งานล่าสุด</h3><a href="files.html" class="link-arrow small">ทั้งหมด →</a></div>
              <div class="grid" style="gap:10px">${files.length ? files.slice(0, 3).map((f) => `
                <div class="file-card" style="padding:10px"><div class="file-ext" data-ext="${UI.esc(f.type || this.ext(f.name))}" style="width:40px;height:44px">${UI.esc(f.type || this.ext(f.name))}</div>
                <div class="info"><b>${UI.esc(f.name)}</b><small>${UI.fileSize(f.size)}</small></div></div>`).join('') : '<div class="empty" style="padding:20px">ยังไม่มีไฟล์</div>'}</div>
            </div>

            <div class="panel reveal">
              <div class="panel-head"><h3>💬 ข้อความล่าสุด</h3><a href="messages.html" class="link-arrow small">เปิดแชท →</a></div>
              ${lastMsgs.length ? lastMsgs.map((m) => `<div style="padding:10px 0;border-bottom:1px solid var(--border)">
                <div class="flex between small"><b style="color:#fff">${UI.esc(m.senderName || (m.from === 'client' ? 'คุณ' : 'DesignNext'))}</b><span class="muted">${UI.dateTime(m.createdAt)}</span></div>
                <p class="small mb-0" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${UI.esc(m.text)}</p></div>`).join('') : '<div class="empty" style="padding:20px">ยังไม่มีข้อความ</div>'}
            </div>
          </div>
        </div>`;
      UI.reveal(view);
    } catch (err) { this.fail(view, err); }
  },

  /* =====================================================
     PROJECTS
     ===================================================== */
  async pageProjects() {
    const view = await this.boot('projects', 'โปรเจกต์ของฉัน', 'รายละเอียดและความคืบหน้าของแต่ละโปรเจกต์');
    try {
      const projects = await this.load('projects');
      if (!projects.length) {
        view.innerHTML = `<div class="panel empty"><div class="big">📭</div>ยังไม่มีโปรเจกต์<br><a href="../pages/booking.html" class="btn btn-primary btn-sm mt-1">เริ่มต้นโปรเจกต์</a></div>`;
        return;
      }
      const focus = UI.param('id');
      view.innerHTML = `<div class="toolbar">
          <input class="input" id="pSearch" placeholder="🔍 ค้นหาโปรเจกต์ / Project ID">
          <select class="input" id="pStatus"><option value="">ทุกสถานะ</option>${STATUS.project.map((s) => `<option>${s}</option>`).join('')}</select>
        </div>
        <div class="grid" id="pList" style="gap:22px"></div>`;
      const list = view.querySelector('#pList');
      const draw = () => {
        const q = view.querySelector('#pSearch').value.trim().toLowerCase();
        const st = view.querySelector('#pStatus').value;
        const rows = projects.filter((p) => (!st || p.status === st) && (!q || `${p.projectId} ${p.name} ${p.service}`.toLowerCase().includes(q)));
        list.innerHTML = rows.length ? rows.map((p) => `
          <article class="panel reveal" id="p-${UI.esc(p.id)}" style="margin:0;${focus === p.id ? 'border-color:var(--accent);box-shadow:var(--glow)' : ''}">
            <div class="panel-head">
              <div><div class="id" style="font-family:var(--font-head);color:#C4BCFF;font-size:.85rem">${UI.esc(p.projectId)}</div>
                <h3 style="font-size:1.35rem">${UI.esc(p.name)}</h3></div>
              <div class="flex">${UI.status(p.status)}</div>
            </div>
            <div class="grid grid-2" style="gap:26px;align-items:start">
              <dl class="kv">
                <dt>Project ID</dt><dd>${UI.esc(p.projectId)}</dd>
                <dt>ชื่อ Project</dt><dd>${UI.esc(p.name)}</dd>
                <dt>บริการ</dt><dd>${UI.esc(p.service)}${p.package ? ` · <span class="tag">${UI.esc(p.package)}</span>` : ''}</dd>
                <dt>ผู้รับผิดชอบ</dt><dd>${UI.esc(p.owner || '-')}</dd>
                <dt>วันที่เริ่มงาน</dt><dd>${UI.date(p.startDate)}</dd>
                <dt>กำหนดส่ง</dt><dd><b style="color:#fff">${UI.date(p.deadline)}</b></dd>
                <dt>งบประมาณ</dt><dd>${UI.money(p.budget)}</dd>
                <dt>การชำระเงิน</dt><dd>${UI.status(p.paymentStatus || 'Unpaid')} <span class="small muted">ชำระแล้ว ${UI.money(p.paid)}</span></dd>
              </dl>
              <div>
                <div class="flex between"><span class="muted small">Progress</span><b class="gradient-text" style="font-family:var(--font-head);font-size:1.6rem">${p.progress || 0}%</b></div>
                ${UI.progress(p.progress)}
                <p class="small mt-1">Status: <b style="color:#fff">${UI.esc(p.stage || p.status)}</b></p>
                <div class="mt-2">${this.statusFlow(p.status)}</div>
                <div class="flex flex-wrap mt-2">
                  <a href="files.html?project=${encodeURIComponent(p.projectId)}" class="btn btn-ghost btn-sm">🗂️ ไฟล์งาน</a>
                  <a href="quotation.html?project=${encodeURIComponent(p.projectId)}" class="btn btn-ghost btn-sm">🧾 ใบเสนอราคา</a>
                  <a href="messages.html" class="btn btn-ghost btn-sm">💬 ส่งข้อความ</a>
                </div>
              </div>
            </div>
          </article>`).join('') : '<div class="panel empty">ไม่พบโปรเจกต์ที่ค้นหา</div>';
        UI.reveal(list);
      };
      view.querySelector('#pSearch').addEventListener('input', draw);
      view.querySelector('#pStatus').addEventListener('change', draw);
      draw();
      if (focus) setTimeout(() => document.getElementById('p-' + focus)?.scrollIntoView({ behavior: 'smooth' }), 300);
    } catch (err) { this.fail(view, err); }
  },

  /* =====================================================
     QUOTATION
     ===================================================== */
  async pageQuotation() {
    const view = await this.boot('quotation', 'ใบเสนอราคา', 'ดู อนุมัติ หรือพิมพ์ใบเสนอราคาออนไลน์');
    try {
      let quotes = await this.load('quotations');
      if (!quotes.length) { view.innerHTML = '<div class="panel empty"><div class="big">🧾</div>ยังไม่มีใบเสนอราคา</div>'; return; }
      const byProject = UI.param('project');
      let current = quotes.find((q) => q.id === UI.param('id')) || (byProject && quotes.find((q) => q.projectId === byProject)) || quotes[0];

      const drawList = () => `<div class="table-wrap no-print"><table class="table" style="min-width:600px">
          <thead><tr><th>เลขที่</th><th>วันที่</th><th>Project</th><th>ยอดรวม</th><th>สถานะ</th><th></th></tr></thead>
          <tbody>${quotes.map((q) => `<tr style="${q.id === current.id ? 'background:rgba(118,103,255,.1)' : ''}">
            <td class="id">${UI.esc(q.quotationNo)}</td><td>${UI.dateShort(q.date)}</td><td>${UI.esc(q.projectId || '-')}</td>
            <td>${UI.money(this.quoteTotals(q).total)}</td><td>${UI.status(q.status)}</td>
            <td><button class="btn btn-ghost btn-sm" data-view="${UI.esc(q.id)}">ดู</button></td></tr>`).join('')}</tbody></table></div>`;

      const drawDoc = (q) => {
        const t = this.quoteTotals(q);
        return `<div class="quote-doc mt-2" id="quoteDoc">
          <div class="q-head">
            <div class="flex" style="align-items:flex-start">
              <div style="width:52px;height:52px">${LOGO_SVG}</div>
              <div><h3 style="margin:0">${UI.esc(COMPANY.name)}</h3>
                <p class="small mb-0">${UI.esc(COMPANY.legalName)}<br>${UI.esc(COMPANY.address)}<br>
                เลขประจำตัวผู้เสียภาษี ${UI.esc(COMPANY.taxId)}<br>โทร ${UI.esc(COMPANY.phone)} · ${UI.esc(COMPANY.email)}</p></div>
            </div>
            <div style="text-align:right">
              <h2 style="font-size:1.6rem;margin:0;color:#7667FF">QUOTATION</h2>
              <p class="small mb-0">ใบเสนอราคา</p>
              <p class="small mb-0"><b style="color:#0B0B0F">เลขที่:</b> ${UI.esc(q.quotationNo)}<br>
                <b style="color:#0B0B0F">วันที่:</b> ${UI.date(q.date)}<br>
                <b style="color:#0B0B0F">ใช้ได้ถึง:</b> ${UI.date(q.validUntil)}</p>
              <div style="margin-top:8px">${UI.status(q.status)}</div>
            </div>
          </div>
          <div class="q-parties">
            <div><p class="small mb-0" style="color:#7667FF;font-weight:700">ลูกค้า (Customer)</p>
              <b>${UI.esc(q.customerName)}</b><br>${UI.esc(q.customerCompany || '-')}<br>${UI.esc(q.customerEmail || '')}<br>${UI.esc(q.customerPhone || '')}</div>
            <div><p class="small mb-0" style="color:#7667FF;font-weight:700">อ้างอิงโปรเจกต์ (Project)</p>
              <b>${UI.esc(q.projectId || '-')}</b><br>ผู้ติดต่อ: ${UI.esc((EMPLOYEES.find((e) => e.position.startsWith('Project Manager')) || EMPLOYEES[0]).name)} (Project Manager)</div>
          </div>
          <div style="overflow-x:auto"><table>
            <thead><tr><th style="width:44px">#</th><th>รายการบริการ</th><th class="num">จำนวน</th><th class="num">ราคา/หน่วย</th><th class="num">จำนวนเงิน</th></tr></thead>
            <tbody>${(q.items || []).map((it, i) => `<tr><td>${i + 1}</td><td>${UI.esc(it.desc)}</td><td class="num">${UI.num(it.qty)}</td>
              <td class="num">${UI.money(it.price)}</td><td class="num">${UI.money(it.qty * it.price)}</td></tr>`).join('')}</tbody>
          </table></div>
          <div class="totals">
            <div><span>รวมเป็นเงิน (Subtotal)</span><span>${UI.money(t.subtotal)}</span></div>
            <div><span>ส่วนลด (Discount)</span><span>- ${UI.money(t.discount)}</span></div>
            <div><span>ยอดหลังหักส่วนลด</span><span>${UI.money(t.net)}</span></div>
            <div><span>ภาษีมูลค่าเพิ่ม ${t.vatRate}%</span><span>${UI.money(t.vat)}</span></div>
            <div class="grand"><span>ยอดรวมทั้งสิ้น</span><span>${UI.money(t.total)}</span></div>
          </div>
          <div class="terms"><b>เงื่อนไขการชำระเงิน (Payment Terms)</b><ul>${PAYMENT_TERMS.map((x) => `<li>${UI.esc(x)}</li>`).join('')}</ul></div>
          <div class="flex between flex-wrap" style="margin-top:40px;font-size:.85rem;color:#4b4b5c">
            <div style="text-align:center;min-width:200px"><div style="border-top:1px solid #bbb;padding-top:6px">ผู้เสนอราคา<br>${UI.esc(COMPANY.name)}</div></div>
            <div style="text-align:center;min-width:200px"><div style="border-top:1px solid #bbb;padding-top:6px">ผู้อนุมัติ<br>${UI.esc(q.customerName)}</div></div>
          </div>
        </div>`;
      };

      const draw = () => {
        const pending = current.status === 'Pending';
        view.innerHTML = `${drawList()}
          <div class="panel-head mt-2 no-print"><h3>${UI.esc(current.quotationNo)}</h3>
            <div class="flex flex-wrap">
              ${pending ? `<button class="btn btn-primary btn-sm" data-act="Approved">✅ อนุมัติ</button><button class="btn btn-danger btn-sm" data-act="Rejected">✕ ปฏิเสธ</button>` : ''}
              <button class="btn btn-ghost btn-sm" id="printBtn">🖨️ พิมพ์ / PDF</button>
            </div></div>
          ${drawDoc(current)}`;
        view.querySelectorAll('[data-view]').forEach((b) => b.onclick = () => { current = quotes.find((q) => q.id === b.dataset.view); draw(); });
        view.querySelector('#printBtn').onclick = () => window.print();
        view.querySelectorAll('[data-act]').forEach((b) => b.onclick = async () => {
          const st = b.dataset.act;
          const ok = await UI.confirm(st === 'Approved' ? 'อนุมัติใบเสนอราคา?' : 'ปฏิเสธใบเสนอราคา?',
            `${current.quotationNo} ยอดรวม ${UI.money(this.quoteTotals(current).total)}`, st === 'Approved' ? 'อนุมัติ' : 'ปฏิเสธ');
          if (!ok) return;
          try {
            const patch = { status: st, [st === 'Approved' ? 'approvedAt' : 'rejectedAt']: new Date().toISOString() };
            await DB.update('quotations', current.id, patch);
            Object.assign(current, patch);
            UI.toast(st === 'Approved' ? 'อนุมัติใบเสนอราคาเรียบร้อย' : 'ปฏิเสธใบเสนอราคาแล้ว', 'success');
            draw();
          } catch (err) { console.error(err); UI.toast(err.message || 'บันทึกไม่สำเร็จ', 'error'); }
        });
      };
      draw();
    } catch (err) { this.fail(view, err); }
  },

  /* =====================================================
     FILES
     ===================================================== */
  fileGroup(type) {
    const t = String(type || '').toUpperCase();
    if (t === 'JPG' || t === 'JPEG') return 'JPG';
    if (['PNG', 'PDF', 'ZIP'].includes(t)) return t;
    return 'Source';
  },
  /* ไฟล์ตัวอย่าง (Demo) ที่ยังไม่มีไฟล์จริง → สร้างไฟล์ Placeholder ให้ดาวน์โหลด */
  downloadPlaceholder(f) {
    const isImg = ['PNG', 'JPG', 'JPEG'].includes(String(f.type).toUpperCase());
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7667FF"/><stop offset="1" stop-color="#38BDF8"/></linearGradient></defs>
      <rect width="1200" height="800" fill="#0B0B0F"/><rect x="60" y="60" width="1080" height="680" rx="40" fill="url(#g)" opacity=".9"/>
      <text x="600" y="380" fill="#fff" font-family="Arial" font-size="56" font-weight="700" text-anchor="middle">${UI.esc(f.name)}</text>
      <text x="600" y="450" fill="#fff" font-family="Arial" font-size="28" text-anchor="middle" opacity=".8">DesignNext Studio — Demo File (${UI.esc(f.projectId || '')})</text></svg>`;
    const blob = isImg
      ? new Blob([svg], { type: 'image/svg+xml' })
      : new Blob([`DesignNext Studio — Demo File\n\nไฟล์: ${f.name}\nProject: ${f.projectId || '-'}\n\nนี่คือไฟล์ตัวอย่างสำหรับทดสอบระบบ (Demo)\nไฟล์จริงจะถูกเก็บใน Firebase Storage`], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = f.name.replace(/\.[^.]+$/, '') + (isImg ? '_preview.svg' : '_demo.txt');
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  },

  async pageFiles() {
    const view = await this.boot('files', 'ไฟล์งาน', 'ดูและดาวน์โหลดไฟล์ของโปรเจกต์ (JPG · PNG · PDF · ZIP · Source File)');
    try {
      let files = await this.load('files');
      const projects = await this.load('projects');
      let filter = 'all';
      let projFilter = UI.param('project') || '';

      document.getElementById('topActions').innerHTML = '<button class="btn btn-primary btn-sm" id="uploadBtn">⬆️ อัปโหลดไฟล์</button>';
      document.getElementById('uploadBtn').onclick = () => this.uploadModal(projects, async () => { files = await this.load('files'); draw(); });

      const groups = ['all', 'JPG', 'PNG', 'PDF', 'ZIP', 'Source'];
      const draw = () => {
        const rows = files.filter((f) => (filter === 'all' || this.fileGroup(f.type || this.ext(f.name)) === filter) && (!projFilter || f.projectId === projFilter));
        const count = (g) => files.filter((f) => g === 'all' || this.fileGroup(f.type || this.ext(f.name)) === g).length;
        view.innerHTML = `
          <div class="toolbar">
            <div class="filters" style="margin:0;justify-content:flex-start">${groups.map((g) =>
              `<button class="filter-btn ${filter === g ? 'active' : ''}" data-g="${g}">${g === 'all' ? 'ทั้งหมด' : g} (${count(g)})</button>`).join('')}</div>
            <select class="input" id="projSel"><option value="">ทุกโปรเจกต์</option>${projects.map((p) =>
              `<option value="${UI.esc(p.projectId)}" ${projFilter === p.projectId ? 'selected' : ''}>${UI.esc(p.projectId)} — ${UI.esc(p.name)}</option>`).join('')}</select>
          </div>
          ${DN.mode === 'demo' ? '<div class="notice" style="margin-bottom:18px">🧪 Demo Mode: ไฟล์จะถูกเก็บในเบราว์เซอร์ (ไฟล์ใหญ่กว่า 1.5MB จะเก็บเฉพาะข้อมูลไฟล์) — เมื่อเชื่อม Firebase จะเก็บใน Firebase Storage</div>' : ''}
          <div class="grid grid-2">${rows.length ? rows.map((f) => {
            const ext = UI.esc(f.type || this.ext(f.name));
            return `<div class="file-card reveal">
              <div class="file-ext" data-ext="${ext}">${ext}</div>
              <div class="info"><b title="${UI.esc(f.name)}">${UI.esc(f.name)}</b>
                <small>${UI.fileSize(f.size)} · ${UI.dateShort(f.createdAt)} · ${UI.esc(f.projectId || '-')} · ${f.uploadedBy === 'client' ? 'อัปโหลดโดยคุณ' : 'จาก DesignNext'}</small></div>
              ${f.url ? `<a class="btn btn-ghost btn-sm" href="${UI.esc(f.url)}" download="${UI.esc(f.name)}" target="_blank" rel="noopener">⬇ ดาวน์โหลด</a>`
                : `<button class="btn btn-ghost btn-sm" data-dl="${UI.esc(f.id)}">⬇ ดาวน์โหลด</button>`}
            </div>`;
          }).join('') : '<div class="panel empty" style="grid-column:1/-1"><div class="big">🗂️</div>ไม่มีไฟล์ในหมวดนี้</div>'}</div>`;
        view.querySelectorAll('[data-g]').forEach((b) => b.onclick = () => { filter = b.dataset.g; draw(); });
        view.querySelector('#projSel').onchange = (e) => { projFilter = e.target.value; draw(); };
        view.querySelectorAll('[data-dl]').forEach((b) => b.onclick = () => this.downloadPlaceholder(files.find((f) => f.id === b.dataset.dl)));
        UI.reveal(view);
      };
      draw();
    } catch (err) { this.fail(view, err); }
  },

  uploadModal(projects, onDone) {
    const box = UI.modal(`<h3>⬆️ อัปโหลดไฟล์</h3><p class="small">ส่งไฟล์ข้อมูลหรือเอกสารประกอบให้ทีมงาน (ไม่เกิน 10MB)</p>
      <form id="upForm" class="auth-form" novalidate>
        <div class="field"><label>โปรเจกต์</label><select name="project">${projects.length ? projects.map((p) =>
          `<option value="${UI.esc(p.projectId)}">${UI.esc(p.projectId)} — ${UI.esc(p.name)}</option>`).join('') : '<option value="">ทั่วไป</option>'}</select></div>
        <div class="dropzone"><input type="file" name="file" accept=".jpg,.jpeg,.png,.pdf,.zip,.ai,.psd,.fig,.doc,.docx,.svg"><div class="dz-icon">📎</div><div>ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์</div><div class="dz-file"></div></div>
        <button class="btn btn-primary btn-block" type="submit">อัปโหลด</button>
      </form>`);
    const form = box.querySelector('#upForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const file = form.file.files[0];
      if (!file) return UI.toast('กรุณาเลือกไฟล์', 'error');
      if (file.size > 10 * 1024 * 1024) return UI.toast('ไฟล์ต้องมีขนาดไม่เกิน 10MB', 'error');
      const btn = form.querySelector('[type=submit]');
      UI.busy(btn, true, 'กำลังอัปโหลด...');
      try {
        const up = await Storage.upload(`files/${this.user.uid}`, file);
        await DB.add('files', { customerId: this.user.uid, projectId: form.project.value, name: up.name, type: up.type, size: up.size, url: up.url, path: up.path, uploadedBy: 'client' });
        UI.closeModal();
        UI.toast('อัปโหลดไฟล์สำเร็จ', 'success');
        onDone && onDone();
      } catch (err) { console.error(err); UI.toast(err.message || 'อัปโหลดไม่สำเร็จ', 'error'); UI.busy(btn, false); }
    });
  },

  /* =====================================================
     MESSAGES
     ===================================================== */
  async pageMessages() {
    const view = await this.boot('messages', 'ข้อความ', 'พูดคุยกับทีม DesignNext Studio');
    const name = this.customer?.name || this.user.name || this.user.email;
    view.innerHTML = `<div class="panel chat">
        <div class="panel-head" style="margin-bottom:8px">
          <div class="flex"><div class="user-chip" style="margin:0;background:none;padding:0"><div class="av">DN</div>
            <div><div class="nm">DesignNext Studio</div><div class="rl">ทีมงานตอบกลับภายใน 24 ชม. (${UI.esc(COMPANY.hours)})</div></div></div></div>
        </div>
        <div class="chat-body" id="chatBody"><div class="loader"></div></div>
        <form class="chat-form" id="chatForm" autocomplete="off">
          <input class="input" name="text" placeholder="พิมพ์ข้อความ..." maxlength="1000">
          <button class="btn btn-primary" type="submit">ส่ง ➤</button>
        </form>
      </div>`;
    const body = view.querySelector('#chatBody');
    const render = (msgs) => {
      body.innerHTML = msgs.length ? msgs.map((m) => `<div class="bubble ${m.from === 'client' ? 'me' : 'them'}">
          <div class="who">${UI.esc(m.from === 'client' ? 'คุณ' : (m.senderName || 'DesignNext Studio'))} · ${UI.dateTime(m.createdAt)}</div>${UI.esc(m.text)}</div>`).join('')
        : '<div class="empty"><div class="big">💬</div>ยังไม่มีข้อความ เริ่มสนทนาได้เลย</div>';
      body.scrollTop = body.scrollHeight;
    };
    try {
      this.unwatch = DB.watch('messages', { where: ['customerId', '==', this.user.uid], orderBy: 'createdAt', dir: 'asc' }, render);
    } catch (err) { this.fail(view, err); return; }

    const form = view.querySelector('#chatForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = form.text.value.trim();
      if (!text) return;
      const btn = form.querySelector('[type=submit]');
      btn.disabled = true;
      try {
        await DB.add('messages', { customerId: this.user.uid, from: 'client', senderName: name, text });
        form.text.value = '';
      } catch (err) { console.error(err); UI.toast(err.message || 'ส่งข้อความไม่สำเร็จ', 'error'); }
      btn.disabled = false;
      form.text.focus();
    });
  }
};

/* ---------------- Boot ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  const pages = {
    'client-login': 'pageLogin',
    'client-dashboard': 'pageDashboard',
    'client-projects': 'pageProjects',
    'client-quotation': 'pageQuotation',
    'client-files': 'pageFiles',
    'client-messages': 'pageMessages'
  };
  const fn = pages[PAGE];
  if (fn) Client[fn]().catch((err) => { console.error(err); UI.toast(err.message || 'เกิดข้อผิดพลาด', 'error'); });
});
