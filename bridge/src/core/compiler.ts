import * as fs from 'node:fs';
import * as path from 'node:path';
import { getVaultRoot, getAgentSkillRoot, readMarkdownFile } from './vault.js';

export interface CompiledContextOptions {
  projectName?: string;
  includeRules?: boolean;
  includePreferences?: boolean;
  maxDecisions?: number;
}

export interface CompiledContextResult {
  projectName: string;
  projectFound: boolean;
  markdown: string;
  tokenEstimate: number;
}

export interface ProjectCatchupSummary {
  projectName: string;
  lastSessionDate: string;
  lastSessionSummary: string;
  currentStatus: string;
  nextSteps: string[];
}

export function compileJITContext(options: CompiledContextOptions = {}): CompiledContextResult {
  const vaultRoot = getVaultRoot();
  const agentSkillRoot = getAgentSkillRoot();
  const targetProject = options.projectName || 'Nexus';

  const sections: string[] = [];

  // Header
  sections.push(`# ⚡ Nexus JIT Context Packet: ${targetProject}`);
  sections.push(`> Compiled dynamically by Nexus 2.0 at ${new Date().toISOString()}`);

  // 1. User Preferences & Tone
  if (options.includePreferences !== false) {
    const prefsPath = path.join(vaultRoot, 'Shared/User-Memory/user-preferences.md');
    const prefs = readMarkdownFile(prefsPath);
    if (prefs) {
      sections.push(`\n## 👤 User Preferences & Persona\n${prefs.trim()}`);
    }
  }

  // 2. Project Context
  let projectFound = false;
  const projectFileCandidates = [
    path.join(vaultRoot, `Projects/${targetProject}.md`),
    path.join(vaultRoot, `Projects/${targetProject}/_Index.md`),
    path.join(vaultRoot, `Projects/${targetProject}/index.md`),
  ];

  for (const p of projectFileCandidates) {
    if (fs.existsSync(p)) {
      const content = readMarkdownFile(p);
      if (content) {
        sections.push(`\n## 🚀 Project Overview & Architecture\n${content.trim()}`);
        projectFound = true;
        break;
      }
    }
  }

  if (!projectFound && targetProject !== 'Nexus') {
    sections.push(`\n## 🚀 Project Overview\n*Note: Project file for "${targetProject}" was not found directly in Projects/. Initializing standard template context.*`);
  }

  // 3. Relevant Decisions (ADRs)
  const decisionsDir = path.join(vaultRoot, 'Decisions');
  if (fs.existsSync(decisionsDir)) {
    const decisionFiles = fs.readdirSync(decisionsDir)
      .filter(f => f.endsWith('.md') && !f.startsWith('_'))
      .sort()
      .reverse()
      .slice(0, options.maxDecisions || 5);

    if (decisionFiles.length > 0) {
      sections.push('\n## 🏛️ Recent Architectural Decisions (ADR)');
      for (const df of decisionFiles) {
        const dContent = readMarkdownFile(path.join(decisionsDir, df));
        if (dContent) {
          sections.push(`### 📄 ${df}\n${dContent.trim()}\n`);
        }
      }
    }
  }

  // 4. Current Tasks & State
  const tasksPath = path.join(vaultRoot, 'Shared/Task-Queue/current-tasks.md');
  const tasks = readMarkdownFile(tasksPath);
  if (tasks) {
    sections.push(`\n## 📋 Active Tasks & Priorities\n${tasks.trim()}`);
  }

  // 5. Tier 2 Engineering Rules (agent_skill integration)
  if (options.includeRules) {
    const rulesDir = path.join(agentSkillRoot, 'rules');
    if (fs.existsSync(rulesDir)) {
      const ruleFiles = fs.readdirSync(rulesDir).filter(f => f.endsWith('.md')).sort();
      sections.push('\n## 📜 6-Pillar Engineering Standards (agent_skill Tier 2)');
      for (const rf of ruleFiles) {
        const rContent = readMarkdownFile(path.join(rulesDir, rf));
        if (rContent) {
          sections.push(`### Standard: ${rf}\n${rContent.trim()}\n`);
        }
      }
    }
  }

  const markdown = sections.join('\n\n---\n\n');
  const tokenEstimate = Math.ceil(markdown.length / 4);

  return {
    projectName: targetProject,
    projectFound,
    markdown,
    tokenEstimate,
  };
}

