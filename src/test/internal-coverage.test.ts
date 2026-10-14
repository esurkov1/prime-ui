// @vitest-environment node
/**
 * Every runtime module of `src/internal` and `src/hooks` has a sibling test (`x.ts` →
 * `x.test.ts` or `x.test.tsx`): the shared mechanics are tested where they live, not only through
 * the components that use them. Types-only modules and the `*.api.ts` tables are skipped; a
 * stylesheet is no module.
 *
 * In ratchet mode (`internal-coverage`): the modules without a test when the check landed are the
 * baseline.
 */
import path from "node:path";

import ts from "typescript";

import { exists, read, walk } from "./contract-utils";
import { ratchet } from "./ratchet";

/** A module with no runtime code: only types, interfaces and type-only imports or exports. */
function typesOnly(file: string): boolean {
  const source = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true);
  return source.statements.every(
    (statement) =>
      ts.isTypeAliasDeclaration(statement) ||
      ts.isInterfaceDeclaration(statement) ||
      (ts.isImportDeclaration(statement) && statement.importClause?.isTypeOnly === true) ||
      (ts.isExportDeclaration(statement) && statement.isTypeOnly),
  );
}

describe("internal coverage", () => {
  it("every runtime module of src/internal and src/hooks has a sibling test", () => {
    const modules = [...walk("src/internal", /\.tsx?$/), ...walk("src/hooks", /\.tsx?$/)].filter(
      (file) => !/\.test\.tsx?$|\.api\.ts$|\.d\.ts$/.test(file),
    );
    const untested = modules.filter((file) => {
      if (typesOnly(file)) return false;
      const stem = file.replace(/\.tsx?$/, "");
      return !exists(`${stem}.test.ts`) && !exists(`${stem}.test.tsx`);
    });
    expect(modules.length).toBeGreaterThan(40);
    ratchet(
      "internal-coverage",
      untested.map(
        (file) => `${file}: no ${path.posix.basename(file).replace(/\.tsx?$/, ".test")}`,
      ),
    );
  });
});
