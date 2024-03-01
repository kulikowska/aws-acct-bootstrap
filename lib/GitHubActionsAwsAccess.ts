import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';
import {
    Conditions,
  Effect,
  OpenIdConnectProvider,
  Policy,
  PolicyStatement,
  Role,
  WebIdentityPrincipal,
} from 'aws-cdk-lib/aws-iam';
import { getOpenIDConnectProviderArn } from '../utils';

const oidcProvider = 'token.actions.githubusercontent.com';
const oidcAudience = 'sts.amazonaws.com';
const ceilingStsSessionDuration = 43200; //12 hrs
const floorStsSessionDuration = 900; //15 min

export interface GitHubActionsAwsAccessProps {
readonly profile: string;
  readonly namespace: string;
  readonly allowedIamActionsForGitHubActions: string[];
  readonly maximumSessionDurationInSeconds: number;
  readonly repoConfig: {
    user: string;
    repo: string;
    branchRestrictions: string[];
  };
}

export default class GitHubActionsAwsAccess extends Construct {
  public githubActionsAwsAccessRoleName: string;
  public githubActionsAwsAccessRoleArn: string;
  constructor(
    scope: Construct,
    id: string,
    props: GitHubActionsAwsAccessProps,
  ) {
    super(scope, id);
    const {
      allowedIamActionsForGitHubActions,
      repoConfig: { user, repo, branchRestrictions },
      namespace,
      maximumSessionDurationInSeconds,
      profile,
    } = props;
    if (
      isNaN(maximumSessionDurationInSeconds) ||
        maximumSessionDurationInSeconds > ceilingStsSessionDuration ||
      maximumSessionDurationInSeconds < floorStsSessionDuration
    )
      throw new Error(
        'STS Session Duration must be between 900 and 43200 seconds',
      );

    //grab if oidc provider exists or create a new one
    let githubIdpArn = getOpenIDConnectProviderArn(oidcProvider, profile);
    if (!githubIdpArn) {
      console.log(
        `OIDC Provider ${oidcProvider} not found. Creating new OIDC Provider`,
      );
      githubIdpArn = new OpenIdConnectProvider(this, 'GithubIdp', {
      url: `https://${oidcProvider}`,
      clientIds: [oidcAudience],
    }).openIdConnectProviderArn;
    }

    if (branchRestrictions.length == 0)
      throw new Error('Branch restrictions cannot be empty');

    let accessConditions: Conditions;
    if (props.repoConfig.branchRestrictions.find(e => e === '*')) {
      //then all or '*' branches allowed => have to use StringLike (not StringEquals)
      accessConditions = {
        StringLike: {
          [`${oidcProvider}:sub`]: `repo:${user}/${repo}:ref:refs/heads/*`,
        },
        StringEquals: {
          [`${oidcProvider}:aud`]: oidcAudience,
        },
      };
    } else {
      const audienceCondition = { [`${oidcProvider}:aud`]: oidcAudience };
      const branchConditions = branchRestrictions
        .map(branch => ({
          [`${oidcProvider}:sub`]: `repo:${user}/${repo}:ref:refs/heads/${branch}`,
        }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});
      accessConditions = {
        StringEquals: { ...audienceCondition, ...branchConditions },
      };
    }

    const githubActionsAwsAccessRole = new Role(
      this,
      'GitHubActionsAwsAccessRole',
      {
        //! Generally a bad idea but this is super useful for dynamic role access in github workflows
        roleName: `oidc-${namespace}`,
        assumedBy: new WebIdentityPrincipal(githubIdpArn, accessConditions),
      maxSessionDuration: Duration.seconds(maximumSessionDurationInSeconds),
    },
    );

    githubActionsAwsAccessRole.attachInlinePolicy(
      new Policy(this, 'GithubAccessPolicy', {
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: allowedIamActionsForGitHubActions,
            //?allow all resources => otherwise restricting to specific resources require s a lot of work  => you can manually configure permission boundary in IAM as necessary + ideally your account is bounded by an SCP.
            resources: ['*'],
          }),
        ],
      }),
    );
    this.githubActionsAwsAccessRoleName = githubActionsAwsAccessRole.roleName;
    this.githubActionsAwsAccessRoleArn = githubActionsAwsAccessRole.roleArn;
  }
}
