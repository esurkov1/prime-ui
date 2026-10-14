/**
 * The TypeScript side of an `api.ts`: the exported part a table names, its props type and where
 * each prop is declared. Shared by `src/test/api-types.test.ts` (the structure of `api.ts`
 * against the code) and `scripts/bundle-lib.ts` (the `api.ts` text as each prop's JSDoc in
 * `dist/*.d.ts`).
 */
import path from "node:path";

import ts from "typescript";

import type { ApiPart, ComponentApi } from "./componentApi";

/** The package entries whose exports are the parts. */
export const ENTRY_FILES = ["src/index.ts", "src/color-picker.ts"];

/** A program over the package entries with the repository's compiler options. */
export function createKitProgram(root: string, rootNames?: string[]): ts.Program {
  const configPath = path.join(root, "tsconfig.json");
  const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
  const { options } = ts.parseJsonConfigFileContent(config, ts.sys, root);
  return ts.createProgram({
    rootNames: rootNames ?? [
      ...ENTRY_FILES.map((file) => path.join(root, file)),
      path.join(root, "src/types/css-modules.d.ts"),
    ],
    options: { ...options, noEmit: true },
  });
}

/** Every export of the package entries by name. */
export function kitExports(program: ts.Program, root: string): Map<string, ts.Symbol> {
  const checker = program.getTypeChecker();
  const exports = new Map<string, ts.Symbol>();
  for (const file of ENTRY_FILES) {
    const source = program.getSourceFile(path.join(root, file));
    const module = source && checker.getSymbolAtLocation(source);
    if (!module) throw new Error(`no module symbol for ${file}`);
    for (const symbol of checker.getExportsOfModule(module)) exports.set(symbol.name, symbol);
  }
  return exports;
}

/** The type of an exported part: `Button.Root`, `Spinner`. */
export function partType(
  checker: ts.TypeChecker,
  exports: Map<string, ts.Symbol>,
  name: string,
): ts.Type | undefined {
  const [ns, member] = name.split(".");
  const symbol = exports.get(ns);
  if (!symbol) return undefined;
  const resolved = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
  const type = checker.getTypeOfSymbol(resolved);
  if (!member) return type;
  const property = checker.getPropertyOfType(type, member);
  return property ? checker.getTypeOfSymbol(property) : undefined;
}

/** The props type of a component type: the first parameter of its (first) call signature. */
export function propsType(checker: ts.TypeChecker, component: ts.Type): ts.Type | undefined {
  const signature = component.getCallSignatures()[0];
  const parameter = signature?.getParameters()[0];
  if (!parameter) return undefined;
  return checker.getTypeOfSymbol(parameter);
}

/** A prop is the component's own when it is declared in the kit, not in React's DOM types. */
export function isOwnProp(prop: ts.Symbol): boolean {
  const declarations = prop.getDeclarations() ?? [];
  return declarations.some((declaration) => {
    const file = declaration.getSourceFile().fileName;
    return !file.includes("/node_modules/");
  });
}

/** A prop is optional when it is marked `?`. */
export function isOptionalProp(prop: ts.Symbol): boolean {
  return (prop.flags & ts.SymbolFlags.Optional) !== 0;
}

/** The string literals of a union type, or `null` when the type is no pure string-literal union. */
export function stringLiterals(type: ts.Type): string[] | null {
  const members = type.isUnion() ? type.types : [type];
  const values: string[] = [];
  for (const member of members) {
    if (member.flags & ts.TypeFlags.Undefined) continue;
    if (!member.isStringLiteral()) return null;
    values.push(member.value);
  }
  return values.length > 1 ? values.sort() : null;
}

/** The names a part row stands for: `Modal.Title · Modal.Description` → both. */
export const partNames = (part: ApiPart) => part.name.split(" · ");

/** The prop names a row stands for: `onEnter · onLeave`, `aria-label / aria-labelledby` → each. */
export const propNames = (name: string) => name.split(/ · | \/ /);

/** Every documented prop of every resolvable part, with its declarations in the code. */
export function documentedProps(
  program: ts.Program,
  exports: Map<string, ts.Symbol>,
  apis: ComponentApi[],
): { declaration: ts.Declaration; en: string }[] {
  const checker = program.getTypeChecker();
  const out: { declaration: ts.Declaration; en: string }[] = [];
  for (const api of apis) {
    for (const part of api.parts) {
      for (const name of partNames(part)) {
        const component = partType(checker, exports, name);
        const props = component && propsType(checker, component);
        if (!props) continue;
        for (const row of part.props) {
          for (const propName of propNames(row.name)) {
            const symbol = checker.getPropertyOfType(props, propName);
            if (!symbol || !isOwnProp(symbol)) continue;
            for (const declaration of symbol.getDeclarations() ?? []) {
              if (declaration.getSourceFile().fileName.includes("/node_modules/")) continue;
              out.push({ declaration, en: row.en });
            }
          }
        }
      }
    }
  }
  return out;
}
