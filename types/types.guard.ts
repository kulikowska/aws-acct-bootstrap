/*
 * Generated type guards for "types.ts".
 * WARNING: Do not manually change this file.
 */
import { GithubActionsAwsAccessSettings, DeploymentEnv, AccountSettings } from "./types";

export function isGithubActionsAwsAccessSettings(obj: unknown): obj is GithubActionsAwsAccessSettings {
    const typedObj = obj as GithubActionsAwsAccessSettings
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        Array.isArray(typedObj["allowedIamActionsForGitHubActions"]) &&
        typedObj["allowedIamActionsForGitHubActions"].every((e: any) =>
            typeof e === "string"
        ) &&
        Array.isArray(typedObj["githubBranchesRestrictedToAccessAws"]) &&
        typedObj["githubBranchesRestrictedToAccessAws"].every((e: any) =>
            typeof e === "string"
        ) &&
        typeof typedObj["githubRepoName"] === "string" &&
        typeof typedObj["githubUsername"] === "string" &&
        typeof typedObj["maximumSessionDurationInSeconds"] === "number"
    )
}

export function isDeploymentEnv(obj: unknown): obj is DeploymentEnv {
    const typedObj = obj as DeploymentEnv
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        typeof typedObj["account"] === "string" &&
        typeof typedObj["branch"] === "string" &&
        typeof typedObj["env"] === "string" &&
        typeof typedObj["profile"] === "string" &&
        typeof typedObj["region"] === "string"
    )
}

export function isAccountSettings(obj: unknown): obj is AccountSettings {
    const typedObj = obj as AccountSettings
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        isDeploymentEnv(typedObj["DEPLOYMENT_ENV"]) as boolean &&
        isGithubActionsAwsAccessSettings(typedObj["GITHUB_ACTIONS_AWS_ACCESS_SETTINGS"]) as boolean
    )
}
