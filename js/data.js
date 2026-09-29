/* =========================================================
   DesignNext Studio — Company Data
   ---------------------------------------------------------
   ข้อมูลบริษัททั้งหมดอยู่ในไฟล์นี้ไฟล์เดียว
   ถ้าเอกสารบริษัทมีข้อมูลต่างจากนี้ (ชื่อพนักงาน ราคา เงินเดือน ฯลฯ)
   ให้แก้ที่ไฟล์นี้ แล้วทุกหน้าจะอัปเดตตามอัตโนมัติ
   ========================================================= */

const COMPANY = {
  name: 'DesignNext Studio',
  legalName: 'บริษัท ดีไซน์เน็กซ์ สตูดิโอ จำกัด',
  slogan: 'Design Beyond Ideas.',
  founded: 2026,
  email: 'hello@designnext.studio',
  phone: '02-123-4567',
  mobile: '089-123-4567',
  line: '@designnext',
  address: '88/8 อาคาร Next Tower ชั้น 12 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
  taxId: '0105569000000',
  hours: 'จันทร์ – ศุกร์ 09:00 – 18:00 น.',
  intro: 'DesignNext Studio คือบริษัทด้าน Graphic Design และ Digital Technology ที่ผสานความคิดสร้างสรรค์เข้ากับเทคโนโลยี เพื่อสร้างแบรนด์ เว็บไซต์ และประสบการณ์ดิจิทัลที่โดดเด่น วัดผลได้ และเติบโตไปพร้อมกับธุรกิจของลูกค้า',
  history: 'DesignNext Studio ก่อตั้งขึ้นในปี 2026 โดยกลุ่มนักออกแบบและนักพัฒนารุ่นใหม่ที่มองเห็นว่าธุรกิจขนาดเล็กและกลางจำนวนมากยังขาดพาร์ตเนอร์ที่เข้าใจทั้ง "งานออกแบบ" และ "เทคโนโลยี" ไปพร้อมกัน ทีมผู้ก่อตั้งจึงรวมประสบการณ์ด้าน Graphic Design, UI/UX, Web Development และ Digital Marketing เข้าไว้ในสตูดิโอเดียว เพื่อให้ลูกค้าได้รับบริการครบวงจรตั้งแต่การสร้างแบรนด์ไปจนถึงการทำตลาดออนไลน์',
  concept: 'แนวคิดในการก่อตั้งคือ "Design Beyond Ideas." — งานออกแบบที่ดีต้องไม่หยุดอยู่แค่ความสวยงาม แต่ต้องแก้ปัญหาทางธุรกิจได้จริง เราจึงเริ่มทุกโปรเจกต์ด้วยการทำความเข้าใจเป้าหมายของลูกค้า วางกลยุทธ์ แล้วจึงออกแบบและพัฒนาด้วยเทคโนโลยีที่เหมาะสม',
  vision: 'เป็นสตูดิโอออกแบบและเทคโนโลยีดิจิทัลชั้นนำของประเทศไทย ที่ธุรกิจทุกขนาดไว้วางใจให้สร้างแบรนด์และประสบการณ์ดิจิทัลที่เหนือความคาดหมาย',
  mission: [
    'สร้างสรรค์งานออกแบบที่มีคุณภาพระดับสากลในราคาที่ธุรกิจทุกขนาดเข้าถึงได้',
    'ผสานงานออกแบบเข้ากับเทคโนโลยี เพื่อสร้างผลลัพธ์ที่วัดผลได้จริง',
    'ทำงานอย่างโปร่งใส ตรงเวลา และสื่อสารกับลูกค้าอย่างใกล้ชิดทุกขั้นตอน',
    'พัฒนาทักษะของทีมอย่างต่อเนื่องและติดตามเทรนด์การออกแบบและเทคโนโลยีใหม่ ๆ'
  ],
  values: [
    { name: 'Creativity', th: 'ความคิดสร้างสรรค์', desc: 'กล้าคิดต่าง และหาไอเดียใหม่ที่ทำให้แบรนด์โดดเด่น' },
    { name: 'Quality', th: 'คุณภาพ', desc: 'ใส่ใจทุกรายละเอียด ตั้งแต่ Pixel แรกจนถึงบรรทัดโค้ดสุดท้าย' },
    { name: 'Integrity', th: 'ความซื่อสัตย์', desc: 'โปร่งใสทั้งราคา ระยะเวลา และผลงาน' },
    { name: 'Collaboration', th: 'การทำงานร่วมกัน', desc: 'ลูกค้าคือส่วนหนึ่งของทีม เราทำงานไปด้วยกันทุกขั้นตอน' },
    { name: 'Innovation', th: 'นวัตกรรม', desc: 'ใช้เทคโนโลยีที่ทันสมัยเพื่อสร้างผลลัพธ์ที่ดีกว่า' },
    { name: 'On Time', th: 'ตรงต่อเวลา', desc: 'ส่งมอบงานตามกำหนดด้วยขั้นตอนการทำงานที่ชัดเจน' }
  ],
  highlights: [
    { icon: '⚡', title: 'ครบจบในที่เดียว', desc: 'ออกแบบ พัฒนา และทำการตลาด โดยทีมเดียวกัน' },
    { icon: '🎯', title: 'Strategy-First', desc: 'ทุกงานเริ่มจากเป้าหมายทางธุรกิจ ไม่ใช่แค่ความสวยงาม' },
    { icon: '💎', title: 'Premium Quality', desc: 'มาตรฐานงานระดับสากลในราคาที่เหมาะสม' },
    { icon: '📊', title: 'โปร่งใส ติดตามได้', desc: 'ลูกค้าดูสถานะงาน ใบเสนอราคา และไฟล์ได้ผ่าน Client Dashboard' }
  ],
  tech: [
    { short: 'Ai', name: 'Adobe Illustrator' },
    { short: 'Ps', name: 'Adobe Photoshop' },
    { short: 'Fg', name: 'Figma' },
    { short: 'VS', name: 'VS Code' },
    { short: 'H5', name: 'HTML5 / CSS3' },
    { short: 'JS', name: 'JavaScript' },
    { short: 'Fb', name: 'Firebase' },
    { short: 'GA', name: 'Google Analytics' },
    { short: 'Me', name: 'Meta Business Suite' },
    { short: 'AI', name: 'Generative AI Tools' }
  ]
};

