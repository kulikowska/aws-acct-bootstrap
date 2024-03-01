/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { execSync } from 'child_process';

export function getOpenIDConnectProviderArn(
  providerUrl: string,
  profile: string,
): string | false {
  try {
    const cmd = `aws iam list-open-id-connect-providers --profile ${profile} --output json`;
    const output = execSync(cmd, { encoding: 'utf-8' });
    const providers = JSON.parse(output);

    const provider = providers.OpenIDConnectProviderList.find(
      (provider: { Arn: string }) => provider.Arn.includes(providerUrl),
    );
    return provider ? provider.Arn : null;
  } catch (error) {
    console.error('Error executing AWS CLI command:', error);
    throw error;
  }
}
