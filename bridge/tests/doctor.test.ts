import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { runProjectDoctor } from '../src/core/doctor.js';
import { getVaultRoot } from '../src/core/vault.js';

describe('Nexus Doctor Health Audit', () => {
  it('should run doctor audit on the Nexus workspace and return a valid report', () => {
    const vaultRoot = getVaultRoot();
    const report = runProjectDoctor(vaultRoot);

    expect(report).toBeDefined();
    expect(report.projectName).toBe(path.basename(vaultRoot));
    expect(report.projectPath).toBe(vaultRoot);
    expect(typeof report.overallScore).toBe('number');
    expect(report.overallScore).toBeGreaterThanOrEqual(0);
    expect(report.overallScore).toBeLessThanOrEqual(100);
    expect(['A+', 'A', 'B', 'C', 'F']).toContain(report.grade);
    expect(report.checks.length).toBe(4);
    expect(report.markdown).toContain('Nexus Doctor Health Report');
  });

  it('should include all 4 Apex 6-Pillar standard categories in checks', () => {
    const vaultRoot = getVaultRoot();
    const report = runProjectDoctor(vaultRoot);
    const categories = report.checks.map(c => c.category);

    expect(categories).toContain('🥇 Security & Auth');
    expect(categories).toContain('🥈 Code Quality & Strict TS');
    expect(categories).toContain('🗄️ Database Design');
    expect(categories).toContain('🧪 QA & Testing Gate');
  });

  it('should pass Security check when .gitignore excludes .env', () => {
    const vaultRoot = getVaultRoot();
    const report = runProjectDoctor(vaultRoot);
    const securityCheck = report.checks.find(c => c.category.includes('Security'));

    expect(securityCheck).toBeDefined();
    expect(securityCheck?.passed).toBe(true);
    expect(securityCheck?.score).toBe(100);
  });
});
