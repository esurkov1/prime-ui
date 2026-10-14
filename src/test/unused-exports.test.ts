// @vitest-environment node
/**
 * The exports of the shared modules (`src/internal`, `src/hooks`, `tokens/`) are used by the kit:
 * an export nothing imports is dead code, and one only the tests import is a test-only seam that
 * belongs inside the module. A module re-exported whole by a package entry (`export * from …`)
 * is public API.
 *
 * In ratchet mode (`unused-exports`): the offenders found when the check landed are the baseline.
 */
import path from "node:path";

import ts from "typescript";

import { read, walk } from "./contract-utils";
import { ratchet } from "./ratchet";

const MODULES = [
  ...walk("src/internal", /\.tsx?$/),
  ...walk("src/hooks", /\.tsx?$/),
  ...walk("tokens", /\.ts$/),
].filter((file) => !/\.test\.tsx?$|\.d\.ts$/.test(file));

/** Every file that may import a shared module, tests apart. */
const CODE = [
  ...walk("src", /\.tsx?$/),
  ...walk("scripts", /\.ts$/),
  ...walk("playground", /\.tsx?$/),
  ...walk("tokens", /\.ts$/),
  ...walk("SKILL", /\.tsx$/),
];
const isTest = (file: string) => /\.test\.tsx?$|^src\/test\//.test(file);

/** The names a module exports (declarations and `export { … }` lists, not re-exports of `*`). */
function exportedNames(file: string): string[] {
  const source = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true);
  const names: string[] = [];
  for (const statement of source.statements) {
    const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
    const exported = modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (
      ts.isExportDeclaration(statement) &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause)
    ) {
      for (const element of statement.exportClause.elements) names.push(element.name.text);
      continue;
    }
    if (!exported) continue;
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) names.push(declaration.name.text);
      }
    } else if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isEnumDeclaration(statement)) &&
      statement.name
    ) {
      names.push(statement.name.text);
    }
  }
  return names;
}

/** Modules a package entry re-exports whole: their exports are public. */
function publicModules(): Set<string> {
  const entries = [
    "src/index.ts",
    "src/color-picker.ts",
    "src/icon-set.ts",
    "src/components/index.ts",
    "src/layout/index.ts",
  ];
  const modules = new Set<string>();
  for (const entry of entries) {
    for (const m of read(entry).matchAll(/^export \* from "([^"]+)";/gm)) {
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(entry), m[1]));
      modules.add(target);
    }
  }
  return modules;
}

describe("unused exports", () => {
  it("every export of a shared module is used by the kit", () => {
    const publics = publicModules();
    const texts = CODE.map((file) => ({ file, text: read(file), test: isTest(file) }));
    const offenders: string[] = [];
    for (const module of MODULES) {
      if (publics.has(module.replace(/\.tsx?$/, ""))) continue;
      for (const name of exportedNames(module)) {
        const pattern = new RegExp(`\\b${name}\\b`);
        const users = texts.filter(({ file, text }) => file !== module && pattern.test(text));
        if (users.length === 0) offenders.push(`${module}: ${name} is unused`);
        else if (users.every((user) => user.test))
          offenders.push(`${module}: ${name} is test-only`);
      }
    }
    ratchet("unused-exports", offenders);
  });
});
