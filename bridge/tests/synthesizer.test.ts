import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import { synthesizePattern, synthesizeLineWebhookBlueprint } from '../src/core/synthesizer.js';

describe('Pattern & Blueprint Synthesizer', () => {
  it('should synthesize a custom pattern blueprint to Apex and Nexus directories', () => {
    const result = synthesizePattern({
      patternName: 'Test Rate Limiter Pattern',
      category: 'security',
      description: 'Distributed rate limiting pattern with Redis sliding window',
      keyMechanisms: [
        'Sliding window algorithm',
        'Redis atomic increments with TTL',
        'Standard 429 response formatting',
      ],
      sanitizedCode: 'export function checkRateLimit() { return true; }',
    });

    expect(result.blueprintName).toBe('Test Rate Limiter Pattern');
    expect(result.agentSkillPath).toContain('test-rate-limiter-pattern.md');
    expect(result.nexusKnowledgePath).toContain('test-rate-limiter-pattern.md');

    expect(fs.existsSync(result.agentSkillPath)).toBe(true);
    expect(fs.existsSync(result.nexusKnowledgePath)).toBe(true);

    const content = fs.readFileSync(result.nexusKnowledgePath, 'utf-8');
    expect(content).toContain('Test Rate Limiter Pattern');
    expect(content).toContain('SECURITY');
    expect(content).toContain('Sliding window algorithm');

    // Clean up test file
    fs.rmSync(result.agentSkillPath, { force: true });
    fs.rmSync(result.nexusKnowledgePath, { force: true });
  });

  it('should synthesize the production LINE webhook blueprint', () => {
    const result = synthesizeLineWebhookBlueprint();

    expect(result.blueprintName).toBe('Idempotent Webhook Receiver with HMAC Signature');
    expect(fs.existsSync(result.agentSkillPath)).toBe(true);
    expect(fs.existsSync(result.nexusKnowledgePath)).toBe(true);

    const content = fs.readFileSync(result.nexusKnowledgePath, 'utf-8');
    expect(content).toContain('crypto.timingSafeEqual');
    expect(content).toContain('x-line-signature');
  });
});
