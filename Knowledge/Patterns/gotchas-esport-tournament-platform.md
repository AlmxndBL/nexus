---
tags: [knowledge, gotchas, stack/nuxt4, stack/prisma, stack/tailwind, domain/esport, multi-tenant]
note_type: gotcha-collection
stack: nuxt4-nitro-prisma-supabase
created: 2026-08-22
updated: 2026-08-22
parent: "[[Knowledge/Patterns/_Index]]"
---

# ⚠️ Gotchas: E-Sports Tournament Platform (Nuxt 4 + Prisma 7 + PostgreSQL)

> รวมข้อผิดพลาด, ข้อควรระวังสำคัญ, และ Best Practices จากการพัฒนาแพลตฟอร์มจัดการแข่งขัน E-Sports และระบบ Multi-Tenant Role-Based Access Control (RBAC)

---

### 1. 🔌 Prisma 7 with Supabase Connection Pooler (`prisma.config.ts` vs `DIRECT_URL`)
- ❌ **ห้ามทำ:** อย่าใช้ `DATABASE_URL` พอร์ต `6543` (Transaction-mode pooler) ไปรันคำสั่ง Migration หรือ `npx prisma db push` เพราะ Transaction Pooler ใน Supabase ไม่อนุญาต Advisory Locks ทำให้คำสั่งค้างหรือเกิด Connection Timeout
- ✅ **วิธีที่ถูกต้อง:** ใน `prisma.config.ts` ให้ตั้ง `datasource.url` ชี้ไปที่ `DIRECT_URL` (Port `5432` Session-mode) และโหลด `import 'dotenv/config'` เสมอ ส่วน runtime Nitro API ให้เชื่อมต่อผ่าน `DATABASE_URL` ร่วมกับ `@prisma/adapter-pg`

---

### 2. 🧭 Layout Separation & Collapsible Rail (The `dorm-management` Pattern)
- ❌ **ห้ามทำ:** อย่ายัด `<AppSidebar />` ครอบทุกหน้าจอใน `app.vue` เพราะหน้าแรก (Landing Page) และหน้าดูผลสาธารณะจะดูแคบ อึดอัด และบดบังมุมมองของผู้ชมทั่วไป
- ✅ **วิธีที่ถูกต้อง:** ใช้ Nuxt Layouts แยกบทบาท:
  - `app/layouts/default.vue`: สำหรับหน้าสาธารณะ (`/`, `/tournaments/[id]`, `/roles`, `/help`, `/login`) แสดงเฉพาะ Top Navbar และพื้นที่ตรงกลาง `max-w-7xl mx-auto` โดยไม่มี Sidebar
  - `app/layouts/dashboard.vue`: สำหรับ Workspace (`/dashboard`, `/team`) ติดตั้ง Collapsible Sidebar (`w-64` ขยาย / `w-20` ย่อเป็น Rail) พร้อมปุ่ม Toggle บน Navbar, ปุ่มวงกลมขยายเมนูลอยบนขอบขวา (`-right-3 top-5`), และบันทึกค่าลง `localStorage`

---

### 3. 🔒 Multi-Tenant Organizer Authorization Guard (Backend Isolation)
- ❌ **ห้ามทำ:** อย่าพึ่งพาแค่ UI-level check (การซ่อนปุ่ม Edit/Delete บนหน้าจอ) เพียงอย่างเดียว เพราะผู้จัดคนอื่นสามารถใช้ Script หรือ Postman ยิง `POST /api/tournaments/[id]/*` มาแก้ไขผลหรือลบทีมของคนอื่นได้
- ✅ **วิธีที่ถูกต้อง:** สร้าง Backend Guard (`assertTournamentOwnership(event, tournamentId)`) ใน Nitro Server ตรวจสอบสิทธิ์ทุก Endpoint ที่มีการบันทึกคะแนนหรือจัดการทีม:
  - `SUPER_ADMIN` $\rightarrow$ อนุญาต (Global System Access)
  - `tournament.organizerId === user.id` หรืออยู่ใน `coOrganizers` $\rightarrow$ อนุญาต
  - กรณีอื่นๆ $\rightarrow$ ส่งกลับ HTTP `403 Forbidden` ทันที

---