/* ---------- Services ---------- */
const SERVICES = [
  {
    id: 'graphic', name: 'Graphic Design', icon: '🎨',
    short: 'ออกแบบสื่อสิ่งพิมพ์และสื่อออนไลน์ให้สวยงาม สื่อสารชัดเจน และตรงกับภาพลักษณ์ของแบรนด์',
    detail: 'บริการออกแบบกราฟิกทุกประเภท ทั้งโปสเตอร์ แผ่นพับ นามบัตร Banner โฆษณา Infographic และสื่อ Social Media โดยนักออกแบบมืออาชีพที่คำนึงถึงทั้งความสวยงามและการสื่อสาร',
    deliverables: ['ไฟล์งานความละเอียดสูง (JPG / PNG / PDF)', 'Source File (AI / PSD)', 'ปรับแก้ได้ 2 ครั้ง', 'ไฟล์สำหรับพิมพ์และออนไลน์'],
    duration: '3 – 7 วันทำการ', startPrice: 1500
  },
  {
    id: 'branding', name: 'Branding', icon: '💠',
    short: 'สร้างอัตลักษณ์แบรนด์ครบวงจร ตั้งแต่โลโก้ สี ฟอนต์ จนถึง Brand Guideline',
    detail: 'วางรากฐานแบรนด์ด้วยการวิเคราะห์กลุ่มเป้าหมายและคู่แข่ง ออกแบบโลโก้ ระบบสี ฟอนต์ และองค์ประกอบกราฟิก พร้อมจัดทำ Brand Guideline เพื่อให้แบรนด์มีความสม่ำเสมอในทุกช่องทาง',
    deliverables: ['Logo (Primary / Secondary / Icon)', 'Color Palette & Typography', 'Brand Guideline (PDF)', 'Business Card & Stationery', 'Brand Mockup'],
    duration: '14 – 21 วันทำการ', startPrice: 15000
  },
  {
    id: 'uiux', name: 'UI/UX Design', icon: '📱',
    short: 'ออกแบบประสบการณ์ผู้ใช้และหน้าจอ Website / Application ให้ใช้งานง่ายและน่าประทับใจ',
    detail: 'ออกแบบ User Flow, Wireframe และ High-fidelity UI บน Figma พร้อม Interactive Prototype สำหรับทดสอบกับผู้ใช้จริง เหมาะสำหรับเว็บไซต์ แอปพลิเคชัน และระบบภายในองค์กร',
    deliverables: ['User Flow & Wireframe', 'UI Design (Desktop / Mobile)', 'Interactive Prototype', 'Design System / Components', 'ไฟล์ Figma'],
    duration: '14 – 30 วันทำการ', startPrice: 20000
  },
  {
    id: 'web', name: 'Web Development', icon: '💻',
    short: 'พัฒนาเว็บไซต์ที่รวดเร็ว รองรับทุกอุปกรณ์ และพร้อมต่อยอดสู่ระบบธุรกิจออนไลน์',
    detail: 'พัฒนาเว็บไซต์บริษัท Landing Page และ Web Application ด้วย HTML, CSS, JavaScript และ Firebase รองรับ Responsive Design, SEO พื้นฐาน และระบบหลังบ้านสำหรับจัดการข้อมูล',
    deliverables: ['เว็บไซต์ Responsive', 'ระบบ Admin / ฐานข้อมูล Firebase', 'SEO พื้นฐาน', 'Domain & Hosting Setup', 'ดูแลหลังส่งมอบ 30 วัน'],
    duration: '21 – 45 วันทำการ', startPrice: 25000
  },
  {
    id: 'marketing', name: 'Digital Marketing', icon: '📈',
    short: 'วางแผนและทำการตลาดออนไลน์ ทั้ง Content, Social Media และโฆษณา เพื่อเพิ่มยอดขาย',
    detail: 'วางกลยุทธ์การตลาดดิจิทัล ผลิต Content และกราฟิกสำหรับ Social Media ยิงโฆษณา Facebook / Instagram / Google พร้อมรายงานผลรายเดือนเพื่อปรับปรุงแคมเปญอย่างต่อเนื่อง',
    deliverables: ['Content Plan รายเดือน', 'กราฟิก Social Media', 'Ads Management', 'Monthly Report', 'Page Setup & Optimization'],
    duration: 'สัญญารายเดือน (ขั้นต่ำ 3 เดือน)', startPrice: 12000
  },
  {
    id: 'solutions', name: 'Digital Solutions', icon: '⚙️',
    short: 'ออกแบบและพัฒนาระบบดิจิทัลเฉพาะธุรกิจ เช่น ระบบจองคิว ระบบสมาชิก และ Dashboard',
    detail: 'ให้คำปรึกษาและพัฒนาระบบดิจิทัลที่ช่วยให้ธุรกิจทำงานได้เร็วขึ้น เช่น ระบบจองคิวออนไลน์ ระบบสมาชิก ระบบจัดการลูกค้า และ Dashboard รายงานผล โดยใช้ Cloud Technology',
    deliverables: ['วิเคราะห์ความต้องการ (Requirement)', 'ออกแบบและพัฒนาระบบ', 'ระบบ Login / Database', 'คู่มือการใช้งาน & Training', 'ดูแลหลังส่งมอบ 60 วัน'],
    duration: '30 – 60 วันทำการ', startPrice: 40000
  }
];

