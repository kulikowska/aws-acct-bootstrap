/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { spawn } from 'child_process';
import { getBranchSettings } from '../utils';

const {
  DEPLOYMENT_ENV: { account, profile, region },
} = getBranchSettings();

export function main() {
  const command = 'cdk synth && cdk diff';
  console.log('Running validation with profile:', profile);
  console.log('with a command:', command);

  const child = spawn(command, {
    shell: true,
    env: {
      ...process.env,
      AWS_PROFILE: profile,
      AWS_REGION: region,
      AWS_ACCOUNT: account,
    },
  });

  child.stdout.on('data', data => {
    console.log(data.toString());
  });

  child.stderr.on('data', data => {
    console.error(data.toString());
  });

  child.on('close', code => {
    console.log(`child process exited with code ${code as number}`);
  });
}
