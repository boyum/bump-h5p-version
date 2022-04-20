import * as core from "@actions/core";
import { exec } from "@actions/exec";
import * as github from "@actions/github";
import type { VersionType } from "./types/VersionType";
import { bumpVersion, isVersionType, readLibrary, writeLibrary } from "./utils";

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
    // Get options
    const {
      versionType,
      userName,
      userEmail,
      workingDirectory,
      commitMessage,
    } = getOptions();

    // Find library file
    let library = await readLibrary(workingDirectory);

    // Update the version number (set patch to 0 if minor is bumped, etc)
    library = bumpVersion(versionType, library);

    // Store the new library file
    writeLibrary(workingDirectory, library);

    // Set which user should commit
    exec("git", ["config", "user.name", `"${userName}"`]);
    exec("git", ["config", "user.email", `"${userEmail}"`]);

    // Check out the current branch
    exec("gh", ["pr", "checkout", github.context.issue.number.toString()]);

    // Commit
    exec("git", ["add", "-A"]);
    exec("git", [
      "commit",
      "-am",
      `"${commitMessage.replace(/$TYPE$/g, versionType)}"`,
    ]);
    exec("git", ["push"]);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
