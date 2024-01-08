import fs from 'fs';
import path from 'path';
import { AccountSettings, isAccountSettings } from '../types';

/**
 * The function `getGitBranch` returns the current Git branch of a project by
 * searching for the `.git/HEAD` file in the current directory and its parent
 * directories.
 * @returns The function `getGitBranch` returns a string value representing the
 * current Git branch if it is found in the current directory or any of its parent
 * directories. If no Git branch is found, it returns `null`.
 */

export const getGitBranch = (): string | null => {
  let currentDir = process.cwd();

  while (currentDir !== '/' && !currentDir.match(/^[A-Z]:\\$/i)) {
    const gitHeadPath = path.join(currentDir, '.git', 'HEAD');
    if (fs.existsSync(gitHeadPath)) {
      const headContent = fs.readFileSync(gitHeadPath, 'utf8');
      const match = headContent.match(/ref: refs\/heads\/(.*)/);
      return match ? match[1]!.trim() : null;
    }
    currentDir = path.dirname(currentDir);
  }
  return null;
};

/**
 * Reads account settings from a JSON file and returns the environment settings for the current Git branch.
 * Validates the structure of the settings using `isAccountSettings` type guard.
 * If the settings are improperly structured, the function throws an error with a descriptive message.
 *
 * @returns An `AccountSettings` object for the current Git branch.
 * @throws Error if the settings file is not structured correctly.
 */
export function getBranchSettings(): AccountSettings {
  const settingsPath = path.join(__dirname, '../acc-settings.json');
  const settingsArray: any[] = JSON.parse(
    fs.readFileSync(settingsPath, 'utf-8'),
  );

  const currentBranch = getGitBranch() ?? 'dev';
  const setting = settingsArray.find(
    setting => setting.DEPLOYMENT_ENV?.branch === currentBranch,
  );

  if (!setting || !isAccountSettings(setting)) {
    throw new Error('Invalid account settings structure.');
  }

  return setting;
}

if (require.main === module) {
  console.log(getBranchSettings());
}
