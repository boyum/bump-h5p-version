import fs from "fs";
import type { Library } from "h5p-types";
import path from "path";
import type { VersionType } from "./types/VersionType";

export const isVersionType = (str: string): str is VersionType => {
  const versionTypes: Array<VersionType> = ["major", "minor", "patch"];
  return versionTypes.includes(str as VersionType);
};

export async function readLibrary(directory: string): Promise<Library> {
  const libraryPath = path.join(directory, "library.json");
  let libraryString: string;

  try {
    libraryString = (await fs.promises.readFile(libraryPath)).toString("utf-8");
  } catch (error) {
    console.error(error);
    throw new Error(`Could not find library file at '${libraryPath}'.`);
  }

  let library: Library;

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
  library: Library,
): Promise<void> {
  const libraryPath = path.join(directory, "library.json");
  await fs.promises.writeFile(libraryPath, JSON.stringify(library));
}

function bumpPatchVersion(library: Library): Library {
  return {
    ...library,
    patchVersion: library.patchVersion + 1,
  };
}

function bumpMinorVersion(library: Library): Library {
  return {
    ...library,
    minorVersion: library.minorVersion + 1,
    patchVersion: 0,
  };
}

function bumpMajorVersion(library: Library): Library {
  return {
    ...library,
    majorVersion: library.majorVersion + 1,
    minorVersion: 0,
    patchVersion: 0,
  };
}

export function bumpVersion(
  versionType: VersionType,
  library: Library,
): Library {
  let updatedLibrary: Library;

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
