---
tags: [knowledge, gotchas, stack/prisma, stack/postgres, stack/database]
note_type: gotcha-collection
stack: prisma
confidence: 0.95
times_applied: 35
last_validated: 2026-08-22
source: session
parent: "[[Knowledge/Patterns/_Index]]"
---

# ⚠️ Gotchas: Prisma ORM + PostgreSQL

> รวมข้อควรระวังเรื่อง Database Connection, Migrations, และ Transaction Performance

---

### 1. 🔌 Connection Pool Exhaustion on Serverless / Hot Reload
- ❌ **ห้ามทำ:** ห้ามสร้าง `new PrismaClient()` ทุกครั้งที่เรียก Server Route หรือ API Handler
- ✅ **วิธีที่ถูกต้อง:** ใช้ Singleton Pattern บน Global Object (เช่น `globalThis.prisma = globalThis.prisma || new PrismaClient()`) เพื่อหลีกเลี่ยง Connection ล้น Database

### 2. ⏳ Interactive Transaction Timeouts
- ❌ **ห้ามทำ:** อย่าใส่ Async I/O นอกฐานข้อมูล (เช่น เรียก External HTTP API, ส่ง LINE Message, ส่ง Email) ไว้ข้างใน `$transaction(async (tx) => { ... })`
- ✅ **วิธีที่ถูกต้อง:** ภายใน Transaction ให้มีเฉพาะ Database Operations สั้น ๆ เท่านั้น และกำหนด `timeout` ที่เหมาะสม (default คือ 5000ms)

### 3. 🚀 Zero-Downtime Safe Migrations
- ❌ **ห้ามทำ:** อย่าลบ Column หรือเปลี่ยน Type ทันทีใน Migration เดียวกันเมื่อมี Service รันอยู่
- ✅ **วิธีที่ถูกต้อง:** ใช้วิธี **Expand-and-Contract Pattern** (เพิ่ม Column ใหม่ $\rightarrow$ ทยอยย้ายข้อมูล $\rightarrow$ สลับโค้ดมาใช้ตัวใหม่ $\rightarrow$ ลบ Column เก่าในภายหลัง)

### 4. 📊 N+1 Query Prevention
- ❌ **ห้ามทำ:** อย่าเขียน Loop แล้วยิง `prisma.model.findUnique()` ข้างใน
- ✅ **วิธีที่ถูกต้อง:** ใช้ `include` / `select` relations หรือใช้ `findMany({ where: { id: { in: ids } } })` แทน

### 5. 💰 Floating Point Currency Math & Decimal Precision
- ❌ **ห้ามทำ:** ห้ามใช้ Type `Float` ใน Prisma Schema สำหรับคอลัมน์ราคา, ยอดเงิน, ค่าไฟ-ค่าน้ำ, หรือภาษี VAT และห้ามใช้ Native JS `+ - * /` กับยอดเงิน เพราะจะเกิดปัญหา IEEE 754 Floating Point Precision Error (`0.1 + 0.2 !== 0.3`) ทำให้ยอดเงินเพี้ยน 1-2 สตางค์
- ✅ **วิธีที่ถูกต้อง:** ใช้ Type `Decimal` (เช่น `Decimal @db.Decimal(12, 2)`) และใช้ **`Prisma.Decimal`** หรือเก็บเป็น **หน่วยสตางค์ (Integer `Int`)** เสมอ

### 6. 🕒 UTC vs UTC+7 (Asia/Bangkok) Date Range Queries
- ❌ **ห้ามทำ:** อย่าส่ง UTC Date String (เช่น `2026-08-20T00:00:00Z`) ไปค้นหา `gte / lte` โดยตรง เพราะเวลา 00:00-06:59 น. ของไทยจะถูกตัดเป็นของวันก่อนหน้า
- ✅ **วิธีที่ถูกต้อง:** คำนวณ Start/End of Day ตาม Timezone `Asia/Bangkok` ก่อน แล้วจึงแปลงเป็น Date Object ส่งให้ Prisma:
  ```typescript
  const start = dayjs().tz('Asia/Bangkok').startOf('day').toDate();
  const end = dayjs().tz('Asia/Bangkok').endOf('day').toDate();
  ```

### 7. 🔒 Concurrency & Double-Booking Prevention
- ❌ **ห้ามทำ:** อย่าเช็กความว่างของ Slot (`findFirst`) แล้วตามด้วย `create` แยกคำสั่งกันโดยไม่มี Lock เพราะถ้ายิงพร้อมกัน 2 Requests จะเกิด Double Booking
- ✅ **วิธีที่ถูกต้อง:**
  1. ใช้ **PostgreSQL `EXCLUDE USING gist (tsrange(start_time, end_time) WITH &&)`** ที่ Database Constraint
  2. หรือรันใน `$transaction` พร้อมใช้ **Optimistic Locking (`version` column)** หรือ **`SELECT FOR UPDATE`** ผ่าน `$queryRaw`

### 8. 🛡️ Supabase RLS vs Prisma `service_role` Bypass
- ❌ **ห้ามทำ:** อย่าทึกทักเอาเองว่าเปิด Supabase Row-Level Security (RLS) แล้ว Prisma จะบังคับ Tenant Isolation ให้อัตโนมัติ เพราะ Prisma เชื่อมต่อด้วย Direct/Pooler connection ที่ถือสิทธิ์ Bypass RLS เสมอ
- ✅ **วิธีที่ถูกต้อง:** ต้องใส่เงื่อนไข `where: { tenantId }` ใน Service / Repository Layer เสมอ หรือใช้ Extension/Middleware กำหนด Tenant Session Variable ก่อน Query

---

up:: [[Knowledge/Patterns/_Index]]

