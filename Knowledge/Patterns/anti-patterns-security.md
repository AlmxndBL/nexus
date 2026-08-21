---
tags: [knowledge, gotchas, stack/universal, sec/owasp]
note_type: gotcha-collection
stack: universal
created: 2026-08-19
updated: 2026-08-19
parent: "[[Knowledge/Patterns/_Index]]"
---

# 🛡️ Universal Security Anti-Patterns

> กฎเหล็กและข้อห้ามเด็ดขาดด้านความปลอดภัย (OWASP Top 10) ที่ต้องบังคับใช้กับทุกโปรเจกต์

---

### 1. 🔑 Secrets & Tokens Leakage
- ❌ **ห้ามทำ:** ห้าม Commit API Keys, Passwords, Private Keys, JWT Secrets ลง Git หรือ Hardcode ไว้ใน Source Code เด็ดขาด
- ✅ **วิธีที่ถูกต้อง:** ใช้ Environment Variables (`.env`) และตั้งค่า `.gitignore` เสมอ

### 2. 💉 SQL / Query Injection
- ❌ **ห้ามทำ:** ห้ามใช้ String Concatenation หรือ Template Literals ในการต่อ Query ตรง ๆ เช่น `` prisma.$queryRawUnsafe(`SELECT * FROM users WHERE email = '${email}'`) ``
- ✅ **วิธีที่ถูกต้อง:** ใช้ Parameterized Queries (เช่น `prisma.$queryRaw` พร้อม Tagged Template) หรือใช้ ORM Method ปกติ

### 3. 🚪 Broken Object Level Authorization (BOLA / IDOR)
- ❌ **ห้ามทำ:** อย่าเชื่อ `userId`, `tenantId`, หรือ `orderId` ที่ส่งมาจาก Client Body/Params โดยไม่ตรวจสอบสิทธิ์ความเป็นเจ้าของ
- ✅ **วิธีที่ถูกต้อง:** ตรวจสอบสิทธิ์กับ Authenticated Session เสมอ (เช่น `where: { id: orderId, userId: session.user.id }`)

### 4. 🌐 Mass Assignment Vulnerability
- ❌ **ห้ามทำ:** ห้ามส่ง `req.body` เข้า ORM create/update ตรง ๆ โดยไม่มีการกรอง เช่น `prisma.user.update({ data: req.body })`
- ✅ **วิธีที่ถูกต้อง:** ใช้ Zod Schema Validate ข้อมูล และเลือกรับเฉพาะ Field ที่อนุญาต (Whitelist) เท่านั้น

### 5. ⚡ Race Conditions & Lost Updates (Double-Spending / Overbooking)
- ❌ **ห้ามทำ:** อ่านยอดเงิน/สถานะห้องด้วย `findUnique` แล้วนำมาคำนวณใน Javascript ก่อนสั่ง `update` ในระดับ High Concurrency
- ✅ **วิธีที่ถูกต้อง:** ใช้ Atomic Operations (`increment`/`decrement`) หรือ Optimistic Locking ด้วย `@version` Field เสมอ

### 6. 🧟 Zombie Stateless JWT Tokens
- ❌ **ห้ามทำ:** ปล่อยให้ Access Token มีอายุยาว (1h+) หรือพึ่งพาเฉพาะการลบ Client Cookie ตอน Logout โดยไม่มี Server-Side Revocation
- ✅ **วิธีที่ถูกต้อง:** กำหนด Access Token สั้น (5-15m) และตรวจสอบ `tokenVersion` หรือ Session ID ใน DB/Redis สำหรับคำสั่งสำคัญ

### 7. 🖼️ SVG & Media Stored XSS
- ❌ **ห้ามทำ:** รับไฟล์ `.svg` แล้วเก็บบน Public Web Root หรือ CDN ตรงๆ โดยไม่ตรวจ Script tags
- ✅ **วิธีที่ถูกต้อง:** ห้ามรับ SVG หากไม่จำเป็น หรือต้องผ่าน `DOMPurify` และแปลงภาพทั่วไปเป็น WebP พร้อมลบ Metadata เสมอ

### 8. ⏱️ In-Memory Rate Limiting on Multi-Instance
- ❌ **ห้ามทำ:** ใช้ In-memory counter ใน Express/Nitro เมื่อรันระบบบน Serverless หรือ Multi-container
- ✅ **วิธีที่ถูกต้อง:** ต่อ Rate Limiter เข้ากับ Redis (Upstash/Valkey) เสมอเพื่อแชร์ State ข้าม Replicas

### 9. 💥 Refresh Token Rotation Race Conditions (Multi-Tab / Parallel Requests)
- ❌ **ห้ามทำ:** บังคับ Revoke Refresh Token ทันทีแบบ 0-tolerance โดยไม่มี Grace Period หรือ Client Mutex ทำให้ผู้ใช้ที่เปิดหลายแท็บหรือโหลดหลาย API พร้อมกันถูกเตะหลุดเอง
- ✅ **วิธีที่ถูกต้อง:** ใส่ **Server-Side Grace Period (15-30 วินาที)** สำหรับ Token เก่า และทำ **Client Mutex Interceptor** ให้รอ Refresh Token สำเร็จรอบเดียวก่อนยิง Retry

### 10. 🗄️ Hybrid JWT Database Overload (`tokenVersion` Anti-pattern)
- ❌ **ห้ามทำ:** สั่ง Query Database เพื่อเช็ก `tokenVersion` หรือ `sessionId` ในทุกๆ Read Request ปกติ ซึ่งทำให้ Stateless JWT กลายเป็น Stateful DB Bottleneck
- ✅ **วิธีที่ถูกต้อง:** เช็ก `tokenVersion` เฉพาะตอน **Refresh Token (ทุก 10-15 นาที)** และตอนทำธุรกรรมวิกฤต (Critical Mutations) เท่านั้น

### 11. 📱 LINE LIFF / Third-Party Identity Spoofing
- ❌ **ห้ามทำ:** ยอมรับ `userId` หรือ `lineUserId` ที่ส่งมาใน JSON Request Body ของ Client โดยตรง เพราะผู้ไม่ประสงค์ดีสามารถปลอมแปลง `userId` ของผู้อื่นเพื่อขโมยข้อมูลหรือสร้างคำสั่งแทนได้
- ✅ **วิธีที่ถูกต้อง:** ส่ง **LINE `id_token`** มายัง Server แล้วตรวจสอบความถูกต้องผ่าน LINE Token Verification API (`https://api.line.me/oauth2/v2.1/verify`) หรือ Cryptographic Signature เทียบกับ LINE Channel ID เสมอเพื่อดึง `sub` (User ID จริง)

---

up:: [[Knowledge/Patterns/_Index]]


