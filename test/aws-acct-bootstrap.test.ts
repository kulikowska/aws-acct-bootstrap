// import * as cdk from 'aws-cdk-lib';
// import { Template } from 'aws-cdk-lib/assertions';
import { AwsAcctBootstrapStack } from "../lib/aws-acct-bootstrap-stack";

import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import {
  account,
  gitHubActionsAwsAccessEnvSettings,
  region,
} from "../bin/env-props";

test("BootstrapStack Created", () => {
  const app = new cdk.App();
  //     // WHEN
  const stack = new AwsAcctBootstrapStack(app, "BootstrapStack", {
    env: { account, region },
    gitHubActionsAwsAccessEnvSettings,
  });
  //     // THEN
  const template = Template.fromStack(stack);

  //GitHubActionsAwsAccess
  template.hasResourceProperties("AWS::IAM::Role", {});
  template.hasResourceProperties("AWS::IAM::Policy", {});
  template.resourceCountIs("AWS::IAM::Role", 2);
  template.hasResourceProperties("AWS::Lambda::Function", {});
});