### 4. ⏱️ Live Spectator Polling & Smart Tab Visibility (Resource Storm Prevention)
- ❌ **ห้ามทำ:** อย่าเปิด `setInterval` Polling ถี่ๆ (เช่น ทุก 3-4 วินาที) ค้างไว้ตลอดเวลาเมื่อผู้ชมเปิดแท็บทิ้งไว้ เพราะหากมีผู้ใช้พร้อมกันหลายร้อยคนจะทำให้เกิด Request Storm ถล่มเซิร์ฟเวอร์ Supabase/Nitro โดยไม่มีคนดูจริง
- ✅ **วิธีที่ถูกต้อง:** ตั้งรอบ Polling มาตรฐานเป็น **30 วินาที** และใช้ Page Visibility API (`document.visibilityState` / `document.hidden`) เพื่อ **หยุด Polling ทันทีเมื่อผู้ใช้สลับแท็บไปหน้าอื่น** และสั่ง Fetch ดึงข้อมูลใหม่ทันทีเมื่อเปิดกลับเข้ามาดูหน้าเว็บ

---

### 5. 🎨 Two-Tone Dynamic Theming & Dark Input Autofill Overrides
- ❌ **ห้ามทำ:** อย่า Hardcode รหัสสี HEX ลงใน Components สำหรับสีที่ต้องสลับโทน และอย่าปล่อยให้ Browser Autofill เปลี่ยนสีพื้นหลังช่อง Input กลายเป็นสีขาว
- ✅ **วิธีที่ถูกต้อง:** 
  1. ประกาศ CSS Variables (`--bg-dark`, `--bg-card`, `--brand-primary`, `--brand-border`, `--brand-highlight`) ภายใต้ selector `[data-theme="sapphire"]` และ `[data-theme="crimson"]`
  2. เขียน CSS Override ป้องกัน Browser Autofill สีขาว:
     ```css
     input:-webkit-autofill,
     input:-webkit-autofill:hover, 
     input:-webkit-autofill:focus {
       -webkit-box-shadow: 0 0 0 1000px var(--bg-dark) inset !important;
       -webkit-text-fill-color: #ffffff !important;
     }
     ```

---

### 6. 📁 CSV Import Column Matching (Multi-Language Header Flexibility)
- ❌ **ห้ามทำ:** อย่าฮาร์ดโค้ดตรวจเฉพาะหัวคอลัมน์ภาษาอังกฤษ เช่น `name,inGameId,teamName,role` เพราะผู้จัดมักอัปโหลดไฟล์ Excel/CSV ภาษาไทยมา (`ชื่อนักแข่ง`, `ชื่อในเกม`, `ชื่อทีม`, `ตำแหน่ง`)
- ✅ **วิธีที่ถูกต้อง:** แปลง Header ทุกตัวเป็น `.toLowerCase().trim()` แล้วใช้ Index Search ค้นหาคำพ้องทั้งภาษาไทยและอังกฤษ:
  - ชื่อนักแข่ง: `['name', 'ชื่อ', 'ชื่อนักแข่ง', 'player']`
  - ชื่อในเกม: `['ingame', 'ign', 'ชื่อในเกม', 'id']`
  - ชื่อทีม: `['team', 'ทีม', 'สังกัด', 'สโมสร']`

---

### 7. 👑 Bracket Auto-Advancement Logic (Knockout Flow)
- ❌ **ห้ามทำ:** อย่าลืมคำนวณการเลื่อนสายผู้ชนะเมื่อผลการแข่งขันเสร็จสิ้น (`status === 'COMPLETED'`) เพราะจะทำให้สายรอบถัดไปขึ้นเป็น TBD ค้าง
- ✅ **วิธีที่ถูกต้อง:** เมื่อแมตช์มีผู้ชนะ (`winnerId`) ให้ตรวจสอบ `match.nextMatchId` และใช้เงื่อนไข Match Index:
  - `match.matchIndex % 2 === 1` $\rightarrow$ ส่ง `winnerId` เข้าเป็น `teamAId` ของแมตช์ถัดไป
  - `match.matchIndex % 2 === 0` $\rightarrow$ ส่ง `winnerId` เข้าเป็น `teamBId` ของแมตช์ถัดไป

---

### 8. ⚡ Nuxt 4 Composable Auto-import Type Generation (`nuxi prepare`)
- ❌ **ห้ามทำ:** เมื่อสร้าง Composable หรือ Utility ใหม่ใน `app/composables/` (เช่น `useTheme.ts`, `useSidebar.ts`) แล้วรัน `vue-tsc --noEmit` ทันที อาจเจอ Build Error `Cannot find name 'useTheme'`
- ✅ **วิธีที่ถูกต้อง:** รันคำสั่ง `npx nuxi prepare` เพื่อให้ Nuxt สแกนและอัปเดตไฟล์ `.nuxt/imports.d.ts` และ `.nuxt/tsconfig.json` ในเครื่องก่อนรัน TypeCheck เสมอ
