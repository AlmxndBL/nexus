---
title: Thai Typography Metrics & Mathematical UI Sliders Gotchas
tags: [stack/universal, stack/tailwind, ui/typography, ui/components, lang/thai]
author: Apex AI Framework
date: 2026-08-20
status: active
---

# ⚡ Thai Typography Metrics & Mathematical UI Sliders Gotchas

ข้อควรระวัง (Gotchas) และแนวทางคำนวณที่ถูกต้องสำหรับการจัดวางตัวหนังสือภาษาไทย (Thai Typography) และการสร้างคอมโพเนนต์ Micro-interactions (Sliders / Theme Toggles / Pill Bars) ด้วย Tailwind CSS

---

## 🚨 Gotcha 1: Thai Vowel & Tone Mark Vertical Collisions (สระบน-ล่างชนกัน)

### ❌ Anti-pattern ที่ต้องหลีกเลี่ยง:
1. การนำ `<span>` สองบรรทัดมาซ้อนกันใน `<h1>` เดียวกันโดยใช้ `line-height` แคบ (`leading-tight`, `leading-snug` หรือ `leading-none`)
2. การพยายามแก้ปัญหาสระชนกันด้วยการสุ่มใส่ `mt-[7px]` หรือ margin เล็กๆ แบบเดาค่า

```html
<!-- ❌ ผิด: สระ ู ของบรรทัดแรกจะชนกับ สระ ไ / วรรณยุกต์ ของบรรทัดที่ 2 -->
<h1 class="text-4xl font-bold leading-tight">
  <span class="block">ยกระดับการอยู่อาศัย</span>
  <span class="block mt-[7px]">ใจกลางเมือง</span>
</h1>
```

### 💥 ผลกระทบ:
ในฟอนต์ภาษาไทย (เช่น Prompt, Sukhumvit, IBM Plex Sans Thai) ตัวอักษรขนาด `text-4xl` ถึง `text-5xl` (36px - 48px):
- **สระล่าง (Descenders):** เช่น `ู`, `ุ` จะยื่นลงมาใต้ Baseline ถึง **12 - 15px**
- **สระบนและวรรณยุกต์ (Ascenders):** เช่น `ใ`, `ไ`, `่`, `้`, `๊`, `๋`, `์` จะยื่นขึ้นไปเหนือ Cap Height ถึง **14 - 16px**
- เมื่อ Line-height แคบ หรือมี Margin น้อยกว่า 16px Bounding Box ของสองบรรทัดจะทับซ้อนกันทันที

### ✅ Best Practice Solution:
1. **Discrete Block Containers:** แยกแต่ละบรรทัดออกเป็น `<div>` หรือ `<p>` ระดับ Block อิสระ
2. **Internal Clearance:** กำหนด `leading-relaxed` (1.625x) ในแต่ละบรรทัด
3. **Generous Vertical Gap:** ใช้ `space-y-4 sm:space-y-6` (16px - 24px) ระหว่างบรรทัดเสมอ

```html
<!-- ✅ ถูกต้อง: มีระยะหายใจสมบูรณ์แบบ สระไม่ชนกัน 100% -->
<div class="space-y-4 sm:space-y-6">
  <div class="text-3xl sm:text-5xl font-black text-slate-900 leading-relaxed">
    ยกระดับการอยู่อาศัยที่ลงตัว
  </div>
  <div class="text-3xl sm:text-5xl font-black text-blue-600 leading-relaxed">
    สะอาด ปลอดภัย ใจกลางเมือง
  </div>
</div>
```

---

## 🚨 Gotcha 2: Custom Slider Thumb Distortion & Travel Overflow (ปุ่มบวมรีและสไลด์ล้น)

### ❌ Anti-pattern ที่ต้องหลีกเลี่ยง:
1. ใช้คลาสนอกสเกลมาตรฐาน Tailwind เช่น `w-5.5` หรือ `h-5.5`
2. เดาระยะเลื่อน (`translate-x-5`, `translate-x-7`) โดยไม่ได้คำนวณจากขนาดจริงของ Track และ Thumb

```html
<!-- ❌ ผิด: w-5.5 กลายเป็น width: auto วงกลมบิดเบี้ยวเป็นแคปซูลรีแนวตั้ง และเลื่อนล้นขอบ -->
<button class="w-12 h-6 p-0.5">
  <span class="w-5.5 h-5.5 rounded-full transform translate-x-5"></span>
</button>
```

### 💥 ผลกระทบ:
- เบราว์เซอร์ไม่รู้จัก `w-5.5` ทำให้ตัว Thumb ถูกบีบกลายเป็นวงรี (Oval Capsule Distortion)
- ระยะ Translation ไม่พอดีกับ Track ทำให้ Thumb ล้นออกไปทับปุ่มหรือข้อความที่อยู่ติดกัน

### ✅ Best Practice Solution (Mathematical Precision Formula):
ยึดสูตรคำนวณเรขาคณิตเสมอ:

$$\text{Translation Distance} = \text{Track Width} - (2 \times \text{Padding}) - \text{Thumb Width}$$

1. **Track:** `w-12` (48px) x `h-6` (24px) + `p-0.5` (2px)
2. **Thumb:** `w-5 h-5` (20px) พร้อมล็อก `aspect-square shrink-0 rounded-full`
3. **Travel Calculation:** 48 - (2 * 2) - 20 = 24px -> **`translate-x-6`** (24px พอดีเป๊ะ)

```html
<!-- ✅ ถูกต้อง: วงกลมสมบูรณ์แบบ 1:1 มีระยะขอบ 2px เท่ากันทั้งซ้ายและขวา -->
<button
  class="relative inline-flex w-12 h-6 p-0.5 rounded-full transition-colors duration-300 bg-slate-200 dark:bg-slate-700"
>
  <span
    class="w-5 h-5 aspect-square shrink-0 rounded-full bg-white shadow-md transform transition-transform duration-300"
    :class="isDark ? 'translate-x-6' : 'translate-x-0'"
  ></span>
</button>
```
