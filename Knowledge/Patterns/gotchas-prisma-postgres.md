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