/* ---------- Packages ---------- */
const PACKAGES = [
  {
    id: 'starter', name: 'Starter', price: 9900, unit: 'บาท / โปรเจกต์',
    tagline: 'เหมาะสำหรับธุรกิจเปิดใหม่ที่ต้องการเริ่มต้นสร้างภาพลักษณ์',
    duration: '7 – 10 วันทำการ',
    features: ['ออกแบบโลโก้ 2 แบบให้เลือก', 'นามบัตร 1 แบบ', 'กราฟิก Social Media 5 ชิ้น', 'Color Palette พื้นฐาน', 'แก้ไขได้ 2 ครั้ง', 'ไฟล์ JPG / PNG / PDF'],
    featured: false
  },
  {
    id: 'business', name: 'Business', price: 29900, unit: 'บาท / โปรเจกต์',
    tagline: 'สร้างแบรนด์ครบชุด พร้อมใช้งานทั้งออฟไลน์และออนไลน์',
    duration: '14 – 21 วันทำการ',
    features: ['Brand Identity ครบชุด', 'Brand Guideline (PDF)', 'Stationery Set', 'กราฟิก Social Media 15 ชิ้น', 'Landing Page 1 หน้า', 'แก้ไขได้ 3 ครั้ง', 'Source File ทั้งหมด'],
    featured: true
  },
  {
    id: 'digital', name: 'Digital', price: 59900, unit: 'บาท / โปรเจกต์',
    tagline: 'สำหรับธุรกิจที่ต้องการเว็บไซต์และระบบออนไลน์แบบมืออาชีพ',
    duration: '30 – 45 วันทำการ',
    features: ['UI/UX Design (สูงสุด 8 หน้า)', 'เว็บไซต์ Responsive', 'ระบบ Admin + Firebase', 'SEO พื้นฐาน', 'Content Plan 1 เดือน', 'แก้ไขได้ 3 ครั้ง', 'ดูแลหลังส่งมอบ 30 วัน'],
    featured: false
  },
  {
    id: 'enterprise', name: 'Enterprise', price: 150000, unit: 'บาท ขึ้นไป', priceNote: 'เริ่มต้น',
    tagline: 'โซลูชันครบวงจรสำหรับองค์กร ออกแบบตามความต้องการเฉพาะ',
    duration: '60 – 90 วันทำการ',
    features: ['Branding + Rebranding ทั้งองค์กร', 'Web Application / ระบบเฉพาะ', 'Dashboard & Reporting', 'Digital Marketing 3 เดือน', 'Dedicated Project Manager', 'แก้ไขไม่จำกัด (ตามขอบเขต)', 'ดูแลหลังส่งมอบ 90 วัน'],
    featured: false
  }
];

/* ---------- Process ---------- */
const PROCESS = [
  { n: '01', name: 'Discover', th: 'ค้นหาและทำความเข้าใจ', days: '1 – 3 วัน', desc: 'พูดคุยกับลูกค้าเพื่อเข้าใจธุรกิจ เป้าหมาย กลุ่มเป้าหมาย และคู่แข่ง พร้อมรวบรวม Requirement', out: ['Project Brief', 'Requirement List'] },
  { n: '02', name: 'Strategy', th: 'วางกลยุทธ์', days: '2 – 5 วัน', desc: 'วิเคราะห์ข้อมูลและวางแนวทางการออกแบบ ขอบเขตงาน Timeline และจัดทำใบเสนอราคา', out: ['Creative Direction', 'Quotation & Timeline'] },
  { n: '03', name: 'Design', th: 'ออกแบบ', days: '5 – 15 วัน', desc: 'สร้าง Moodboard, Sketch และออกแบบงานจริง นำเสนอให้ลูกค้าเลือกแนวทาง', out: ['Design Concepts', 'Prototype'] },
  { n: '04', name: 'Develop', th: 'พัฒนา', days: '5 – 30 วัน', desc: 'พัฒนางานให้สมบูรณ์ เช่น เขียนเว็บไซต์ ทำระบบ หรือผลิตสื่อทั้งหมดตามที่ตกลง', out: ['Final Artwork', 'Website / System'] },
  { n: '05', name: 'Review', th: 'ตรวจสอบและแก้ไข', days: '2 – 5 วัน', desc: 'ลูกค้าตรวจงานผ่าน Client Dashboard และแจ้งแก้ไขตามจำนวนครั้งที่กำหนดในแพ็กเกจ', out: ['Revision', 'Final Approval'] },
  { n: '06', name: 'Deliver', th: 'ส่งมอบ', days: '1 – 2 วัน', desc: 'ส่งมอบไฟล์งานทั้งหมดผ่านระบบ พร้อมคู่มือการใช้งานและการดูแลหลังการขาย', out: ['Final Files', 'Guideline / Manual'] }
];

/* ---------- Team (7 employees) ---------- */
const EMPLOYEES = [
  { employeeId: 'DN-EMP-001', prefix: 'นางสาว', name: 'เมริสา สุวรรณพานิช', initials: 'MS', position: 'Project Manager / Business & UX Lead', department: 'Management', salary: 55000, status: 'Active',
    duty: 'บริหารโปรเจกต์และทีม วางแผน Timeline ดูแลความต้องการทางธุรกิจของลูกค้า และกำหนดแนวทาง UX ของระบบ', skills: ['Project Management', 'Business Analysis', 'UX Strategy'], color: '#7667FF' },
  { employeeId: 'DN-EMP-002', prefix: 'นาย', name: 'กันตพัฒน์ จารีย์', initials: 'KJ', position: 'Front-End Developer', department: 'Technology', salary: 40000, status: 'Active',
    duty: 'พัฒนาหน้าเว็บไซต์ด้วย HTML, CSS, JavaScript ทำ Responsive Design, Animation และ Hover Effect', skills: ['HTML/CSS', 'JavaScript', 'Responsive Web'], color: '#38BDF8' },
  { employeeId: 'DN-EMP-003', prefix: 'นาย', name: 'เกียรติพัฒน์ มหิมา', initials: 'KM', position: 'UI/UX & Visual Designer', department: 'Design', salary: 38000, status: 'Active',
    duty: 'ออกแบบ UI/UX, Wireframe, Prototype และงานกราฟิก Visual ของเว็บไซต์และแบรนด์', skills: ['Figma', 'UI Design', 'Visual Design'], color: '#F472B6' },
  { employeeId: 'DN-EMP-004', prefix: 'นาย', name: 'ณัชวัฒน์ ศรีเกตุ', initials: 'NS', position: 'Firebase / Backend Developer', department: 'Technology', salary: 42000, status: 'Active',
    duty: 'ออกแบบและดูแลฐานข้อมูล Firestore, Authentication, Storage และ Security Rules ของระบบ', skills: ['Firebase', 'Firestore', 'Security Rules'], color: '#FBBF24' },
  { employeeId: 'DN-EMP-005', prefix: 'นาย', name: 'ธนกร อาจคงหาร', initials: 'TA', position: 'Customer System Developer', department: 'Technology', salary: 38000, status: 'Active',
    duty: 'พัฒนาระบบฝั่งลูกค้า ได้แก่ Booking, Customer Login, Client Dashboard, ใบเสนอราคา และไฟล์งาน', skills: ['JavaScript', 'Firebase Auth', 'Booking System'], color: '#34D399' },
  { employeeId: 'DN-EMP-006', prefix: 'นาย', name: 'ณัฐพล สงมณี', initials: 'NS', position: 'Admin System Developer', department: 'Technology', salary: 38000, status: 'Active',
    duty: 'พัฒนาระบบหลังบ้าน Admin Dashboard จัดการลูกค้า โปรเจกต์ การจอง ใบสมัครงาน และการเงิน', skills: ['JavaScript', 'Dashboard', 'Chart.js'], color: '#A78BFA' },
  { employeeId: 'DN-EMP-007', prefix: 'นาย', name: 'สักการ นกแก้ว', initials: 'SN', position: 'Content / Portfolio / QA', department: 'Content & QA', salary: 30000, status: 'Active',
    duty: 'จัดทำเนื้อหาเว็บไซต์และผลงาน Portfolio ทดสอบระบบ (QA) และตรวจสอบความถูกต้องก่อนส่งมอบ', skills: ['Content Writing', 'Portfolio', 'Testing / QA'], color: '#F97316' }
];

