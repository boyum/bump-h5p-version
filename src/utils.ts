import fs from "fs";
import type { Library } from "h5p-types";
import path from "path";
import type { Version } from "./types/Version";

export async function findLibraryVersion(directory: string): Promise<Version> {
  const libraryString = (
    await fs.promises.readFile(path.join(directory, "library.json"))
  ).toString("utf-8");
  const library: Library = JSON.parse(libraryString);

  return library;
}
