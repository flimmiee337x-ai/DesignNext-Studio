/* =========================================================
   DesignNext Studio — Admin System
   ---------------------------------------------------------
   Pages: login, dashboard, customers, projects, bookings,
          employees, applications, finance
   ใช้ DB / Storage / Auth จาก firebase.js และ UI จาก script.js
   ========================================================= */

const ADMIN_PAGE = document.body.dataset.page || '';
const admCharts = {};

/* ---------------- Helpers ---------------- */
const adm = {
  todayISO() { return new Date().toISOString().slice(0, 10); },
  plusDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); },
  month(iso) { return String(iso || '').slice(0, 7); },
  monthLabel(key) { const d = new Date(key + '-01T00:00:00'); return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }); },
  sum(arr, f = (x) => x) { return arr.reduce((t, x) => t + Number(f(x) || 0), 0); },
  options(list, selected) { return list.map((v) => `<option ${v === selected ? 'selected' : ''}>${UI.esc(v)}</option>`).join(''); },
  empty(text = 'ไม่พบข้อมูล', icon = '📭') { return `<div class="empty"><div class="big">${icon}</div>${text}</div>`; },
  formData(form, keys) { const fd = new FormData(form); return Object.fromEntries(keys.map((k) => [k, String(fd.get(k) ?? '').trim()])); },
  stat(label, value, sub = '', icon = '', cls = '') {
    return `<div class="stat-card"><div class="lbl"><span>${label}</span><span>${icon}</span></div><div class="val">${value}</div><div class="sub ${cls}">${sub}</div></div>`;
  },
  /* Quotation total with discount + VAT */
  quoteTotal(q) {
    const sub = adm.sum(q.items || [], (i) => Number(i.qty) * Number(i.price));
    const after = sub - Number(q.discount || 0);
    return after + after * (Number(q.vat ?? 7) / 100);
  },
  /* Month keys: Apr–Sep 2026 plus any month found in data */
  monthKeys(rows) {
    const set = new Set(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09']);
    rows.forEach((r) => r.date && set.add(adm.month(r.date)));
    return [...set].sort();
  },
  /* Chart.js wrapper with dark theme + graceful fallback */
  chart(id, config) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    if (typeof Chart === 'undefined') { canvas.parentElement.innerHTML = adm.empty('โหลด Chart.js ไม่ได้ (ต้องเชื่อมต่ออินเทอร์เน็ต)', '📉'); return; }
    Chart.defaults.color = '#9A9AB0';
    Chart.defaults.borderColor = 'rgba(255,255,255,.06)';
    Chart.defaults.font.family = "'IBM Plex Sans Thai', 'Sora', sans-serif";
    if (admCharts[id]) admCharts[id].destroy();
    admCharts[id] = new Chart(canvas, config);
  },
  palette: ['#7667FF', '#38BDF8', '#A78BFA', '#34D399', '#FBBF24', '#F472B6', '#F87171', '#60A5FA']
};

