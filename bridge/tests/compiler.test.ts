import { describe, it, expect } from 'vitest';
import { compileJITContext, getExecutiveCatchupSummary } from '../src/core/compiler.js';

describe('JIT Context Compiler', () => {
  it('should compile JIT context packet with project overview and header', () => {
    const result = compileJITContext({ projectName: 'Nexus', includePreferences: true });
    expect(result).toBeDefined();
    expect(result.projectName).toBe('Nexus');
    expect(result.markdown).toContain('Nexus JIT Context Packet: Nexus');
    expect(result.tokenEstimate).toBeGreaterThan(0);
  });

  it('should include 6-Pillar standards when includeRules is true', () => {
    const result = compileJITContext({ projectName: 'Nexus', includeRules: true });
    expect(result.markdown).toContain('6-Pillar Engineering Standards');
  });

  it('should generate executive catchup summary without crashing', () => {
    const summary = getExecutiveCatchupSummary(['Nexus']);
    expect(summary).toBeDefined();
    expect(summary).toContain('Executive Multi-Project Catchup Briefing');
  });
});
