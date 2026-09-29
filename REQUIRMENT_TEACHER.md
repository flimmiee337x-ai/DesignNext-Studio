งานเว็บไซต์ Project DesignNext Studio

เราจะทำเว็บไซต์บริษัท DesignNext Studio ซึ่งเป็นบริษัทด้าน Graphic Design และ Digital Technology โดยใช้
	•	VS Code
	•	HTML
	•	CSS
	•	JavaScript
	•	Firebase

เว็บไซต์จะเน้นรูปแบบ Modern / Premium / Technology / Responsive มี Animation, Hover Effect และรองรับทั้งคอมพิวเตอร์และมือถือ
1. เว็บไซต์หลักสำหรับลูกค้า

🏠 Home

หน้าแรกของบริษัท ประกอบด้วย
	•	Logo และชื่อ DesignNext Studio
	•	Slogan: Design Beyond Ideas.
	•	แนะนำบริษัท
	•	บริการของบริษัท
	•	ผลงานตัวอย่าง
	•	แพ็กเกจบริการ
	•	ขั้นตอนการทำงาน
	•	ทีมงาน
	•	ปุ่มติดต่อ / ขอใบเสนอราคา / เริ่มต้นโปรเจกต์

🎨 Services

แสดงบริการทั้งหมดของบริษัท เช่น
	•	Graphic Design
	•	Branding
	•	UI/UX Design
	•	Web Development
	•	Digital Marketing
	•	Digital Solutions

แต่ละบริการมีรายละเอียด สิ่งที่ลูกค้าจะได้รับ ระยะเวลา และสามารถกดดูรายละเอียดเพิ่มเติมได้

💰 Packages

แสดงแพ็กเกจบริการและราคาตามข้อมูลในเอกสารบริษัท เช่น
	•	Starter
	•	Business
	•	Digital
	•	Enterprise

แต่ละแพ็กเกจต้องมีรายละเอียด ราคา สิ่งที่ได้รับ ระยะเวลาทำงาน และปุ่มเริ่มต้นโปรเจกต์

🖼️ Portfolio

แสดงผลงานตัวอย่างของบริษัท โดยแบ่งหมวดหมู่ เช่น
	•	Branding
	•	Graphic Design
	•	UI/UX
	•	Website
	•	Social Media
	•	Packaging

เนื่องจาก DesignNext เป็นบริษัทเปิดใหม่ ผลงานที่ยังไม่มีลูกค้าจริงให้ระบุว่าเป็น Concept Project / Demo Project ไม่ควรระบุว่าเป็นผลงานของลูกค้าจริง

🏢 About Us

แสดงข้อมูลบริษัทจากเอกสารที่จัดทำไว้แล้ว ได้แก่
	•	ความเป็นมาของบริษัท
	•	แนวคิดในการก่อตั้ง
	•	Vision
	•	Mission
	•	Core Values
	•	จุดเด่นของบริษัท
	•	เทคโนโลยีที่ใช้

👥 Team

แสดงข้อมูลพนักงานทั้ง 7 คนจากเอกสารบริษัท โดยมี
	•	ชื่อ
	•	รหัสพนักงาน
	•	ตำแหน่ง
	•	ฝ่าย
	•	หน้าที่
	•	ทักษะที่เกี่ยวข้อง

🔄 Process

แสดงขั้นตอนการทำงานของบริษัทแบบ Timeline

01 Discover → 02 Strategy → 03 Design → 04 Develop → 05 Review → 06 Deliver

❓ FAQ

คำถามที่ลูกค้าถามบ่อย เช่น
	•	ใช้เวลาทำงานกี่วัน
	•	แก้งานได้กี่ครั้ง
	•	ชำระเงินอย่างไร
	•	ขอใบเสนอราคาได้อย่างไร
	•	รับงานประเภทใดบ้าง
	•	สามารถทำงานนอกแพ็กเกจได้หรือไม่

📞 Contact

หน้าติดต่อบริษัท มี
	•	ชื่อ
	•	บริษัท
	•	Email
	•	เบอร์โทร
	•	บริการที่สนใจ
	•	งบประมาณ
	•	รายละเอียดงาน
	•	Upload File
	•	ปุ่มส่งข้อมูล

ข้อมูลที่ส่งเข้ามาให้บันทึกลง Firebase

⸻

2. ระบบจองคิว / นัดหมาย

สร้างหน้า Booking

ลูกค้าสามารถ
	1.	เลือกบริการ
	2.	เลือกแพ็กเกจ
	3.	เลือกวันที่
	4.	เลือกเวลา
	5.	กรอกข้อมูลติดต่อ
	6.	ระบุรายละเอียดงาน
	7.	ยืนยันการจอง

