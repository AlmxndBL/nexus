import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { installGitHook, uninstallGitHook } from '../src/core/hook.js';

describe('Git Pre-Push Hook Installer', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-hook-test-'));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should return error when directory has no .git folder', () => {
    const result = installGitHook(tempDir);
    expect(result.installed).toBe(false);
    expect(result.message).toContain('not a git repository');
  });

  it('should install pre-push hook script successfully when .git exists', () => {
    const gitDir = path.join(tempDir, '.git');
    fs.mkdirSync(gitDir, { recursive: true });

    const result = installGitHook(tempDir, 'test-project');
    expect(result.installed).toBe(true);
    expect(result.projectName).toBe('test-project');
    expect(fs.existsSync(result.hookPath)).toBe(true);

    const content = fs.readFileSync(result.hookPath, 'utf-8');
    expect(content).toContain('Nexus 2.0 Auto-Checkpoint Hook');
    expect(content).toContain('test-project');
  });

  it('should uninstall pre-push hook script successfully', () => {
    const gitDir = path.join(tempDir, '.git');
    fs.mkdirSync(gitDir, { recursive: true });

    installGitHook(tempDir, 'test-project');
    const uninstallResult = uninstallGitHook(tempDir);
    expect(uninstallResult.uninstalled).toBe(true);
    expect(uninstallResult.message).toContain('removed');

    const hookFile = path.join(gitDir, 'hooks/pre-push');
    expect(fs.existsSync(hookFile)).toBe(false);
  });
});
