import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Nexus vault root is 2 levels up from bridge/src/core/
export function getVaultRoot(): string {
  const envRoot = process.env.NEXUS_VAULT_ROOT;
  if (envRoot && fs.existsSync(envRoot)) {
    return path.resolve(envRoot);
  }
  // Try relative to current file or current working directory
  const candidateFromHere = path.resolve(__dirname, '../../..');
  if (fs.existsSync(path.join(candidateFromHere, '_index.md'))) {
    return candidateFromHere;
  }
  const candidateFromCwd = path.resolve(process.cwd());
  if (fs.existsSync(path.join(candidateFromCwd, '_index.md'))) {
    return candidateFromCwd;
  }
  return candidateFromHere;
}

export function getAgentSkillRoot(): string {
  const envRoot = process.env.AGENT_SKILL_ROOT;
  if (envRoot && fs.existsSync(envRoot)) {
    return path.resolve(envRoot);
  }
  const defaultPath = path.resolve('c:/Users/Admin/Desktop/work/agent_skill');
  if (fs.existsSync(defaultPath)) {
    return defaultPath;
  }
  return path.resolve(getVaultRoot(), '../agent_skill');
}

export function readMarkdownFile(filePath: string): string | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, 'utf-8');
}

export function writeMarkdownFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf-8');
}

export function getFormattedDate(): { dateStr: string; timeStr: string; slugTime: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return {
    dateStr: `${year}-${month}-${day}`,
    timeStr: `${hours}:${minutes}`,
    slugTime: `${year}-${month}-${day}-${hours}${minutes}`,
  };
}
