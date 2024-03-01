import { getBranchSettings } from '../utils';
const { GITHUB_ACTIONS_AWS_ACCESS_SETTINGS, DEPLOYMENT_ENV } =
  getBranchSettings();

const { account, region, profile, env } = DEPLOYMENT_ENV;

const gitHubActionsAwsAccessEnvSettings = GITHUB_ACTIONS_AWS_ACCESS_SETTINGS;
const { githubRepoName, githubUsername } = gitHubActionsAwsAccessEnvSettings;
const namespace = `${githubUsername}-${githubRepoName}-${account}-${env}`;
export {
  account,
  env,
  gitHubActionsAwsAccessEnvSettings,
  profile,
  region,
  namespace,
};

if (require.main === module) {
  console.log(
    JSON.stringify({
      account,
      env,
      gitHubActionsAwsAccessEnvSettings,
      profile,
      region,
namespace,
    }),
  );
}
