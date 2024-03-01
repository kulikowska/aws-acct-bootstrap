import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import GitHubActionsAwsAccess from './GitHubActionsAwsAccess';
import { GithubActionsAwsAccessSettings } from '../types/types';
export interface BootstrapStackProps extends StackProps {
  namespace: string;
  gitHubActionsAwsAccessEnvSettings: GithubActionsAwsAccessSettings;
  profile: string;
}
export class AwsAcctBootstrapStack extends Stack {
  constructor(scope: Construct, id: string, props: BootstrapStackProps) {
    super(scope, id, props);

    const {
      gitHubActionsAwsAccessEnvSettings: {
        allowedIamActionsForGitHubActions,
        githubBranchesRestrictedToAccessAws,
        githubRepoName,
        githubUsername,
        maximumSessionDurationInSeconds,
      },
      namespace,
      profile,
    } = props;

    //create githubActionsAwsAccess
    const githubActionsAccess = new GitHubActionsAwsAccess(
      this,
      'githubActionsAwsAccess',
      {
        allowedIamActionsForGitHubActions,
        maximumSessionDurationInSeconds,
        namespace: namespace,
        profile,
        repoConfig: {
          user: githubUsername,
          repo: githubRepoName,
          branchRestrictions: githubBranchesRestrictedToAccessAws,
        },
      },
    );
    new CfnOutput(this, 'GitHubActionsAwsAccessRoleName', {
      value: githubActionsAccess.githubActionsAwsAccessRoleName,
      description: `The roleName of the githubActionsAwsAccess: Username = ${githubUsername}, Repo = ${githubRepoName}`,
      exportName: `GitHubActionsAwsAccessRoleNameForUser${namespace}`,
    });
    new CfnOutput(this, 'GitHubActionsAwsAccessRoleArn', {
      value: githubActionsAccess.githubActionsAwsAccessRoleArn,
      description: `The roleArn of the githubActionsAwsAccess: Username = ${githubUsername}, Repo = ${githubRepoName}`,
      exportName: `GitHubActionsAwsAccessRoleArnForUser${namespace}`,
    });
  }
}
