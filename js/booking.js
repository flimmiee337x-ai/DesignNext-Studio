/* =========================================================
   DesignNext Studio — Booking System
   ขั้นตอน: บริการ → แพ็กเกจ → วันที่ → เวลา → ข้อมูลติดต่อ → รายละเอียดงาน → ยืนยัน
   ========================================================= */

const Booking = (() => {
  const STEPS = ['บริการ', 'แพ็กเกจ', 'วันที่', 'เวลา', 'ข้อมูลติดต่อ', 'รายละเอียดงาน', 'ยืนยัน'];
  const STATUS_INFO = {
    Pending: 'รอทีมงานยืนยันนัดหมาย',
    Confirmed: 'ยืนยันนัดหมายเรียบร้อย',
    Rescheduled: 'เลื่อนวัน/เวลานัดหมาย',
    Completed: 'ปรึกษาเสร็จสิ้นแล้ว',
    Cancelled: 'ยกเลิกการจอง'
  };
  const CUSTOM_PKG = 'Custom / ยังไม่แน่ใจ';

  const state = { step: 0, service: '', package: '', date: '', time: '', name: '', company: '', email: '', phone: '', details: '', uid: '' };
  let taken = [];   // เวลาที่ถูกจองแล้วในวันที่เลือก
  let els;

  /* วันที่ท้องถิ่นในรูปแบบ YYYY-MM-DD (ไม่ใช้ toISOString เพื่อเลี่ยงปัญหา Timezone) */
  const localISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = () => localISO(new Date());
  const isSunday = (iso) => new Date(iso + 'T00:00:00').getDay() === 0;
  const pkgLabel = (id) => (PACKAGES.find((p) => p.id === id) || {}).name || id;

  /* ---------- Render ---------- */
  function renderStepper() {
    els.stepper.innerHTML = STEPS.map((s, i) =>
      `<div class="st ${i === state.step ? 'active' : ''} ${i < state.step ? 'done' : ''}" data-n="${i + 1}">${s}</div>`).join('');
  }

  function renderStep() {
    const s = state.step;
    let html = '';
    if (s === 0) {
      html = `<h3>1. เลือกบริการ</h3><p>บริการที่คุณสนใจปรึกษา</p>
        <div class="choice-grid">${SERVICES.map((x) => `<button type="button" class="choice ${state.service === x.name ? 'selected' : ''}" data-val="${x.name}">
          <b>${x.icon} ${x.name}</b><small>เริ่มต้น ${UI.money(x.startPrice)}</small></button>`).join('')}</div>`;
    } else if (s === 1) {
      html = `<h3>2. เลือกแพ็กเกจ</h3><p>เลือกแพ็กเกจที่ต้องการ หรือเลือก Custom หากยังไม่แน่ใจ</p>
        <div class="choice-grid">${PACKAGES.map((p) => `<button type="button" class="choice ${state.package === p.id ? 'selected' : ''}" data-val="${p.id}">
          <b>${p.name}${p.featured ? ' ⭐' : ''}</b><small>${p.priceNote ? p.priceNote + ' ' : ''}${UI.money(p.price)} · ${p.duration}</small></button>`).join('')}
          <button type="button" class="choice ${state.package === 'custom' ? 'selected' : ''}" data-val="custom"><b>🧩 Custom</b><small>ยังไม่แน่ใจ / ต้องการแพ็กเกจเฉพาะ</small></button></div>`;
    } else if (s === 2) {
      html = `<h3>3. เลือกวันที่</h3><p>เปิดให้จองวันจันทร์ – เสาร์ (ปิดวันอาทิตย์)</p>
        <div class="field" style="max-width:320px"><label>วันที่นัดหมาย <span class="req">*</span></label>
        <input type="date" id="dateInput" min="${today()}" value="${state.date}"></div>
        <p class="small mt-1" id="dateNote">${state.date ? '📅 ' + UI.date(state.date) : ''}</p>`;
    } else if (s === 3) {
      html = `<h3>4. เลือกเวลา</h3><p>วันที่ ${UI.date(state.date)} — ช่วงเวลาที่ขีดฆ่าถูกจองแล้ว</p>
        <div class="time-grid" id="timeGrid"><div class="loader"></div></div>`;
    } else if (s === 4) {
      html = `<h3>5. ข้อมูลติดต่อ</h3><p>ทีมงานจะใช้ข้อมูลนี้ในการยืนยันนัดหมาย</p>
        <div class="form-grid">
          <div class="field"><label>ชื่อ-นามสกุล <span class="req">*</span></label><input data-k="name" value="${UI.esc(state.name)}"></div>
          <div class="field"><label>บริษัท</label><input data-k="company" value="${UI.esc(state.company)}"></div>
          <div class="field"><label>Email <span class="req">*</span></label><input type="email" data-k="email" value="${UI.esc(state.email)}"></div>
          <div class="field"><label>เบอร์โทร <span class="req">*</span></label><input type="tel" data-k="phone" value="${UI.esc(state.phone)}"></div>
        </div>`;
    } else if (s === 5) {
      html = `<h3>6. รายละเอียดงาน</h3><p>อธิบายเป้าหมาย ขอบเขตงาน หรือสิ่งที่ต้องการปรึกษา</p>
        <div class="field"><label>รายละเอียด <span class="req">*</span></label>
        <textarea data-k="details" placeholder="เช่น ต้องการออกแบบโลโก้และเว็บไซต์สำหรับร้านกาแฟเปิดใหม่ กำหนดเปิดร้านเดือนธันวาคม...">${UI.esc(state.details)}</textarea></div>`;
    } else if (s === 6) {
      html = `<h3>7. ตรวจสอบและยืนยันการจอง</h3><p>กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดยืนยัน</p>
        <div class="summary-list">${summaryRows(true)}</div>
        <div class="notice mt-2">ℹ️ หลังยืนยัน ระบบจะสร้าง Booking ID ให้ และสถานะเริ่มต้นจะเป็น <b>Pending</b> จนกว่าทีมงานจะยืนยัน</div>`;
    }
    els.body.innerHTML = `<div class="step-pane fade-up">${html}</div>`;
    els.prev.style.visibility = s === 0 ? 'hidden' : 'visible';
    els.next.innerHTML = s === STEPS.length - 1 ? '✅ ยืนยันการจอง' : 'ถัดไป →';
    renderStepper();
    renderSummary();
    bindStep();
  }

  function summaryRows(full) {
    const rows = [
      ['บริการ', state.service],
      ['แพ็กเกจ', state.package === 'custom' ? CUSTOM_PKG : state.package ? pkgLabel(state.package) : ''],
      ['วันที่', state.date ? UI.date(state.date) : ''],
      ['เวลา', state.time ? state.time + ' น.' : ''],
      ['ชื่อ', state.name]
    ];
    if (full) rows.push(['บริษัท', state.company || '-'], ['Email', state.email], ['เบอร์โทร', state.phone], ['รายละเอียด', state.details]);
    return rows.map(([k, v]) => `<div><span>${k}</span><span>${v ? UI.esc(v) : '<span class="muted">—</span>'}</span></div>`).join('');
  }
  function renderSummary() { els.summary.innerHTML = summaryRows(false); }

  /* ---------- Step events ---------- */
  function bindStep() {
    const s = state.step;
    if (s === 0 || s === 1) {
      els.body.querySelectorAll('.choice').forEach((c) => c.addEventListener('click', () => {
        els.body.querySelectorAll('.choice').forEach((x) => x.classList.remove('selected'));
        c.classList.add('selected');
        state[s === 0 ? 'service' : 'package'] = c.dataset.val;
        renderSummary();
      }));
    }
    if (s === 2) {
      const input = els.body.querySelector('#dateInput');
      input.addEventListener('change', () => {
        const note = els.body.querySelector('#dateNote');
        if (input.value && isSunday(input.value)) {
          UI.toast('ปิดทำการวันอาทิตย์ กรุณาเลือกวันอื่น', 'error');
          input.value = ''; state.date = ''; note.textContent = '';
        } else {
          if (state.date !== input.value) state.time = '';
          state.date = input.value;
          note.textContent = state.date ? '📅 ' + UI.date(state.date) : '';
        }
        renderSummary();
      });
    }
    if (s === 3) loadTimes();
    if (s === 4 || s === 5) {
      els.body.querySelectorAll('[data-k]').forEach((inp) => inp.addEventListener('input', () => { state[inp.dataset.k] = inp.value; renderSummary(); }));
    }
  }

  async function loadTimes() {
    const grid = els.body.querySelector('#timeGrid');
    try {
      const list = await DB.list('bookings', { where: ['date', '==', state.date] });
      taken = list.filter((b) => b.status !== 'Cancelled').map((b) => b.time);
    } catch (e) { console.warn(e); taken = []; }
    // ถ้าเป็นวันนี้ ปิดช่วงเวลาที่ผ่านไปแล้ว
    const nowH = new Date().getHours();
    const past = (t) => state.date === today() && parseInt(t, 10) <= nowH;
    if (taken.includes(state.time)) state.time = '';
    grid.innerHTML = BOOKING_TIMES.map((t) => {
      const off = taken.includes(t) || past(t);
      return `<button type="button" class="choice ${off ? 'disabled' : ''} ${state.time === t ? 'selected' : ''}" data-val="${t}"><b>${t}</b><small>${off ? 'ไม่ว่าง' : 'ว่าง'}</small></button>`;
    }).join('');
    grid.querySelectorAll('.choice:not(.disabled)').forEach((c) => c.addEventListener('click', () => {
      grid.querySelectorAll('.choice').forEach((x) => x.classList.remove('selected'));
      c.classList.add('selected'); state.time = c.dataset.val; renderSummary();
    }));
  }

  /* ---------- Validation ---------- */
  function validate() {
    const s = state.step;
    const err = (m) => { UI.toast(m, 'error'); return false; };
    if (s === 0 && !state.service) return err('กรุณาเลือกบริการ');
    if (s === 1 && !state.package) return err('กรุณาเลือกแพ็กเกจ');
    if (s === 2) {
      if (!state.date) return err('กรุณาเลือกวันที่');
      if (state.date < today()) return err('ไม่สามารถเลือกวันที่ผ่านมาแล้ว');
      if (isSunday(state.date)) return err('ปิดทำการวันอาทิตย์');
    }
    if (s === 3 && !state.time) return err('กรุณาเลือกเวลา');
    if (s === 4) {
      if (!state.name.trim() || !state.email.trim() || !state.phone.trim()) return err('กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบ');
      if (!/^\S+@\S+\.\S+$/.test(state.email.trim())) return err('รูปแบบอีเมลไม่ถูกต้อง');
      if (!/^[0-9+\-\s]{9,15}$/.test(state.phone.trim())) return err('รูปแบบเบอร์โทรไม่ถูกต้อง');
    }
    if (s === 5 && state.details.trim().length < 10) return err('กรุณาอธิบายรายละเอียดงานอย่างน้อย 10 ตัวอักษร');
    return true;
  }

  /* ---------- Submit ---------- */
  async function submit() {
    UI.busy(els.next, true, 'กำลังบันทึก...');
    try {
      // ตรวจซ้ำว่าเวลายังว่างอยู่ (กันจองชนกัน)
      const same = await DB.list('bookings', { where: ['date', '==', state.date] });
      if (same.some((b) => b.time === state.time && b.status !== 'Cancelled')) {
        UI.busy(els.next, false);
        UI.toast('ขออภัย เวลานี้เพิ่งถูกจอง กรุณาเลือกเวลาใหม่', 'error');
        state.time = ''; state.step = 3; renderStep(); return;
      }
      const bookingId = await DB.nextId('booking');
      const data = {
        bookingId,
        service: state.service,
        package: state.package === 'custom' ? 'Custom' : pkgLabel(state.package),
        date: state.date, time: state.time,
        name: state.name.trim(), company: state.company.trim(), email: state.email.trim().toLowerCase(), phone: state.phone.trim(),
        details: state.details.trim(),
        uid: state.uid || '',
        status: 'Pending'
      };
      await DB.add('bookings', data);
      showSuccess(data);
    } catch (e) {
      console.error(e);
      UI.toast(e.message || 'จองไม่สำเร็จ กรุณาลองใหม่', 'error');
      UI.busy(els.next, false);
    }
  }

  function showSuccess(b) {
    document.getElementById('wizard').innerHTML = `<div class="center" style="padding:30px 0">
      <div class="pop" style="font-size:3.6rem">🎉</div>
      <h2 style="font-size:1.8rem">จองคิวสำเร็จ!</h2>
      <p>หมายเลขการจองของคุณคือ</p>
      <div class="id-big gradient-text">${b.bookingId}</div>
      <p class="mt-1">สถานะ ${UI.status(b.status)}</p>
      <div class="summary-list" style="max-width:460px;margin:24px auto;text-align:left">
        <div><span>บริการ</span><span>${UI.esc(b.service)}</span></div>
        <div><span>แพ็กเกจ</span><span>${UI.esc(b.package)}</span></div>
        <div><span>วัน-เวลา</span><span>${UI.date(b.date)} · ${b.time} น.</span></div>
        <div><span>ชื่อ</span><span>${UI.esc(b.name)}</span></div>
      </div>
      <p class="small">ทีมงานจะติดต่อยืนยันทางอีเมล ${UI.esc(b.email)} ภายใน 24 ชั่วโมง<br>กรุณาเก็บ Booking ID ไว้เพื่อตรวจสอบสถานะ</p>
      <div class="flex flex-wrap" style="justify-content:center">
        <a href="booking.html" class="btn btn-ghost">จองคิวเพิ่ม</a>
        <a href="../client/login.html" class="btn btn-primary">เข้าสู่ Client Dashboard</a>
      </div></div>`;
    els.summary.innerHTML = summaryRows(false);
    UI.toast('บันทึกการจองเรียบร้อย: ' + b.bookingId, 'success');
  }

  /* ---------- Booking status lookup ---------- */
  function bindLookup() {
    const form = document.getElementById('lookupForm');
    const out = document.getElementById('lookupResult');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const bid = form.bid.value.trim().toUpperCase();
      const email = form.email.value.trim().toLowerCase();
      if (!bid || !email) return UI.toast('กรุณากรอก Booking ID และ Email', 'error');
      out.innerHTML = '<div class="loader" style="margin:10px auto"></div>';
      try {
        const list = await DB.list('bookings', { where: ['bookingId', '==', bid] });
        const b = list.find((x) => String(x.email || '').toLowerCase() === email);
        out.innerHTML = b
          ? `<div class="summary-list">
              <div><span>Booking ID</span><span>${UI.esc(b.bookingId)}</span></div>
              <div><span>สถานะ</span><span>${UI.status(b.status)}</span></div>
              <div><span>บริการ</span><span>${UI.esc(b.service)}</span></div>
              <div><span>วัน-เวลา</span><span>${UI.date(b.date)} · ${UI.esc(b.time)} น.</span></div></div>
              <p class="small mt-1 mb-0">${STATUS_INFO[b.status] || ''}</p>`
          : '<p class="small mb-0" style="color:var(--danger)">ไม่พบข้อมูลการจอง กรุณาตรวจสอบ Booking ID และ Email</p>';
      } catch (err) {
        console.error(err);
        out.innerHTML = '<p class="small mb-0" style="color:var(--danger)">ไม่สามารถตรวจสอบได้ในขณะนี้</p>';
      }
    });
  }

  /* ---------- Init ---------- */
  async function init() {
    els = {
      stepper: document.getElementById('stepper'),
      body: document.getElementById('stepBody'),
      prev: document.getElementById('prevBtn'),
      next: document.getElementById('nextBtn'),
      summary: document.getElementById('sideSummary')
    };
    document.getElementById('statusLegend').innerHTML = STATUS.booking.map((s) => `<div>${UI.status(s)}<span class="muted">${STATUS_INFO[s]}</span></div>`).join('');

    // Prefill จาก URL: ?service=Branding&package=business
    const qs = UI.param('service');
    const qp = UI.param('package');
    if (qs) { const sv = SERVICES.find((x) => x.name.toLowerCase() === qs.toLowerCase() || x.id === qs); if (sv) state.service = sv.name; }
    if (qp && PACKAGES.some((p) => p.id === qp)) state.package = qp;
    if (state.service && state.package) state.step = 2;
    else if (state.service) state.step = 1;
    else if (state.package) state.step = 0;

    els.prev.addEventListener('click', () => { if (state.step > 0) { state.step--; renderStep(); } });
    els.next.addEventListener('click', () => {
      if (!validate()) return;
      if (state.step === STEPS.length - 1) return submit();
      state.step++; renderStep();
      document.getElementById('wizard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    renderStep();
    bindLookup();

    // ถ้า Login อยู่ ดึงข้อมูลลูกค้ามากรอกให้อัตโนมัติ
    try {
      await DN.ready;
      const u = await Auth.current();
      if (u && !Auth.isAdmin(u)) {
        state.uid = u.uid;
        const c = await DB.get('customers', u.uid).catch(() => null);
        state.name = state.name || c?.name || u.name || '';
        state.company = state.company || (c?.company && c.company !== '-' ? c.company : '');
        state.email = state.email || c?.email || u.email || '';
        state.phone = state.phone || c?.phone || '';
        if (state.step === 4) renderStep(); else renderSummary();
      }
    } catch (e) { console.warn(e); }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Booking.init);
