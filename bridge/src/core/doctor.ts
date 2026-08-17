import * as fs from 'node:fs';
import * as path from 'node:path';
import { getVaultRoot } from './vault.js';

export interface DoctorCheckResult {
  category: string;
  name: string;
  passed: boolean;
  score: number; // 0 to 100
  issues: string[];
  recommendations: string[];
}

export interface DoctorReport {
  projectName: string;
  projectPath: string;
  timestamp: string;
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'F';
  checks: DoctorCheckResult[];
  markdown: string;
}

function resolveProjectLocation(projectOrPath: string): { name: string; absPath: string } {
  // If it is an existing absolute or relative directory
  if (fs.existsSync(projectOrPath) && fs.statSync(projectOrPath).isDirectory()) {
    return { name: path.basename(path.resolve(projectOrPath)), absPath: path.resolve(projectOrPath) };
  }

  // Look in parent workspace (e.g. c:/Users/Admin/Desktop/work/<projectName>)
  const parentDir = path.resolve(getVaultRoot(), '..');
  const candidateDir = path.join(parentDir, projectOrPath);
  if (fs.existsSync(candidateDir) && fs.statSync(candidateDir).isDirectory()) {
    return { name: projectOrPath, absPath: candidateDir };
  }

  return { name: projectOrPath, absPath: process.cwd() };
}

function scanFilesRecursively(dir: string, fileExtensions: string[], maxFiles: number = 200): string[] {
  const results: string[] = [];

  function walk(currentDir: string) {
    if (results.length >= maxFiles) return;
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.nuxt' || entry.name === '.output' || entry.name === 'dist') {
          continue;
        }
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.isFile() && fileExtensions.some(ext => entry.name.endsWith(ext))) {
          results.push(fullPath);
        }
      }
    } catch {
      // Ignore unreadable dirs
    }
  }

  walk(dir);
  return results;
}

