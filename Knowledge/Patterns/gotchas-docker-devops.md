---
tags: [knowledge, patterns, gotchas, docker, devops, infrastructure]
note_type: pattern
created: 2026-08-22
updated: 2026-08-22
parent: "[[Knowledge/Patterns/_Index]]"
---

# 🐳 Docker & DevOps Architecture Gotchas

> คลังข้อควรระวัง (Gotchas), Anti-Patterns และแนวทางแก้ไขสำหรับ Docker Multi-stage Builds, Container Security, CI/CD Pipelines และ Docker Compose

---

## 1. Docker Build Layer Caching Optimization

### ⚠️ Gotcha: Inefficient Cache Invalidation (Slow Builds)
- **ปัญหา:** การสั่ง `COPY . .` ก่อนรัน `pnpm install` หรือ `npm ci` ทำให้ Docker Invalidate Cache ทุกครั้งที่มีการแก้ไฟล์โค้ดแม้แต่บรรทัดเดียว ส่งผลให้ต้องดาวน์โหลดและติดตั้ง Dependencies ใหม่ทุกรอบ (Build ช้า 2-5 นาที)
- **แนวทางแก้ไข (Multi-Stage Layer Ordering):**
  ```dockerfile
  # 1. Base Layer
  FROM node:22-alpine AS base
  ENV PNPM_HOME="/pnpm"
  ENV PATH="$PNPM_HOME:$PATH"
  RUN corepack enable

  # 2. Dependencies Layer (Cached unless lockfile changes)
  FROM base AS deps
  WORKDIR /app
  COPY package.json pnpm-lock.yaml ./
  RUN pnpm install --frozen-lockfile

  # 3. Build Layer
  FROM base AS builder
  WORKDIR /app
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .
  RUN pnpm run build

  # 4. Production Runner Layer (Minimal footprint)
  FROM base AS runner
  WORKDIR /app
  ENV NODE_ENV=production
  COPY --from=builder /app/.output ./.output
  USER node
  EXPOSE 3000
  CMD ["node", ".output/server/index.mjs"]
  ```

---

## 2. Alpine Linux vs Debian-Slim for Native Modules (Prisma / Bcrypt)

### ⚠️ Gotcha: Missing `musl` / `glibc` Compatibility
- **ปัญหา:** การใช้ Image `node:alpine` กับ Node.js Packages ที่มี C++ Native Bindings (เช่น `bcrypt`, `sharp`, `@prisma/client` engine) มักพังระหว่าง Runtime ด้วย Error: `Error loading shared library ld-linux-x86-64.so.2` หรือหา Prisma Query Engine ไม่พบ
- **แนวทางแก้ไข:**
  - ติดตั้ง `libc6-compat` และ `openssl` บน Alpine: `RUN apk add --no-cache libc6-compat openssl`
  - หรือสลับไปใช้ **Debian-Slim (`node:22-slim`)** ซึ่งมาพร้อม standard glibc ที่เข้ากันได้กับ Native Modules 100%

---

## 3. Docker Compose Healthchecks & Service Dependencies

### ⚠️ Gotcha: Premature App Startup Before Database Is Ready
- **ปัญหา:** ใส่เพียง `depends_on: [postgres]` ใน `docker-compose.yml` ทำให้ Web App เริ่มทำงานทันทีที่ Container Postgres ถูกสร้าง แต่ Postgres Server ภายในยังไม่ได้ Initialize Socket ทำให้ App Crash (`ECONNREFUSED 127.0.0.1:5432`).
- **แนวทางแก้ไข (Explicit Healthcheck Condition):**
  ```yaml
  services:
    postgres:
      image: postgres:17-alpine
      environment:
        POSTGRES_DB: myapp
        POSTGRES_USER: postgres
        POSTGRES_PASSWORD: secretpassword
      healthcheck:
        test: ["CMD-SHELL", "pg_isready -U postgres -d myapp"]
        interval: 5s
        timeout: 5s
        retries: 5
      ports:
        - "5432:5432"

    app:
      build: .
      ports:
        - "3000:3000"
      depends_on:
        postgres:
          condition: service_healthy
  ```

---

## 4. Container Non-Root User & Volume Permissions

### ⚠️ Gotcha: Running Container as `root` (Security Hazard)
- **ปัญหา:** การรัน Process ใน Container ด้วยสิทธิ์ `root` (Default) ก่อให้เกิดความเสี่ยงด้าน Security (Container Breakout) และทำให้ไฟล์ที่เขียนลง Mounted Volume เป็นของ UID 0 (`root`) บน Host เครื่องพัฒนา ทำให้ลบหรือแก้ไฟล์บน Host ไม่ได้
- **แนวทางแก้ไข:**
  - สลับไปใช้ User `node` (UID 1000) ที่ติดมากับ official Node images: `USER node`
  - หากต้องสร้างโฟลเดอร์สำหรับ Uploads ให้ `chown -R node:node /app/uploads` ในขั้นตอน Dockerfile ก่อนสลับ User

---

up:: [[Knowledge/Patterns/_Index]]
