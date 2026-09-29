/* =========================================================
   DesignNext Studio — Firebase Layer
   ---------------------------------------------------------
   1) สร้างโปรเจกต์ที่ https://console.firebase.google.com
   2) เปิดใช้ Authentication (Email/Password), Firestore, Storage
   3) คัดลอก config ของ Web App มาวางแทนค่าด้านล่าง
   ถ้ายังไม่ได้ใส่ config ระบบจะทำงานใน "Demo Mode"
   (เก็บข้อมูลใน localStorage ของเบราว์เซอร์) เพื่อให้ทดสอบได้ทันที
   ========================================================= */

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

/* อีเมลที่มีสิทธิ์เข้า Admin (ต้องตรงกับ firestore.rules / storage.rules) */
const ADMIN_EMAILS = ['admin@designnext.studio'];

/* บัญชีทดสอบสำหรับ Demo Mode */
const DEMO_ADMIN = { email: 'admin@designnext.studio', password: 'admin1234' };
const DEMO_CLIENT = { email: 'somchai@kafenomad.co', password: 'client1234', uid: 'demo-cus-1' };

/* เพิ่มเลขนี้เมื่อแก้ข้อมูลตัวอย่างใน data.js → ระบบจะโหลดข้อมูลตัวอย่างใหม่ให้อัตโนมัติ */
const SEED_VERSION = 2;

/* เลขเริ่มต้นของ ID แต่ละประเภท (ต่อจากข้อมูลตัวอย่าง) */
const ID_FORMAT = {
  booking:     { prefix: 'DN-BK-',  base: 5 },
  application: { prefix: 'DN-APP-', base: 4 },
  project:     { prefix: 'DN-PRJ-', base: 7 },
  quotation:   { prefix: 'DN-QT-',  base: 4 },
  customer:    { prefix: 'DN-CUS-', base: 5 }
};

