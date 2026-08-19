---
title: Database & API Performance Gotchas (Supabase + Prisma + Next.js SWR)
tags: [stack/universal, stack/prisma, stack/nextjs, stack/supabase, performance/database, performance/frontend]
author: Apex AI Framework
date: 2026-08-19
status: active
---

# ⚡ Database & API Performance Gotchas (Supabase + Prisma + Next.js SWR)

เอกสารรวบรวมข้อควรระวัง (Gotchas) และ Anti-patterns ที่ทำให้ระบบทำงานช้า พร้อมแนวทางการแก้ไขระดับ Production สำหรับโปรเจกต์ที่ใช้ Next.js 14, Prisma ORM, Supabase Cloud PostgreSQL, และ SWR Client Caching

---

## 🚨 Gotcha 1: N+1 & Sequential Waterfall Queries ใน API Route Handlers

### ❌ Anti-pattern ที่ต้องหลีกเลี่ยง:
การเขียนคำสั่ง `await prisma...` เรียงต่อกันหลายบรรทัดใน API เส้นเดียว หรือการนำ `await` ไปใส่ไว้ใน `for / while loop` เช่น:
```typescript
// ❌ ช้ามาก: วนลูป 6 รอบ = ยิง Database Request 12 ครั้งแบบเรียงคิว
for (let i = 5; i >= 0; i--) {
  const [inc, exp] = await Promise.all([
    prisma.transaction.aggregate({ where: { userId, type: 'INCOME', date: { gte: mStart, lte: mEnd } }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: 'EXPENSE', date: { gte: mStart, lte: mEnd } }, _sum: { amount: true } }),
  ]);
  monthlyTrend.push(...);
}
```

### 💥 ผลกระทบ:
เมื่อ Database อยู่บน Cloud (เช่น Supabase Tokyo ที่มี Network Round-trip Time ~100ms) การวนลูป 12 ครั้งจะทำให้แค่ API เส้นเดียวต้องรอเน็ตไป-กลับ **1.5 - 2.5 วินาที**

### ✅ Best Practice Solution:
1. **Fetch Once in Single Query:** ดึงข้อมูลช่วงเวลาทั้งหมด (6 เดือน) ในครั้งเดียว แล้วนำมา Grouping/Aggregate ใน RAM ของ Node.js ซึ่งใช้เวลาเพียง `0.1ms`
2. **Parallel Batch with Promise.all:** รวมคำสั่งดึงข้อมูลที่อิสระต่อกันทั้งหมดไว้ใน `Promise.all([q1, q2, q3, q4])` เพื่อให้จบใน **1 Network Round-trip**

```typescript
// ✅ เร็วที่สุด: 1 Network Round-trip (< 150ms)
const [wallets, incomeAgg, expenseAgg, recentTx, categoryGroup, pastSixMonthsTx] = await Promise.all([
  prisma.wallet.findMany({ where: { userId, deletedAt: null } }),
  prisma.transaction.aggregate({ where: { userId, type: 'INCOME', date: { gte: mStart, lte: mEnd } }, _sum: { amount: true } }),
  prisma.transaction.aggregate({ where: { userId, type: 'EXPENSE', date: { gte: mStart, lte: mEnd } }, _sum: { amount: true } }),
  prisma.transaction.findMany({ where: { userId, deletedAt: null }, take: 5 }),
  prisma.transaction.groupBy({ by: ['categoryId'], where: { userId, type: 'EXPENSE' }, _sum: { amount: true } }),
  prisma.transaction.findMany({ where: { userId, date: { gte: sixMonthsAgo } }, select: { type: true, amount: true, date: true } }),
]);
```

---

## 🚨 Gotcha 2: ขาด Composite Indexes ใน Prisma Schema

