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
