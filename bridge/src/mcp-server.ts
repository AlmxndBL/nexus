import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import * as path from 'node:path';
import { getVaultRoot, readMarkdownFile, writeMarkdownFile, getFormattedDate } from './core/vault.js';
import { compileJITContext, getExecutiveCatchupSummary } from './core/compiler.js';
import { createSessionCheckpoint } from './core/checkpoint.js';
import { synthesizePattern } from './core/synthesizer.js';
import { runProjectDoctor } from './core/doctor.js';
import { installGitHook } from './core/hook.js';

export async function runMcpServer(): Promise<void> {
  const server = new Server(
    {
      name: 'nexus-mcp-server',
      version: '2.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Define Tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'nexus_get_state',
          description: 'Get current active focus, operating state, and high-priority tasks from Nexus Vault.',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'nexus_get_executive_brief',
          description: 'Multi-Project Catchup Briefing: Summarizes the latest progress, working state, and next 3 immediate action steps across all projects (or specific projects) when switching context.',
          inputSchema: {
            type: 'object',
            properties: {
              projectNames: {
                type: 'array',
                items: { type: 'string' },
                description: 'Optional list of specific project names (e.g. ["SaiJai-Phareab", "personal-finance-tracker"]). If omitted, summarizes all active projects.',
              },
            },
          },
        },
        {
          name: 'nexus_doctor',
          description: 'Project Health & Quality Auditor: Scans a project codebase against the 6-pillar agent_skill standards (Secrets, No-any, DB migrations, Test DoD) and outputs a detailed score & scorecard.',
          inputSchema: {
            type: 'object',
            properties: {
              projectOrPath: {
                type: 'string',
                description: 'Project name (e.g. SaiJai-Phareab, Nexus) or absolute/relative directory path.',
              },
            },
            required: ['projectOrPath'],
          },
        },
        {
          name: 'nexus_install_git_hook',
          description: 'Installs a pre-push Git Hook into the target project so that every "git push" automatically logs the session into Nexus and updates README.md.',
          inputSchema: {
            type: 'object',
            properties: {
              targetDir: {
                type: 'string',
                description: 'Target git repository folder (defaults to current working directory).',
              },
              projectName: {
                type: 'string',
                description: 'Optional custom project name.',
              },
            },
          },
        },
        {
          name: 'nexus_get_project_brief',
          description: 'JIT Context Compiler: Generates high-density compiled context for a specific project including architecture, ADRs, stack, and rules.',
          inputSchema: {
            type: 'object',
            properties: {
              projectName: {
                type: 'string',
                description: 'The project name in Nexus (e.g. SaiJai-Phareab, personal-finance-tracker, claude-mem, Project_Y).',
              },
              includeRules: {
                type: 'boolean',
                description: 'Whether to include the 6-pillar agent_skill rules in the brief.',
              },
            },
          },
        },
        {
          name: 'nexus_save_session',
          description: 'Closed-Loop Memory: Records a completed work session into Nexus Sessions/ log, updates Operating State, and optionally syncs project README.md.',
          inputSchema: {
            type: 'object',
            properties: {
              project: { type: 'string', description: 'Project name' },
              summary: { type: 'string', description: 'One-line summary of what was accomplished' },
              whatIDid: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of specific actions taken',
              },
              filesChanged: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of modified file paths',
              },
              decisions: {
                type: 'array',
                items: { type: 'string' },
                description: 'Key decisions or architectural choices made',
              },
              verificationEvidence: {
                type: 'string',
                description: 'Terminal test output, logs, or assertion proof confirming DoD',
              },
              nextSteps: {
                type: 'array',
                items: { type: 'string' },
                description: 'Next pending actions',
              },
              autoUpdateReadme: {
                type: 'boolean',
                description: 'Whether to automatically sync and update the project README.md Latest Updates section.',
                default: true,
              },
              projectDir: {
                type: 'string',
                description: 'Absolute path to project directory to scan and update README (defaults to cwd).',
              },
            },
            required: ['project', 'summary', 'whatIDid'],
          },
        },
        {
          name: 'nexus_record_decision',
          description: 'Architecture Decision Records (ADR): Records a major technical decision in Nexus Decisions/ folder.',
          inputSchema: {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'Title of the architectural decision' },
              context: { type: 'string', description: 'Background context and problem' },
              decision: { type: 'string', description: 'The chosen solution and rationale' },
              tradeoffs: { type: 'string', description: 'Pros, cons, and trade-offs considered' },
              status: { type: 'string', enum: ['accepted', 'proposed', 'deprecated'], default: 'accepted' },
            },
            required: ['title', 'context', 'decision'],
          },
        },
        {
          name: 'nexus_synthesize_pattern',
          description: 'Cross-Project Synthesizer: Sanitizes proven code into a reusable System Blueprint and syncs to agent_skill and Nexus.',
          inputSchema: {
            type: 'object',
            properties: {
              patternName: { type: 'string', description: 'Name of the pattern (e.g. Idempotent Webhook Receiver)' },
              category: { type: 'string', enum: ['api', 'security', 'database', 'ui', 'workflow'] },
              description: { type: 'string', description: 'Description of the problem solved' },
              keyMechanisms: {
                type: 'array',
                items: { type: 'string' },
                description: '4 key architectural mechanisms',
              },
              sanitizedCode: { type: 'string', description: 'Clean, generic TypeScript code template' },
            },
            required: ['patternName', 'category', 'description', 'keyMechanisms', 'sanitizedCode'],
          },
        },
      ],
    };
  });

  // Handle Tool Execution
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const vaultRoot = getVaultRoot();

    try {
      if (name === 'nexus_get_state') {
        const statePath = path.join(vaultRoot, 'Shared/Operating-State/current-state.md');
        const tasksPath = path.join(vaultRoot, 'Shared/Task-Queue/current-tasks.md');
        const state = readMarkdownFile(statePath) || 'No current state file found.';
        const tasks = readMarkdownFile(tasksPath) || 'No active tasks file found.';

        return {
          content: [
            {
              type: 'text',
              text: `## Current Operating State\n${state}\n\n## Task Queue\n${tasks}`,
            },
          ],
        };
      }

      if (name === 'nexus_doctor') {
        const projectOrPath = String(args?.projectOrPath || 'Nexus');
        const report = runProjectDoctor(projectOrPath);

        return {
          content: [
            {
              type: 'text',
              text: report.markdown,
            },
          ],
        };
      }

      if (name === 'nexus_install_git_hook') {
        const targetDir = typeof args?.targetDir === 'string' ? args.targetDir : process.cwd();
        const projectName = typeof args?.projectName === 'string' ? args.projectName : undefined;
        const res = installGitHook(targetDir, projectName);

        return {
          content: [
            {
              type: 'text',
              text: res.message,
            },
          ],
        };
      }

      if (name === 'nexus_get_executive_brief') {
        const projectNames = Array.isArray(args?.projectNames) ? args.projectNames.map(String) : undefined;
        const brief = getExecutiveCatchupSummary(projectNames);

        return {
          content: [
            {
              type: 'text',
              text: brief,
            },
          ],
        };
      }

      if (name === 'nexus_get_project_brief') {
        const projectName = typeof args?.projectName === 'string' ? args.projectName : undefined;
        const includeRules = typeof args?.includeRules === 'boolean' ? args.includeRules : false;
        const result = compileJITContext({ projectName, includeRules });

        return {
          content: [
            {
              type: 'text',
              text: result.markdown,
            },
          ],
        };
      }

      if (name === 'nexus_save_session') {
        const project = String(args?.project || 'Nexus');
        const summary = String(args?.summary || '');
        const whatIDid = Array.isArray(args?.whatIDid) ? args.whatIDid.map(String) : [];
        const filesChanged = Array.isArray(args?.filesChanged) ? args.filesChanged.map(String) : [];
        const decisions = Array.isArray(args?.decisions) ? args.decisions.map(String) : [];
        const verificationEvidence = typeof args?.verificationEvidence === 'string' ? args.verificationEvidence : undefined;
        const nextSteps = Array.isArray(args?.nextSteps) ? args.nextSteps.map(String) : [];
        const autoUpdateReadme = typeof args?.autoUpdateReadme === 'boolean' ? args.autoUpdateReadme : true;
        const cwd = typeof args?.projectDir === 'string' ? args.projectDir : process.cwd();

        const result = createSessionCheckpoint({
          project,
          summary,
          whatIDid,
          filesChanged,
          decisions,
          verificationEvidence,
          nextSteps,
          autoUpdateReadme,
          cwd,
        });

        let msg = `✅ Session checkpoint recorded successfully:\n- File: ${result.sessionFilePath}\n- Slug: ${result.sessionSlug}`;
        if (result.readmeUpdated) {
          msg += `\n- README Updated: ${result.readmePath}`;
        }

        return {
          content: [
            {
              type: 'text',
              text: msg,
            },
          ],
        };
      }

      if (name === 'nexus_record_decision') {
        const title = String(args?.title || 'Decision');
        const context = String(args?.context || '');
        const decision = String(args?.decision || '');
        const tradeoffs = String(args?.tradeoffs || 'None documented.');
        const status = String(args?.status || 'accepted');

        const { dateStr } = getFormattedDate();
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        const adrFileName = `${dateStr}-${slug}.md`;
        const adrPath = path.join(vaultRoot, 'Decisions', adrFileName);

        const adrContent = `---
date: ${dateStr}
status: ${status}
tags: [decision, adr]
---

# ${title}

## Status
**${status.toUpperCase()}** (${dateStr})

## Context & Problem Statement
${context}

## Decision Outcome
${decision}

## Pros, Cons & Trade-offs
${tradeoffs}
`;
        writeMarkdownFile(adrPath, adrContent);

        return {
          content: [
            {
              type: 'text',
              text: `✅ ADR recorded successfully at Decisions/${adrFileName}`,
            },
          ],
        };
      }

      if (name === 'nexus_synthesize_pattern') {
        const patternName = String(args?.patternName);
        const category = args?.category as 'api' | 'security' | 'database' | 'ui' | 'workflow';
        const description = String(args?.description);
        const keyMechanisms = Array.isArray(args?.keyMechanisms) ? args.keyMechanisms.map(String) : [];
        const sanitizedCode = String(args?.sanitizedCode);

        const result = synthesizePattern({
          patternName,
          category,
          description,
          keyMechanisms,
          sanitizedCode,
        });

        return {
          content: [
            {
              type: 'text',
              text: `✅ Pattern synthesized & registered:\n- Blueprint: ${result.blueprintName}\n- agent_skill: ${result.agentSkillPath}\n- Nexus Knowledge: ${result.nexusKnowledgePath}`,
            },
          ],
        };
      }

      throw new Error(`Unknown tool: ${name}`);
    } catch (error) {
      console.error('[Nexus MCP Server Error]', error);
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Nexus 2.0 MCP Server running on stdio.');
}