/* ---------- Portfolio (Concept / Demo projects) ---------- */
const PORTFOLIO = [
  { title: 'Kafé Nomad', cat: 'Branding', desc: 'Brand Identity สำหรับคาเฟ่สไตล์ Minimal', g: ['#7667FF', '#F472B6'] },
  { title: 'GreenLeaf Organic', cat: 'Packaging', desc: 'ออกแบบบรรจุภัณฑ์สินค้าออร์แกนิก', g: ['#34D399', '#0EA5E9'] },
  { title: 'FinTrack App', cat: 'UI/UX', desc: 'UI/UX แอปพลิเคชันจัดการการเงินส่วนบุคคล', g: ['#38BDF8', '#7667FF'] },
  { title: 'Siam Clinic', cat: 'Website', desc: 'เว็บไซต์คลินิกพร้อมระบบจองคิวออนไลน์', g: ['#0EA5E9', '#34D399'] },
  { title: 'Urban Run 2026', cat: 'Graphic Design', desc: 'Key Visual และโปสเตอร์งานวิ่งมาราธอน', g: ['#F97316', '#F472B6'] },
  { title: 'Bloom Skincare', cat: 'Social Media', desc: 'ชุดกราฟิก Social Media 30 วัน', g: ['#F472B6', '#FBBF24'] },
  { title: 'Nexa Tech', cat: 'Branding', desc: 'Rebranding บริษัท Tech Startup', g: ['#0B0B0F', '#7667FF'] },
  { title: 'EduSpace', cat: 'UI/UX', desc: 'Dashboard ระบบเรียนออนไลน์', g: ['#A78BFA', '#38BDF8'] },
  { title: 'Thai Craft Beer', cat: 'Packaging', desc: 'ฉลากและกล่องเบียร์คราฟต์', g: ['#FBBF24', '#B45309'] },
  { title: 'Studio Fit', cat: 'Website', desc: 'Landing Page ฟิตเนสสตูดิโอ', g: ['#EF4444', '#7667FF'] },
  { title: 'Art Week BKK', cat: 'Graphic Design', desc: 'Event Identity และสื่อประชาสัมพันธ์', g: ['#7667FF', '#FBBF24'] },
  { title: 'Foodie Box', cat: 'Social Media', desc: 'Content & Ads Creative ธุรกิจเดลิเวอรี', g: ['#F97316', '#34D399'] }
];
const PORTFOLIO_CATS = ['Branding', 'Graphic Design', 'UI/UX', 'Website', 'Social Media', 'Packaging'];

/* ---------- FAQ ---------- */
const FAQS = [
  { q: 'ใช้เวลาทำงานกี่วัน?', a: 'ขึ้นอยู่กับประเภทงานและแพ็กเกจ เช่น Starter ใช้เวลา 7 – 10 วันทำการ, Business 14 – 21 วันทำการ, Digital 30 – 45 วันทำการ และ Enterprise 60 – 90 วันทำการ โดยจะแจ้ง Timeline ที่ชัดเจนในใบเสนอราคา' },
  { q: 'แก้งานได้กี่ครั้ง?', a: 'แพ็กเกจ Starter แก้ไขได้ 2 ครั้ง, Business และ Digital แก้ไขได้ 3 ครั้ง, Enterprise แก้ไขได้ไม่จำกัดภายในขอบเขตงานที่ตกลง หากต้องการแก้ไขเพิ่มเติมคิดค่าบริการครั้งละ 500 – 1,500 บาทตามความซับซ้อน' },
  { q: 'ชำระเงินอย่างไร?', a: 'ชำระมัดจำ 50% ก่อนเริ่มงาน และชำระส่วนที่เหลือ 50% ก่อนส่งมอบไฟล์งานฉบับสมบูรณ์ รองรับการโอนผ่านบัญชีธนาคารและ PromptPay พร้อมออกใบเสร็จ/ใบกำกับภาษีได้' },
  { q: 'ขอใบเสนอราคาได้อย่างไร?', a: 'กรอกแบบฟอร์มในหน้า Contact หรือจองคิวปรึกษาในหน้า Booking ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง และส่งใบเสนอราคาให้ดูออนไลน์ผ่าน Client Dashboard' },
  { q: 'รับงานประเภทใดบ้าง?', a: 'Graphic Design, Branding, UI/UX Design, Web Development, Digital Marketing และ Digital Solutions ทั้งงานสำหรับธุรกิจขนาดเล็ก SME ไปจนถึงองค์กรขนาดใหญ่' },
  { q: 'สามารถทำงานนอกแพ็กเกจได้หรือไม่?', a: 'ได้ครับ เราสามารถปรับแพ็กเกจหรือออกแบบขอบเขตงานใหม่ตามความต้องการ (Custom Package) โดยทีมงานจะประเมินราคาให้ตามขอบเขตงานจริง' },
  { q: 'จะได้รับ Source File หรือไม่?', a: 'แพ็กเกจ Business ขึ้นไปจะได้รับ Source File (AI / PSD / Figma) ทั้งหมด สำหรับ Starter สามารถซื้อ Source File เพิ่มได้' },
  { q: 'ติดตามสถานะงานได้อย่างไร?', a: 'ลูกค้าสามารถสมัครสมาชิกและเข้าสู่ Client Dashboard เพื่อดูสถานะงาน Progress ใบเสนอราคา ไฟล์งาน และส่งข้อความหาทีมงานได้ตลอด 24 ชั่วโมง' }
];

