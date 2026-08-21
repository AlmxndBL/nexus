---
tags: [knowledge, patterns, gotchas, nextjs, react, frontend]
note_type: pattern
created: 2026-08-22
updated: 2026-08-22
parent: "[[Knowledge/Patterns/_Index]]"
---

# ⚛️ Next.js 15 & React 19 Architecture Gotchas

> คลังข้อควรระวัง (Gotchas), Anti-Patterns และแนวทางแก้ไขสำหรับ Next.js 15 (App Router), React 19, Server Actions และ React Server Components (RSC)

---

## 1. Server Actions Security & Input Validation

### ⚠️ Gotcha: Treating Server Actions as Private Internal Functions
- **ปัญหา:** นักพัฒนามักเข้าใจผิดว่าฟังก์ชันที่ติด `"use server"` เป็นฟังก์ชันภายใน (Internal helper) จึงไม่ทำ Authentication หรือ Validation
- **ความจริง:** Server Actions คือ **Public HTTP POST Endpoints** ที่ถูก expose สู่โลกภายนอก ทุกคนสามารถยิง payload แปลกปลอมมาที่ action ID ได้โดยตรงผ่าน Postman หรือ cURL
- **แนวทางแก้ไข (Zero Trust Pattern):**
  ```typescript
  'use server';

  import { z } from 'zod';
  import { auth } from '@/lib/auth';
  import { prisma } from '@/lib/prisma';

  const updateProfileSchema = z.object({
    displayName: z.string().min(2).max(50),
    bio: z.string().max(200).optional(),
  });

  export async function updateProfileAction(rawInput: unknown) {
    // 1. Authenticate & Authorize
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('UNAUTHORIZED');
    }

    // 2. Validate input strictly with Zod
    const parsed = updateProfileSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    // 3. Perform mutation
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
    });

    return { success: true, data: updated };
  }
  ```

---

## 2. React Server Component (RSC) Boundary & Serialization

### ⚠️ Gotcha: Passing Non-Serializable Props across Server/Client Boundary
- **ปัญหา:** ส่งฟังก์ชัน Callback (`onClick`, `formatter`), Class instances, หรือ Date objects ข้ามจาก Server Component ไปยัง Client Component (`'use client'`) ทำให้เกิด Runtime Serialization Error (`Functions cannot be passed directly to Client Components unless you explicitly expose it as a Server Action`).
- **แนวทางแก้ไข:**
  - แปลง Date เป็น ISO String (`date.toISOString()`) หรือ timestamp (`number`) ก่อนส่งข้าม Boundary
  - ส่งเฉพาะ Plain JSON Objects / Primitives
  - จัดการ Event Handlers ภายใน Client Component หรือส่งเป็น Server Action แทน Callback ปกติ

---

## 3. Hydration Mismatch & SSR Divergence

### ⚠️ Gotcha: Divergent Output between Server & Client
- **ปัญหา:** การเข้าถึง Browser API (`window.innerWidth`, `localStorage`), การเรนเดอร์วันที่แบบ Local Timezone บน Server ที่ต่างจากเครื่องผู้ใช้, หรือการใช้ `Math.random()` ใน Render tree ทำให้เกิด Error: `Hydration failed because the initial UI does not match what was rendered on the server`.
- **แนวทางแก้ไข:**
  1. ย้ายการคำนวณที่อิง Browser/Client ไปทำใน `useEffect()` หรือ Custom Hook (`useIsMounted`)
  2. หากจำเป็นต้องแสดงวันที่เฉพาะเจาะจง ให้ใช้ `suppressHydrationWarning` บน element นั้น หรือ Format ด้วย Timezone คงที่ (เช่น UTC+7)

  ```tsx
  'use client';

  import { useState, useEffect } from 'react';

  export function ClientOnlyTime() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) return <span className="animate-pulse bg-slate-200 h-4 w-20 inline-block rounded" />;
    return <span>{new Date().toLocaleTimeString('th-TH')}</span>;
  }
  ```

---

## 4. Next.js 15 Caching & Revalidation Mechanics

### ⚠️ Gotcha: Unintended Route Caching or Missing On-Demand Revalidation
- **ปัญหา:** Next.js 15 ปรับค่า Default Caching ของ `fetch` ให้เป็น `no-store` (Uncached) แตกต่างจาก Next.js 14 ที่เป็น Cached By Default ส่งผลให้เกิดความสับสนเมื่อย้ายโค้ด
- **แนวทางปฏิบัติ:**
  - หากต้องการ Cache ข้อมูล ให้ระบุ `fetch(url, { next: { revalidate: 60, tags: ['posts'] } })` หรือใช้ `unstable_cache`
  - เมื่อเกิดการ Mutation ใน Server Action ให้เรียก `revalidatePath('/dashboard')` หรือ `revalidateTag('posts')` เพื่อ Clear Cache ทันที

---

## 5. React Hook Dependency & Stale Closure Bugs

### ⚠️ Gotcha: Omitting Dependencies in `useCallback` / `useEffect`
- **ปัญหา:** การลบ Dependencies ใน Dependency Array เพื่อหลีกเลี่ยง Re-render ทำให้ Component เข้าถึง State เก่า (Stale Closure) ส่งผลให้ Save ข้อมูลทับด้วย State เก่า
- **แนวทางแก้ไข:**
  - ใส่ Dependencies ให้ครบตามคำแนะนำของ ESLint
  - ใช้ Functional State Update (`setCount(prev => prev + 1)`) เมื่อคำนวณจากค่าก่อนหน้า เพื่อลดความจำเป็นในการใส่ State นั้นลงใน Dependency Array

---

up:: [[Knowledge/Patterns/_Index]]
