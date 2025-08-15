import { copyFile, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "@jest/globals";
import type { H5PLibrary } from "h5p-types";
import { bumpVersion, isVersionType, readLibrary, writeLibrary } from "./utils";

describe(isVersionType.name, () => {
  it("should return true if any of the version types is given", () => {
    for (const versionType of ["major", "minor", "patch"]) {
      expect(isVersionType(versionType)).toBe(true);
    }
  });

  it("should return false if any other value is given", () => {
    expect(isVersionType("asd")).toBe(false);
  });
});

describe(readLibrary.name, () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), `${readLibrary.name}-`));

    await copyFile(
      join("demo", "library.json"),
      join(directory, "library.json"),
    );
  });

  it("should read and parse the library file in the given directory", async () => {
    const expectedLibrary = {
      title: "Library",
      machineName: "H5P.Library",
      majorVersion: 0,
      minorVersion: 0,
      patchVersion: 0,
    };

    const actualLibrary = await readLibrary(directory);

    expect(actualLibrary).toEqual(expectedLibrary);
  });

  it("should throw an error if the library file wasn't found in the given directory", async () => {
    try {
      await readLibrary("invalid");
      expect(false).toBeTruthy();
    } catch {
      expect(true).toBeTruthy();
    }
  });
});

describe(writeLibrary.name, () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), `${writeLibrary.name}-`));

    await copyFile(
      join("demo", "library.json"),
      join(directory, "library.json"),
    );
  });

  it("should write the given library object to library.json", async () => {
    const library: H5PLibrary = {
      title: "title",
      machineName: "machineName",
      majorVersion: 1,
      minorVersion: 1,
      patchVersion: 1,
    };

    await writeLibrary(directory, library);

    const updatedLibrary = await readLibrary(directory);
    expect(updatedLibrary).toEqual(library);
  });
});

describe(bumpVersion.name, () => {
  it("should bump major version", () => {
    const library = {
      title: "title",
      machineName: "machineName",
      majorVersion: 1,
      minorVersion: 1,
      patchVersion: 1,
    };

    const expectedLibrary = {
      title: "title",
      machineName: "machineName",
      majorVersion: 2,
      minorVersion: 0,
      patchVersion: 0,
    };

    const actualLibrary = bumpVersion("major", library);

    expect(actualLibrary).toEqual(expectedLibrary);
  });

  it("should bump minor version", () => {
    const library = {
      title: "title",
      machineName: "machineName",
      majorVersion: 1,
      minorVersion: 1,
      patchVersion: 1,
    };

    const expectedLibrary = {
      title: "title",
      machineName: "machineName",
      majorVersion: 1,
      minorVersion: 2,
      patchVersion: 0,
    };

    const actualLibrary = bumpVersion("minor", library);

    expect(actualLibrary).toEqual(expectedLibrary);
  });

  it("should bump patch version", () => {
    const library = {
      title: "title",
      machineName: "machineName",
      majorVersion: 1,
      minorVersion: 1,
      patchVersion: 1,
    };

    const expectedLibrary = {
      title: "title",
      machineName: "machineName",
      majorVersion: 1,
      minorVersion: 1,
      patchVersion: 2,
    };

    const actualLibrary = bumpVersion("patch", library);

    expect(actualLibrary).toEqual(expectedLibrary);
  });
});
