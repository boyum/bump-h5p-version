import { expect, test } from "@jest/globals";
import { isVersionType } from "../src/utils";

test(isVersionType.name, () => {
  ["major", "minor", "patch"].forEach(versionType =>
    expect(isVersionType(versionType)).toBe(true),
  );
  expect(isVersionType("asd")).toBe(false);
});