/* ---------- Careers ---------- */
const CAREERS = [
  { id: 'graphic-designer', title: 'Graphic Designer', type: 'Full-time', dept: 'Creative', salary: '22,000 – 35,000 บาท',
    desc: 'ออกแบบสื่อกราฟิกทั้งออนไลน์และออฟไลน์ให้กับลูกค้าหลากหลายธุรกิจ',
    duties: ['ออกแบบโลโก้ สื่อสิ่งพิมพ์ และกราฟิก Social Media', 'ทำงานร่วมกับ Art Director ตาม Brand Guideline', 'เตรียมไฟล์สำหรับพิมพ์และออนไลน์'],
    quals: ['ปริญญาตรีด้านออกแบบ นิเทศศิลป์ หรือที่เกี่ยวข้อง', 'มี Portfolio ผลงาน', 'ประสบการณ์ 0 – 2 ปี (รับนักศึกษาจบใหม่)'],
    skills: ['Illustrator', 'Photoshop', 'Typography', 'Layout'] },
  { id: 'uiux-designer', title: 'UI/UX Designer', type: 'Full-time', dept: 'Design & Technology', salary: '28,000 – 45,000 บาท',
    desc: 'ออกแบบประสบการณ์ผู้ใช้และหน้าจอเว็บไซต์/แอปพลิเคชันให้ใช้งานง่าย',
    duties: ['ทำ User Research, User Flow และ Wireframe', 'ออกแบบ UI และ Prototype บน Figma', 'ทำงานร่วมกับ Developer เพื่อส่งมอบงาน'],
    quals: ['ปริญญาตรีสาขาที่เกี่ยวข้อง', 'ประสบการณ์ 1 ปีขึ้นไป', 'เข้าใจหลัก Usability และ Responsive Design'],
    skills: ['Figma', 'Prototyping', 'Design System', 'UX Research'] },
  { id: 'web-developer', title: 'Web Developer', type: 'Full-time', dept: 'Design & Technology', salary: '30,000 – 50,000 บาท',
    desc: 'พัฒนาเว็บไซต์และระบบออนไลน์ให้ลูกค้าด้วยเทคโนโลยีที่ทันสมัย',
    duties: ['พัฒนาเว็บไซต์ Responsive ด้วย HTML/CSS/JavaScript', 'เชื่อมต่อฐานข้อมูลและระบบ Authentication (Firebase)', 'ดูแลและแก้ไขปัญหาระบบหลังส่งมอบ'],
    quals: ['ปริญญาตรีสาขาคอมพิวเตอร์หรือที่เกี่ยวข้อง', 'ประสบการณ์ 1 ปีขึ้นไป', 'ใช้งาน Git ได้'],
    skills: ['HTML/CSS', 'JavaScript', 'Firebase', 'Git'] },
  { id: 'digital-marketing', title: 'Digital Marketing', type: 'Full-time', dept: 'Marketing', salary: '25,000 – 40,000 บาท',
    desc: 'วางแผนและทำการตลาดออนไลน์ให้แบรนด์ของลูกค้าเติบโต',
    duties: ['วางแผน Content และแคมเปญโฆษณา', 'ยิงโฆษณา Facebook / Instagram / Google', 'ทำรายงานและวิเคราะห์ผลรายเดือน'],
    quals: ['ปริญญาตรีด้านการตลาด นิเทศศาสตร์ หรือที่เกี่ยวข้อง', 'ประสบการณ์ 1 ปีขึ้นไป', 'ทักษะการเขียน Copywriting'],
    skills: ['Meta Ads', 'Google Ads', 'Analytics', 'Copywriting'] },
  { id: 'project-coordinator', title: 'Project Coordinator', type: 'Full-time', dept: 'Operations', salary: '22,000 – 32,000 บาท',
    desc: 'ประสานงานโปรเจกต์ระหว่างลูกค้าและทีมงานให้ส่งมอบตรงเวลา',
    duties: ['ดูแล Timeline และติดตามความคืบหน้างาน', 'ประสานงานลูกค้า นัดหมาย และทำใบเสนอราคา', 'บันทึกข้อมูลโปรเจกต์ในระบบ'],
    quals: ['ปริญญาตรีทุกสาขา', 'มีทักษะการสื่อสารและการจัดการเวลา', 'ใช้ Google Workspace ได้ดี'],
    skills: ['Communication', 'Planning', 'Excel / Sheets', 'Problem Solving'] },
  { id: 'internship', title: 'Internship (ฝึกงาน)', type: 'Internship', dept: 'ทุกฝ่าย', salary: '300 บาท / วัน',
    desc: 'เปิดรับนักศึกษาฝึกงานด้าน Graphic, UI/UX, Web Development และ Marketing',
    duties: ['ช่วยงานทีมตามสายงานที่สมัคร', 'เรียนรู้กระบวนการทำงานจริงกับลูกค้า', 'นำเสนอผลงานเมื่อจบการฝึกงาน'],
    quals: ['นักศึกษาปี 3 – 4 หรือ ปวส.', 'ฝึกงานได้อย่างน้อย 2 เดือน', 'มี Portfolio หรือผลงานตัวอย่าง'],
    skills: ['ตามสายงานที่สมัคร', 'ความรับผิดชอบ', 'ความกระตือรือร้น'] }
];
const BENEFITS = ['ประกันสังคม', 'ประกันสุขภาพกลุ่ม', 'โบนัสตามผลงาน', 'Hybrid Working (WFH 2 วัน/สัปดาห์)', 'MacBook สำหรับทำงาน', 'งบพัฒนาทักษะ 10,000 บาท/ปี', 'วันหยุดพักร้อน 10 วัน/ปี', 'Team Outing ประจำปี'];

/* ---------- Booking options ---------- */
const BOOKING_TIMES = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const BUDGETS = ['ต่ำกว่า 10,000 บาท', '10,000 – 30,000 บาท', '30,000 – 60,000 บาท', '60,000 – 150,000 บาท', 'มากกว่า 150,000 บาท', 'ยังไม่แน่ใจ'];

