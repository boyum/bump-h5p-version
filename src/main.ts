import * as core from "@actions/core";
import { exec } from "@actions/exec";
import * as github from "@actions/github";
import type { VersionType } from "./types/VersionType";
import {
  bumpVersion,
  getBranchName,
  isVersionType,
  readLibrary,
  writeLibrary,
} from "./utils";

const options = {
  type: "type",
  userName: "user-name",
  userEmail: "user-email",
  workingDirectory: "working-directory",
  commitMessage: "commit-message",
};

function getOptions(): {
  versionType: VersionType;
  userName: string;
  userEmail: string;
  workingDirectory: string;
  commitMessage: string;
} {
  // Get which version number should be changed
  const versionType: string | undefined = core.getInput(options.type);

  if (!versionType) {
    throw new Error(
      `\`${options.type}\` was not defined. Please set it to either \`major\`, \`minor\`, or \`patch\`.`,
    );
  }

  if (!isVersionType(versionType)) {
    throw new Error(
      `\`${options.type}\` was set to \`${versionType}\`. Please set it to either \`major\`, \`minor\`, or \`patch\`.`,
    );
  }

  // Get the user
  const userName: string = core.getInput(options.userName);
  const userEmail: string = core.getInput(options.userEmail);

  const workingDirectory = core.getInput(options.workingDirectory);

  const commitMessage = core.getInput(options.commitMessage);

  return {
    versionType,
    userName,
    userEmail,
    workingDirectory,
    commitMessage,
  };
}

async function run(): Promise<void> {
  try {
    core.info("Getting options");
    const {
      versionType,
      userName,
      userEmail,
      workingDirectory,
      commitMessage,
    } = getOptions();

    core.info("Finding library file");
    let library = await readLibrary(workingDirectory);

    core.info("Updating version number");
    library = bumpVersion(versionType, library);

    core.info("Storing the updated library file");
    writeLibrary(workingDirectory, library);

    core.info("Setting user info");
    await exec("git", ["config", "user.name", `"${userName}"`]);
    await exec("git", ["config", "user.email", `"${userEmail}"`]);

    const { owner, repo } = github.context.repo;
    const { number } = github.context.issue;

    core.info(
      `Getting branch name with owner: ${owner}, repo: ${repo}, and number: ${number}`,
    );
    const branchName = await getBranchName(owner, repo, number);

    core.info("Checking out the current branch");
    await exec(`git checkout ${branchName}`);

    core.info("Commiting");
    await exec("git", ["add", "-A"]);
    await exec("git", [
      "commit",
      "-am",
      `${commitMessage.replace(/\$TYPE\$/g, versionType)}`,
    ]);

    core.info("Pushing");
    await exec("git", ["push"]);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
