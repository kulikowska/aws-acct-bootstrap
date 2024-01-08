/** @see {isGithubActionsAwsAccessSettings} ts-auto-guard:type-guard */
export type GithubActionsAwsAccessSettings = {
  allowedIamActionsForGitHubActions: string[];
  githubBranchesRestrictedToAccessAws: string[];
  githubRepoName: string;
  githubUsername: string;
  maximumSessionDurationInSeconds: number;
}

/** @see {isDeploymentEnv} ts-auto-guard:type-guard */
export interface DeploymentEnv {
  account: string;
  branch: string;
  env: string;
  profile: string;
  region: string;
}

/** @see {isAccountSettings} ts-auto-guard:type-guard */
export interface AccountSettings {
  DEPLOYMENT_ENV: DeploymentEnv;
  GITHUB_ACTIONS_AWS_ACCESS_SETTINGS: GithubActionsAwsAccessSettings;
  // Add other keys here if necessary
}
