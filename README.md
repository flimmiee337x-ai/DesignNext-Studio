# DesignNext Studio — Design Beyond Ideas.

เว็บไซต์บริษัท DesignNext Studio (Graphic Design & Digital Technology)
พัฒนาด้วย **HTML + CSS + JavaScript + Firebase** (Authentication, Firestore, Storage)

---

## วิธีเปิดดูเว็บไซต์

1. เปิดโฟลเดอร์นี้ใน **VS Code**
2. ติดตั้ง Extension **Live Server** แล้วคลิกขวาที่ `index.html` → **Open with Live Server**
   (เปิดไฟล์ `index.html` ตรง ๆ ด้วยการดับเบิลคลิกก็ได้)

ถ้ายังไม่ได้ใส่ Firebase config เว็บจะทำงานใน **Demo Mode**: ข้อมูลจะเก็บใน `localStorage` ของเบราว์เซอร์
ทุกระบบใช้งานได้ครบ (จองคิว, สมัครงาน, Login, Dashboard) เหมาะสำหรับทดสอบและนำเสนอ

### บัญชีทดสอบ (Demo Mode)

| ระบบ | Email | Password |
|------|-------|----------|
| Customer Login (`client/login.html`) | somchai@kafenomad.co | client1234 |
| Admin Login (`admin/login.html`) | admin@designnext.studio | admin1234 |

หรือกด "สมัครสมาชิก" ในหน้า Customer Login เพื่อสร้างบัญชีลูกค้าใหม่ได้เลย

---

## เชื่อมต่อ Firebase จริง

1. ไปที่ <https://console.firebase.google.com> → **Add project**
2. **Build → Authentication → Get started → Email/Password → Enable**
3. **Build → Firestore Database → Create database** (เลือก location `asia-southeast1`)
4. **Build → Storage → Get started**
5. **Project settings → Your apps → Web (</>)** → คัดลอก `firebaseConfig`
   แล้ววางแทนค่าใน `js/firebase.js`
6. นำไฟล์ `firestore.rules` และ `storage.rules` ไปวางในแท็บ **Rules** ของ Firestore และ Storage แล้วกด **Publish**
7. สร้างบัญชี Admin: **Authentication → Users → Add user**
   Email `admin@designnext.studio` + รหัสผ่านที่ต้องการ
   (ถ้าเปลี่ยนอีเมล Admin ให้แก้ทั้งใน `js/firebase.js` → `ADMIN_EMAILS` และในไฟล์ rules ทั้ง 2 ไฟล์)
8. Login ที่ `admin/login.html` — ระบบจะใส่ข้อมูลตัวอย่าง (seed) ลง Firestore ให้อัตโนมัติในครั้งแรก

เมื่อเชื่อมต่อสำเร็จ มุมขวาบนของ Dashboard จะแสดง **● Firebase Live**

### Firestore Collections

| Collection | ใช้เก็บ |
|---|---|
| `users` | ข้อมูลบัญชีผู้ใช้ + role |
| `customers` | ข้อมูลลูกค้า (Document ID = uid ของลูกค้า) |
| `employees` | ข้อมูลพนักงาน 7 คน |
| `projects` | โปรเจกต์ของลูกค้า |
| `bookings` | การจองคิว / นัดหมาย (DN-BK-0001) |
| `quotations` | ใบเสนอราคา (DN-QT-0001) |
| `applications` | ใบสมัครงาน (DN-APP-0001) |
| `messages` | ข้อความระหว่างลูกค้ากับทีมงาน |
| `files` | ข้อมูลไฟล์งาน (ตัวไฟล์อยู่ใน Firebase Storage) |
| `finance` | รายรับ / รายจ่าย |
| `contacts` | ข้อมูลจากแบบฟอร์มหน้า Contact |
| `counters` | ตัวนับเลขที่เอกสาร |

---

## โครงสร้างไฟล์

```
DesignNext/
├── index.html                 หน้าแรก
├── pages/                     เว็บไซต์หลัก + Booking + Careers
├── client/                    ระบบสมาชิกลูกค้า (Login, Dashboard, Projects, Quotation, Files, Messages)
├── admin/                     ระบบ Admin (Login, Dashboard, Customers, Projects, Bookings, Employees, Applications, Finance)
├── css/  styles.css · responsive.css · animations.css
├── js/   data.js      ← ข้อมูลบริษัททั้งหมด (บริการ ราคา พนักงาน ฯลฯ)
│         firebase.js  ← ตั้งค่า Firebase + ฟังก์ชันฐานข้อมูล
│         script.js    ← Navbar/Footer, Animation, หน้าเว็บไซต์หลัก, Contact, Careers
│         portfolio-gl.js ← ภาพผลงานแบบ WebGL Animation (shader แยกตามหมวด)
│         booking.js · client.js · admin.js
├── images/ logo · team · portfolio · services
├── firestore.rules · storage.rules
```

## แก้ไขข้อมูลบริษัท

ข้อมูลทั้งหมด (ชื่อพนักงาน รหัสพนักงาน ตำแหน่ง เงินเดือน ราคาแพ็กเกจ บริการ FAQ ตำแหน่งงาน)
อยู่ในไฟล์ **`js/data.js`** ไฟล์เดียว แก้ที่นี่แล้วทุกหน้าจะเปลี่ยนตาม
(ถ้าใช้ Firebase แล้ว ให้กด "Reset demo data" ในหน้า Admin Dashboard เพื่อโหลดข้อมูลพนักงานใหม่)

ใส่รูปพนักงานจริงได้ที่ `images/team/` และรูปผลงานที่ `images/portfolio/`