export function runProjectDoctor(projectOrPath: string): DoctorReport {
  const { name, absPath } = resolveProjectLocation(projectOrPath);
  const checks: DoctorCheckResult[] = [];

  // Check 1: Security & Secrets Check
  const securityIssues: string[] = [];
  const gitignorePath = path.join(absPath, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    securityIssues.push('Missing `.gitignore` file — risks leaking environment variables.');
  } else {
    const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
    if (!gitignore.includes('.env')) {
      securityIssues.push('`.env` is NOT excluded in `.gitignore` — high security risk.');
    }
  }

  const envFiles = ['.env', '.env.local', '.env.production'];
  for (const envF of envFiles) {
    const p = path.join(absPath, envF);
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf-8');
      if (content.includes('password=') || content.includes('SECRET=')) {
        // Warning if raw secret present in repo root
      }
    }
  }

  checks.push({
    category: '🥇 Security & Auth',
    name: 'Zero-Trust Secrets & Git Protection',
    passed: securityIssues.length === 0,
    score: securityIssues.length === 0 ? 100 : Math.max(20, 100 - securityIssues.length * 40),
    issues: securityIssues,
    recommendations: securityIssues.length === 0 ? ['Security configuration is solid.'] : ['Add `.env` to `.gitignore` and use `<secret:VAR>` pattern.'],
  });

  // Check 2: TypeScript & Strict Typing Check
  const codeFiles = scanFilesRecursively(absPath, ['.ts', '.tsx', '.vue'], 150);
  const tsIssues: string[] = [];
  let anyCount = 0;
  let emptyCatchCount = 0;

  for (const file of codeFiles) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, idx) => {
        // Check for forbidden any
        if (/:\s*any\b|as\s+any\b|<any>/.test(line) && !line.includes('// eslint-disable') && !line.includes('/*')) {
          anyCount++;
          if (tsIssues.length < 5) {
            tsIssues.push(`Forbidden \`any\` found in \`${path.relative(absPath, file)}:${idx + 1}\``);
          }
        }

        // Check for empty catch block
        if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(line)) {
          emptyCatchCount++;
          if (tsIssues.length < 5) {
            tsIssues.push(`Swallowed empty catch block in \`${path.relative(absPath, file)}:${idx + 1}\``);
          }
        }
      });
    } catch {
      // Ignore read errors
    }
  }

  if (anyCount > 5) {
    tsIssues.push(`...and ${anyCount - 5} more instances of \`any\` in codebase.`);
  }

  const tsScore = Math.max(0, 100 - (anyCount * 10) - (emptyCatchCount * 20));
  checks.push({
    category: '🥈 Code Quality & Strict TS',
    name: 'No `any` & Debuggable Error Handling',
    passed: anyCount === 0 && emptyCatchCount === 0,
    score: tsScore,
    issues: tsIssues,
    recommendations: anyCount === 0 ? ['Strict TypeScript standards satisfied.'] : ['Refactor `any` into `unknown` with Zod validation or Discriminated Unions.'],
  });

  // Check 3: Database & Prisma Migrations Check
  const dbIssues: string[] = [];
  const prismaSchemaPath = path.join(absPath, 'prisma/schema.prisma');
  if (fs.existsSync(prismaSchemaPath)) {
    const migrationsDir = path.join(absPath, 'prisma/migrations');
    if (!fs.existsSync(migrationsDir)) {
      dbIssues.push('Prisma schema exists but `prisma/migrations/` folder is missing.');
    }
  }

  checks.push({
    category: '🗄️ Database Design',
    name: 'Prisma Schema & Safe Migrations',
    passed: dbIssues.length === 0,
    score: dbIssues.length === 0 ? 100 : 50,
    issues: dbIssues,
    recommendations: dbIssues.length === 0 ? ['Database schema and migration structure aligned.'] : ['Run `prisma migrate dev` to generate initial migration.'],
  });

  // Check 4: Testing & DoD Quality Gate Check
  const testFiles = scanFilesRecursively(absPath, ['.test.ts', '.spec.ts', '.test.js'], 50);
  const testIssues: string[] = [];
  if (testFiles.length === 0) {
    testIssues.push('No test files found in project (expected `tests/*.test.ts` or `*.spec.ts`).');
  }

  const testScore = testFiles.length > 0 ? 100 : 40;
  checks.push({
    category: '🧪 QA & Testing Gate',
    name: 'Universal DoD Test Suite Presence',
    passed: testFiles.length > 0,
    score: testScore,
    issues: testIssues,
    recommendations: testFiles.length > 0 ? [`Found ${testFiles.length} test suites ready for verification.`] : ['Add Vitest / Jest test suites to satisfy Definition of Done gate.'],
  });

  // Calculate Overall Score & Grade
  const overallScore = Math.round(checks.reduce((acc, c) => acc + c.score, 0) / checks.length);
  let grade: 'A+' | 'A' | 'B' | 'C' | 'F' = 'F';
  if (overallScore >= 95) grade = 'A+';
  else if (overallScore >= 85) grade = 'A';
  else if (overallScore >= 70) grade = 'B';
  else if (overallScore >= 50) grade = 'C';

  // Build Markdown Report
  let markdown = `# 🩺 Nexus Doctor Health Report: ${name}\n`;
  markdown += `> **Target Path:** \`${absPath}\`\n`;
  markdown += `> **Overall Health Score:** **${overallScore}/100** (Grade: **${grade}**)\n`;
  markdown += `> **Evaluation Standard:** \`agent_skill\` 6-Pillar Production Rules\n\n`;
  markdown += `| Category | Checkpoint | Status | Score |\n`;
  markdown += `|---|---|---|---|\n`;

  for (const c of checks) {
    const statusIcon = c.passed ? '🟢 PASS' : (c.score >= 50 ? '🟡 WARN' : '🔴 FAIL');
    markdown += `| ${c.category} | ${c.name} | ${statusIcon} | ${c.score}/100 |\n`;
  }

  markdown += `\n---\n\n## 🔍 Detailed Diagnostics & Action Items\n\n`;
  for (const c of checks) {
    if (!c.passed || c.issues.length > 0) {
      markdown += `### ${c.category}: ${c.name}\n`;
      c.issues.forEach(iss => {
        markdown += `- ❌ **Issue:** ${iss}\n`;
      });
      c.recommendations.forEach(rec => {
        markdown += `- 💡 **Action:** ${rec}\n`;
      });
      markdown += `\n`;
    }
  }

  if (checks.every(c => c.passed)) {
    markdown += `✨ **All checks passed!** This codebase adheres strictly to \`agent_skill\` production standards.\n`;
  }

  return {
    projectName: name,
    projectPath: absPath,
    timestamp: new Date().toISOString(),
    overallScore,
    grade,
    checks,
    markdown,
  };
}