function monthlyChartConfig(finance) {
  const keys = adm.monthKeys(finance);
  const inc = keys.map((k) => adm.sum(finance.filter((f) => f.type === 'income' && f.status === 'Paid' && adm.month(f.date) === k), (f) => f.amount));
  const exp = keys.map((k) => adm.sum(finance.filter((f) => f.type === 'expense' && adm.month(f.date) === k), (f) => f.amount));
  return {
    type: 'bar',
    data: {
      labels: keys.map(adm.monthLabel),
      datasets: [
        { label: 'รายได้', data: inc, backgroundColor: 'rgba(118,103,255,.85)', borderRadius: 8, maxBarThickness: 34 },
        { label: 'ค่าใช้จ่าย', data: exp, backgroundColor: 'rgba(56,189,248,.65)', borderRadius: 8, maxBarThickness: 34 },
        { label: 'กำไร', type: 'line', data: inc.map((v, i) => v - exp[i]), borderColor: '#34D399', backgroundColor: '#34D399', tension: .35, pointRadius: 4 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${UI.money(c.parsed.y)}` } } },
      scales: { y: { ticks: { callback: (v) => '฿' + (v / 1000) + 'k' } }, x: { grid: { display: false } } }
    }
  };
}

function doughnutConfig(labels, data) {
  return {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: adm.palette, borderColor: '#0B0B0F', borderWidth: 3 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '64%', plugins: { legend: { position: 'bottom' } } }
  };
}

/* ---------------- Login ---------------- */
async function admLogin() {
  const form = document.getElementById('adminLoginForm');
  const logo = document.querySelector('.auth-card .logo');
  if (logo) logo.outerHTML = UI.logo('../index.html'); // inline SVG logo
  if (DN.mode === 'demo') {
    document.getElementById('demoHint').innerHTML = `<div class="demo-hint">🧪 <b>Demo Mode</b> — ยังไม่ได้ตั้งค่า Firebase<br>Email: <b>${DEMO_ADMIN.email}</b><br>Password: <b>${DEMO_ADMIN.password}</b>
      <button type="button" class="btn btn-ghost btn-sm mt-1" id="fillDemo">ใส่ข้อมูลทดสอบ</button></div>`;
    document.getElementById('fillDemo').onclick = () => { form.email.value = DEMO_ADMIN.email; form.password.value = DEMO_ADMIN.password; };
  }
  const cur = await Auth.current();
  if (cur && Auth.isAdmin(cur)) { location.href = 'dashboard.html'; return; }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const email = form.email.value.trim(); const password = form.password.value;
    if (!email || !password) return UI.toast('กรุณากรอกอีเมลและรหัสผ่าน', 'error');
    UI.busy(btn, true, 'กำลังเข้าสู่ระบบ...');
    try {
      const user = await Auth.login(email, password);
      if (!Auth.isAdmin(user)) { await Auth.logout(); throw new Error('บัญชีนี้ไม่มีสิทธิ์เข้าระบบ Admin'); }
      UI.toast('เข้าสู่ระบบสำเร็จ', 'success');
      location.href = 'dashboard.html';
    } catch (err) {
      const msg = /auth\/(invalid-credential|wrong-password|user-not-found|invalid-email)/.test(err.code || '') ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : err.message;
      UI.toast(msg, 'error'); UI.busy(btn, false);
    }
  });
}

/* ---------------- Dashboard ---------------- */
async function admDashboard(view) {
  if (DN.mode === 'firebase') await DN.seed(); // seeds only once (meta/seed)
  document.getElementById('topActions').innerHTML = '<button class="btn btn-ghost btn-sm" id="resetSeed">↺ Reset demo data</button>';
  document.getElementById('resetSeed').onclick = async () => {
    if (!await UI.confirm('Reset demo data', 'เขียนข้อมูลตัวอย่างทับข้อมูลตัวอย่างเดิมทั้งหมด (ข้อมูลที่เพิ่มใหม่จะยังอยู่) ต้องการดำเนินการต่อหรือไม่?', 'Reset')) return;
    await DN.seed(true); UI.toast('รีเซ็ตข้อมูลตัวอย่างแล้ว', 'success'); admDashboard(view);
  };

  const [projects, customers, bookings, apps, finance, contacts] = await Promise.all(
    ['projects', 'customers', 'bookings', 'applications', 'finance', 'contacts'].map((c) => DB.list(c)));
  const revenue = adm.sum(finance.filter((f) => f.type === 'income' && f.status === 'Paid'), (f) => f.amount);
  const pending = adm.sum(finance.filter((f) => f.type === 'income' && f.status === 'Pending'), (f) => f.amount);
  const active = projects.filter((p) => ['In Progress', 'Review'].includes(p.status)).length;
  const waiting = projects.filter((p) => p.status === 'Pending').length;
  const upcoming = bookings.filter((b) => !['Cancelled', 'Completed'].includes(b.status)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 6);
  const recentApps = [...apps].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, 5);
  const recentContacts = [...contacts].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, 6);
  const statusCount = STATUS.project.map((s) => projects.filter((p) => p.status === s).length);

  view.innerHTML = `
    <div class="stats">
      ${adm.stat('รายได้ (รับแล้ว)', UI.money(revenue), `รอชำระ ${UI.money(pending)}`, '💰', 'up')}
      ${adm.stat('จำนวน Project', projects.length, `${projects.filter((p) => p.status === 'Completed').length} เสร็จสมบูรณ์`, '📁')}
      ${adm.stat('จำนวนลูกค้า', customers.length, `${customers.filter((c) => c.status === 'Active').length} Active`, '👤')}
      ${adm.stat('จำนวน Booking', bookings.length, `${bookings.filter((b) => b.status === 'Pending').length} รอยืนยัน`, '📅')}
      ${adm.stat('จำนวนใบสมัคร', apps.length, `${apps.filter((a) => a.status === 'New').length} ใบสมัครใหม่`, '📝')}
      ${adm.stat('งานที่กำลังดำเนินการ', active, 'In Progress + Review', '⚙️')}
      ${adm.stat('งานที่รอดำเนินการ', waiting, 'Pending', '⏳')}
      ${adm.stat('ข้อความติดต่อใหม่', contacts.filter((c) => c.status !== 'Read').length, `ทั้งหมด ${contacts.length} รายการ`, '✉️')}
    </div>
    <div class="split">
      <div class="panel"><div class="panel-head"><h3>รายได้ vs ค่าใช้จ่าย รายเดือน</h3><a href="finance.html" class="link-arrow small">Finance →</a></div><div class="chart-box"><canvas id="chMonthly"></canvas></div></div>
      <div class="panel"><div class="panel-head"><h3>สถานะ Project</h3></div><div class="chart-box"><canvas id="chStatus"></canvas></div></div>
    </div>
    <div class="split">
      <div class="panel"><div class="panel-head"><h3>นัดหมายที่กำลังจะถึง</h3><a href="bookings.html" class="link-arrow small">ทั้งหมด →</a></div>
        ${upcoming.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Booking ID</th><th>ลูกค้า</th><th>บริการ</th><th>วันที่ / เวลา</th><th>Status</th></tr></thead><tbody>
        ${upcoming.map((b) => `<tr><td class="id">${UI.esc(b.bookingId)}</td><td>${UI.esc(b.name)}<br><small class="muted">${UI.esc(b.company || '')}</small></td><td>${UI.esc(b.service)}</td><td>${UI.dateShort(b.date)} · ${UI.esc(b.time)}</td><td>${UI.status(b.status)}</td></tr>`).join('')}
        </tbody></table></div>` : adm.empty('ไม่มีนัดหมาย')}</div>
      <div class="panel"><div class="panel-head"><h3>ใบสมัครล่าสุด</h3><a href="applications.html" class="link-arrow small">ทั้งหมด →</a></div>
        ${recentApps.length ? recentApps.map((a) => `<div class="flex between" style="padding:10px 0;border-bottom:1px solid var(--border)"><div><b style="color:#fff">${UI.esc(a.name)}</b><br><small class="muted">${UI.esc(a.position)} · ${UI.dateShort(a.createdAt)}</small></div>${UI.status(a.status)}</div>`).join('') : adm.empty('ยังไม่มีใบสมัคร')}</div>
    </div>
    <div class="panel"><div class="panel-head"><h3>ข้อความจากฟอร์มติดต่อ / ขอใบเสนอราคา</h3></div>
      ${recentContacts.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>วันที่</th><th>ชื่อ</th><th>ประเภท</th><th>บริการ</th><th>งบประมาณ</th><th>Status</th><th></th></tr></thead><tbody>
      ${recentContacts.map((c) => `<tr><td>${UI.dateShort(c.createdAt)}</td><td>${UI.esc(c.name)}<br><small class="muted">${UI.esc(c.email)}</small></td><td>${UI.esc(c.type || 'Contact')}</td><td>${UI.esc(c.service)}</td><td>${UI.esc(c.budget || '-')}</td><td>${UI.status(c.status === 'Read' ? 'Read' : 'New')}</td><td><button class="btn btn-ghost btn-sm" data-contact="${c.id}">ดู</button></td></tr>`).join('')}
      </tbody></table></div>` : adm.empty('ยังไม่มีข้อความจากหน้า Contact')}</div>`;

  adm.chart('chMonthly', monthlyChartConfig(finance));
  adm.chart('chStatus', doughnutConfig(STATUS.project, statusCount));
  view.querySelectorAll('[data-contact]').forEach((b) => b.onclick = async () => {
    const c = contacts.find((x) => x.id === b.dataset.contact);
    UI.modal(`<span class="eyebrow">${UI.esc(c.type || 'Contact')}</span><h2 style="font-size:1.5rem">${UI.esc(c.name)}</h2>
      <dl class="kv"><dt>บริษัท</dt><dd>${UI.esc(c.company || '-')}</dd><dt>Email</dt><dd>${UI.esc(c.email)}</dd><dt>เบอร์โทร</dt><dd>${UI.esc(c.phone)}</dd>
      <dt>บริการที่สนใจ</dt><dd>${UI.esc(c.service)}</dd><dt>งบประมาณ</dt><dd>${UI.esc(c.budget || '-')}</dd><dt>วันที่ส่ง</dt><dd>${UI.dateTime(c.createdAt)}</dd>
      <dt>ไฟล์แนบ</dt><dd>${c.fileUrl ? `<a class="link-arrow" href="${UI.esc(c.fileUrl)}" target="_blank" download="${UI.esc(c.fileName)}">⬇ ${UI.esc(c.fileName)}</a>` : (c.fileName ? UI.esc(c.fileName) + ' (ไฟล์ใหญ่เกิน Demo Mode)' : '-')}</dd></dl>
      <h4 class="mt-2">รายละเอียดงาน</h4><p style="white-space:pre-wrap">${UI.esc(c.details)}</p>`);
    if (c.status !== 'Read') { await DB.update('contacts', c.id, { status: 'Read' }); c.status = 'Read'; }
  });
}

/* ---------------- Customers ---------------- */
async function admCustomers(view) {
  document.getElementById('topActions').innerHTML = '<button class="btn btn-primary btn-sm" id="addCus">+ เพิ่มลูกค้า</button>';
  let [customers, projects] = await Promise.all([DB.list('customers', { orderBy: 'customerId' }), DB.list('projects')]);
  const count = (c) => projects.filter((p) => p.customerId === c.id).length;

  view.innerHTML = `
    <div class="stats">
      ${adm.stat('ลูกค้าทั้งหมด', customers.length, '', '👤')}
      ${adm.stat('Active', customers.filter((c) => c.status === 'Active').length, '', '✅')}
      ${adm.stat('Inactive', customers.filter((c) => c.status !== 'Active').length, '', '⏸')}
      ${adm.stat('Project ทั้งหมด', projects.length, '', '📁')}
    </div>
    <div class="panel">
      <div class="toolbar"><input class="input" id="q" placeholder="🔍 ค้นหา ชื่อ / บริษัท / Email / Customer ID">
        <select class="input" id="fStatus"><option value="">ทุกสถานะ</option><option>Active</option><option>Inactive</option></select></div>
      <div id="tbl"></div>
    </div>`;

  const draw = () => {
    const q = view.querySelector('#q').value.toLowerCase(); const s = view.querySelector('#fStatus').value;
    const rows = customers.filter((c) => (!s || c.status === s) && [c.customerId, c.name, c.company, c.email, c.phone].join(' ').toLowerCase().includes(q));
    view.querySelector('#tbl').innerHTML = rows.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Customer ID</th><th>ชื่อลูกค้า</th><th>บริษัท</th><th>Email</th><th>เบอร์โทร</th><th>Projects</th><th>Status</th><th></th></tr></thead><tbody>
      ${rows.map((c) => `<tr><td class="id">${UI.esc(c.customerId)}</td><td>${UI.esc(c.name)}</td><td>${UI.esc(c.company)}</td><td>${UI.esc(c.email)}</td><td>${UI.esc(c.phone)}</td><td>${count(c)}</td><td>${UI.status(c.status)}</td>
        <td><div class="actions"><button class="btn btn-ghost btn-sm" data-view="${c.id}">ดู</button><button class="btn btn-ghost btn-sm" data-edit="${c.id}">แก้ไข</button><button class="btn btn-ghost btn-sm" data-toggle="${c.id}">${c.status === 'Active' ? 'ปิด' : 'เปิด'}</button></div></td></tr>`).join('')}
      </tbody></table></div>` : adm.empty('ไม่พบลูกค้า');
  };
  const reload = async () => { customers = await DB.list('customers', { orderBy: 'customerId' }); draw(); };
  draw();
  view.querySelector('#q').oninput = draw;
  view.querySelector('#fStatus').onchange = draw;

  const form = (c = {}) => UI.modal(`<h2 style="font-size:1.5rem">${c.id ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มลูกค้าใหม่'}</h2>
    <form id="cusForm" class="form-grid mt-1">
      <div class="field"><label>ชื่อลูกค้า *</label><input name="name" value="${UI.esc(c.name)}" required></div>
      <div class="field"><label>บริษัท</label><input name="company" value="${UI.esc(c.company)}"></div>
      <div class="field"><label>Email *</label><input name="email" type="email" value="${UI.esc(c.email)}" required></div>
      <div class="field"><label>เบอร์โทร</label><input name="phone" value="${UI.esc(c.phone)}"></div>
      <div class="field"><label>Status</label><select name="status">${adm.options(['Active', 'Inactive'], c.status || 'Active')}</select></div>
      <div class="full"><button class="btn btn-primary btn-block" type="submit">บันทึก</button></div>
    </form>`).querySelector('#cusForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = adm.formData(e.target, ['name', 'company', 'email', 'phone', 'status']);
    if (!data.name || !data.email) return UI.toast('กรุณากรอกชื่อและอีเมล', 'error');
    const btn = e.target.querySelector('button'); UI.busy(btn, true);
    try {
      if (c.id) await DB.update('customers', c.id, data);
      else await DB.add('customers', { ...data, customerId: await DB.nextId('customer') });
      UI.closeModal(); UI.toast('บันทึกข้อมูลลูกค้าแล้ว', 'success'); reload();
    } catch (err) { UI.toast(err.message, 'error'); UI.busy(btn, false); }
  });

  document.getElementById('addCus').onclick = () => form();
  view.addEventListener('click', async (e) => {
    const t = e.target.closest('button'); if (!t) return;
    const find = (id) => customers.find((c) => c.id === id);
    if (t.dataset.edit) form(find(t.dataset.edit));
    if (t.dataset.toggle) {
      const c = find(t.dataset.toggle);
      await DB.update('customers', c.id, { status: c.status === 'Active' ? 'Inactive' : 'Active' });
      UI.toast('อัปเดตสถานะแล้ว', 'success'); reload();
    }
    if (t.dataset.view) {
      const c = find(t.dataset.view);
      const [bks, qts] = await Promise.all([DB.list('bookings', { where: ['email', '==', c.email] }), DB.list('quotations', { where: ['customerId', '==', c.id] })]);
      const prj = projects.filter((p) => p.customerId === c.id);
      UI.modal(`<span class="id">${UI.esc(c.customerId)}</span><h2 style="font-size:1.6rem;margin-top:6px">${UI.esc(c.name)}</h2>
        <dl class="kv"><dt>บริษัท</dt><dd>${UI.esc(c.company)}</dd><dt>Email</dt><dd>${UI.esc(c.email)}</dd><dt>เบอร์โทร</dt><dd>${UI.esc(c.phone || '-')}</dd><dt>Status</dt><dd>${UI.status(c.status)}</dd><dt>ลงทะเบียน</dt><dd>${UI.date(c.createdAt)}</dd></dl>
        <h4 class="mt-2">Projects (${prj.length})</h4>
        ${prj.length ? prj.map((p) => `<div class="flex between" style="padding:8px 0;border-bottom:1px solid var(--border)"><div><span class="id">${UI.esc(p.projectId)}</span> ${UI.esc(p.name)}<br><small class="muted">${UI.esc(p.service)} · ${UI.money(p.budget)}</small></div>${UI.status(p.status)}</div>`).join('') : '<p class="small">ไม่มี Project</p>'}
        <h4 class="mt-2">Bookings (${bks.length})</h4>
        ${bks.length ? bks.map((b) => `<div class="flex between" style="padding:8px 0;border-bottom:1px solid var(--border)"><div><span class="id">${UI.esc(b.bookingId)}</span> ${UI.esc(b.service)}<br><small class="muted">${UI.dateShort(b.date)} · ${UI.esc(b.time)}</small></div>${UI.status(b.status)}</div>`).join('') : '<p class="small">ไม่มีการจอง</p>'}
        <h4 class="mt-2">Quotations (${qts.length})</h4>
        ${qts.length ? qts.map((q) => `<div class="flex between" style="padding:8px 0;border-bottom:1px solid var(--border)"><div><span class="id">${UI.esc(q.quotationNo)}</span> ${UI.money(adm.quoteTotal(q))}<br><small class="muted">${UI.dateShort(q.date)}</small></div>${UI.status(q.status)}</div>`).join('') : '<p class="small">ไม่มีใบเสนอราคา</p>'}`, { wide: true });
    }
  });
}

/* ---------------- Projects ---------------- */
async function admProjects(view) {
  document.getElementById('topActions').innerHTML = '<button class="btn btn-primary btn-sm" id="addPrj">+ สร้าง Project</button>';
  let [projects, customers] = await Promise.all([DB.list('projects', { orderBy: 'projectId' }), DB.list('customers', { orderBy: 'customerId' })]);
  const owners = EMPLOYEES.map((e) => e.name);

  view.innerHTML = `
    <div class="stats" id="pStats"></div>
    <div class="panel">
      <div class="toolbar"><input class="input" id="q" placeholder="🔍 ค้นหา Project ID / ชื่อ / ลูกค้า / ผู้รับผิดชอบ">
        <select class="input" id="fStatus"><option value="">ทุกสถานะ</option>${adm.options(STATUS.project)}</select>
        <select class="input" id="fService"><option value="">ทุกบริการ</option>${adm.options(SERVICES.map((s) => s.name))}</select></div>
      <div id="tbl"></div>
    </div>`;

  const draw = () => {
    view.querySelector('#pStats').innerHTML = STATUS.project.slice(0, 4).map((s) => adm.stat(s, projects.filter((p) => p.status === s).length, '', '')).join('');
    const q = view.querySelector('#q').value.toLowerCase(); const s = view.querySelector('#fStatus').value; const sv = view.querySelector('#fService').value;
    const rows = projects.filter((p) => (!s || p.status === s) && (!sv || p.service === sv) && [p.projectId, p.name, p.customerName, p.owner].join(' ').toLowerCase().includes(q));
    view.querySelector('#tbl').innerHTML = rows.length ? `<div class="table-wrap"><table class="table" style="min-width:1150px"><thead><tr><th>Project ID</th><th>Customer</th><th>Project Name</th><th>Service</th><th>ผู้รับผิดชอบ</th><th>เริ่มงาน</th><th>Deadline</th><th>Budget</th><th>Progress</th><th>Status</th><th></th></tr></thead><tbody>
      ${rows.map((p) => `<tr><td class="id">${UI.esc(p.projectId)}</td><td>${UI.esc(p.customerName)}</td><td><b style="color:#fff">${UI.esc(p.name)}</b><br><small class="muted">${UI.esc(p.stage || '')}</small></td><td>${UI.esc(p.service)}</td><td>${UI.esc(p.owner)}</td>
        <td>${UI.dateShort(p.startDate)}</td><td>${UI.dateShort(p.deadline)}</td><td>${UI.money(p.budget)}</td><td style="min-width:110px"><small>${p.progress || 0}%</small>${UI.progress(p.progress)}</td>
        <td><select class="input" style="padding:6px 34px 6px 10px;font-size:.8rem;min-width:130px" data-status="${p.id}">${adm.options(STATUS.project, p.status)}</select></td>
        <td><div class="actions"><button class="btn btn-ghost btn-sm" data-edit="${p.id}">แก้ไข</button><button class="btn btn-ghost btn-sm" data-quote="${p.id}">🧾 ใบเสนอราคา</button><button class="btn btn-ghost btn-sm" data-upload="${p.id}">⬆ ไฟล์</button></div></td></tr>`).join('')}
      </tbody></table></div>` : adm.empty('ไม่พบ Project');
    UI.reveal(view);
  };
  const reload = async () => { projects = await DB.list('projects', { orderBy: 'projectId' }); draw(); };
  draw();
  ['#q', '#fStatus', '#fService'].forEach((s) => view.querySelector(s).addEventListener('input', draw));

  /* Inline status change */
  view.addEventListener('change', async (e) => {
    const sel = e.target.closest('[data-status]'); if (!sel) return;
    const patch = { status: sel.value };
    if (sel.value === 'Completed') Object.assign(patch, { progress: 100, stage: 'Delivered' });
    await DB.update('projects', sel.dataset.status, patch);
    UI.toast(`เปลี่ยนสถานะเป็น ${sel.value}`, 'success'); reload();
  });

  /* Create / edit modal */
  const form = (p = {}) => {
    const isNew = !p.id;
    const box = UI.modal(`<h2 style="font-size:1.5rem">${isNew ? 'สร้าง Project ใหม่' : 'แก้ไข ' + UI.esc(p.projectId)}</h2>
      <form id="prjForm" class="form-grid mt-1">
        ${isNew ? `<div class="field full"><label>ลูกค้า *</label><select name="customerId" required><option value="">— เลือกลูกค้า —</option>${customers.map((c) => `<option value="${c.id}">${UI.esc(c.customerId)} · ${UI.esc(c.name)} (${UI.esc(c.company)})</option>`).join('')}</select></div>` : ''}
        <div class="field full"><label>ชื่อ Project *</label><input name="name" value="${UI.esc(p.name)}" required></div>
        <div class="field"><label>บริการ</label><select name="service">${adm.options(SERVICES.map((s) => s.name), p.service)}</select></div>
        <div class="field"><label>แพ็กเกจ</label><select name="package">${adm.options([...PACKAGES.map((x) => x.name), 'Custom'], p.package)}</select></div>
        <div class="field"><label>ผู้รับผิดชอบ</label><select name="owner">${adm.options(owners, p.owner)}</select></div>
        <div class="field"><label>Stage (ขั้นตอนปัจจุบัน)</label><input name="stage" value="${UI.esc(p.stage || 'Discover')}"></div>
        <div class="field"><label>วันที่เริ่มงาน</label><input name="startDate" type="date" value="${UI.esc(p.startDate || adm.todayISO())}"></div>
        <div class="field"><label>Deadline</label><input name="deadline" type="date" value="${UI.esc(p.deadline || adm.plusDays(30))}"></div>
        <div class="field"><label>Budget (บาท)</label><input name="budget" type="number" min="0" value="${p.budget ?? 0}"></div>
        <div class="field"><label>ชำระแล้ว (บาท)</label><input name="paid" type="number" min="0" value="${p.paid ?? 0}"></div>
        <div class="field"><label>Progress: <b id="pv">${p.progress ?? 0}</b>%</label><input name="progress" type="range" min="0" max="100" step="5" value="${p.progress ?? 0}"></div>
        <div class="field"><label>สถานะการชำระเงิน</label><select name="paymentStatus">${adm.options(STATUS.payment, p.paymentStatus || 'Unpaid')}</select></div>
        <div class="field"><label>Status</label><select name="status">${adm.options(STATUS.project, p.status || 'Pending')}</select></div>
        <div class="full"><button class="btn btn-primary btn-block" type="submit">บันทึก</button></div>
      </form>`, { wide: true });
    const f = box.querySelector('#prjForm');
    f.progress.oninput = () => { box.querySelector('#pv').textContent = f.progress.value; };
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const d = adm.formData(f, ['name', 'service', 'package', 'owner', 'stage', 'startDate', 'deadline', 'budget', 'paid', 'progress', 'paymentStatus', 'status']);
      if (!d.name) return UI.toast('กรุณากรอกชื่อ Project', 'error');
      Object.assign(d, { budget: Number(d.budget), paid: Number(d.paid), progress: Number(d.progress) });
      const btn = f.querySelector('button[type=submit]'); UI.busy(btn, true);
      try {
        if (isNew) {
          const c = customers.find((x) => x.id === f.customerId.value);
          if (!c) { UI.busy(btn, false); return UI.toast('กรุณาเลือกลูกค้า', 'error'); }
          await DB.add('projects', { ...d, customerId: c.id, customerName: c.company && c.company !== '-' ? c.company : c.name, projectId: await DB.nextId('project') });
        } else await DB.update('projects', p.id, d);
        UI.closeModal(); UI.toast('บันทึก Project แล้ว', 'success'); reload();
      } catch (err) { UI.toast(err.message, 'error'); UI.busy(btn, false); }
    });
  };

  /* Quotation builder */
  const quoteForm = (p) => {
    const c = customers.find((x) => x.id === p.customerId) || { name: p.customerName, company: p.customerName };
    const box = UI.modal(`<h2 style="font-size:1.5rem">สร้างใบเสนอราคา</h2><p class="small">${UI.esc(p.projectId)} · ${UI.esc(p.name)} · ลูกค้า ${UI.esc(c.name)}</p>
      <form id="qForm">
        <div class="table-wrap"><table class="table" style="min-width:560px"><thead><tr><th>รายการบริการ</th><th style="width:90px">จำนวน</th><th style="width:140px">ราคา/หน่วย</th><th style="width:50px"></th></tr></thead><tbody id="items"></tbody></table></div>
        <button type="button" class="btn btn-ghost btn-sm mt-1" id="addItem">+ เพิ่มรายการ</button>
        <div class="form-grid mt-2">
          <div class="field"><label>ส่วนลด (บาท)</label><input name="discount" type="number" min="0" value="0"></div>
          <div class="field"><label>วันหมดอายุ</label><input name="validUntil" type="date" value="${adm.plusDays(30)}"></div>
        </div>
        <div class="panel mt-2" id="qSum" style="margin-bottom:16px"></div>
        <button class="btn btn-primary btn-block" type="submit">ออกใบเสนอราคา</button>
      </form>`, { wide: true });
    const tbody = box.querySelector('#items');
    const pkg = PACKAGES.find((x) => x.name === p.package);
    const addRow = (desc = '', qty = 1, price = 0) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td><input class="input" data-k="desc" value="${UI.esc(desc)}" placeholder="รายละเอียดบริการ"></td><td><input class="input" data-k="qty" type="number" min="1" value="${qty}"></td><td><input class="input" data-k="price" type="number" min="0" value="${price}"></td><td><button type="button" class="btn btn-danger btn-sm" data-del>✕</button></td>`;
      tbody.appendChild(tr); calc();
    };
    const items = () => [...tbody.querySelectorAll('tr')].map((tr) => ({ desc: tr.querySelector('[data-k=desc]').value.trim(), qty: Number(tr.querySelector('[data-k=qty]').value), price: Number(tr.querySelector('[data-k=price]').value) })).filter((i) => i.desc);
    const calc = () => {
      const q = { items: items(), discount: Number(box.querySelector('[name=discount]').value), vat: 7 };
      const sub = adm.sum(q.items, (i) => i.qty * i.price);
      box.querySelector('#qSum').innerHTML = `<div class="flex between"><span>รวม</span><b>${UI.money(sub)}</b></div><div class="flex between"><span>ส่วนลด</span><b>- ${UI.money(q.discount)}</b></div>
        <div class="flex between"><span>VAT 7%</span><b>${UI.money((sub - q.discount) * 0.07)}</b></div><div class="divider" style="margin:10px 0"></div><div class="flex between"><span>ยอดรวมสุทธิ</span><b class="gradient-text" style="font-size:1.3rem">${UI.money(adm.quoteTotal(q))}</b></div>`;
    };
    addRow(pkg ? `${pkg.name} Package — ${p.name}` : `${p.service} — ${p.name}`, 1, pkg ? pkg.price : p.budget || 0);
    box.querySelector('#addItem').onclick = () => addRow();
    box.addEventListener('input', calc);
    tbody.addEventListener('click', (e) => { if (e.target.closest('[data-del]')) { e.target.closest('tr').remove(); calc(); } });
    box.querySelector('#qForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const it = items(); if (!it.length) return UI.toast('กรุณาเพิ่มรายการอย่างน้อย 1 รายการ', 'error');
      const btn = e.target.querySelector('button[type=submit]'); UI.busy(btn, true);
      try {
        const quotationNo = await DB.nextId('quotation');
        await DB.add('quotations', {
          quotationNo, customerId: p.customerId, customerName: c.name, customerCompany: c.company || '-', customerEmail: c.email || '', customerPhone: c.phone || '',
          projectId: p.projectId, date: adm.todayISO(), validUntil: box.querySelector('[name=validUntil]').value,
          items: it, discount: Number(box.querySelector('[name=discount]').value), vat: 7, status: 'Pending'
        });
        UI.closeModal(); UI.toast(`ออกใบเสนอราคา ${quotationNo} แล้ว`, 'success');
      } catch (err) { UI.toast(err.message, 'error'); UI.busy(btn, false); }
    });
  };

  /* Upload files for customer (Firebase Storage) */
  const uploadForm = (p) => {
    const box = UI.modal(`<h2 style="font-size:1.5rem">อัปโหลดไฟล์ให้ลูกค้า</h2><p class="small">${UI.esc(p.projectId)} · ${UI.esc(p.name)} · ${UI.esc(p.customerName)}</p>
      <form id="upForm"><div class="dropzone"><input type="file" name="files" multiple accept=".jpg,.jpeg,.png,.pdf,.zip,.ai,.psd,.fig,.svg"><div class="dz-icon">☁️</div><div>JPG · PNG · PDF · ZIP · Source File (AI / PSD / FIG)</div><div class="dz-file"></div></div>
      <button class="btn btn-primary btn-block mt-2" type="submit">อัปโหลด</button></form>`);
    box.querySelector('#upForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const files = [...e.target.files.files]; if (!files.length) return UI.toast('กรุณาเลือกไฟล์', 'error');
      const btn = e.target.querySelector('button'); UI.busy(btn, true, 'กำลังอัปโหลด...');
      try {
        for (const file of files) {
          const up = await Storage.upload(`files/${p.customerId}`, file);
          await DB.add('files', { customerId: p.customerId, projectId: p.projectId, name: up.name, type: up.type, size: up.size, url: up.url, path: up.path, uploadedBy: 'studio' });
        }
        UI.closeModal(); UI.toast(`อัปโหลด ${files.length} ไฟล์แล้ว`, 'success');
      } catch (err) { UI.toast(err.message, 'error'); UI.busy(btn, false); }
    });
  };

  document.getElementById('addPrj').onclick = () => form();
  view.addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t) return;
    const p = projects.find((x) => x.id === (t.dataset.edit || t.dataset.quote || t.dataset.upload));
    if (!p) return;
    if (t.dataset.edit) form(p);
    if (t.dataset.quote) quoteForm(p);
    if (t.dataset.upload) uploadForm(p);
  });
}

/* ---------------- Bookings ---------------- */
async function admBookings(view) {
  let bookings = await DB.list('bookings', { orderBy: 'bookingId', dir: 'desc' });
  view.innerHTML = `
    <div class="stats" id="bStats"></div>
    <div class="split">
      <div class="panel">
        <div class="panel-head"><h3>คิวทั้งหมด</h3></div>
        <div class="toolbar"><input class="input" id="q" placeholder="🔍 ค้นหา Booking ID / ชื่อ / บริการ">
          <select class="input" id="fStatus"><option value="">ทุกสถานะ</option>${adm.options(STATUS.booking)}</select>
          <input class="input" type="date" id="fDate" style="flex:0 0 auto;min-width:160px"></div>
        <div id="tbl"></div>
      </div>
      <div class="panel"><div class="panel-head"><h3>📅 Agenda — นัดหมายที่กำลังจะถึง</h3></div><div id="agenda"></div></div>
    </div>`;

  const draw = () => {
    view.querySelector('#bStats').innerHTML = STATUS.booking.slice(0, 4).map((s) => adm.stat(s, bookings.filter((b) => b.status === s).length)).join('');
    const q = view.querySelector('#q').value.toLowerCase(); const s = view.querySelector('#fStatus').value; const d = view.querySelector('#fDate').value;
    const rows = bookings.filter((b) => (!s || b.status === s) && (!d || b.date === d) && [b.bookingId, b.name, b.company, b.service, b.email].join(' ').toLowerCase().includes(q));
    view.querySelector('#tbl').innerHTML = rows.length ? `<div class="table-wrap"><table class="table" style="min-width:820px"><thead><tr><th>Booking ID</th><th>ลูกค้า</th><th>บริการ / แพ็กเกจ</th><th>วันที่ / เวลา</th><th>Status</th><th></th></tr></thead><tbody>
      ${rows.map((b) => `<tr><td class="id">${UI.esc(b.bookingId)}</td><td>${UI.esc(b.name)}<br><small class="muted">${UI.esc(b.company || b.email)}</small></td><td>${UI.esc(b.service)}<br><small class="muted">${UI.esc(b.package || '-')}</small></td>
        <td><b style="color:#fff">${UI.dateShort(b.date)}</b><br><small class="muted">🕒 ${UI.esc(b.time)} น.</small></td><td>${UI.status(b.status)}</td>
        <td><div class="actions"><button class="btn btn-ghost btn-sm" data-view="${b.id}">ดู</button>${actionBtns(b)}</div></td></tr>`).join('')}
      </tbody></table></div>` : adm.empty('ไม่พบการจอง');

    // Agenda grouped by date
    const up = bookings.filter((b) => !['Cancelled', 'Completed'].includes(b.status)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    const groups = {}; up.forEach((b) => (groups[b.date] = groups[b.date] || []).push(b));
    view.querySelector('#agenda').innerHTML = up.length ? Object.entries(groups).map(([date, list]) => `
      <div style="margin-bottom:18px"><div style="font-family:var(--font-head);font-weight:700;color:#C4BCFF;margin-bottom:8px">${new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</div>
      ${list.map((b) => `<div class="flex" style="padding:10px 12px;border-radius:12px;background:var(--glass);border:1px solid var(--border);margin-bottom:8px;align-items:flex-start">
        <b style="color:#fff;min-width:52px">${UI.esc(b.time)}</b><div style="flex:1"><div style="color:#fff">${UI.esc(b.name)}</div><small class="muted">${UI.esc(b.service)} · ${UI.esc(b.bookingId)}</small></div>${UI.status(b.status)}</div>`).join('')}</div>`).join('') : adm.empty('ไม่มีนัดหมายที่กำลังจะถึง', '🗓️');
  };
  const actionBtns = (b) => {
    if (['Cancelled', 'Completed'].includes(b.status)) return '';
    return `${b.status !== 'Confirmed' ? `<button class="btn btn-ghost btn-sm" data-act="Confirmed" data-id="${b.id}">Confirm</button>` : ''}
      <button class="btn btn-ghost btn-sm" data-resched="${b.id}">Reschedule</button>
      <button class="btn btn-ghost btn-sm" data-act="Completed" data-id="${b.id}">Complete</button>
      <button class="btn btn-danger btn-sm" data-act="Cancelled" data-id="${b.id}">Cancel</button>`;
  };
  const reload = async () => { bookings = await DB.list('bookings', { orderBy: 'bookingId', dir: 'desc' }); draw(); };
  draw();
  ['#q', '#fStatus', '#fDate'].forEach((s) => view.querySelector(s).addEventListener('input', draw));

  const setStatus = async (id, status) => {
    if (status === 'Cancelled' && !await UI.confirm('ยกเลิกการจอง', 'ต้องการยกเลิกการจองนี้หรือไม่?', 'ยกเลิกการจอง')) return;
    await DB.update('bookings', id, { status });
    UI.toast(`อัปเดตสถานะเป็น ${status}`, 'success'); reload();
  };

  view.addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.act) setStatus(t.dataset.id, t.dataset.act);
    if (t.dataset.view) {
      const b = bookings.find((x) => x.id === t.dataset.view);
      const box = UI.modal(`<span class="id">${UI.esc(b.bookingId)}</span><h2 style="font-size:1.6rem;margin-top:6px">${UI.esc(b.name)}</h2>
        <dl class="kv"><dt>บริษัท</dt><dd>${UI.esc(b.company || '-')}</dd><dt>Email</dt><dd>${UI.esc(b.email)}</dd><dt>เบอร์โทร</dt><dd>${UI.esc(b.phone)}</dd>
        <dt>บริการ</dt><dd>${UI.esc(b.service)}</dd><dt>แพ็กเกจ</dt><dd>${UI.esc(b.package || '-')}</dd>
        <dt>วันที่นัด</dt><dd><b style="color:#fff">${UI.date(b.date)} · ${UI.esc(b.time)} น.</b>${b.rescheduledFrom ? `<br><small class="muted">เดิม: ${UI.esc(b.rescheduledFrom)}</small>` : ''}</dd>
        <dt>Status</dt><dd>${UI.status(b.status)}</dd><dt>จองเมื่อ</dt><dd>${UI.dateTime(b.createdAt)}</dd></dl>
        <h4 class="mt-2">รายละเอียดงาน</h4><p style="white-space:pre-wrap">${UI.esc(b.details || '-')}</p>
        <div class="actions mt-1">${actionBtns(b)}</div>`);
      box.addEventListener('click', (ev) => { const x = ev.target.closest('button'); if (!x) return; if (x.dataset.act) { UI.closeModal(); setStatus(x.dataset.id, x.dataset.act); } if (x.dataset.resched) resched(x.dataset.resched); });
    }
    if (t.dataset.resched) resched(t.dataset.resched);
  });

  function resched(id) {
    const b = bookings.find((x) => x.id === id);
    const box = UI.modal(`<h2 style="font-size:1.5rem">Reschedule ${UI.esc(b.bookingId)}</h2><p class="small">นัดเดิม: ${UI.date(b.date)} · ${UI.esc(b.time)} น.</p>
      <form id="rsForm" class="form-grid"><div class="field"><label>วันที่ใหม่</label><input type="date" name="date" min="${adm.todayISO()}" value="${UI.esc(b.date)}" required></div>
      <div class="field"><label>เวลาใหม่</label><select name="time">${adm.options(BOOKING_TIMES, b.time)}</select></div>
      <div class="full"><button class="btn btn-primary btn-block" type="submit">บันทึกนัดหมายใหม่</button></div></form>`);
    box.querySelector('#rsForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const d = adm.formData(e.target, ['date', 'time']);
      if (!d.date) return UI.toast('กรุณาเลือกวันที่', 'error');
      await DB.update('bookings', id, { ...d, status: 'Rescheduled', rescheduledFrom: `${b.date} ${b.time}` });
      UI.closeModal(); UI.toast('เลื่อนนัดหมายแล้ว', 'success'); reload();
    });
  }
}

/* ---------------- Employees ---------------- */
async function admEmployees(view) {
  let employees = await DB.list('employees', { orderBy: 'employeeId' });
  const fromData = !employees.length;
  if (fromData) employees = EMPLOYEES.map(({ color, initials, prefix, ...e }) => ({ id: e.employeeId, ...e }));
  const EMP_STATUS = ['Active', 'On Leave', 'Resigned'];

  const draw = () => {
    const active = employees.filter((e) => e.status === 'Active');
    view.innerHTML = `
      <div class="stats">
        ${adm.stat('พนักงานทั้งหมด', employees.length, '', '👥')}
        ${adm.stat('กำลังทำงาน', active.length, 'Active', '✅')}
        ${adm.stat('เงินเดือนรวม / เดือน', UI.money(adm.sum(active, (e) => e.salary)), 'เฉพาะพนักงาน Active', '💵')}
        ${adm.stat('จำนวนฝ่าย', new Set(employees.map((e) => e.department)).size, 'Departments', '🏢')}
      </div>
      ${fromData ? '<div class="notice" style="margin-bottom:18px">ℹ️ ยังไม่มีข้อมูลใน Firestore — แสดงข้อมูลจาก data.js (กดแก้ไขเพื่อบันทึกลงฐานข้อมูล)</div>' : ''}
      <div class="panel"><div class="table-wrap"><table class="table"><thead><tr><th>Employee ID</th><th>ชื่อ</th><th>ตำแหน่ง</th><th>ฝ่าย</th><th>เงินเดือน</th><th>สถานะการทำงาน</th><th></th></tr></thead><tbody>
        ${employees.map((e) => `<tr><td class="id">${UI.esc(e.employeeId)}</td><td><b style="color:#fff">${UI.esc(e.name)}</b></td><td>${UI.esc(e.position)}</td><td>${UI.esc(e.department)}</td><td>${UI.money(e.salary)}</td>
          <td><span class="status" data-s="${e.status === 'On Leave' ? 'Pending' : e.status === 'Resigned' ? 'Inactive' : 'Active'}">${UI.esc(e.status)}</span></td>
          <td><button class="btn btn-ghost btn-sm" data-edit="${e.id}">แก้ไข</button></td></tr>`).join('')}
      </tbody></table></div></div>`;
    UI.reveal(view);
  };
  draw();

  view.addEventListener('click', (ev) => {
    const t = ev.target.closest('[data-edit]'); if (!t) return;
    const e = employees.find((x) => x.id === t.dataset.edit);
    const box = UI.modal(`<span class="id">${UI.esc(e.employeeId)}</span><h2 style="font-size:1.5rem;margin-top:6px">${UI.esc(e.name)}</h2><p class="small">${UI.esc(e.position)} · ฝ่าย ${UI.esc(e.department)}</p>
      <form id="empForm" class="form-grid">
        <div class="field"><label>ตำแหน่ง</label><input name="position" value="${UI.esc(e.position)}"></div>
        <div class="field"><label>ฝ่าย</label><input name="department" value="${UI.esc(e.department)}"></div>
        <div class="field"><label>เงินเดือน (บาท)</label><input name="salary" type="number" min="0" value="${e.salary}"></div>
        <div class="field"><label>สถานะการทำงาน</label><select name="status">${adm.options(EMP_STATUS, e.status)}</select></div>
        <div class="full"><button class="btn btn-primary btn-block" type="submit">บันทึก</button></div></form>`);
    box.querySelector('#empForm').addEventListener('submit', async (evt) => {
      evt.preventDefault();
      const d = adm.formData(evt.target, ['position', 'department', 'salary', 'status']); d.salary = Number(d.salary);
      const { id, ...rest } = e;
      await DB.set('employees', e.employeeId, { ...rest, ...d });
      UI.closeModal(); UI.toast('บันทึกข้อมูลพนักงานแล้ว', 'success');
      employees = await DB.list('employees', { orderBy: 'employeeId' }); draw();
    });
  });
}

/* ---------------- Applications ---------------- */
async function admApplications(view) {
  let apps = await DB.list('applications', { orderBy: 'applicationId', dir: 'desc' });
  view.innerHTML = `
    <div class="stats" id="aStats"></div>
    <div class="panel">
      <div class="toolbar"><input class="input" id="q" placeholder="🔍 ค้นหา Application ID / ชื่อ / Email">
        <select class="input" id="fStatus"><option value="">ทุกสถานะ</option>${adm.options(STATUS.application)}</select>
        <select class="input" id="fPos"><option value="">ทุกตำแหน่ง</option>${adm.options(CAREERS.map((c) => c.title))}</select></div>
      <div id="tbl"></div>
    </div>`;
  const draw = () => {
    view.querySelector('#aStats').innerHTML = ['New', 'Reviewing', 'Interview', 'Accepted'].map((s) => adm.stat(s, apps.filter((a) => a.status === s).length)).join('');
    const q = view.querySelector('#q').value.toLowerCase(); const s = view.querySelector('#fStatus').value; const p = view.querySelector('#fPos').value;
    const rows = apps.filter((a) => (!s || a.status === s) && (!p || a.position === p) && [a.applicationId, a.name, a.email, a.phone].join(' ').toLowerCase().includes(q));
    view.querySelector('#tbl').innerHTML = rows.length ? `<div class="table-wrap"><table class="table" style="min-width:960px"><thead><tr><th>Application ID</th><th>ชื่อผู้สมัคร</th><th>ตำแหน่ง</th><th>วันที่สมัคร</th><th>Email</th><th>เบอร์โทร</th><th>Status</th><th></th></tr></thead><tbody>
      ${rows.map((a) => `<tr><td class="id">${UI.esc(a.applicationId)}</td><td><b style="color:#fff">${UI.esc(a.name)}</b></td><td>${UI.esc(a.position)}</td><td>${UI.dateShort(a.createdAt)}</td><td>${UI.esc(a.email)}</td><td>${UI.esc(a.phone)}</td>
        <td><select class="input" style="padding:6px 34px 6px 10px;font-size:.8rem;min-width:125px" data-status="${a.id}">${adm.options(STATUS.application, a.status)}</select></td>
        <td><button class="btn btn-ghost btn-sm" data-view="${a.id}">ดู</button></td></tr>`).join('')}
      </tbody></table></div>` : adm.empty('ไม่พบใบสมัคร');
  };
  const reload = async () => { apps = await DB.list('applications', { orderBy: 'applicationId', dir: 'desc' }); draw(); };
  draw();
  ['#q', '#fStatus', '#fPos'].forEach((s) => view.querySelector(s).addEventListener('input', draw));

  view.addEventListener('change', async (e) => {
    const sel = e.target.closest('[data-status]'); if (!sel) return;
    await DB.update('applications', sel.dataset.status, { status: sel.value });
    UI.toast(`เปลี่ยนสถานะเป็น ${sel.value}`, 'success'); reload();
  });
  view.addEventListener('click', (e) => {
    const t = e.target.closest('[data-view]'); if (!t) return;
    const a = apps.find((x) => x.id === t.dataset.view);
    UI.modal(`<span class="id">${UI.esc(a.applicationId)}</span><h2 style="font-size:1.6rem;margin-top:6px">${UI.esc(a.name)}</h2>
      <dl class="kv"><dt>ตำแหน่งที่สมัคร</dt><dd><b style="color:#fff">${UI.esc(a.position)}</b></dd><dt>Email</dt><dd>${UI.esc(a.email)}</dd><dt>เบอร์โทร</dt><dd>${UI.esc(a.phone)}</dd>
      <dt>การศึกษา</dt><dd>${UI.esc(a.education)}</dd><dt>Skills</dt><dd><div class="tags">${String(a.skills || '').split(',').filter(Boolean).map((s) => `<span class="tag">${UI.esc(s.trim())}</span>`).join('')}</div></dd>
      <dt>Portfolio</dt><dd>${a.portfolio ? `<a class="link-arrow" href="${UI.esc(a.portfolio)}" target="_blank" rel="noopener">${UI.esc(a.portfolio)}</a>` : '-'}</dd>
      <dt>Resume</dt><dd>${a.resumeUrl ? `<a class="btn btn-ghost btn-sm" href="${UI.esc(a.resumeUrl)}" target="_blank" download="${UI.esc(a.resumeName)}">⬇ ${UI.esc(a.resumeName)}</a>` : `${UI.esc(a.resumeName || '-')} <small class="muted">(ไม่มีไฟล์ให้ดาวน์โหลด — ข้อมูลตัวอย่างหรือไฟล์ใหญ่เกิน Demo Mode)</small>`}</dd>
      <dt>วันที่สมัคร</dt><dd>${UI.dateTime(a.createdAt)}</dd><dt>Status</dt><dd>${UI.status(a.status)}</dd></dl>`);
  });
}

/* ---------------- Finance ---------------- */
async function admFinance(view) {
  document.getElementById('topActions').innerHTML = '<button class="btn btn-primary btn-sm" id="addTx">+ เพิ่มรายการ</button>';
  let finance = await DB.list('finance', { orderBy: 'date', dir: 'desc' });

  view.innerHTML = `
    <div class="stats" id="fStats"></div>
    <div class="split">
      <div class="panel"><div class="panel-head"><h3>รายได้รายเดือน vs ค่าใช้จ่ายรายเดือน</h3></div><div class="chart-box"><canvas id="chMonthly"></canvas></div></div>
      <div class="panel"><div class="panel-head"><h3>ค่าใช้จ่ายตามหมวดหมู่</h3></div><div class="chart-box"><canvas id="chCat"></canvas></div></div>
    </div>
    <div class="panel">
      <div class="panel-head"><h3>รายการเคลื่อนไหวทางการเงิน</h3></div>
      <div class="toolbar"><input class="input" id="q" placeholder="🔍 ค้นหารายการ / หมวดหมู่">
        <select class="input" id="fType"><option value="">ทุกประเภท</option><option value="income">รายได้</option><option value="expense">ค่าใช้จ่าย</option></select>
        <select class="input" id="fSt"><option value="">ทุกสถานะ</option><option>Paid</option><option>Pending</option></select></div>
      <div id="tbl"></div>
    </div>`;

  const draw = () => {
    const income = adm.sum(finance.filter((f) => f.type === 'income' && f.status === 'Paid'), (f) => f.amount);
    const expense = adm.sum(finance.filter((f) => f.type === 'expense'), (f) => f.amount);
    const pending = adm.sum(finance.filter((f) => f.type === 'income' && f.status === 'Pending'), (f) => f.amount);
    const profit = income - expense;
    view.querySelector('#fStats').innerHTML =
      adm.stat('รายได้', UI.money(income), 'รับชำระแล้ว', '💰', 'up') +
      adm.stat('ค่าใช้จ่าย', UI.money(expense), 'รวมทุกหมวด', '💸', 'down') +
      adm.stat('กำไร', UI.money(profit), profit >= 0 ? 'กำไรสุทธิ' : 'ขาดทุน', '📈', profit >= 0 ? 'up' : 'down') +
      adm.stat('เงินที่รอชำระ', UI.money(pending), `${finance.filter((f) => f.type === 'income' && f.status === 'Pending').length} รายการ`, '⏳');

    adm.chart('chMonthly', monthlyChartConfig(finance));
    const cats = [...new Set(finance.filter((f) => f.type === 'expense').map((f) => f.category))];
    adm.chart('chCat', doughnutConfig(cats, cats.map((c) => adm.sum(finance.filter((f) => f.type === 'expense' && f.category === c), (f) => f.amount))));
    drawTable();
  };
  /* Transactions table (redrawn on filter change without rebuilding charts) */
  const drawTable = () => {
    const q = view.querySelector('#q').value.toLowerCase(); const t = view.querySelector('#fType').value; const s = view.querySelector('#fSt').value;
    const rows = finance.filter((f) => (!t || f.type === t) && (!s || f.status === s) && [f.note, f.category].join(' ').toLowerCase().includes(q));
    view.querySelector('#tbl').innerHTML = rows.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>วันที่</th><th>ประเภท</th><th>หมวดหมู่</th><th>รายละเอียด</th><th style="text-align:right">จำนวนเงิน</th><th>Status</th><th></th></tr></thead><tbody>
      ${rows.map((f) => `<tr><td>${UI.dateShort(f.date)}</td><td>${f.type === 'income' ? '<span style="color:var(--success)">▲ รายได้</span>' : '<span style="color:var(--danger)">▼ ค่าใช้จ่าย</span>'}</td><td>${UI.esc(f.category)}</td><td>${UI.esc(f.note)}</td>
        <td style="text-align:right;font-weight:700;color:${f.type === 'income' ? 'var(--success)' : 'var(--danger)'}">${f.type === 'income' ? '+' : '-'}${UI.money(f.amount)}</td><td>${UI.status(f.status)}</td>
        <td><div class="actions">${f.status === 'Pending' ? `<button class="btn btn-ghost btn-sm" data-paid="${f.id}">✓ รับชำระแล้ว</button>` : ''}<button class="btn btn-danger btn-sm" data-del="${f.id}">ลบ</button></div></td></tr>`).join('')}
      </tbody></table></div>` : adm.empty('ไม่พบรายการ');
  };
  const reload = async () => { finance = await DB.list('finance', { orderBy: 'date', dir: 'desc' }); draw(); };
  draw();
  ['#q', '#fType', '#fSt'].forEach((s) => view.querySelector(s).addEventListener('input', drawTable));

  view.addEventListener('click', async (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.paid) {
      await DB.update('finance', t.dataset.paid, { status: 'Paid', date: adm.todayISO() });
      UI.toast('บันทึกการรับชำระแล้ว', 'success'); reload();
    }
    if (t.dataset.del && await UI.confirm('ลบรายการ', 'ต้องการลบรายการนี้หรือไม่?', 'ลบ')) {
      await DB.remove('finance', t.dataset.del); UI.toast('ลบรายการแล้ว', 'success'); reload();
    }
  });

  document.getElementById('addTx').onclick = () => {
    const box = UI.modal(`<h2 style="font-size:1.5rem">เพิ่มรายการการเงิน</h2>
      <form id="txForm" class="form-grid mt-1">
        <div class="field"><label>ประเภท</label><select name="type"><option value="income">รายได้</option><option value="expense">ค่าใช้จ่าย</option></select></div>
        <div class="field"><label>หมวดหมู่</label><input name="category" list="catList" placeholder="เช่น Project Payment, Office Rent" required>
          <datalist id="catList">${[...new Set(finance.map((f) => f.category))].map((c) => `<option value="${UI.esc(c)}">`).join('')}</datalist></div>
        <div class="field"><label>จำนวนเงิน (บาท)</label><input name="amount" type="number" min="0" step="0.01" required></div>
        <div class="field"><label>วันที่</label><input name="date" type="date" value="${adm.todayISO()}" required></div>
        <div class="field full"><label>รายละเอียด</label><input name="note" placeholder="รายละเอียดรายการ"></div>
        <div class="field"><label>Status</label><select name="status"><option>Paid</option><option>Pending</option></select></div>
        <div class="full"><button class="btn btn-primary btn-block" type="submit">บันทึกรายการ</button></div>
      </form>`);
    box.querySelector('#txForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const d = adm.formData(e.target, ['type', 'category', 'amount', 'date', 'note', 'status']);
      d.amount = Number(d.amount);
      if (!d.category || !d.amount || !d.date) return UI.toast('กรุณากรอกข้อมูลให้ครบ', 'error');
      await DB.add('finance', d);
      UI.closeModal(); UI.toast('เพิ่มรายการแล้ว', 'success'); reload();
    });
  };
}

