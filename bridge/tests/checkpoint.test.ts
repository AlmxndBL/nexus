import { describe, it, expect } from 'vitest';
import { scanGitRepository } from '../src/core/checkpoint.js';
import { getVaultRoot } from '../src/core/vault.js';

describe('Checkpoint & Git Scanner', () => {
  it('should scan git repository information cleanly', () => {
    const vaultRoot = getVaultRoot();
    const gitInfo = scanGitRepository(vaultRoot);

    expect(gitInfo).toBeDefined();
    expect(typeof gitInfo.branch).toBe('string');
    expect(Array.isArray(gitInfo.files)).toBe(true);
    expect(typeof gitInfo.diffStat).toBe('string');
  });
});
