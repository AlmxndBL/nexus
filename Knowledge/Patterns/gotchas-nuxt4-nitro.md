---
tags: [knowledge, gotchas, stack/nuxt4, stack/vue, runtime/nitro]
note_type: gotcha-collection
stack: nuxt4
created: 2026-08-19
updated: 2026-08-19
parent: "[[Knowledge/Patterns/_Index]]"
---

# ⚠️ Gotchas: Nuxt 4 + Nitro + Vue 3

> รวมข้อผิดพลาดและข้อควรระวังสำคัญสำหรับโปรเจกต์ Nuxt 4 (อิงจากประสบการณ์โปรเจกต์ SaiJai-Phareab และ 43 Sessions)

---

### 1. 🕒 Timezone Boundary (Bangkok Calendar Day)
- ❌ **ห้ามทำ:** อย่าใช้ `new Date().toISOString().split('T')[0]` หรือ UTC Date ในการคำนวณวันและรายได้ เพราะรอบเที่ยงคืน (00:00 - 06:59 น.) จะถูกนับเป็นของ "เมื่อวาน" ทันที
- ✅ **วิธีที่ถูกต้อง:** ใช้ `BANGKOK_OFFSET_MS` (+7 ชม.) หรือ date-fns `tz('Asia/Bangkok')` คำนวณขอบเขตวัน (Start/End of Day) เสมอ

### 2. 📊 Chart & Canvas SSR Crash
- ❌ **ห้ามทำ:** อย่าตั้งชื่อคอมโพเนนต์ Chart/Canvas เป็นชื่อธรรมดา เช่น `Chart.vue` เพราะ Nitro SSR จะพยายามเรนเดอร์ Canvas ฝั่ง Server และทำให้หน้าเว็บพัง (500 Error)
- ✅ **วิธีที่ถูกต้อง:** ตั้งชื่อไฟล์เป็น `Chart.client.vue` เสมอ เพื่อบังคับให้โหลดเฉพาะ Client-side เท่านั้น

### 3. 💬 Webhook Response & Async Reply (LINE/Payment)
- ❌ **ห้ามทำ:** อย่าใช้ `void replyMessage()` แบบ fire-and-forget โดยไม่รอ หรือปล่อยให้ webhook ค้างนานเกิน 1-2 วินาที เพราะ LINE Server จะยิง Retry ซ้ำ ๆ เข้ามา
- ✅ **วิธีที่ถูกต้อง:** Return HTTP 200 อย่างรวดเร็ว และครอบ `await` การส่งข้อความ/Event ด้วย `try/catch` พร้อมบันทึกลง Error log

### 4. 🧩 Pure Business Logic vs DB Dispatcher Decoupling
- ❌ **ห้ามทำ:** อย่าเขียนตรรกะคำนวณ (เช่น การจัดคิวส่งผ้า, การคำนวณเงิน, การคิดแต้ม) ผูกติดไว้ข้างใน Database query functions
- ✅ **วิธีที่ถูกต้อง:** แยกฟังก์ชันคำนวณให้เป็น **Pure Functions** (รับ parameters แล้ว return ค่า) เพื่อให้สามารถเขียน Unit Test ได้ 100% โดยไม่ต้องเปิด Connection ฐานข้อมูล

### 5. ⏰ Nitro Tasks & Protected Cron Endpoints
- ❌ **ห้ามทำ:** อย่าเปิด Public API สำหรับรัน Cron Job เบื้องหลังโดยไม่มี Authentication Guard
- ✅ **วิธีที่ถูกต้อง:** ใช้ Nitro Tasks ใน `server/tasks/` ร่วมกับ Secret Header Check (`CRON_SECRET`)

### 6. 🔄 Composable vs Helper Auto-import
- ❌ **ห้ามทำ:** อย่าพึ่งพา Auto-import กับ Utility/Helper functions ที่อยู่นอกโฟลเดอร์ `composables/` หรือ `utils/`
- ✅ **วิธีที่ถูกต้อง:** หากเป็นโมดูลภายนอกหรือ Helper เฉพาะทาง ให้เขียน Explicit Import (`import { ... } from '...'`) เสมอเพื่อป้องกัน Build Error ใน Production

### 7. ⚡ Nitro Server Route Error Handling
- ❌ **ห้ามทำ:** อย่าใช้ `res.status().json()` หรือ `throw new Error()` เปล่า ๆ ใน Nitro Server Handlers
- ✅ **วิธีที่ถูกต้อง:** ให้ใช้ `createError({ statusCode: 400, statusMessage: '...' })` ของ H3 / Nitro เพื่อให้ Error Payload มีโครงสร้างที่ปลอดภัยและฝั่ง Client ดักจับได้ถูกต้อง
