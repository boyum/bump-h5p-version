import type { Library } from "h5p-types";

export type Version = Pick<
  Library,
  "majorVersion" | "minorVersion" | "patchVersion"
>;