### ❌ Anti-pattern ที่ต้องหลีกเลี่ยง:
ประกาศเฉพาะ Single Index เดี่ยวๆ เช่น `@@index([userId])` หรือ `@@index([date])` แต่ใน Business Logic มีการกรองเงื่อนไขร่วมกันหลายฟิลด์เสมอ เช่น `WHERE userId = ? AND type = ? AND date BETWEEN ? AND ?`

### 💥 ผลกระทบ:
PostgreSQL จะต้องทำ Bitmap Index Scan หรือ Full Table Scan ทำให้ความเร็วในการค้นหาตกลงอย่างมากเมื่อข้อมูลมีปริมาณมากขึ้น

### ✅ Best Practice Solution:
เพิ่ม Composite Index ให้ครอบคลุมรูปแบบการ Query หลักของระบบใน `prisma/schema.prisma`:
```prisma
model Transaction {
  // ... fields ...

  @@index([userId, date])
  @@index([userId, type, date])
  @@index([userId, categoryId, date])
  @@index([walletId])
  @@index([bankRefId])
}

model SavingsGoal {
  // ... fields ...

  @@index([userId, isCompleted])
}
```

---

## 🚨 Gotcha 3: SWR Auto-Revalidation On Window Focus Over-fetching

### ❌ Anti-pattern ที่ต้องหลีกเลี่ยง:
ไม่ตั้งค่า Global `SWRConfig` หรือปล่อยให้ `revalidateOnFocus: true` ทำงานเป็นค่าเริ่มต้น

### 💥 ผลกระทบ:
ทุกครั้งที่ผู้ใช้สลับหน้าต่าง (Alt-Tab) หรือคลิกกลับมาที่หน้าเว็บ SWR จะสั่งยิง API ทุกตัวพร้อมกัน 4-5 เส้นทันที ทำให้เกิด Network Choke, เปลือง Bandwidth, และทำให้ Terminal มี Log ขึ้นตลอดเวลา

### ✅ Best Practice Solution:
ห่อ Global Provider ด้วย `SWRConfig` พร้อมตั้งค่า Caching Policy ที่เหมาะสม:
```tsx
<SWRConfig
  value={{
    fetcher: globalFetcher,
    revalidateOnFocus: false,      // 🛑 ปิดการยิงซ้ำตอนสลับหน้าจอ (Alt-Tab)
    revalidateOnReconnect: false,  // 🛑 ปิดการยิงซ้ำตอนต่อเน็ตใหม่
    revalidateIfStale: false,      // 🛡️ ใช้ข้อมูลเดิมจากแคชก่อน
    dedupingInterval: 60000,       // ⚡ แคชข้อมูลใน Memory ไว้ 60 วินาที ห้ามยิงซ้ำ
    errorRetryCount: 1,
  }}
>
  {children}
</SWRConfig>
```

---

## 🚨 Gotcha 4: Noisy Prisma Query Logging ในโหมด Development

### ❌ Anti-pattern ที่ต้องหลีกเลี่ยง:
เปิด `log: ['query']` ค้างไว้ใน `new PrismaClient()` ตลอดเวลาในโหมด dev:
```typescript
// ❌ ไม่ควรเปิด query log ค้างไว้
new PrismaClient({ log: ['query', 'error', 'warn'] })
```

### 💥 ผลกระทบ:
Node.js ต้องคอย serialize ข้อความ SQL และเขียน I/O Stream ทุกขั้นตอน (`BEGIN`, `SELECT`, `COMMIT`, `DEALLOCATE ALL`) ลง Terminal วันละหลายพันบรรทัด ทำให้ I/O Process หน่วงและรกหน้าจอ

### ✅ Best Practice Solution:
กำหนดให้แสดงเฉพาะ `['warn', 'error']` เป็นค่าเริ่มต้น และเปิด `query` เฉพาะเมื่อตั้งค่า Environment Variable `PRISMA_LOG_QUERIES=true` เพื่อ Debug เท่านั้น:
```typescript
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.PRISMA_LOG_QUERIES === 'true'
        ? ['query', 'error', 'warn']
        : ['error', 'warn'],
  });
```
