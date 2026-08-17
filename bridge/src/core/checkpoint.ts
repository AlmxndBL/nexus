import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import { getVaultRoot, getFormattedDate, writeMarkdownFile, readMarkdownFile } from './vault.js';

export interface CheckpointOptions {
  project?: string;
  topic?: string;
  summary?: string;
  context?: string;
  whatIDid?: string[];
  filesChanged?: string[];
  decisions?: string[];
  verificationEvidence?: string;
  nextSteps?: string[];
  cwd?: string;
  autoUpdateReadme?: boolean;
}

export interface CheckpointResult {
  sessionFilePath: string;
  sessionSlug: string;
  gitScannedFiles: string[];
  readmeUpdated: boolean;
  readmePath?: string;
  date: string;
  time: string;
}

export function scanGitRepository(targetDir: string): { branch: string; files: string[]; diffStat: string } {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: targetDir, encoding: 'utf-8' }).trim();
    const statusOutput = execSync('git status --porcelain', { cwd: targetDir, encoding: 'utf-8' }).trim();
    const diffStat = execSync('git diff --stat HEAD~1 2>nul || git diff --stat 2>nul || echo ""', { cwd: targetDir, encoding: 'utf-8' }).trim();

    const files = statusOutput
      ? statusOutput.split('\n').map(l => l.trim().slice(3)).filter(Boolean)
      : [];

    return { branch, files, diffStat };
  } catch {
    return { branch: 'unknown', files: [], diffStat: '' };
  }
}

export function syncProjectReadme(projectDir: string, summary: string, whatIDid: string[]): { updated: boolean; filePath: string } {
  const readmePath = path.join(projectDir, 'README.md');
  const { dateStr, timeStr } = getFormattedDate();

  if (!fs.existsSync(readmePath)) {
    return { updated: false, filePath: readmePath };
  }

  try {
    let content = fs.readFileSync(readmePath, 'utf-8');
    const updateEntry = `- **${dateStr} (${timeStr}):** ${summary}\n${whatIDid.map(w => `  * ${w}`).join('\n')}`;

    if (content.includes('## 📌 Latest Updates') || content.includes('## 🚀 Latest Updates')) {
      // Replace or insert after the header
      content = content.replace(/(## [📌🚀] Latest Updates\n+)/, `$1${updateEntry}\n\n`);
    } else {
      // Append section before the end or after title
      content += `\n\n---\n\n## 📌 Latest Updates\n${updateEntry}\n`;
    }

    fs.writeFileSync(readmePath, content, 'utf-8');
    return { updated: true, filePath: readmePath };
  } catch (err) {
    console.error('[README Sync Error]', err);
    return { updated: false, filePath: readmePath };
  }
}

export function createSessionCheckpoint(options: CheckpointOptions = {}): CheckpointResult {
  const vaultRoot = getVaultRoot();
  const scanDir = options.cwd || process.cwd();
  const gitInfo = scanGitRepository(scanDir);

  const { dateStr, timeStr, slugTime } = getFormattedDate();
  const project = options.project || 'Nexus';
  const rawTopic = options.topic || (options.summary ? options.summary.slice(0, 30) : 'session-checkpoint');
  const slugTopic = rawTopic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'checkpoint';

  const sessionSlug = `${slugTime}-${slugTopic}`;
  const sessionFilePath = path.join(vaultRoot, 'Sessions', `${sessionSlug}.md`);

  const summary = options.summary || `Session checkpoint for ${project}`;
  const filesChanged = (options.filesChanged && options.filesChanged.length > 0)
    ? options.filesChanged
    : (gitInfo.files.length > 0 ? gitInfo.files : ['None specified']);

  const whatIDidList = (options.whatIDid && options.whatIDid.length > 0)
    ? options.whatIDid.map((item, idx) => `${idx + 1}. ${item}`).join('\n')
    : '1. Automated session checkpoint recorded.';

  const decisionsList = (options.decisions && options.decisions.length > 0)
    ? options.decisions.map(d => `- **Decision:** ${d}`).join('\n')
    : '- (No major architectural decisions recorded in this session)';

  const nextStepsList = (options.nextSteps && options.nextSteps.length > 0)
    ? options.nextSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')
    : '1. Review next priorities in Task Queue.';

  const verification = options.verificationEvidence || 'Verified via terminal output and git status inspection.';

  const sessionContent = `---
date: ${dateStr}
time: "${timeStr}"
project: "[[Projects/${project}]]"
tags: [session]
summary: "${summary.replace(/"/g, '\\"')}"
---

# Session: ${dateStr} ${timeStr}

> ${summary}

## Context
${options.context || `Working on [[Projects/${project}]] (Branch: \`${gitInfo.branch}\`).`}

## What I Did
${whatIDidList}

## Files Changed
${filesChanged.map(f => `- \`${f}\``).join('\n')}

## Key Decisions
${decisionsList}

## Verification (Universal DoD Evidence)
\`\`\`text
${verification}
\`\`\`

## Next Steps
${nextStepsList}
`;

  writeMarkdownFile(sessionFilePath, sessionContent);

  // Update Operating State in Nexus
  updateOperatingState(project, summary, sessionSlug);

  // Auto-Update Project README if requested
  let readmeUpdated = false;
  let readmePath: string | undefined;
  if (options.autoUpdateReadme !== false) {
    const rawWhatIDid = options.whatIDid && options.whatIDid.length > 0 ? options.whatIDid : [summary];
    const res = syncProjectReadme(scanDir, summary, rawWhatIDid);
    readmeUpdated = res.updated;
    readmePath = res.filePath;
  }

  return {
    sessionFilePath,
    sessionSlug,
    gitScannedFiles: gitInfo.files,
    readmeUpdated,
    readmePath,
    date: dateStr,
    time: timeStr,
  };
}

function updateOperatingState(project: string, summary: string, sessionSlug: string): void {
  const vaultRoot = getVaultRoot();
  const statePath = path.join(vaultRoot, 'Shared/Operating-State/current-state.md');
  const currentState = readMarkdownFile(statePath);

  if (currentState) {
    const { dateStr, timeStr } = getFormattedDate();
    const updatedState = `---
tags: [operating-state, current-state]
note_type: operating-state
created: 2026-07-25
updated: ${dateStr}
parent: "[[Shared/Operating-State/_Index]]"
ai_surface: starter
---

# 🎯 Current State — Jack (StxrFxll)

> ตอนนี้กำลังโฟกัสอะไร (AI อ่านเพื่อรู้ context "ปัจจุบัน" — อัปเดตเมื่อ priority เปลี่ยน)

## Now Focus
- **Project:** [[Projects/${project}|${project}]]
- **Last Action (${dateStr} ${timeStr}):** ${summary}
- **Session Reference:** [[Sessions/${sessionSlug}|${sessionSlug}]]

## Active Projects
- [[Projects/SaiJai-Phareab|SaiJai-Phareab]] — Laundry storefront SaaS (Nuxt 4 + LINE Bot + Prisma)
- [[Projects/personal-finance-tracker|Personal Finance Tracker]] — React Bento Grid + Fastify + Supabase
- [[Projects/claude-mem|claude-mem]] — Persistent memory plugin (v13.4.0)
- [[Projects/Project_Y/_Index|Project_Y]] — Stock S/R App

## Task Queue
> **Session ใหม่อ่านก่อนเริ่ม:** [[Shared/Task-Queue/current-tasks]]
`;
    writeMarkdownFile(statePath, updatedState);
  }
}
