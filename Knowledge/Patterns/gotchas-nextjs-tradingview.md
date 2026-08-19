---
tags: [knowledge, gotchas, stack/nextjs, stack/react, chart/lightweight, api/yahoo-finance]
note_type: gotcha-collection
stack: nextjs
created: 2026-08-19
updated: 2026-08-19
parent: "[[Knowledge/Patterns/_Index]]"
---

# ⚠️ Gotchas: Next.js 15, TradingView Lightweight Charts & Yahoo Finance

> รวมข้อควรระวังเรื่อง Lightweight Charts Data Schema, Next.js Standalone on Windows, และ Yahoo Finance v4

---

### 1. 📈 TradingView Lightweight Charts Timestamp Property
- ❌ **ห้ามทำ:** ห้ามตั้งชื่อฟิลด์เวลาของแท่งเทียนเป็น `date` หรือส่งค่า `time: undefined` เข้า `candleSeries.setData()`
- ⚠️ **ผลกระทบ:** จะเกิด Browser Runtime Crash `Uncaught TypeError: Cannot read properties of undefined (reading 'year')`
- ✅ **วิธีที่ถูกต้อง:** กำหนดชื่อฟิลด์เป็น **`time`** เสมอ โดยใช้รูปแบบ string `'YYYY-MM-DD'` (สำหรับช่วงวัน/เดือน/ปี) หรือตัวเลข **UNIX Timestamp (วินาที)** สำหรับ Intraday และต้องเรียงลำดับเวลาจากอดีตไปหาปัจจุบัน (Ascending Sort)

### 2. 🪟 Next.js Standalone Build on Windows (`EPERM symlink`)
- ❌ **ห้ามทำ:** อย่าตั้ง `output: 'standalone'` ตายตัวใน `next.config.ts` บนเครื่อง Windows ที่ไม่ได้เปิด Developer Mode
- ⚠️ **ผลกระทบ:** คำสั่ง `pnpm build` จะพังด้วย error `EPERM: operation not permitted, symlink`
- ✅ **วิธีที่ถูกต้อง:** ใช้ Conditional Standalone:
  ```ts
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined
  ```
  โดยให้ Docker Container (Linux) ส่ง `ENV BUILD_STANDALONE=true` เข้าไปตอน Build ส่วนบน Local Windows ให้รัน Standard Build ตามปกติ

### 3. 📅 Yahoo Finance v4 Date Parameters
- ❌ **ห้ามทำ:** อย่าส่ง Shorthand string เช่น `period1: '1y'` เข้า `yahooFinance.chart()`
- ⚠️ **ผลกระทบ:** เกิด `Error: yahooFinance.chart() option 'period1' invalid date provided: '1y'`
- ✅ **วิธีที่ถูกต้อง:** ส่งเป็น `Date` Object เสมอ เช่น:
  ```ts
  const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  yf.chart(symbol, { period1: oneYearAgo, interval: '1d' });
  ```

### 4. ⚡ Zero-Redis In-Memory Caching Pattern
- ❌ **ห้ามทำ:** อย่าเพิ่ม Redis Container สำหรับโปรเจกต์ขนาดเล็กถึงกลางที่ไม่จำเป็นต้องแชร์ Cache ข้ามหลายเซิร์ฟเวอร์
- ✅ **วิธีที่ถูกต้อง:** ใช้ `Map<string, { data: T, expiresAt: number }>` ร่วมกับ Next.js 15 Data Cache (`fetch(..., { next: { revalidate: 60 } })`) ช่วยลด Memory footprint และตัด Dependency ภายนอกได้ 100%