/* ---------------- Boot ---------------- */
document.addEventListener('DOMContentLoaded', async () => {
  if (ADMIN_PAGE === 'admin-login') return admLogin();

  const pages = {
    'admin-dashboard': ['dashboard', 'Dashboard', 'ภาพรวมธุรกิจ DesignNext Studio', admDashboard],
    'admin-customers': ['customers', 'Customers', 'ข้อมูลลูกค้าทั้งหมด', admCustomers],
    'admin-projects': ['projects', 'Projects', 'Project ทั้งหมดของบริษัท', admProjects],
    'admin-bookings': ['bookings', 'Bookings', 'คิวนัดหมายและการจองทั้งหมด', admBookings],
    'admin-employees': ['employees', 'Employees', 'ข้อมูลพนักงานทั้ง 7 คน', admEmployees],
    'admin-applications': ['applications', 'Applications', 'ใบสมัครงานทั้งหมด', admApplications],
    'admin-finance': ['finance', 'Finance', 'ระบบการเงินเบื้องต้นของบริษัท', admFinance]
  };
  const cfg = pages[ADMIN_PAGE]; if (!cfg) return;
  const user = await Auth.requireAdmin();
  await DN.ready;
  const view = UI.appShell({ area: 'admin', active: cfg[0], title: cfg[1], subtitle: cfg[2], user });
  try { await cfg[3](view); }
  catch (err) {
    console.error(err);
    view.innerHTML = adm.empty(`โหลดข้อมูลไม่สำเร็จ: ${UI.esc(err.message)}<br><small>ตรวจสอบ Firebase config และ Firestore Rules</small>`, '⚠️');
  }
  UI.reveal(view);
});
