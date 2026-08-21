---
tags: [knowledge, gotchas, stack/prisma, stack/postgres, stack/database]
note_type: gotcha-collection
stack: prisma
created: 2026-08-19
updated: 2026-08-19
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

