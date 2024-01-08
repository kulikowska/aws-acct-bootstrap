import { spawn } from 'child_process';
import { getBranchSettings } from '../utils';
import config from '../config.json';

const {
  DEPLOYMENT_ENV: { account, profile, region },
} = getBranchSettings();

export function main() {
  let command =
    'cdk deploy --require-approval never --outputs-file cdk-outputs.json';

  if (config.DEV_NO_ROLLBACK) {
    command += ' --no-rollback';
  }
  const [cmd, ...args] = command.split(' ');
  console.log('Deploying to:', {
    account,
    profile,
    region,
  });
  console.log('with a command:', command);

  spawn(cmd, args, {
    shell: true,
    stdio: 'inherit',
    env: {
      ...process.env,
      PATH: process.env.PATH, //explicitly reset.
      AWS_PROFILE: profile,
      AWS_REGION: region,
      AWS_ACCOUNT: account,
      FORCE_COLOR: '1',
    },
  });
}
if (require.main === module) {
  main()
}
