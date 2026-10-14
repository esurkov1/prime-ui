// @vitest-environment node
/**
 * api.ts against the code: every part an `api.ts` table names is an exported part, and its props
 * are the props of the TypeScript type — the same names, the same `required`, the same literal
 * unions, a `…rest` row exactly when native attributes are forwarded and no Omit key that still
 * reaches the element. Every `labels` key is a key of the part's labels type and its default is
 * the runtime default.
 */
import ts from "typescript";

import {
  createKitProgram,
  documentedProps,
  isOptionalProp,
  isOwnProp,
  kitExports,
  partNames,
  partType,
  propNames,
  propsType,
  stringLiterals,
} from "../../scripts/docs/apiTypes";
import type { ComponentApi } from "../../scripts/docs/componentApi";
import { componentDirs, root, walk } from "./contract-utils";

const apiModules = import.meta.glob<{ api: ComponentApi }>("../{components,layout}/*/api.ts", {
  eager: true,
});

let program: ts.Program;
let checker: ts.TypeChecker;
let exports: Map<string, ts.Symbol>;
/** Runtime label defaults by their labels type name, read from the `const X: XLabels = {…}`. */
const labelDefaults = new Map<string, Map<string, string>>();

beforeAll(() => {
  const sources = walk("src", /\.tsx?$/)
    .filter((file) => !/\.test\.tsx?$|\/examples\/|\/api\.ts$|\.api\.ts$/.test(file))
    .map((file) => `${root}/${file}`);
  program = createKitProgram(root, [...sources, `${root}/src/types/css-modules.d.ts`]);
  checker = program.getTypeChecker();
  exports = kitExports(program, root);
  for (const source of program.getSourceFiles()) {
    if (source.fileName.includes("/node_modules/")) continue;
    const visit = (node: ts.Node) => {
      if (
        ts.isVariableDeclaration(node) &&
        node.type &&
        ts.isTypeReferenceNode(node.type) &&
        /Labels$/.test(node.type.typeName.getText(source)) &&
        node.initializer &&
        ts.isObjectLiteralExpression(node.initializer)
      ) {
        const values = new Map<string, string>();
        for (const property of node.initializer.properties) {
          if (
            ts.isPropertyAssignment(property) &&
            (ts.isStringLiteral(property.initializer) ||
              ts.isNoSubstitutionTemplateLiteral(property.initializer))
          ) {
            values.set(
              property.name.getText(source).replace(/^"|"$/g, ""),
              property.initializer.text,
            );
          }
        }
        labelDefaults.set(node.type.typeName.getText(source), values);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
}, 120_000);

/** The `Omit<…, "a" | "b">` keys of a `…rest` type text. */
const omitKeys = (type: string) => {
  const omit = type.match(/^Omit<.*,\s*((?:"[^"]+"\s*\|?\s*)+)>$/)?.[1] ?? "";
  return [...omit.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
};

/** The literal values of a `"a" | "b"` type text, or `null`. */
const textLiterals = (type: string) =>
  /^\s*"[^"]*"(\s*\|\s*"[^"]*")+\s*$/.test(type)
    ? [...type.matchAll(/"([^"]*)"/g)].map((m) => m[1]).sort()
    : null;

function offendersOf(rel: string, api: ComponentApi): string[] {
  const at = `${rel}/api.ts`;
  const offenders: string[] = [];
  const labelsByPart = new Map<string, Set<string>>();
  for (const part of api.parts) {
    for (const name of partNames(part)) {
      const component = partType(checker, exports, name);
      if (!component) continue; // an unresolvable name is the docs contract's `api-part-names`
      const props = propsType(checker, component);
      if (!props) {
        if (part.props.length > 0) offenders.push(`${at}: ${name} takes no props`);
        continue;
      }
      const tsProps = new Map(
        checker.getPropertiesOfType(props).map((symbol) => [symbol.name, symbol]),
      );
      const documented = new Set(part.props.flatMap((row) => propNames(row.name)));
      for (const row of part.props) {
        if (row.name === "…rest") {
          const forwards = [...tsProps.values()].some((symbol) => !isOwnProp(symbol));
          if (!forwards) offenders.push(`${at}: ${name} …rest, but no native attributes reach it`);
          for (const key of omitKeys(row.type)) {
            const symbol = tsProps.get(key);
            if (symbol && !isOwnProp(symbol)) {
              offenders.push(
                `${at}: ${name} …rest omits "${key}", which still reaches the element`,
              );
            }
          }
          continue;
        }
        for (const propName of propNames(row.name)) {
          const symbol = tsProps.get(propName);
          if (!symbol) {
            offenders.push(`${at}: ${name}.${propName} is not a prop`);
            continue;
          }
          const required = !isOptionalProp(symbol);
          if (required !== Boolean(row.required)) {
            offenders.push(`${at}: ${name}.${propName} required is ${required}`);
          }
          const expected = textLiterals(row.type);
          const declared = stringLiterals(
            checker.getNonNullableType(checker.getTypeOfSymbol(symbol)),
          );
          if (expected && declared && expected.join("|") !== declared.join("|")) {
            offenders.push(
              `${at}: ${name}.${propName} type is ${declared.map((v) => `"${v}"`).join(" | ")}`,
            );
          }
          if (propName === "labels") {
            const labelsType = checker.getNonNullableType(checker.getTypeOfSymbol(symbol));
            labelsByPart.set(
              name,
              new Set(checker.getPropertiesOfType(labelsType).map((item) => item.name)),
            );
          }
        }
      }
      const forwardsDom = [...tsProps.values()].some((symbol) => !isOwnProp(symbol));
      if (forwardsDom && !documented.has("…rest")) {
        offenders.push(`${at}: ${name} forwards native attributes, no …rest row`);
      }
      for (const [propName, symbol] of tsProps) {
        if (propName === "ref" || propName === "key" || !isOwnProp(symbol)) continue;
        if (!documented.has(propName)) offenders.push(`${at}: ${name}.${propName} is undocumented`);
      }
    }
  }

  // Labels: the key belongs to the part that takes it, and the default is the runtime default.
  const root0 = api.parts[0]?.name.split(" · ")[0];
  for (const label of api.labels) {
    const owner = label.part ?? root0;
    const keys = owner ? labelsByPart.get(owner) : undefined;
    if (keys && !keys.has(label.key)) {
      const actual = [...labelsByPart].find(([, set]) => set.has(label.key))?.[0];
      offenders.push(
        `${at}: labels.${label.key} is not a key of ${owner}${actual ? ` (it is ${actual}'s)` : ""}`,
      );
    }
  }
  const documentedKeys = new Set(api.labels.map((label) => label.key));
  for (const [part, keys] of labelsByPart) {
    for (const key of keys) {
      if (!documentedKeys.has(key)) offenders.push(`${at}: ${part} labels.${key} is undocumented`);
    }
  }
  for (const part of api.parts) {
    const row = part.props.find((prop) => prop.name === "labels");
    const typeName = row?.type.match(/^Partial<(\w+)>$/)?.[1];
    const defaults = typeName ? labelDefaults.get(typeName) : undefined;
    if (!defaults) continue;
    for (const label of api.labels) {
      const value = defaults.get(label.key);
      if (value !== undefined && value !== label.default) {
        offenders.push(`${at}: labels.${label.key} default is "${value}" in ${typeName}`);
      }
    }
  }
  return offenders;
}

describe("api.ts matches the TypeScript props", () => {
  it.each(componentDirs())("$rel", ({ base, dir, rel }) => {
    const api = apiModules[`../${base}/${dir}/api.ts`]?.api;
    expect(api, `${rel}/api.ts`).toBeDefined();
    expect(offendersOf(rel, api as ComponentApi), "api-types").toEqual([]);
  });
});

describe("api.ts is the one prose source of a prop", () => {
  it("documented props carry no JSDoc of their own (bundle-lib writes api.ts text into d.ts)", () => {
    const apis = Object.values(apiModules).map((module) => module.api);
    const offenders = new Set<string>();
    for (const { declaration } of documentedProps(program, exports, apis)) {
      if (ts.getJSDocCommentsAndTags(declaration).length === 0) continue;
      const source = declaration.getSourceFile();
      const name = ts.getNameOfDeclaration(declaration)?.getText(source) ?? "?";
      const owner = ts.findAncestor(
        declaration.parent,
        (node) => ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node),
      ) as ts.TypeAliasDeclaration | ts.InterfaceDeclaration | undefined;
      offenders.add(
        `${source.fileName.slice(root.length + 1)}: ${owner ? `${owner.name.text}.` : ""}${name}`,
      );
    }
    expect([...offenders], "api-jsdoc").toEqual([]);
  });
});