เมื่อจองสำเร็จ ระบบสร้าง Booking ID เช่น

DN-BK-0001

สถานะการจองมี
	•	Pending
	•	Confirmed
	•	Rescheduled
	•	Completed
	•	Cancelled

ข้อมูลการจองต้องบันทึกใน Firebase

⸻

3. ระบบสมาชิกสำหรับลูกค้า

สร้างหน้า Customer Login

ลูกค้าสามารถสมัครสมาชิกและ Login ผ่าน Firebase Authentication

หลัง Login ให้เข้าสู่ Client Dashboard

ใน Dashboard มี
	•	ข้อมูลลูกค้า
	•	โปรเจกต์ของฉัน
	•	สถานะงาน
	•	ใบเสนอราคา
	•	ไฟล์งาน
	•	ข้อความ
	•	สถานะการชำระเงิน

ตัวอย่างสถานะงาน

Pending → In Progress → Review → Completed

⸻

4. ระบบ Project สำหรับลูกค้า

ลูกค้าสามารถดูรายละเอียด Project ของตัวเอง เช่น
	•	Project ID
	•	ชื่อ Project
	•	บริการ
	•	ผู้รับผิดชอบ
	•	วันที่เริ่มงาน
	•	กำหนดส่ง
	•	งบประมาณ
	•	Progress
	•	Status

ตัวอย่าง

Brand Identity

Progress: 80%

Status: Final Review

Deadline: 15 October 2026

⸻

5. ระบบใบเสนอราคา

ลูกค้าสามารถดูใบเสนอราคาออนไลน์ได้

ข้อมูลประกอบด้วย
	•	เลขที่ใบเสนอราคา
	•	วันที่
	•	ข้อมูลบริษัท
	•	ข้อมูลลูกค้า
	•	รายการบริการ
	•	จำนวน
	•	ราคา
	•	ส่วนลด
	•	ยอดรวม
	•	เงื่อนไขการชำระเงิน

สถานะใบเสนอราคา
	•	Pending
	•	Approved
	•	Rejected

ราคาและรายละเอียดต้องตรงกับข้อมูลในเอกสารบริษัท

⸻

6. ระบบไฟล์งาน

สร้างหน้า Files

ให้ลูกค้าสามารถดูและดาวน์โหลดไฟล์ของ Project เช่น
	•	JPG
	•	PNG
	•	PDF
	•	ZIP
	•	Source File

ใช้ Firebase Storage ในการจัดเก็บไฟล์

⸻

7. ระบบรับสมัครพนักงาน

สร้างหน้า Careers

แสดงตำแหน่งงานที่เปิดรับ เช่น
	•	Graphic Designer
	•	UI/UX Designer
	•	Web Developer
	•	Digital Marketing
	•	Project Coordinator
	•	Internship

แต่ละตำแหน่งมี
	•	รายละเอียดงาน
	•	หน้าที่
	•	คุณสมบัติ
	•	Skills
	•	เงินเดือน/ช่วงเงินเดือน
	•	สวัสดิการ
	•	ปุ่ม Apply Now

⸻

8. ระบบสมัครงาน

เมื่อกด Apply Now ให้กรอก
	•	ชื่อ
	•	Email
	•	เบอร์โทร
	•	ตำแหน่งที่สมัคร
	•	การศึกษา
	•	Skills
	•	Resume
	•	Portfolio

เมื่อสมัครสำเร็จให้สร้าง Application ID เช่น

DN-APP-0001

สถานะใบสมัคร
	•	New
	•	Reviewing
	•	Interview
	•	Accepted
	•	Rejected

ข้อมูลเก็บใน Firebase

⸻

9. ระบบ Admin

สร้างหน้า Admin Login

สำหรับผู้ดูแลระบบและพนักงานเท่านั้น

หลัง Login เข้า Admin Dashboard

Dashboard แสดง
	•	รายได้
	•	จำนวน Project
	•	จำนวนลูกค้า
	•	จำนวน Booking
	•	จำนวนใบสมัคร
	•	งานที่กำลังดำเนินการ
	•	งานที่รอดำเนินการ

10. Admin — Customers

แสดงข้อมูลลูกค้า
	•	Customer ID
	•	ชื่อลูกค้า
	•	บริษัท
	•	Email
	•	เบอร์โทร
	•	จำนวน Project
	•	Status

สามารถค้นหาและดูรายละเอียดลูกค้าได้

⸻

11. Admin — Projects

แสดง Project ทั้งหมดของบริษัท
	•	Project ID
	•	Customer
	•	Project Name
	•	Service
	•	ผู้รับผิดชอบ
	•	วันที่เริ่มงาน
	•	Deadline
	•	Budget
	•	Status