/**
 * Multi-Project Executive Catchup Summary
 * Solves the problem: "ทำงานหลายงานพร้อมกันแล้วลืมว่าค้างอะไรไว้"
 */
export function getExecutiveCatchupSummary(projectNames?: string[]): string {
  const vaultRoot = getVaultRoot();
  const projectsDir = path.join(vaultRoot, 'Projects');
  const sessionsDir = path.join(vaultRoot, 'Sessions');

  let targetProjects: string[] = [];
  if (projectNames && projectNames.length > 0) {
    targetProjects = projectNames;
  } else if (fs.existsSync(projectsDir)) {
    targetProjects = fs.readdirSync(projectsDir)
      .filter(f => f.endsWith('.md') && !f.startsWith('_'))
      .map(f => f.replace(/\.md$/, ''));
  }

  const summaries: ProjectCatchupSummary[] = [];

  // Read latest session files to find recent activity per project
  const sessionFiles = fs.existsSync(sessionsDir)
    ? fs.readdirSync(sessionsDir).filter(f => f.endsWith('.md') && !f.startsWith('_')).sort().reverse()
    : [];

  for (const proj of targetProjects) {
    let lastSessionDate = 'No recent session';
    let lastSessionSummary = 'No recent session log found';
    let nextSteps: string[] = [];
    let currentStatus = 'Active / In Backlog';

    // Find latest matching session
    for (const sf of sessionFiles) {
      const sContent = readMarkdownFile(path.join(sessionsDir, sf));
      if (sContent && sContent.toLowerCase().includes(proj.toLowerCase())) {
        const dateMatch = sContent.match(/date:\s*([^\n]+)/);
        const summaryMatch = sContent.match(/summary:\s*"([^"]+)"/) || sContent.match(/summary:\s*([^\n]+)/);
        if (dateMatch) lastSessionDate = dateMatch[1].trim();
        if (summaryMatch) lastSessionSummary = summaryMatch[1].trim();

        // Extract Next Steps if available
        const nextStepsMatch = sContent.match(/## Next Steps([\s\S]*?)(?=\n##|$)/);
        if (nextStepsMatch) {
          nextSteps = nextStepsMatch[1]
            .split('\n')
            .map(l => l.trim().replace(/^[\d.-]+\s*/, ''))
            .filter(Boolean)
            .slice(0, 3);
        }
        break;
      }
    }

    // Read project file status
    const pContent = readMarkdownFile(path.join(projectsDir, `${proj}.md`));
    if (pContent) {
      const statusMatch = pContent.match(/status:\s*([^\n]+)/i);
      if (statusMatch) currentStatus = statusMatch[1].trim();
    }

    summaries.push({
      projectName: proj,
      lastSessionDate,
      lastSessionSummary,
      currentStatus,
      nextSteps: nextSteps.length > 0 ? nextSteps : ['Resume from previous checkpoint.'],
    });
  }

  // Format into clean Markdown
  let output = `# 📊 Executive Multi-Project Catchup Briefing\n`;
  output += `> สรุปสถานะงานค้างและจุดที่ทำถึงล่าสุด สำหรับสลับบริบททำงานทันที (${new Date().toLocaleDateString('th-TH')})\n\n`;

  for (const s of summaries) {
    output += `### 🚀 ${s.projectName} [${s.currentStatus}]\n`;
    output += `- 🕒 **ทำล่าสุดเมื่อ (${s.lastSessionDate}):** ${s.lastSessionSummary}\n`;
    output += `- 🎯 **3 สิ่งที่ต้องทำต่อทันที:**\n`;
    s.nextSteps.forEach((step, idx) => {
      output += `  ${idx + 1}. ${step}\n`;
    });
    output += `\n`;
  }

  return output;
}
