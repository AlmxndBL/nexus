import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { getVaultRoot, getAgentSkillRoot, getFormattedDate, readMarkdownFile } from '../src/core/vault.js';

describe('Vault Utilities', () => {
  it('should resolve a valid vault root containing _index.md', () => {
    const root = getVaultRoot();
    expect(fs.existsSync(root)).toBe(true);
    expect(fs.existsSync(path.join(root, '_index.md'))).toBe(true);
  });

  it('should resolve a valid Apex-core / agent_skill root directory', () => {
    const apexRoot = getAgentSkillRoot();
    expect(fs.existsSync(apexRoot)).toBe(true);
    expect(fs.existsSync(path.join(apexRoot, 'AGENTS.md'))).toBe(true);
  });

  it('should return valid formatted dates matching YYYY-MM-DD and HH:mm patterns', () => {
    const { dateStr, timeStr, slugTime } = getFormattedDate();
    expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(timeStr).toMatch(/^\d{2}:\d{2}$/);
    expect(slugTime).toMatch(/^\d{4}-\d{2}-\d{2}-\d{4}$/);
  });

  it('should return null when reading a non-existent markdown file', () => {
    const content = readMarkdownFile(path.join(getVaultRoot(), 'non-existent-file-12345.md'));
    expect(content).toBeNull();
  });
});