/* ---------- Status lists ---------- */
const STATUS = {
  booking: ['Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled'],
  project: ['Pending', 'In Progress', 'Review', 'Completed', 'Cancelled'],
  quotation: ['Pending', 'Approved', 'Rejected'],
  application: ['New', 'Reviewing', 'Interview', 'Accepted', 'Rejected'],
  payment: ['Unpaid', 'Partial', 'Paid']
};

/* ---------- Quotation terms ---------- */
const PAYMENT_TERMS = [
  'ชำระมัดจำ 50% ก่อนเริ่มงาน และชำระส่วนที่เหลือ 50% ก่อนส่งมอบไฟล์งานฉบับสมบูรณ์',
  'ราคาข้างต้นยังไม่รวมภาษีมูลค่าเพิ่ม 7%',
  'ใบเสนอราคานี้มีอายุ 30 วันนับจากวันที่ออก',
  'ชำระผ่านการโอนเงิน: ธนาคารกสิกรไทย บจก. ดีไซน์เน็กซ์ สตูดิโอ เลขที่ 123-4-56789-0',
  'การแก้ไขเกินจำนวนครั้งที่กำหนด คิดค่าบริการเพิ่มตามจริง'
];

/* =========================================================
   DEMO SEED DATA — ใช้เติมฐานข้อมูลครั้งแรกเพื่อให้ Dashboard มีข้อมูลแสดง
   (ข้อมูลลูกค้าเป็นข้อมูลสมมติทั้งหมด)
   ========================================================= */
