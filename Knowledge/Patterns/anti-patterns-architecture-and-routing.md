---
title: The God Dashboard & Monolithic Routing Anti-Patterns
tags: [architecture/routing, pattern/anti-pattern, stack/nuxt4, stack/nextjs, frontend/routes]
author: Apex AI Framework & Nexus Memory
date: 2026-08-20
status: active
---

# 🚨 The God Dashboard & Monolithic Routing Anti-Patterns

บันทึกข้อผิดพลาดเชิงสถาปัตยกรรม (Architecture Anti-Patterns) ว่าด้วยการรวมหลาย Business Domain ไว้ใน Route/Page เดียว และแนวทางปฏิบัติตามหลัก Domain-Driven Granular Routing

---

## 💥 1. The "God Dashboard" Anti-Pattern (รวมทุกอย่างไว้ในหน้าเดียว)

### ❌ ลักษณะปัญหาที่พบ (Observed Anti-Pattern):
ในการพัฒนาระบบที่มีหลายโมดูล (เช่น หอพัก/อพาร์ตเมนต์ หรือระบบ POS/ERP) มีการนำตารางข้อมูลทุกโดเมนมากองรวมกันในหน้าเดียว เช่น `app/pages/admin/index.vue`:
- การ์ดโปรโมทหน้าแรก (Landing Hero Cards)
- ผังห้องและประเภทห้อง (Rooms & Room Types)
- สัญญาเช่าและผู้เช่า (Contracts & Tenants)
- การตรวจสลิปโอนเงิน (Payment Verification)
- การจดและบันทึกมิเตอร์น้ำ-ไฟ (Utility Meter Readings)
- ประวัติการทำรายการย้อนหลัง (Historical Transactions)

```
❌ Monolithic /admin/index.vue (1,000+ Lines)
┌────────────────────────────────────────────────────────┐
│ [API: /hero-cards]   [API: /rooms]    [API: /contracts] │
│ [API: /payments]     [API: /meters]   [API: /invoices]  │
│                                                        │
│ -> 6 Parallel API Calls on Mount                       │
│ -> State Collision & Filter Clashing                   │
│ -> Impossible Granular RBAC Permissions               │
│ -> No URL Deep Linking for Specific Management Views   │
└────────────────────────────────────────────────────────┘
```

---

## 🧨 2. ผลกระทบเชิงระบบ (Systemic Consequences)

1. **API Load Waterfall & Slower TTFB:**
   - เมื่อผู้ใช้เปิดหน้า Dashboard ระบบจะยิง API พร้อมกัน 5–7 เส้นทันที
   - ก่อให้เกิดภาระหนักกับ Database Connection Pool และเพิ่มเวลารอคอยของผู้ใช้โดยไม่จำเป็น
2. **State Pollution & Race Conditions:**
   - การใช้ Modal เดียวกันข้าม Domain หรือการแชร์ Filter State ในหน้าเดียว ทำให้เกิดบั๊กข้อมูลข้ามตาราง
3. **Broken Granular Role-Based Access Control (RBAC):**
   - พนักงานแต่ละแผนก (เช่น บัญชี vs แม่บ้าน/ช่าง vs ผู้จัดการ) จำเป็นต้องเข้าถึงเฉพาะข้อมูลของตัวเอง
   - การรวมในหน้าเดียวทำให้ไม่สามารถทำ Route-level Middleware Guard หรือซ่อนส่วนประกอบแบบละเอียดได้
4. **Loss of Browser History & Deep Linking:**
   - ผู้ใช้งานไม่สามารถคัดลอก URL หน้า "ผังห้อง" หรือ "รายการค้างชำระ" ไปเปิดในแท็บใหม่ หรือส่งต่อให้เพื่อนร่วมงานได้

---

## ✅ 3. แนวทางแก้ไขที่ถูกต้อง (Domain-Driven Granular Routing)

### 🏛️ โครงสร้าง Route ที่ถูกต้อง:

```
app/pages/admin/
├── index.vue                   # 🌟 Overview Dashboard (KPI Cards, Activity Feed, Action Shortcuts)
├── rooms/
│   ├── index.vue               # 🏢 ผังห้องและสถานะห้องพัก
│   └── types.vue               # 🏷️ ประเภทห้องพักและเรทราคา
├── contracts/
│   ├── index.vue               # 📑 สัญญาเช่าและข้อมูลผู้เช่า
│   └── [id].vue                # 🔍 รายละเอียดสัญญาเฉพาะห้อง
├── billing/
│   ├── index.vue               # 💵 รายการบิลรายเดือน
│   └── batch.vue               # ⚡ ออกบิลแบบกลุ่ม (Batch Invoicing)
├── meters/
│   └── index.vue               # ⚡ จดมิเตอร์น้ำ-ไฟ
├── payments/
│   └── index.vue               # 🧾 ตรวจสอบสลิปและยืนยันการชำระ
└── reports/
    └── index.vue               # 📊 รายงานสถิติและ Cashflow
```

---

## 📋 4. Rules of Thumb สำหรับ Agent ในการออกแบบ Pages

1. **Rule of Single Domain:** หน้า Dashboard หลัก (`/admin`) อนุญาตให้แสดงเฉพาะ **Stat Summary Cards**, **KPIs**, **Action Shortcuts**, และ **Recent Events Feed** เท่านั้น ห้ามนำตาราง CRUD เต็มรูปแบบมาฝัง
2. **Dedicated Table Page:** ทุกตารางข้อมูลที่มีฟังก์ชัน Search, Filter, Pagination, Create, Edit ต้องมี Route เฉพาะของตัวเองเสมอ
3. **Lazy Module Fetching:** ให้โหลดข้อมูลเฉพาะที่จำเป็นใน Route นั้นๆ เพื่อให้ Page Load Time $\le 200\text{ms}$