const DN = (() => {
  const configured = !String(firebaseConfig.apiKey).startsWith('YOUR_');
  const sdkLoaded = typeof firebase !== 'undefined';
  const mode = configured && sdkLoaded ? 'firebase' : 'demo';
  const now = () => new Date().toISOString();
  const pad = (n) => String(n).padStart(4, '0');
  const isAdminEmail = (email) => ADMIN_EMAILS.includes(String(email || '').toLowerCase());

  let fdb, fauth, fstorage;
  if (mode === 'firebase') {
    firebase.initializeApp(firebaseConfig);
    fdb = firebase.firestore();
    fauth = firebase.auth();
    fstorage = firebase.storage ? firebase.storage() : null;
  }

  /* ---------------- Demo (localStorage) backend ---------------- */
  const LS = {
    read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    write(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); }
      catch (e) { console.warn('localStorage full', e); throw new Error('พื้นที่เก็บข้อมูลของเบราว์เซอร์เต็ม (Demo Mode) — ลองใช้ไฟล์ขนาดเล็กลง'); }
    }
  };
  const store = () => LS.read('dn_db', {});
  const saveStore = (s) => LS.write('dn_db', s);
  const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  function match(doc, where) {
    if (!where) return true;
    const list = Array.isArray(where[0]) ? where : [where];
    return list.every(([f, op, v]) => {
      const d = doc[f];
      switch (op) {
        case '==': return d === v;
        case '!=': return d !== v;
        case 'in': return v.includes(d);
        case '>=': return d >= v;
        case '<=': return d <= v;
        case '>': return d > v;
        case '<': return d < v;
        case 'array-contains': return Array.isArray(d) && d.includes(v);
        default: return true;
      }
    });
  }
  function sortDocs(docs, orderBy, dir) {
    if (!orderBy) return docs;
    const m = dir === 'desc' ? -1 : 1;
    return docs.sort((a, b) => (a[orderBy] > b[orderBy] ? m : a[orderBy] < b[orderBy] ? -m : 0));
  }

  /* ---------------- DB API ---------------- */
  const DB = {
    async add(col, data) {
      const doc = { ...data, createdAt: data.createdAt || now() };
      if (mode === 'firebase') { const ref = await fdb.collection(col).add(doc); return ref.id; }
      const s = store(); s[col] = s[col] || {}; const id = genId(); s[col][id] = doc; saveStore(s); return id;
    },
    async set(col, id, data, merge = true) {
      const doc = { ...data, updatedAt: now() };
      if (mode === 'firebase') { await fdb.collection(col).doc(id).set(doc, { merge }); return id; }
      const s = store(); s[col] = s[col] || {};
      s[col][id] = merge ? { createdAt: now(), ...(s[col][id] || {}), ...doc } : { createdAt: now(), ...doc };
      saveStore(s); return id;
    },
    async get(col, id) {
      if (mode === 'firebase') { const snap = await fdb.collection(col).doc(id).get(); return snap.exists ? { id: snap.id, ...snap.data() } : null; }
      const d = (store()[col] || {})[id]; return d ? { id, ...d } : null;
    },
    /* opts: { where: [field, op, value] | [[...],[...]], orderBy: 'field', dir: 'asc'|'desc' } */
    async list(col, opts = {}) {
      let docs;
      if (mode === 'firebase') {
        let q = fdb.collection(col);
        if (opts.where) {
          const list = Array.isArray(opts.where[0]) ? opts.where : [opts.where];
          list.forEach(([f, op, v]) => { q = q.where(f, op, v); });
        }
        const snap = await q.get();
        docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } else {
        docs = Object.entries(store()[col] || {}).map(([id, d]) => ({ id, ...d })).filter((d) => match(d, opts.where));
      }
      return sortDocs(docs, opts.orderBy, opts.dir); // sort client-side (no composite index needed)
    },
    async update(col, id, data) {
      const doc = { ...data, updatedAt: now() };
      if (mode === 'firebase') { await fdb.collection(col).doc(id).update(doc); return id; }
      const s = store(); if (!s[col] || !s[col][id]) throw new Error('ไม่พบข้อมูล');
      s[col][id] = { ...s[col][id], ...doc }; saveStore(s); return id;
    },
    async remove(col, id) {
      if (mode === 'firebase') { await fdb.collection(col).doc(id).delete(); return; }
      const s = store(); if (s[col]) delete s[col][id]; saveStore(s);
    },
    /* Running number e.g. nextId('booking') -> 'DN-BK-0006' */
    async nextId(name) {
      const fmt = ID_FORMAT[name] || { prefix: 'DN-' + name.toUpperCase() + '-', base: 0 };
      if (mode === 'firebase') {
        const ref = fdb.collection('counters').doc(name);
        const n = await fdb.runTransaction(async (tx) => {
          const snap = await tx.get(ref);
          const next = (snap.exists ? snap.data().value : fmt.base) + 1;
          tx.set(ref, { value: next });
          return next;
        });
        return fmt.prefix + pad(n);
      }
      const c = LS.read('dn_counters', {});
      c[name] = (c[name] ?? fmt.base) + 1; LS.write('dn_counters', c);
      return fmt.prefix + pad(c[name]);
    },
    /* Real-time listener (falls back to polling in demo mode). Returns unsubscribe fn */
    watch(col, opts, cb) {
      if (mode === 'firebase') {
        let q = fdb.collection(col);
        if (opts.where) {
          const list = Array.isArray(opts.where[0]) ? opts.where : [opts.where];
          list.forEach(([f, op, v]) => { q = q.where(f, op, v); });
        }
        return q.onSnapshot((snap) => cb(sortDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })), opts.orderBy, opts.dir)));
      }
      let last = '';
      const tick = async () => { const docs = await DB.list(col, opts); const sig = JSON.stringify(docs); if (sig !== last) { last = sig; cb(docs); } };
      tick(); const t = setInterval(tick, 1500);
      return () => clearInterval(t);
    }
  };

  /* ---------------- Storage API ---------------- */
  const Storage = {
    /* Upload a File -> { url, path, name, size, type } */
    async upload(folder, file) {
      const ext = (file.name.split('.').pop() || '').toUpperCase();
      const path = `${folder}/${Date.now()}_${file.name.replace(/[^\w.\-]/g, '_')}`;
      if (mode === 'firebase' && fstorage) {
        const ref = fstorage.ref().child(path);
        await ref.put(file);
        const url = await ref.getDownloadURL();
        return { url, path, name: file.name, size: file.size, type: ext };
      }
      // Demo mode: keep small files as data URL, large files as metadata only
      let url = '';
      if (file.size <= 1.5 * 1024 * 1024) {
        url = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
      }
      return { url, path, name: file.name, size: file.size, type: ext };
    },
    async remove(path) {
      if (mode === 'firebase' && fstorage && path) { try { await fstorage.ref().child(path).delete(); } catch (e) { console.warn(e); } }
    }
  };

  /* ---------------- Auth API ---------------- */
  const demoUsers = () => {
    const u = LS.read('dn_auth_users', null);
    if (u) return u;
    const init = {
      [DEMO_ADMIN.email]: { uid: 'demo-admin', email: DEMO_ADMIN.email, password: DEMO_ADMIN.password, name: 'Admin DesignNext', role: 'admin' },
      [DEMO_CLIENT.email]: { uid: DEMO_CLIENT.uid, email: DEMO_CLIENT.email, password: DEMO_CLIENT.password, name: 'สมชาย ใจดี', role: 'client' }
    };
    LS.write('dn_auth_users', init);
    return init;
  };
  const listeners = [];
  const emit = (u) => listeners.forEach((cb) => cb(u));
  const pub = (u) => (u ? { uid: u.uid, email: u.email, name: u.name || u.displayName || '', role: u.role || (isAdminEmail(u.email) ? 'admin' : 'client') } : null);

  const Auth = {
    async register(email, password, profile = {}) {
      email = email.trim().toLowerCase();
      let user;
      if (mode === 'firebase') {
        const cred = await fauth.createUserWithEmailAndPassword(email, password);
        if (profile.name) await cred.user.updateProfile({ displayName: profile.name });
        user = pub({ uid: cred.user.uid, email, name: profile.name });
      } else {
        const users = demoUsers();
        if (users[email]) throw new Error('อีเมลนี้ถูกใช้สมัครแล้ว');
        if (password.length < 6) throw new Error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
        const uid = 'u-' + genId();
        users[email] = { uid, email, password, name: profile.name || '', role: isAdminEmail(email) ? 'admin' : 'client' };
        LS.write('dn_auth_users', users);
        LS.write('dn_session', email);
        user = pub(users[email]);
      }
      await DB.set('users', user.uid, { uid: user.uid, email, name: profile.name || '', phone: profile.phone || '', company: profile.company || '', role: user.role });
      if (user.role === 'client') await createClientStarter(user.uid, { ...profile, email });
      emit(user);
      return user;
    },
    async login(email, password) {
      email = email.trim().toLowerCase();
      if (mode === 'firebase') {
        const cred = await fauth.signInWithEmailAndPassword(email, password);
        return pub({ uid: cred.user.uid, email: cred.user.email, name: cred.user.displayName });
      }
      const u = demoUsers()[email];
      if (!u || u.password !== password) throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      LS.write('dn_session', email);
      const user = pub(u); emit(user); return user;
    },
    async logout() {
      if (mode === 'firebase') return fauth.signOut();
      localStorage.removeItem('dn_session'); emit(null);
    },
    async resetPassword(email) {
      if (mode === 'firebase') return fauth.sendPasswordResetEmail(email.trim());
      throw new Error('Demo Mode: ไม่รองรับการรีเซ็ตรหัสผ่าน');
    },
    /* Resolves once with current user (or null) */
    current() {
      if (mode === 'firebase') {
        return new Promise((res) => { const off = fauth.onAuthStateChanged((u) => { off(); res(u ? pub({ uid: u.uid, email: u.email, name: u.displayName }) : null); }); });
      }
      const email = LS.read('dn_session', null);
      return Promise.resolve(email ? pub(demoUsers()[email]) : null);
    },
    onChange(cb) {
      if (mode === 'firebase') return fauth.onAuthStateChanged((u) => cb(u ? pub({ uid: u.uid, email: u.email, name: u.displayName }) : null));
      listeners.push(cb); Auth.current().then(cb);
    },
    isAdmin(user) { return !!user && isAdminEmail(user.email); },
    /* Page guards: redirect to login if not allowed */
    async requireClient(loginUrl = 'login.html') {
      const u = await Auth.current();
      if (!u) { location.href = loginUrl; return new Promise(() => {}); }
      if (Auth.isAdmin(u)) { location.href = '../admin/dashboard.html'; return new Promise(() => {}); }
      return u;
    },
    async requireAdmin(loginUrl = 'login.html') {
      const u = await Auth.current();
      if (!u || !Auth.isAdmin(u)) { location.href = loginUrl; return new Promise(() => {}); }
      return u;
    }
  };

  /* When a new client registers, create their customer record plus a sample
     project / quotation / message so the Client Dashboard has content to show. */
  async function createClientStarter(uid, p) {
    const customerId = await DB.nextId('customer');
    const name = p.name || p.email;
    await DB.set('customers', uid, { customerId, uid, name, company: p.company || '-', email: p.email, phone: p.phone || '', status: 'Active' });
    const projectId = await DB.nextId('project');
    const today = new Date();
    const iso = (d) => d.toISOString().slice(0, 10);
    const plus = (days) => { const d = new Date(today); d.setDate(d.getDate() + days); return iso(d); };
    await DB.add('projects', {
      projectId, customerId: uid, customerName: p.company || name, name: 'Brand Identity', service: 'Branding', package: 'Business',
      owner: 'เกียรติพัฒน์ มหิมา', startDate: plus(-14), deadline: '2026-10-15', budget: 29900, paid: 14950,
      progress: 80, stage: 'Final Review', status: 'Review', paymentStatus: 'Partial', demo: true
    });
    const quotationNo = await DB.nextId('quotation');
    await DB.add('quotations', {
      quotationNo, customerId: uid, customerName: name, customerCompany: p.company || '-', customerEmail: p.email, customerPhone: p.phone || '',
      projectId, date: plus(-15), validUntil: plus(15),
      items: [{ desc: 'Business Package — Brand Identity ครบชุด', qty: 1, price: 29900 }], discount: 0, vat: 7, status: 'Pending', demo: true
    });
    await DB.add('messages', { customerId: uid, from: 'studio', senderName: 'DesignNext Studio', text: `ยินดีต้อนรับคุณ${name} สู่ DesignNext Studio! หากมีคำถามเกี่ยวกับโปรเจกต์ ส่งข้อความหาเราได้ที่นี่เลยครับ` });
  }

  /* Fill the database with demo data (runs once) */
  async function seed(force = false) {
    const flag = await DB.get('meta', 'seed').catch(() => null);
    if (flag && flag.version === SEED_VERSION && !force) return false;
    const cols = ['customers', 'projects', 'bookings', 'quotations', 'applications', 'finance', 'messages', 'files'];
    for (const col of cols) {
      for (const { id, ...doc } of SEED[col]) {
        await DB.set(col, id, { createdAt: doc.createdAt || '2026-09-01T09:00:00.000Z', ...doc }, false);
      }
    }
    for (const e of EMPLOYEES) {
      const { color, initials, prefix, ...doc } = e;
      await DB.set('employees', e.employeeId, doc, false);
    }
    await DB.set('meta', 'seed', { seededAt: now(), version: SEED_VERSION });
    return true;
  }

  /* Demo mode: seed automatically so every page has data */
  const ready = mode === 'demo' ? seed().catch(console.error) : Promise.resolve();

  return { mode, DB, Storage, Auth, seed, ready, isAdminEmail };
})();

const { DB, Storage, Auth } = DN;