const SEED = {
  customers: [
    { id: 'demo-cus-1', customerId: 'DN-CUS-0001', name: 'สมชาย ใจดี', company: 'Kafé Nomad Co., Ltd.', email: 'somchai@kafenomad.co', phone: '081-111-2222', status: 'Active' },
    { id: 'demo-cus-2', customerId: 'DN-CUS-0002', name: 'วิภาวี รุ่งเรือง', company: 'Siam Clinic', email: 'wipawee@siamclinic.com', phone: '082-333-4444', status: 'Active' },
    { id: 'demo-cus-3', customerId: 'DN-CUS-0003', name: 'John Carter', company: 'Nexa Tech', email: 'john@nexatech.io', phone: '083-555-6666', status: 'Active' },
    { id: 'demo-cus-4', customerId: 'DN-CUS-0004', name: 'มาลัย ศรีทอง', company: 'GreenLeaf Organic', email: 'malai@greenleaf.co.th', phone: '084-777-8888', status: 'Inactive' },
    { id: 'demo-cus-5', customerId: 'DN-CUS-0005', name: 'ปกรณ์ เจริญสุข', company: 'Studio Fit', email: 'pakorn@studiofit.th', phone: '085-999-0000', status: 'Active' }
  ],
  projects: [
    { id: 'demo-prj-1', projectId: 'DN-PRJ-0001', customerId: 'demo-cus-1', customerName: 'Kafé Nomad Co., Ltd.', name: 'Brand Identity', service: 'Branding', package: 'Business', owner: 'เกียรติพัฒน์ มหิมา', startDate: '2026-09-01', deadline: '2026-10-15', budget: 29900, paid: 14950, progress: 80, stage: 'Final Review', status: 'Review', paymentStatus: 'Partial' },
    { id: 'demo-prj-2', projectId: 'DN-PRJ-0002', customerId: 'demo-cus-2', customerName: 'Siam Clinic', name: 'Clinic Website + Booking', service: 'Web Development', package: 'Digital', owner: 'กันตพัฒน์ จารีย์', startDate: '2026-08-20', deadline: '2026-10-30', budget: 59900, paid: 29950, progress: 55, stage: 'Develop', status: 'In Progress', paymentStatus: 'Partial' },
    { id: 'demo-prj-3', projectId: 'DN-PRJ-0003', customerId: 'demo-cus-3', customerName: 'Nexa Tech', name: 'Corporate Rebranding', service: 'Branding', package: 'Enterprise', owner: 'เมริสา สุวรรณพานิช', startDate: '2026-07-15', deadline: '2026-11-20', budget: 180000, paid: 90000, progress: 40, stage: 'Design', status: 'In Progress', paymentStatus: 'Partial' },
    { id: 'demo-prj-4', projectId: 'DN-PRJ-0004', customerId: 'demo-cus-4', customerName: 'GreenLeaf Organic', name: 'Packaging Design', service: 'Graphic Design', package: 'Starter', owner: 'เกียรติพัฒน์ มหิมา', startDate: '2026-06-01', deadline: '2026-06-20', budget: 9900, paid: 9900, progress: 100, stage: 'Delivered', status: 'Completed', paymentStatus: 'Paid' },
    { id: 'demo-prj-5', projectId: 'DN-PRJ-0005', customerId: 'demo-cus-5', customerName: 'Studio Fit', name: 'Social Media Campaign', service: 'Digital Marketing', package: 'Business', owner: 'สักการ นกแก้ว', startDate: '2026-10-05', deadline: '2026-12-31', budget: 36000, paid: 0, progress: 0, stage: 'Discover', status: 'Pending', paymentStatus: 'Unpaid' },
    { id: 'demo-prj-6', projectId: 'DN-PRJ-0006', customerId: 'demo-cus-1', customerName: 'Kafé Nomad Co., Ltd.', name: 'Menu & Social Kit', service: 'Graphic Design', package: 'Starter', owner: 'เกียรติพัฒน์ มหิมา', startDate: '2026-05-10', deadline: '2026-05-25', budget: 9900, paid: 9900, progress: 100, stage: 'Delivered', status: 'Completed', paymentStatus: 'Paid' },
    { id: 'demo-prj-7', projectId: 'DN-PRJ-0007', customerId: 'demo-cus-3', customerName: 'Nexa Tech', name: 'SaaS Dashboard UI', service: 'UI/UX Design', package: 'Digital', owner: 'เกียรติพัฒน์ มหิมา', startDate: '2026-09-10', deadline: '2026-10-25', budget: 45000, paid: 22500, progress: 65, stage: 'Design', status: 'In Progress', paymentStatus: 'Partial' }
  ],
  bookings: [
    { id: 'demo-bk-1', bookingId: 'DN-BK-0001', service: 'Branding', package: 'Business', date: '2026-10-02', time: '10:00', name: 'ธีรวัฒน์ พงษ์ไทย', company: 'Bloom Skincare', email: 'teerawat@bloom.co', phone: '086-123-4567', details: 'ต้องการทำแบรนด์ใหม่สำหรับสินค้า Skincare', status: 'Pending' },
    { id: 'demo-bk-2', bookingId: 'DN-BK-0002', service: 'Web Development', package: 'Digital', date: '2026-10-03', time: '14:00', name: 'ศิริพร แสงทอง', company: 'EduSpace', email: 'siriporn@eduspace.ac', phone: '087-234-5678', details: 'เว็บไซต์โรงเรียนกวดวิชาพร้อมระบบสมัครเรียน', status: 'Confirmed' },
    { id: 'demo-bk-3', bookingId: 'DN-BK-0003', service: 'Digital Marketing', package: 'Business', date: '2026-10-06', time: '11:00', name: 'ปกรณ์ เจริญสุข', company: 'Studio Fit', email: 'pakorn@studiofit.th', phone: '085-999-0000', details: 'ปรึกษาแผนการตลาดไตรมาส 4', status: 'Rescheduled' },
    { id: 'demo-bk-4', bookingId: 'DN-BK-0004', service: 'UI/UX Design', package: 'Digital', date: '2026-09-18', time: '15:00', name: 'John Carter', company: 'Nexa Tech', email: 'john@nexatech.io', phone: '083-555-6666', details: 'Kick-off SaaS Dashboard', status: 'Completed' },
    { id: 'demo-bk-5', bookingId: 'DN-BK-0005', service: 'Graphic Design', package: 'Starter', date: '2026-09-22', time: '09:00', name: 'อนันต์ มีสุข', company: 'Thai Craft Beer', email: 'anan@tcb.beer', phone: '088-345-6789', details: 'ออกแบบฉลากสินค้า', status: 'Cancelled' }
  ],
  quotations: [
    { id: 'demo-qt-1', quotationNo: 'DN-QT-0001', customerId: 'demo-cus-1', customerName: 'สมชาย ใจดี', customerCompany: 'Kafé Nomad Co., Ltd.', customerEmail: 'somchai@kafenomad.co', customerPhone: '081-111-2222', projectId: 'DN-PRJ-0001', date: '2026-08-25', validUntil: '2026-09-24',
      items: [{ desc: 'Business Package — Brand Identity ครบชุด', qty: 1, price: 29900 }, { desc: 'กราฟิก Social Media เพิ่มเติม', qty: 5, price: 500 }], discount: 2500, vat: 7, status: 'Approved' },
    { id: 'demo-qt-2', quotationNo: 'DN-QT-0002', customerId: 'demo-cus-2', customerName: 'วิภาวี รุ่งเรือง', customerCompany: 'Siam Clinic', customerEmail: 'wipawee@siamclinic.com', customerPhone: '082-333-4444', projectId: 'DN-PRJ-0002', date: '2026-08-15', validUntil: '2026-09-14',
      items: [{ desc: 'Digital Package — เว็บไซต์ + ระบบ Admin', qty: 1, price: 59900 }], discount: 0, vat: 7, status: 'Approved' },
    { id: 'demo-qt-3', quotationNo: 'DN-QT-0003', customerId: 'demo-cus-5', customerName: 'ปกรณ์ เจริญสุข', customerCompany: 'Studio Fit', customerEmail: 'pakorn@studiofit.th', customerPhone: '085-999-0000', projectId: 'DN-PRJ-0005', date: '2026-09-25', validUntil: '2026-10-25',
      items: [{ desc: 'Digital Marketing (รายเดือน)', qty: 3, price: 12000 }], discount: 0, vat: 7, status: 'Pending' },
    { id: 'demo-qt-4', quotationNo: 'DN-QT-0004', customerId: 'demo-cus-4', customerName: 'มาลัย ศรีทอง', customerCompany: 'GreenLeaf Organic', customerEmail: 'malai@greenleaf.co.th', customerPhone: '084-777-8888', projectId: '', date: '2026-09-05', validUntil: '2026-10-05',
      items: [{ desc: 'Website Landing Page', qty: 1, price: 25000 }], discount: 0, vat: 7, status: 'Rejected' }
  ],
  applications: [
    { id: 'demo-app-1', applicationId: 'DN-APP-0001', name: 'ภัทรา สุขสันต์', email: 'pattra.s@gmail.com', phone: '090-111-2233', position: 'Graphic Designer', education: 'ปริญญาตรี นิเทศศิลป์ มหาวิทยาลัยศิลปากร', skills: 'Illustrator, Photoshop, Branding', portfolio: 'https://behance.net/pattra', resumeUrl: '', resumeName: 'resume_pattra.pdf', status: 'Interview', createdAt: '2026-09-10T09:30:00.000Z' },
    { id: 'demo-app-2', applicationId: 'DN-APP-0002', name: 'วรเมธ ทองคำ', email: 'woramet.t@gmail.com', phone: '091-222-3344', position: 'Web Developer', education: 'ปริญญาตรี วิทยาการคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์', skills: 'JavaScript, Firebase, React', portfolio: 'https://github.com/woramet', resumeUrl: '', resumeName: 'woramet_cv.pdf', status: 'Reviewing', createdAt: '2026-09-18T13:10:00.000Z' },
    { id: 'demo-app-3', applicationId: 'DN-APP-0003', name: 'นภัสสร ใจงาม', email: 'napat.j@gmail.com', phone: '092-333-4455', position: 'Internship', education: 'ปวส. คอมพิวเตอร์กราฟิก', skills: 'Photoshop, Canva', portfolio: '', resumeUrl: '', resumeName: 'napatsorn.pdf', status: 'New', createdAt: '2026-09-26T08:00:00.000Z' },
    { id: 'demo-app-4', applicationId: 'DN-APP-0004', name: 'Kevin Tan', email: 'kevin.tan@gmail.com', phone: '093-444-5566', position: 'UI/UX Designer', education: 'Bachelor of Design, NUS', skills: 'Figma, UX Research', portfolio: 'https://dribbble.com/kevintan', resumeUrl: '', resumeName: 'kevin_tan_cv.pdf', status: 'Accepted', createdAt: '2026-08-30T10:00:00.000Z' }
  ],
  finance: [
    { id: 'demo-fin-01', type: 'income', category: 'Project Payment', amount: 9900, date: '2026-05-25', note: 'Kafé Nomad — Menu & Social Kit', status: 'Paid' },
    { id: 'demo-fin-02', type: 'income', category: 'Project Payment', amount: 9900, date: '2026-06-20', note: 'GreenLeaf — Packaging', status: 'Paid' },
    { id: 'demo-fin-03', type: 'income', category: 'Project Deposit', amount: 90000, date: '2026-07-15', note: 'Nexa Tech — Rebranding 50%', status: 'Paid' },
    { id: 'demo-fin-04', type: 'income', category: 'Project Deposit', amount: 29950, date: '2026-08-20', note: 'Siam Clinic — Website 50%', status: 'Paid' },
    { id: 'demo-fin-05', type: 'income', category: 'Project Deposit', amount: 14950, date: '2026-09-01', note: 'Kafé Nomad — Brand Identity 50%', status: 'Paid' },
    { id: 'demo-fin-06', type: 'income', category: 'Project Deposit', amount: 22500, date: '2026-09-10', note: 'Nexa Tech — SaaS Dashboard 50%', status: 'Paid' },
    { id: 'demo-fin-07', type: 'income', category: 'Outstanding', amount: 14950, date: '2026-10-15', note: 'Kafé Nomad — Brand Identity งวดสุดท้าย', status: 'Pending' },
    { id: 'demo-fin-08', type: 'income', category: 'Outstanding', amount: 29950, date: '2026-10-30', note: 'Siam Clinic — Website งวดสุดท้าย', status: 'Pending' },
    { id: 'demo-fin-09', type: 'income', category: 'Outstanding', amount: 90000, date: '2026-11-20', note: 'Nexa Tech — Rebranding งวดสุดท้าย', status: 'Pending' },
    { id: 'demo-fin-10', type: 'income', category: 'Outstanding', amount: 22500, date: '2026-10-25', note: 'Nexa Tech — SaaS Dashboard งวดสุดท้าย', status: 'Pending' },
    { id: 'demo-fin-11', type: 'income', category: 'Project Payment', amount: 18000, date: '2026-04-28', note: 'Freelance Graphic Jobs', status: 'Paid' },
    { id: 'demo-fin-20', type: 'expense', category: 'Office Rent', amount: 25000, date: '2026-04-01', note: 'ค่าเช่าสำนักงาน เม.ย.', status: 'Paid' },
    { id: 'demo-fin-21', type: 'expense', category: 'Office Rent', amount: 25000, date: '2026-05-01', note: 'ค่าเช่าสำนักงาน พ.ค.', status: 'Paid' },
    { id: 'demo-fin-22', type: 'expense', category: 'Office Rent', amount: 25000, date: '2026-06-01', note: 'ค่าเช่าสำนักงาน มิ.ย.', status: 'Paid' },
    { id: 'demo-fin-23', type: 'expense', category: 'Office Rent', amount: 25000, date: '2026-07-01', note: 'ค่าเช่าสำนักงาน ก.ค.', status: 'Paid' },
    { id: 'demo-fin-24', type: 'expense', category: 'Office Rent', amount: 25000, date: '2026-08-01', note: 'ค่าเช่าสำนักงาน ส.ค.', status: 'Paid' },
    { id: 'demo-fin-25', type: 'expense', category: 'Office Rent', amount: 25000, date: '2026-09-01', note: 'ค่าเช่าสำนักงาน ก.ย.', status: 'Paid' },
    { id: 'demo-fin-26', type: 'expense', category: 'Software', amount: 8500, date: '2026-04-05', note: 'Adobe CC + Figma (รายปีเฉลี่ย)', status: 'Paid' },
    { id: 'demo-fin-27', type: 'expense', category: 'Software', amount: 8500, date: '2026-07-05', note: 'Adobe CC + Figma', status: 'Paid' },
    { id: 'demo-fin-28', type: 'expense', category: 'Marketing', amount: 12000, date: '2026-06-10', note: 'โฆษณาเปิดตัวบริษัท', status: 'Paid' },
    { id: 'demo-fin-29', type: 'expense', category: 'Marketing', amount: 6000, date: '2026-09-12', note: 'Facebook Ads', status: 'Paid' },
    { id: 'demo-fin-30', type: 'expense', category: 'Equipment', amount: 45000, date: '2026-04-15', note: 'MacBook สำหรับทีม', status: 'Paid' },
    { id: 'demo-fin-31', type: 'expense', category: 'Utilities', amount: 4200, date: '2026-08-28', note: 'ค่าไฟ อินเทอร์เน็ต', status: 'Paid' },
    { id: 'demo-fin-32', type: 'expense', category: 'Utilities', amount: 4500, date: '2026-09-28', note: 'ค่าไฟ อินเทอร์เน็ต', status: 'Paid' }
  ],
  messages: [
    { id: 'demo-msg-1', customerId: 'demo-cus-1', from: 'studio', senderName: 'เมริสา (Project Manager)', text: 'สวัสดีครับคุณสมชาย ทีมได้อัปโหลดไฟล์ Brand Identity เวอร์ชัน Final Review แล้วนะครับ', createdAt: '2026-09-26T10:00:00.000Z' },
    { id: 'demo-msg-2', customerId: 'demo-cus-1', from: 'client', senderName: 'สมชาย ใจดี', text: 'ได้รับแล้วครับ ขอปรับสีโลโก้ให้เข้มขึ้นเล็กน้อยได้ไหมครับ', createdAt: '2026-09-26T13:20:00.000Z' }
  ],
  files: [
    { id: 'demo-file-1', customerId: 'demo-cus-1', projectId: 'DN-PRJ-0001', name: 'KafeNomad_Logo_Final.png', type: 'PNG', size: 845000, url: '', path: '', uploadedBy: 'studio', demo: true },
    { id: 'demo-file-2', customerId: 'demo-cus-1', projectId: 'DN-PRJ-0001', name: 'KafeNomad_Brand_Guideline.pdf', type: 'PDF', size: 4200000, url: '', path: '', uploadedBy: 'studio', demo: true },
    { id: 'demo-file-3', customerId: 'demo-cus-1', projectId: 'DN-PRJ-0001', name: 'KafeNomad_Source.zip', type: 'ZIP', size: 38000000, url: '', path: '', uploadedBy: 'studio', demo: true }
  ]
};
