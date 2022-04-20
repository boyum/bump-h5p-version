import * as core from "@actions/core";
import type { VersionType } from "./types/VersionType";
import { bumpVersion, isVersionType, readLibrary, writeLibrary } from "./utils";

const options = {
  type: "type",
  workingDirectory: "working-directory",
};

function getOptions(): {
  versionType: VersionType;
  workingDirectory: string;
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

  const workingDirectory = core.getInput(options.workingDirectory);

  return {
    versionType,
    workingDirectory,
  };
}

async function run(): Promise<void> {
  try {
    core.info("Getting options");
    const { versionType, workingDirectory } = getOptions();

    core.info("Finding library file");
    let library = await readLibrary(workingDirectory);

    core.info("Updating version number");
    library = bumpVersion(versionType, library);

    core.info("Storing the updated library file");
    writeLibrary(workingDirectory, library);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
