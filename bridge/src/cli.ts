#!/usr/bin/env node
import * as path from 'node:path';
import * as fs from 'node:fs';
import { getVaultRoot, readMarkdownFile } from './core/vault.js';
import { compileJITContext, getExecutiveCatchupSummary } from './core/compiler.js';
import { createSessionCheckpoint } from './core/checkpoint.js';
import { synthesizeLineWebhookBlueprint } from './core/synthesizer.js';
import { runProjectDoctor } from './core/doctor.js';
import { installGitHook, uninstallGitHook } from './core/hook.js';
import { runMcpServer } from './mcp-server.js';

const args = process.argv.slice(2);
const command = args[0] || 'status';

async function main() {
  const vaultRoot = getVaultRoot();

  switch (command) {
    case 'mcp': {
      await runMcpServer();
      break;
    }

    case 'status': {
      console.log('🏛️  Nexus 2.0 — Active Engineering OS\n');
      console.log(`📂 Vault Root: ${vaultRoot}\n`);

      const statePath = path.join(vaultRoot, 'Shared/Operating-State/current-state.md');
      const state = readMarkdownFile(statePath);
      if (state) {
        console.log('🎯 Current Operating State:');
        console.log(state.replace(/---[\s\S]*?---/, '').trim());
      }

      const tasksPath = path.join(vaultRoot, 'Shared/Task-Queue/current-tasks.md');
      const tasks = readMarkdownFile(tasksPath);
      if (tasks) {
        console.log('\n📋 Task Queue:');
        console.log(tasks.replace(/---[\s\S]*?---/, '').trim());
      }
      break;
    }

    case 'doctor': {
      const target = args[1] || 'Nexus';
      console.error(`🩺 Running Nexus Doctor health audit on "${target}"...`);
      const report = runProjectDoctor(target);
      console.log(report.markdown);
      break;
    }

    case 'install-hook': {
      const targetDir = args[1] || process.cwd();
      const proj = args[2];
      const res = installGitHook(targetDir, proj);
      console.log(res.message);
      break;
    }

    case 'uninstall-hook': {
      const targetDir = args[1] || process.cwd();
      const res = uninstallGitHook(targetDir);
      console.log(res.message);
      break;
    }

    case 'summary':
    case 'catchup': {
      const specificProjects = args.slice(1).filter(a => !a.startsWith('-'));
      const brief = getExecutiveCatchupSummary(specificProjects.length > 0 ? specificProjects : undefined);
      console.log(brief);
      break;
    }

    case 'brief': {
      const projectName = args[1] || 'SaiJai-Phareab';
      const includeRules = args.includes('--rules');
      console.error(`🔍 Compiling JIT context packet for "${projectName}"...`);
      const result = compileJITContext({ projectName, includeRules });
      console.log(result.markdown);
      console.error(`\n✨ Done. Estimated tokens: ~${result.tokenEstimate}`);
      break;
    }

    case 'checkpoint': {
      console.log('💾 Recording Closed-Loop Session Checkpoint...\n');
      const project = args[1] || 'Nexus';
      const summary = args[2] || 'Automated session checkpoint';
      const noReadme = args.includes('--no-readme');

      const result = createSessionCheckpoint({
        project,
        summary,
        whatIDid: [summary],
        autoUpdateReadme: !noReadme,
      });

      console.log(`✅ Session log created at: ${result.sessionFilePath}`);
      if (result.readmeUpdated) {
        console.log(`📄 Project README updated at: ${result.readmePath}`);
      }
      console.log(`📊 Scanned modified files: ${result.gitScannedFiles.length > 0 ? result.gitScannedFiles.join(', ') : 'none'}`);
      break;
    }

    case 'seed-blueprints': {
      console.log('🧬 Extracting and synthesizing battle-tested blueprints from production...\n');
      const res = synthesizeLineWebhookBlueprint();
      console.log(`✅ Blueprint created: ${res.blueprintName}`);
      console.log(`   - agent_skill: ${res.agentSkillPath}`);
      console.log(`   - Nexus Knowledge: ${res.nexusKnowledgePath}`);
      break;
    }

    default: {
      console.log(`
Nexus 2.0 CLI — Active Personal Engineering OS

Usage:
  nexus status                     Show current operating state & task queue
  nexus summary [projects...]      Multi-project executive catchup briefing (แก้ปัญหาลืมงานค้าง)
  nexus doctor [projectOrPath]     Run 6-pillar code health & drift audit (ตรวจจับ Any, Secrets, Tests)
  nexus install-hook [projectDir]  Install auto-checkpoint pre-push git hook
  nexus uninstall-hook [dir]       Remove pre-push git hook
  nexus brief <project> [--rules]  Compile high-density JIT context packet
  nexus checkpoint [proj] [msg]    Auto-record session log from git diff & update README.md
  nexus seed-blueprints            Extract & register reusable blueprints into agent_skill
  nexus mcp                        Start the Model Context Protocol (MCP) server
`);
      break;
    }
  }
}

main().catch((err) => {
  console.error('Fatal Nexus CLI Error:', err);
  process.exit(1);
});
