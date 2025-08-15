import fs from "fs";
import type { H5PLibrary } from "h5p-types";
import path from "path";
import type { VersionType } from "./types/VersionType";

export const isVersionType = (str: string): str is VersionType => {
  const versionTypes = [
    "major",
    "minor",
    "patch",
  ] as const satisfies ReadonlyArray<VersionType>;
  return versionTypes.includes(str as VersionType);
};

export async function readLibrary(directory: string): Promise<H5PLibrary> {
  const libraryPath = path.join(directory, "library.json");
  let libraryString: string;

  try {
    libraryString = (await fs.promises.readFile(libraryPath)).toString("utf-8");
  } catch (error) {
    console.error(error);
    throw new Error(`Could not find library file at '${libraryPath}'.`);
  }

  let library: H5PLibrary;

  try {
    library = JSON.parse(libraryString);
  } catch (error) {
    console.error(error);
    throw new Error(`Could not parse library file.`);
  }

  return library;
}

export async function writeLibrary(
  directory: string,
  library: H5PLibrary,
): Promise<void> {
  const libraryPath = path.join(directory, "library.json");
  await fs.promises.writeFile(libraryPath, JSON.stringify(library, null, 2));
}

function bumpPatchVersion(library: H5PLibrary): H5PLibrary {
  return {
    ...library,
    patchVersion: library.patchVersion + 1,
  };
}

function bumpMinorVersion(library: H5PLibrary): H5PLibrary {
  return {
    ...library,
    minorVersion: library.minorVersion + 1,
    patchVersion: 0,
  };
}

function bumpMajorVersion(library: H5PLibrary): H5PLibrary {
  return {
    ...library,
    majorVersion: library.majorVersion + 1,
    minorVersion: 0,
    patchVersion: 0,
  };
}

export function bumpVersion(
  versionType: VersionType,
  library: H5PLibrary,
): H5PLibrary {
  let updatedLibrary: H5PLibrary;

  switch (versionType) {
    case "major":
      updatedLibrary = bumpMajorVersion(library);
      break;
    case "minor":
      updatedLibrary = bumpMinorVersion(library);
      break;
    case "patch":
      updatedLibrary = bumpPatchVersion(library);
      break;
  }

  return updatedLibrary;
}