สามารถเปลี่ยนสถานะ Project ได้
	•	Pending
	•	In Progress
	•	Review
	•	Completed
	•	Cancelled

⸻

12. Admin — Bookings

แสดงคิวทั้งหมด

สามารถ
	•	ดูรายละเอียดการจอง
	•	Confirm
	•	Reschedule
	•	Cancel
	•	Complete

และสามารถดูวันที่/เวลาที่ลูกค้านัดหมายได้

⸻

13. Admin — Employees

แสดงข้อมูลพนักงานทั้ง 7 คนตามเอกสารบริษัท

ข้อมูลประกอบด้วย
	•	Employee ID
	•	ชื่อ
	•	ตำแหน่ง
	•	ฝ่าย
	•	เงินเดือน
	•	สถานะการทำงาน

⸻

14. Admin — Applications

แสดงใบสมัครงานทั้งหมด

มีข้อมูล
	•	Application ID
	•	ชื่อผู้สมัคร
	•	ตำแหน่ง
	•	วันที่สมัคร
	•	Email
	•	เบอร์โทร
	•	Status

สามารถเปลี่ยนสถานะเป็น

New / Reviewing / Interview / Accepted / Rejected

⸻

15. Admin — Finance

ทำระบบการเงินเบื้องต้นของบริษัท

แสดง
	•	รายได้
	•	ค่าใช้จ่าย
	•	กำไร
	•	เงินที่รอชำระ
	•	รายได้รายเดือน
	•	ค่าใช้จ่ายรายเดือน

สามารถทำเป็นกราฟเพื่อให้ Dashboard ดูสมจริง

⸻

16. Firebase

ใช้ Firebase เป็นฐานข้อมูลและ Backend

Collections หลักที่ต้องเตรียม

users
customers
employees
projects
bookings
quotations
applications
messages
files
finance

ใช้ Firebase Authentication สำหรับ Login

ใช้ Firestore สำหรับเก็บข้อมูล

ใช้ Firebase Storage สำหรับเก็บไฟล์และรูปภาพ

⸻

17. รูปแบบเว็บไซต์

เว็บไซต์ทุกหน้าต้องใช้ Design เดียวกัน

Theme:
	•	Dark
	•	Modern
	•	Premium
	•	Technology

สีหลัก
Background: #0B0B0F
White: #FFFFFF
Accent: #7667FF
ควรมี
	•	Animation
	•	Hover Effect
	•	Scroll Animation
	•	Card Design
	•	Gradient
	•	Glassmorphism
	•	Responsive Design
	•	Mobile Menu

ไม่ทำให้ดูเหมือนเว็บ HTML ธรรมดา แต่ให้ดูเหมือนเว็บไซต์บริษัทเทคโนโลยีจริง

DesignNext/
│
├── index.html
│
├── pages/
│   ├── services.html
│   ├── packages.html
│   ├── portfolio.html
│   ├── about.html
│   ├── team.html
│   ├── process.html
│   ├── faq.html
│   ├── contact.html
│   ├── booking.html
│   └── careers.html
│
├── client/
│   ├── login.html
│   ├── dashboard.html
│   ├── projects.html
│   ├── quotation.html
│   ├── files.html
│   └── messages.html
│
├── admin/
│   ├── login.html
│   ├── dashboard.html
│   ├── customers.html
│   ├── projects.html
│   ├── bookings.html
│   ├── employees.html
│   ├── applications.html
│   └── finance.html
│
├── css/
│   ├── styles.css
│   ├── responsive.css
│   └── animations.css
│
├── js/
│   ├── script.js
│   ├── booking.js
│   ├── client.js
│   ├── admin.js
│   └── firebase.js
│
└── images/
    ├── logo/
    ├── team/
    ├── portfolio/
    └── services/
⭐ ลำดับการทำงาน

ให้ทำตามลำดับนี้เพื่อไม่ให้ระบบชนกัน

Phase 1 — เว็บไซต์หลัก
	1.	Home
	2.	Services
	3.	Packages
	4.	Portfolio
	5.	About
	6.	Team
	7.	Process
	8.	FAQ
	9.	Contact

Phase 2 — ระบบลูกค้า
	10.	Booking
	11.	Login
	12.	Client Dashboard
	13.	Projects
	14.	Quotation
	15.	Files
	16.	Messages

Phase 3 — ระบบสมัครงาน
	17.	Careers
	18.	Application

Phase 4 — ระบบ Admin
	19.	Admin Login
	20.	Dashboard
	21.	Customers
	22.	Projects
	23.	Bookings
	24.	Employees
	25.	Applications
	26.	Finance

Phase 5 — Firebase
	27.	Authentication
	28.	Firestore
	29.	Storage
	30.	เชื่อมข้อมูลทุกระบบเข้าด้วยกัน