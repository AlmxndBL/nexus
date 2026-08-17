import * as fs from 'node:fs';
import * as path from 'node:path';
import { getVaultRoot } from './vault.js';

export interface HookInstallResult {
  installed: boolean;
  hookPath: string;
  projectName: string;
  message: string;
}

export function installGitHook(targetDir: string = process.cwd(), customProjectName?: string): HookInstallResult {
  const resolvedTarget = path.resolve(targetDir);
  const gitDir = path.join(resolvedTarget, '.git');

  if (!fs.existsSync(gitDir)) {
    return {
      installed: false,
      hookPath: '',
      projectName: '',
      message: `Error: ${resolvedTarget} is not a git repository (.git folder missing).`,
    };
  }

  const hooksDir = path.join(gitDir, 'hooks');
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  const projectName = customProjectName || path.basename(resolvedTarget);
  const vaultRoot = getVaultRoot();
  const cliPath = path.join(vaultRoot, 'bridge/dist/cli.js').replace(/\\/g, '/');

  const hookPath = path.join(hooksDir, 'pre-push');

  // Multi-platform pre-push script (works in Git Bash, WSL, and Windows PowerShell)
  const hookScript = `#!/usr/bin/env sh
# Nexus 2.0 Auto-Checkpoint Hook on Git Push
echo "🏛️ [Nexus] Auto-recording session checkpoint before git push..."
node "${cliPath}" checkpoint "${projectName}" "Auto-checkpoint: Git push to remote"
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "⚠️ [Nexus] Warning: Nexus checkpoint finished with exit code $EXIT_CODE"
fi

exit 0
`;

  fs.writeFileSync(hookPath, hookScript, { encoding: 'utf-8', mode: 0o755 });

  return {
    installed: true,
    hookPath,
    projectName,
    message: `✅ Nexus pre-push hook successfully installed in ${hookPath} (Project: ${projectName})`,
  };
}

export function uninstallGitHook(targetDir: string = process.cwd()): { uninstalled: boolean; message: string } {
  const resolvedTarget = path.resolve(targetDir);
  const hookPath = path.join(resolvedTarget, '.git/hooks/pre-push');

  if (fs.existsSync(hookPath)) {
    fs.unlinkSync(hookPath);
    return {
      uninstalled: true,
      message: `✅ Nexus pre-push hook removed from ${hookPath}`,
    };
  }

  return {
    uninstalled: false,
    message: `No pre-push hook found at ${hookPath}`,
  };
}
