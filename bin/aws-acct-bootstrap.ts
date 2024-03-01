#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsAcctBootstrapStack } from '../lib/aws-acct-bootstrap-stack';
import {
  account,
  gitHubActionsAwsAccessEnvSettings,
  profile,
  region,
  namespace,
} from './env-props';

const app = new cdk.App();
new AwsAcctBootstrapStack(app, namespace, {
  profile,
  env: { account, region },
  gitHubActionsAwsAccessEnvSettings,
  namespace,
});
