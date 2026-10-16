/**
 * Docs contract: every component dir (from the filesystem) ships a COMPONENT.md, an `api.ts` and
 * examples/ that stay in sync with the playground and import the kit only by its package name, and
 * follows the page standard (`playground/pageStandard.ts`): kind, slots, order, the example file
 * canon and the COMPONENT.md template. A `screen` example (a whole page) keeps the same canon with
 * its own `screen.module.css` and renders a page with one h1.
 *
 * Each guard asserts no offender, named by the guard's id; a deliberate exception is a named
 * allowlist entry with its reason (`DOMAIN_GLYPHS`, `PAINTED_EXAMPLES`), and a
 * test fails once an entry no longer applies.
 */
import fs from "node:fs";
import path from "node:path";

import { render, screen } from "@testing-library/react";
import * as lucide from "lucide-react";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";
import ts from "typescript";
import * as colorPickerEntry from "@/color-picker";
import * as iconSet from "@/icon-set";
import { iconRegistry } from "@/icons/registry";
import * as mainEntry from "@/index";
import {
  type ComponentPageConfig,
  exampleFile,
  exampleLayout,
} from "../../playground/components/ComponentPage";
import {
  KIND_SLOTS,
  kindLayouts,
  PAGE_KINDS,
  requiredSlots,
  SCENARIOS,
  SLOT_IDS,
  type SlotId,
  slotOrder,
} from "../../playground/pageStandard";
import { type ApiPart, applyApiToDoc, type ComponentApi } from "../../scripts/docs/componentApi";
import {
  EVENTS,
  KEPT,
  NATIVE_EVENTS,
  RENAMED,
  SELECTION_MODE_VALUE,
} from "../../scripts/docs/vocabulary";
import { NotificationProvider } from "../components/notification/NotificationStore";
import {
  apiTexts,
  checkLayoutCss,
  checkSourceCanon,
  codeTokens,
  componentDirs,
  docSection,
  jsdocOf,
  layoutCssOffenders,
  overlongApiDescriptions,
  pascal,
  read,
  root,
  sourceCanonOffenders,
  walk,
} from "./contract-utils";

const dirs = componentDirs();

/** Every playground section (`playground/sections/<Pascal>Section.tsx`) by its component dir. */
const sectionsByDir = new Map(
  Object.entries(
    import.meta.glob<{ page?: ComponentPageConfig }>("../../playground/sections/*Section.tsx", {
      eager: true,
    }),
  ).flatMap(([file, module]) =>
    module.page ? [[module.page.dir, { file, page: module.page }]] : [],
  ),
);

const apiModules = import.meta.glob<{ api: ComponentApi }>("../{components,layout}/*/api.ts", {
  eager: true,
});
const apiOf = (base: string, dir: string) => apiModules[`../${base}/${dir}/api.ts`]?.api;

/** The examples of every component, loaded to render the comparison slots. */
const exampleModules = import.meta.glob<{ default: React.ComponentType }>(
  "../{components,layout}/*/examples/*.tsx",
);

/** The `screen` example of every component that has one: a whole page. */
const screenModules = import.meta.glob<{ default: React.ComponentType }>(
  "../{components,layout}/*/examples/screen.tsx",
);

/** The package entries a component's main symbol is exported from. */
const kit = { ...mainEntry, ...colorPickerEntry } as unknown as Record<string, unknown>;

const ALLOWED_IMPORTS =
  /^(prime-ui-kit(\/color-picker)?|react|react-dom|lucide-react|date-fns(\/.*)?|react-router-dom)$/;
const REQUIRED_HEADINGS = ["## When to use", "## Import", "## API", "## Examples"];
const TEMPLATE_HEADINGS = [
  "## When to use",
  "## When not to use",
  "## Import",
  "## Anatomy",
  "## API",
  "## Variants",
  "## States",
  "## Layout & spacing",
  "## Accessibility",
  "## Examples",
  "## Mistakes",
  "## Related",
];
const ACCESSIBILITY_HEADINGS = ["### Keyboard", "### ARIA", "### Labels"];

/**
 * Lucide glyphs examples may still import directly: domain glyphs the kit registry
 * does not carry. Every entry needs a reason; a glyph the registry has never belongs here.
 */
const DOMAIN_GLYPHS: Record<string, string> = {};

/**
 * Components whose examples paint their items: the component draws no item look, its API leaves
 * the look to the consumer's class, so the examples show that class. Their example CSS may paint
 * and their matrices may import it.
 */
const PAINTED_EXAMPLES: Record<string, string> = {
  dnd: "Dnd is the drag mechanism: a row's fill, radius and padding are the consumer's class (Dnd COMPONENT.md)",
};

/** A dir whose main export is not its PascalCase name. */
const MAIN_SYMBOL: Record<string, string> = { notification: "NotificationProvider" };

/** The one CSS module an example may import: a screen lays a whole page out in its own. */
const exampleCss = (stem: string) =>
  stem === "screen" ? "./screen.module.css" : "./examples.module.css";

/** Registry names per lucide glyph a kit glyph is drawn from (aliases share one glyph). */
function registryNamesByGlyph(): Map<unknown, string[]> {
  const byGlyph = new Map<unknown, string[]>();
  for (const [name, { source }] of Object.entries(iconRegistry)) {
    const glyph = (lucide as unknown as Record<string, unknown>)[source];
    byGlyph.set(glyph, [...(byGlyph.get(glyph) ?? []), name]);
  }
  return byGlyph;
}

/** Glyph names imported from `lucide-react` (`X as Y` counts as `X`). */
const lucideImports = (source: string) =>
  [...source.matchAll(/import\s*\{([^}]*)\}\s*from\s*"lucide-react"/g)].flatMap((m) =>
    m[1]
      .split(",")
      .map(
        (part) =>
          part
            .trim()
            .replace(/^type\s+/, "")
            .split(/\s+as\s+/)[0],
      )
      .filter(Boolean),
  );

/** `Button.Root` or `Spinner` resolves to an export of a package entry. */
function resolvesToExport(name: string): boolean {
  const [ns, member] = name.split(".");
  const value = kit[ns];
  if (value === undefined) return false;
  return (
    member === undefined ||
    ((typeof value === "object" || typeof value === "function") &&
      value !== null &&
      member in value)
  );
}

/** A default is a code literal: it parses as a TypeScript expression. */
function parsesAsExpression(code: string): boolean {
  const { diagnostics } = ts.transpileModule(`const _ = (${code});`, {
    reportDiagnostics: true,
    compilerOptions: { jsx: ts.JsxEmit.Preserve },
  });
  return (diagnostics ?? []).length === 0;
}

/** The literal values of a `"a" | "b"` type text. */
const literalValues = (type: string) =>
  /^\s*"[^"]*"(\s*\|\s*"[^"]*")*\s*$/.test(type)
    ? [...type.matchAll(/"([^"]*)"/g)].map((m) => m[1])
    : [];

const ARROWS: Record<string, string> = {
  "↑": "ArrowUp",
  "↓": "ArrowDown",
  "←": "ArrowLeft",
  "→": "ArrowRight",
};

/** The main key of a keyboard token (`Shift + Tab` → `Tab`, `Alt + ↑` → `ArrowUp`). */
function mainKey(token: string): string {
  if (token === "+" || token === "-") return token;
  const parts = token.split(/\s*\+\s*/).filter(Boolean);
  const key = parts[parts.length - 1] ?? token;
  return ARROWS[key] ?? key;
}

/** Whether the tests `source` press `key` (userEvent or fireEvent). */
function pressesKey(source: string, key: string): boolean {
  const esc = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const named = [
    `\\{${esc}[}>]`,
    `\\[${esc}\\]`,
    `key: ["'\`]${esc}["'\`]`,
    `code: ["'\`]${esc}["'\`]`,
  ];
  if (key === "Space") named.push(`key: ["'\`] ["'\`]`, `keyboard\\(["'\`] ["'\`]\\)`);
  if (key === "Tab") named.push(`\\.tab\\(`);
  if (key === "0–9")
    named.push(`key: ["'\`]\\d["'\`]`, `keyboard\\(["'\`]\\d+["'\`]\\)`, `\\.type\\(`);
  if (key === "A–Я") named.push(`key: ["'\`][а-яА-ЯёЁ]["'\`]`, `keyboard\\(["'\`][а-яА-ЯёЁ]`);
  if (/^[A-Z]$/.test(key)) {
    named.push(
      `key: ["'\`]${key.toLowerCase()}["'\`]`,
      `keyboard\\(["'\`][^"'\`]*${key.toLowerCase()}`,
    );
  }
  if (/^\d$/.test(key)) named.push(`keyboard\\(["'\`][^"'\`]*${key}`);
  return named.some((pattern) => new RegExp(pattern).test(source));
}

/** Tests that fake an activation: a `keyDown` and then a `click` on the same target. */
function keyDownThenClick(file: string, source: string): string[] {
  const offenders: string[] = [];
  const blocks = source.split(/\n\s*it(?:\.each\([^)]*\))?\(/).slice(1);
  for (const block of blocks) {
    const title = block.match(/^\s*["'`]([^"'`]+)/)?.[1] ?? "?";
    for (const m of block.matchAll(/fireEvent\.keyDown\(([^,]+),/g)) {
      const target = m[1].trim();
      const after = block.slice((m.index ?? 0) + m[0].length);
      const esc = target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp(`fireEvent\\.click\\(${esc}[,)]`).test(after)) {
        offenders.push(`${file}: ${title}`);
        break;
      }
    }
  }
  return offenders;
}

/** Kit field roots that carry their own `label` / `hint` (a Label or Hint beside them repeats it). */
const FRAMED_FIELDS =
  /<(Input\.Root|Textarea\.Root|Select\.Root|NativeSelect|TagSelect|Datepicker\.Root|DigitInput|ColorField|Slider|FileUpload\.Root|SegmentedControl\.Root|ButtonGroup\.Root|ColorSwatches|Radio\.Group)\b/;

/** The controls a DataTable `toolbar` may hold (SKILL/composition.md, controls of a table). */
const TABLE_TOOLBAR_CONTROL =
  /<(Button\.Root|LinkButton|Input\.Root|Select\.Root|NativeSelect|TagSelect|SegmentedControl\.Root|ButtonGroup\.Root|Datepicker\.Root|Switch\.Root|Checkbox\.Root|Dropdown\.Root|Popover\.Root|DataTableColumnsMenu|SmartFilter\.Toolbar)\b|(\.map\()/g;

/** The `Page.Tools` groups of `body`, with their content. */
const PAGE_TOOLS = /<Page\.Tools\b[^>]*>([\s\S]*?)<\/Page\.Tools>/g;

/** The `toolbar={…}` expressions of the DataTable elements in `body`. */
function dataTableToolbars(body: string): string[] {
  const found: string[] = [];
  for (const m of body.matchAll(/\btoolbar=\{/g)) {
    const start = m.index + m[0].length;
    // DataTable and Gantt take a `toolbar`: the prop is the one of the nearer opening tag.
    const before = body.slice(0, m.index);
    if (before.lastIndexOf("<DataTable") <= before.lastIndexOf("<Gantt")) continue;
    let depth = 1;
    let end = start;
    while (end < body.length && depth > 0) {
      if (body[end] === "{") depth += 1;
      else if (body[end] === "}") depth -= 1;
      end += 1;
    }
    found.push(body.slice(start, end - 1));
  }
  return found;
}

/**
 * Scenarios that break the kit's own rules (CLAUDE.md §2, SKILL/ux.md), as offender ids for the
 * `example-content` guard.
 */
function contentOffenders(dir: string, file: string, source: string): string[] {
  const offenders: string[] = [];
  const body = source.replace(/^\/\*\*.*\*\/\n/, "");
  if (
    /<(Label\.Root|Hint)\b/.test(body) &&
    FRAMED_FIELDS.test(body) &&
    !/(label|hint)\//.test(file)
  ) {
    offenders.push(`${file}: Label / Hint beside a framed field (use its label / hint)`);
  }
  if (/<Card\.(Root|Body)\b/.test(body) && /<Spinner\b/.test(body)) {
    offenders.push(`${file}: Spinner in a Card (a Skeleton holds the shape)`);
  }
  if (dir === "list" && /диалог|чат|печатает/i.test(body)) {
    offenders.push(`${file}: List as conversations (ChatList)`);
  }
  if (["modal", "drawer", "sheet", "popover"].includes(dir)) {
    for (const m of body.matchAll(/<Button\.Root\b[^>]*>/g)) {
      if (/tone="danger"/.test(m[0]) && !/variant="(soft|outline|ghost)"/.test(m[0])) {
        offenders.push(`${file}: solid danger primary in an overlay (ConfirmDialog)`);
        break;
      }
    }
  }
  if (
    FRAMED_FIELDS.test(body) &&
    /<Button\.Root\b[^>]*>\s*(Сохранить|Отправить)/.test(body) &&
    // A kit form part (`LoginForm.Form`) renders the `<form>` itself.
    !/<form\b|<[A-Z]\w*\.Form\b|\bform=/.test(body)
  ) {
    offenders.push(`${file}: fields with a submit and no <form>`);
  }
  // A filter stands next to what it filters: on a page that holds more than its table (tiles in a
  // Page.Grid), the table's search, filter and chooser go to its `toolbar`, not the page's bar.
  if (/<DataTable\b/.test(body) && /<Page\.Grid\b/.test(body)) {
    for (const m of body.matchAll(PAGE_TOOLS)) {
      if (/<(SmartFilter\.Toolbar|DataTableColumnsMenu)\b/.test(m[1])) {
        offenders.push(`${file}: the table's tools in Page.Tools above other blocks (its toolbar)`);
        break;
      }
    }
  }
  // The header chooser stands only over a row-actions column; without one, the table's toolbar or
  // the tools of a page that is the table hold `DataTableColumnsMenu`.
  if (/<DataTable\b[^>]*\scolumnsMenu\b/.test(body) && !/hideHeader:\s*true/.test(body)) {
    offenders.push(`${file}: columnsMenu without a row-actions column (DataTableColumnsMenu)`);
  }
  for (const toolbar of dataTableToolbars(body)) {
    const controls = [...toolbar.matchAll(TABLE_TOOLBAR_CONTROL)].reduce(
      // SmartFilter.Toolbar is a search with filters; a mapped row is several controls.
      (sum, m) => sum + (m[1] === "SmartFilter.Toolbar" || m[1] === ".map(" ? 2 : 1),
      0,
    );
    if (controls < 2) {
      offenders.push(
        `${file}: a DataTable toolbar with ${controls} control(s) (columnsMenu, the page)`,
      );
    }
  }
  for (const m of body.matchAll(
    /<([A-Z]\w*(?:\.\w+)?)\b[^>]*\bsize="(\w+)"[^>]*>([\s\S]*?)<\/\1>/g,
  )) {
    if (new RegExp(`<Button\\.Root\\b[^>]*\\bsize="${m[2]}"`).test(m[3])) {
      offenders.push(`${file}: Button repeats its host's size="${m[2]}"`);
      break;
    }
  }
  return offenders;
}

/** Names a JSDoc gives that the example body never renders or passes. */
function unrenderedNames(file: string, source: string): string[] {
  const jsdoc = jsdocOf(source) ?? "";
  const body = source.replace(/^\/\*\*.*\*\/\n/, "");
  const offenders: string[] = [];
  for (const token of codeTokens(jsdoc)) {
    let found = true;
    if (token.length === 1) continue;
    if (token === "children") {
      // JSX content is the `children` prop: an element of the page's component that holds content.
      const component = pascal(file.split("/").at(-3) ?? "");
      found = new RegExp(`<${component}(\\.\\w+)?\\b[^>]*(?<!/)>\\s*(?!</)\\S`).test(body);
    } else if (/^[A-Z]\w*(\.[A-Z]\w*)?$/.test(token)) {
      found = new RegExp(`\\b${token.replace(".", "\\.")}\\b`).test(body);
    } else if (/^[a-z][\w-]*$/.test(token)) {
      const esc = token.replace(/-/g, "\\-");
      // A prop (`size=`, a bare flag, an object key), a member, or a value (`"s"`).
      found =
        new RegExp(`(^|[\\s{(,])${esc}(=|:|[\\s>/]|\\s*[,}])|\\.${esc}\\b`, "m").test(body) ||
        body.includes(`"${token}"`);
    } else if (/^[a-z][\w-]*=/.test(token)) {
      found = body.includes(token) || body.includes(token.replace(/"/g, "'"));
    }
    if (!found) offenders.push(`${file}: \`${token}\``);
  }
  return offenders;
}

/** A module path of an import in `file`, repository-relative without extension, or `null`. */
function resolveImport(file: string, spec: string): string | null {
  let target: string;
  if (spec.startsWith("@/")) target = `src/${spec.slice(2)}`;
  else if (spec.startsWith("."))
    target = path.posix.normalize(path.posix.join(path.posix.dirname(file), spec));
  else return null;
  for (const candidate of [target, `${target}.tsx`, `${target}.ts`, `${target}/index.ts`]) {
    if (
      fs.existsSync(path.join(root, candidate)) &&
      fs.statSync(path.join(root, candidate)).isFile()
    ) {
      return candidate;
    }
  }
  return null;
}

/** The value imports (not `import type`) of a source file, resolved. */
function valueImports(file: string): string[] {
  return [...read(file).matchAll(/^import (?!type )[^;]*?from "([^"]+)";/gm)]
    .map((m) => resolveImport(file, m[1]))
    .filter((target): target is string => target !== null);
}

/** The runtime sources of a component dir: no tests, examples or api tables. */
const componentSources = (rel: string) =>
  walk(rel, /\.tsx?$/).filter(
    (file) => !/\.test\.tsx?$|\/api\.ts$|\.api\.ts$|\/examples\//.test(file),
  );

/**
 * What a component builds on: the other component dirs it imports and the internal modules and
 * stylesheets it reaches, following `src/internal` and `src/hooks` transitively (a component that
 * renders FieldFrame renders Label and Hint).
 */
function buildsOn(
  rel: string,
  dir: string,
): { components: Set<string>; internals: Set<string>; css: Set<string> } {
  const components = new Set<string>();
  const internals = new Set<string>();
  const css = new Set<string>();
  const seen = new Set<string>();
  const queue = componentSources(rel);
  while (queue.length > 0) {
    const file = queue.pop() as string;
    if (seen.has(file)) continue;
    seen.add(file);
    if (file.endsWith(".css")) {
      css.add(file);
      continue;
    }
    for (const target of valueImports(file)) {
      const component = target.match(/^src\/(?:components|layout)\/([\w-]+)\//)?.[1];
      if (component && component !== dir) {
        components.add(component);
        continue;
      }
      const internal = target.match(/^src\/internal\/(.+?)(\.module\.css|\.tsx?)?$/)?.[1];
      if (internal) internals.add(internal);
      if (
        target.endsWith(".css") ||
        /^src\/(internal|hooks)\//.test(target) ||
        target.startsWith(`${rel}/`)
      ) {
        queue.push(target);
      }
    }
  }
  for (const file of walk(rel, /\.css$/).filter((item) => !item.includes("/examples/")))
    css.add(file);
  return { components, internals, css };
}

/** Every fact COMPONENT.md states by hand that the code can contradict. */
function componentDocOffenders(rel: string, dir: string, doc: string, api: ComponentApi): string[] {
  const offenders: string[] = [];
  const at = `${rel}/COMPONENT.md`;

  // Built from ↔ the components and internal blocks the sources import.
  const related = docSection(doc, "## Related");
  const builtFrom = related.match(/^- \*\*Built from:\*\* (.+)$/m)?.[1] ?? "";
  const linked = new Set(
    [
      ...builtFrom.matchAll(/\]\((?:\.\.\/)+(?:components\/|layout\/)?([\w-]+)\/COMPONENT\.md\)/g),
    ].map((m) => m[1]),
  );
  const builds = buildsOn(rel, dir);
  const imported = builds.components;
  for (const name of imported) {
    if (!linked.has(name)) offenders.push(`${at}: Built from misses ${name}`);
  }
  for (const name of linked) {
    if (!imported.has(name)) offenders.push(`${at}: Built from links ${name}, not imported`);
  }
  const internals = builds.internals;
  for (const m of builtFrom.matchAll(/`internal\/([\w./-]+)`/g)) {
    if (!internals.has(m[1]))
      offenders.push(`${at}: Built from names internal/${m[1]}, not imported`);
  }

  // Anatomy names resolve to exports.
  const anatomy = docSection(doc, "## Anatomy").match(/```[\s\S]*?```/)?.[0] ?? "";
  for (const m of new Set(anatomy.match(/\b[A-Z]\w*\.[A-Z]\w*\b/g) ?? [])) {
    if (!resolvesToExport(m)) offenders.push(`${at}: Anatomy names ${m}, not exported`);
  }

  // Every boolean prop of the root has a Variants / Flags row; a "yes" row is the default.
  const variants = docSection(doc, "## Variants");
  const rootPart: ApiPart | undefined = api.parts[0];
  for (const prop of rootPart?.props ?? []) {
    const states = docSection(doc, "## States");
    if (
      prop.type === "boolean" &&
      !variants.includes(`\`${prop.name}\``) &&
      !states.includes(`\`${prop.name}\``)
    ) {
      offenders.push(`${at}: neither Variants nor States has \`${prop.name}\``);
    }
    const literal = prop.default?.match(/^"([^"]*)"$/)?.[1];
    if (!literal) continue;
    const table = docSection(variants.replace(/^/, "\n"), `### ${prop.name}`);
    const yes = table.match(/^\| (.+?) \|.*\| yes\b[^|]*\|$/m)?.[1];
    if (table && yes && !yes.includes(`\`${literal}\``)) {
      offenders.push(`${at}: Variants marks ${yes} default, api.ts says "${literal}"`);
    }
  }

  // Tokens named in Layout & spacing and States are in the component's CSS.
  const css = [...builds.css].map(read).join("\n");
  const code = walk(rel, /\.tsx?$/)
    .filter((file) => !/\.test\.|\/examples\//.test(file))
    .map(read)
    .join("\n");
  const prose = `${docSection(doc, "## Layout & spacing")}\n${docSection(doc, "## States")}`;
  for (const token of new Set(prose.match(/--prime-[\w-]+[\w]/g) ?? [])) {
    if (!css.includes(token) && !code.includes(token)) {
      offenders.push(`${at}: names ${token}, not in its CSS`);
    }
  }

  // A width threshold in prose is a breakpoint of the scale or a container query of the CSS.
  const text = doc.replace(/^```[\s\S]*?^```$/gm, "").replace(docSection(doc, "## API"), "");
  for (const m of text.matchAll(
    /\b(?:below|above|under|over|narrower than|wider than|less than|more than|from|up to)\s+(\d{3,4})\s?px\b/gi,
  )) {
    const px = Number(m[1]);
    const media = [px, px - 1].some((value) => css.includes(`${value}px)`));
    const container = css.includes(`${px / 16}rem`) || css.includes(`${px}px`);
    const scale = [640, 768, 1024, 1280].includes(px);
    if (!((scale && media) || container)) offenders.push(`${at}: threshold ${px}px`);
  }
  return offenders;
}

/** Layer-stack overlays: a component whose sources open a layer of the one stack. */
function opensLayer(rel: string): boolean {
  return walk(rel, /\.tsx?$/)
    .filter((file) => !/\.test\.|\/examples\//.test(file))
    .some((file) => /\buse(Layer|FloatingLayer|ModalLayer)\(/.test(read(file)));
}

/** Tooltip closes on its own terms (WCAG 1.4.13); Notification is a live region outside the stack. */
const DISMISS_EXEMPT = new Set(["tooltip", "notification"]);

/** Every API rule the code can check, as offender ids under `${rel}/api.ts`. */
function apiOffenders(rel: string, api: ComponentApi): Record<string, string[]> {
  const at = `${rel}/api.ts`;
  const out: Record<string, string[]> = {
    enRu: [],
    defaults: [],
    partNames: [],
    triads: [],
    support: [],
    slotClassName: [],
    refLine: [],
    vocabulary: [],
  };
  for (const { where, text } of apiTexts(api)) {
    if (codeTokens(text.en).join("\n") !== codeTokens(text.ru).join("\n")) {
      out.enRu.push(`${at}: ${where}`);
    }
  }
  for (const part of api.parts) {
    const names = part.name.split(" · ");
    for (const name of names) {
      if (!/^[A-Z]\w*(\.[A-Z]\w*)?$/.test(name) || !resolvesToExport(name)) {
        out.partNames.push(`${at}: ${name}`);
      }
      if (RENAMED.parts[name]) out.vocabulary.push(`${at}: ${name} → ${RENAMED.parts[name]}`);
    }
    if (
      !/^(`ref` → |Generic `[^`]+`; `ref` → |No DOM|No ref)/.test(part.en) &&
      names.every((name) => resolvesToExport(name))
    ) {
      out.refLine.push(`${at}: ${part.name}`);
    }
    const props = new Map(part.props.map((prop) => [prop.name, prop]));
    for (const prop of part.props) {
      const where = `${part.name}.${prop.name}`;
      if (prop.default !== undefined) {
        expect(
          prop.default,
          `${at}: ${where} default holds a backtick — use defaultNote`,
        ).not.toContain("`");
        if (!parsesAsExpression(prop.default)) out.defaults.push(`${at}: ${where}`);
      }
      const triad = prop.name.match(/^default([A-Z]\w*)$/);
      if (triad) {
        const state = triad[1].charAt(0).toLowerCase() + triad[1].slice(1);
        for (const name of [state, `on${triad[1]}Change`]) {
          if (!props.has(name)) out.triads.push(`${at}: ${where} without ${name}`);
        }
      }
      if (prop.name === "error" && !props.has("hint")) out.support.push(`${at}: ${where}`);
      const renamed = RENAMED.props[where] ?? RENAMED.props[`*.${prop.name}`];
      if (renamed && prop.name !== "…rest" && !KEPT[where]) {
        out.vocabulary.push(`${at}: ${where} → ${renamed}`);
      }
      if (literalValues(prop.type).includes(SELECTION_MODE_VALUE)) {
        out.vocabulary.push(`${at}: ${where} → \`multiple?: boolean\` (one vs many is a flag)`);
      }
      if (/^on[A-Z]/.test(prop.name)) {
        for (const event of prop.name.split(" · ")) {
          if (!/^on\w+Change$/.test(event) && !EVENTS.has(event) && !NATIVE_EVENTS.has(event)) {
            out.vocabulary.push(`${at}: ${part.name}.${event} (not in the event vocabulary)`);
          }
        }
      }
      if (["tone", "status", "variant"].includes(prop.name)) {
        for (const value of literalValues(prop.type)) {
          if (RENAMED.values[value]) {
            out.vocabulary.push(`${at}: ${where} "${value}" → ${RENAMED.values[value]}`);
          }
        }
      }
    }
    if (/^No DOM/.test(part.en) && (props.has("className") || props.has("…rest"))) {
      out.slotClassName.push(`${at}: ${part.name}`);
    }
  }
  for (const label of api.labels) {
    if (label.part) {
      expect(
        api.parts.some((part) => part.name.split(" · ").includes(label.part as string)),
        `${at}: labels.${label.key} names part ${label.part}, which api.ts does not have`,
      ).toBe(true);
    }
  }
  return out;
}

describe("docs contract", () => {
  it("covers every component dir: a page, an api.ts and an exported main symbol", () => {
    const pages = [...sectionsByDir.keys()].sort();
    expect(pages).toEqual(dirs.map(({ dir }) => dir).sort());
    expect(Object.keys(apiModules)).toHaveLength(dirs.length);
    const missing = dirs
      .filter(({ dir }) => !((MAIN_SYMBOL[dir] ?? pascal(dir)) in kit))
      .map(({ rel }) => rel);
    expect(missing, "main symbol not exported from a package entry").toEqual([]);
  });

  it("keeps PAINTED_EXAMPLES to components whose examples paint", () => {
    for (const dir of Object.keys(PAINTED_EXAMPLES)) {
      const rel = dirs.find((item) => item.dir === dir)?.rel;
      expect(rel, dir).toBeDefined();
      const painted = walk(`${rel}/examples`, /\.css$/).flatMap((file) =>
        layoutCssOffenders(file, read(file)),
      );
      expect(painted.length, `${dir}: its examples no longer paint — remove it`).toBeGreaterThan(0);
    }
  });

  it("gives every layer-stack overlay the dismiss props", () => {
    const offenders: string[] = [];
    for (const { base, dir, rel } of dirs) {
      if (DISMISS_EXEMPT.has(dir) || !opensLayer(rel)) continue;
      const api = apiOf(base, dir);
      for (const prop of ["closeOnOutsideClick", "closeOnEscape"]) {
        if (!api?.parts.some((part) => part.props.some((item) => item.name === prop))) {
          offenders.push(`${rel}/api.ts: ${prop}`);
        }
      }
    }
    expect(offenders, "dismiss-props").toEqual([]);
  });

  describe.each(dirs)("$rel", ({ base, dir, rel }) => {
    const docPath = `${rel}/COMPONENT.md`;
    const examples = walk(`${rel}/examples`, /\.tsx$/);

    it("has COMPONENT.md and examples/", () => {
      expect(fs.existsSync(path.join(root, docPath)), docPath).toBe(true);
      expect(examples.length, `${rel}/examples`).toBeGreaterThan(0);
    });

    it("COMPONENT.md has the required sections and the playground category", () => {
      const doc = read(docPath);
      expect(doc).toMatch(/^# \S/);
      for (const heading of REQUIRED_HEADINGS) {
        expect(doc, `${docPath}: ${heading}`).toMatch(new RegExp(`^${heading}$`, "m"));
      }
      const category = sectionsByDir.get(dir)?.page.category;
      expect(category, `${dir} has no playground section with a category`).toBeDefined();
      expect(doc).toMatch(new RegExp(`^\\*\\*Category:\\*\\* ${category}$`, "m"));
      expect(doc).not.toMatch(/--prime-ref-/);
    });

    it.each(examples.map((file) => path.posix.basename(file)))("examples/%s", (name) => {
      const file = `${rel}/examples/${name}`;
      const source = read(file);
      const stem = name.replace(/\.tsx$/, "");

      expect(read(docPath), `${file} is not listed in COMPONENT.md`).toContain(`examples/${name}`);
      checkSourceCanon(
        file,
        source,
        (spec) => ALLOWED_IMPORTS.test(spec) || spec === exampleCss(stem),
      );
      expect(source.match(/^export default function \w+Example\(/gm)?.length).toBe(1);
      expect(source, `${file}: function name`).toMatch(
        new RegExp(`^export default function ${pascal(dir)}${pascal(stem)}Example\\(\\)`, "m"),
      );
    });

    it("examples follow the rest of the canon (example-canon)", () => {
      expect(
        examples.flatMap((file) => sourceCanonOffenders(file, read(file))),
        "example-canon",
      ).toEqual([]);
    });

    it("examples render what their JSDoc names (example-names)", () => {
      expect(
        examples.flatMap((file) => unrenderedNames(file, read(file))),
        "example-names",
      ).toEqual([]);
    });

    it("examples obey the kit's own rules (example-content)", () => {
      expect(
        examples.flatMap((file) => contentOffenders(dir, file, read(file))),
        "example-content",
      ).toEqual([]);
    });

    it("example styles use semantic tokens only", () => {
      for (const file of walk(`${rel}/examples`, /\.css$/)) {
        // A screen lays out a page on the panel: surfaces and text color come from the kit.
        const forbidden = file.endsWith("/screen.module.css")
          ? ["color", "background(-color)?"]
          : [];
        checkLayoutCss(file, read(file), forbidden);
      }
    });

    it("example styles only place things (example-css)", () => {
      const offenders = PAINTED_EXAMPLES[dir]
        ? []
        : walk(`${rel}/examples`, /\.css$/).flatMap((file) => layoutCssOffenders(file, read(file)));
      // The root of an example is never a pure flex stack: the slot's preview layout stacks.
      const cssPath = `${rel}/examples/examples.module.css`;
      if (fs.existsSync(path.join(root, cssPath))) {
        const css = read(cssPath);
        for (const file of examples.filter((item) => !item.endsWith("/screen.tsx"))) {
          const source = read(file);
          const rootClass = source.match(
            /return \(\s*<[\w.]+[^>]*className=\{styles\.(\w+)\}/,
          )?.[1];
          if (!rootClass) continue;
          const rule = css.match(new RegExp(`\\.${rootClass}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
          const props = [...rule.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
          const stack =
            props.length > 0 &&
            props.every((prop) => /^(display|flex-direction|gap|align-items|row-gap)$/.test(prop));
          if (stack && /display:\s*flex/.test(rule) && /flex-direction:\s*column/.test(rule)) {
            offenders.push(`${file}: root .${rootClass} is a flex stack`);
          }
        }
      }
      expect(offenders, "example-css").toEqual([]);
    });

    const screenModule = screenModules[`../${base}/${dir}/examples/screen.tsx`];
    it.runIf(screenModule)("the screen renders a page with one h1", async () => {
      const { default: Screen } = await screenModule();
      render(React.createElement(NotificationProvider, null, React.createElement(Screen)));
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    });

    it.runIf(screenModule)("the screen titles itself in one place", () => {
      const file = `${rel}/examples/screen.tsx`;
      const source = read(file);
      // One page, one title: a screen writes exactly one Page.Title (in its top bar or in the
      // flow) and no other h1.
      expect(
        source.split("<Page.Title").length - 1,
        `${file}: Page.Title written ${source.split("<Page.Title").length - 1} times — one title per screen`,
      ).toBe(1);
      expect(
        /<h1\b|as="h1"/.test(source),
        `${file}: an h1 outside Page.Title — the page title is Page.Title`,
      ).toBe(false);
    });

    describe("page standard", () => {
      let page: ComponentPageConfig;
      const api = apiOf(base, dir) as ComponentApi;

      beforeAll(() => {
        const section = sectionsByDir.get(dir);
        expect(
          section,
          `playground/sections/${pascal(dir)}Section.tsx exports no page`,
        ).toBeDefined();
        expect(section?.file).toBe(`../../playground/sections/${pascal(dir)}Section.tsx`);
        page = section?.page as ComponentPageConfig;
      });

      it("page config matches the dir and declares a kind", () => {
        expect(page.dir).toBe(dir);
        expect(page.base ?? "components").toBe(base);
        expect(PAGE_KINDS).toContain(page.kind);
        expect(read(docPath)).toMatch(new RegExp(`^\\*\\*Kind:\\*\\* ${page.kind}$`, "m"));
      });

      it("lists every example file exactly once", () => {
        const listed = page.examples.map(exampleFile);
        expect(new Set(listed).size, "duplicate example").toBe(listed.length);
        const files = examples.map((file) => path.posix.basename(file, ".tsx")).sort();
        expect([...listed].sort()).toEqual(files);
      });

      it("uses the kind's slots, in order, with every required slot", () => {
        const allowed = KIND_SLOTS[page.kind].map((entry) => entry.slot);
        const slots: SlotId[] = [];
        let previous = -1;
        for (const example of page.examples) {
          const slot = "slot" in example ? example.slot : null;
          if (slot) {
            expect(allowed, `${slot} is not a ${page.kind} slot`).toContain(slot);
            slots.push(slot);
          } else {
            const name = exampleFile(example);
            expect(allowed, `${page.kind} pages take no scenarios`).toContain(SCENARIOS);
            expect(SLOT_IDS as readonly string[], `${name} must use the slot`).not.toContain(name);
            expect(name).toMatch(/^[a-z]+(-[a-z]+)*$/);
            const layout = "layout" in example ? example.layout : undefined;
            if (layout) {
              expect(
                kindLayouts(page.kind),
                `${name}: layout not used by ${page.kind} pages`,
              ).toContain(layout);
            }
          }
          const order = slotOrder(page.kind, slot);
          expect(order, `${exampleFile(example)} is out of slot order`).toBeGreaterThanOrEqual(
            previous,
          );
          previous = order;
          expect(example.description, `${exampleFile(example)}: description`).toMatch(/\.$/);
        }
        const missing = requiredSlots(page.kind, page.api.parts[0])
          .filter(({ slot }) => !slots.includes(slot))
          .map(
            ({ slot, by }) =>
              `${rel}/examples: ${slot} (by ${by === "kind" ? `the ${page.kind} kind` : `\`${by}\``})`,
          );
        expect(missing, "required-slots").toEqual([]);
      });

      it("the kind allows every slot the root API requires", () => {
        const allowed = KIND_SLOTS[page.kind].map((entry) => entry.slot);
        const conflicts = requiredSlots(page.kind, page.api.parts[0])
          .filter(({ slot }) => !allowed.includes(slot))
          .map(({ slot, by }) => `\`${by}\` requires "${slot}"`);
        expect(
          conflicts,
          `the root API requires slots a ${page.kind} page does not allow — add them to KIND_SLOTS.${page.kind} in playground/pageStandard.ts or pick another kind`,
        ).toEqual([]);
      });

      it("a slot required by a prop names the prop in its JSDoc (slot-prop)", () => {
        const offenders: string[] = [];
        for (const { slot, by, shownBy } of requiredSlots(page.kind, page.api.parts[0])) {
          if (by === "kind") continue;
          const example = page.examples.find((item) => "slot" in item && item.slot === slot);
          if (!example) continue;
          const file = `${rel}/examples/${slot}.tsx`;
          const tokens = codeTokens(jsdocOf(read(file)) ?? "");
          const named = tokens.some((token) =>
            shownBy.some((prop) => token === prop || token.startsWith(`${prop}=`)),
          );
          if (!named) {
            const props = shownBy.map((prop) => `\`${prop}\``);
            offenders.push(
              `${file}: names ${props.length === 1 ? "no" : "none of"} ${props.join(", ")}`,
            );
          }
        }
        expect(offenders, "slot-prop").toEqual([]);
      });

      it("matrix examples bring no CSS: the preview layout lines the cells up (matrix-css)", () => {
        const offenders: string[] = [];
        for (const example of page.examples) {
          if (!exampleLayout(page.kind, example).startsWith("matrix")) continue;
          const file = `${rel}/examples/${exampleFile(example)}.tsx`;
          if (read(file).includes("examples.module.css") && !PAINTED_EXAMPLES[dir]) {
            offenders.push(`${file}: imports CSS`);
          }
        }
        expect(offenders, "matrix-css").toEqual([]);
      });

      it("matrix examples are rows of labelled cells (matrix-cells)", async () => {
        const offenders: string[] = [];
        for (const example of page.examples) {
          if (!exampleLayout(page.kind, example).startsWith("matrix")) continue;
          const stem = exampleFile(example);
          const file = `${rel}/examples/${stem}.tsx`;
          const load = exampleModules[`../${base}/${dir}/examples/${stem}.tsx`];
          const { default: Example } = await load();
          const { container, unmount } = render(
            React.createElement(
              MemoryRouter,
              null,
              React.createElement(NotificationProvider, null, React.createElement(Example)),
            ),
          );
          const rows = Array.from(container.children);
          const bad = rows.some(
            (row) =>
              row.tagName !== "DIV" ||
              row.children.length === 0 ||
              Array.from(row.children).some(
                (cell) => cell.tagName !== "DIV" || (cell.textContent ?? "").trim() === "",
              ),
          );
          if (rows.length === 0 || bad) offenders.push(`${file}: not rows of labelled cells`);
          unmount();
        }
        expect(offenders, "matrix-cells").toEqual([]);
      }, 30_000);

      it("examples show every value of variant, tone and color (variant-values)", () => {
        const source = examples.map(read).join("\n");
        const offenders: string[] = [];
        for (const prop of page.api.parts[0]?.props ?? []) {
          if (!["variant", "tone", "color"].includes(prop.name)) continue;
          for (const value of literalValues(prop.type)) {
            if (!source.includes(`"${value}"`))
              offenders.push(`${rel}/examples: ${prop.name}="${value}"`);
          }
        }
        expect(offenders, "variant-values").toEqual([]);
      });

      it("example descriptions name the same props as the example JSDoc", () => {
        for (const example of page.examples) {
          const file = `${rel}/examples/${exampleFile(example)}.tsx`;
          const jsdoc = jsdocOf(read(file)) ?? "";
          expect(codeTokens(example.description), file).toEqual(codeTokens(jsdoc));
        }
      });

      it("COMPONENT.md follows the template", () => {
        const doc = read(docPath);
        expect(doc.match(/^## .+$/gm)).toEqual(TEMPLATE_HEADINGS);
        const a11y = docSection(doc, "## Accessibility");
        expect(a11y.match(/^### .+$/gm)).toEqual(ACCESSIBILITY_HEADINGS);
        expect(docSection(doc, "## Related")).toMatch(/^- \*\*Built from:\*\* .+$/m);
        expect(docSection(doc, "## Related")).toMatch(/^- \*\*See also:\*\* .+$/m);
      });

      it("COMPONENT.md API, Keyboard, ARIA and Labels are generated from api.ts (bun run docs:build)", () => {
        expect(api, `${rel}/api.ts`).toBeDefined();
        expect(page.api, `${pascal(dir)}Section must pass the api from api.ts`).toBe(api);
        const doc = read(docPath);
        expect(doc === applyApiToDoc(doc, api), `${docPath} is stale: run bun run docs:build`).toBe(
          true,
        );
      });

      it("COMPONENT.md states only what the code does (component-md)", () => {
        expect(componentDocOffenders(rel, dir, read(docPath), api), "component-md").toEqual([]);
      });

      it("api.ts descriptions are short summaries (details live in COMPONENT.md)", () => {
        expect(overlongApiDescriptions(api), `${rel}/api.ts`).toEqual([]);
      });

      it("api.ts follows the API rules", () => {
        const out = apiOffenders(rel, api);
        expect(out.enRu, "api-en-ru").toEqual([]);
        expect(out.defaults, "api-default-literal").toEqual([]);
        expect(out.partNames, "api-part-names").toEqual([]);
        expect(out.triads, "api-triads").toEqual([]);
        expect(out.support, "api-error-support").toEqual([]);
        expect(out.slotClassName, "api-slot-classname").toEqual([]);
        expect(out.refLine, "api-ref-line").toEqual([]);
        expect(out.vocabulary, "vocabulary").toEqual([]);
      });

      it("every documented key is pressed in the component's tests (keyboard-tests)", () => {
        const tests = walk(rel, /\.test\.tsx?$/)
          .map(read)
          .join("\n");
        const offenders: string[] = [];
        for (const row of api.accessibility.keyboard) {
          if (row.native) continue;
          for (const token of row.keys.split(" · ")) {
            if (!pressesKey(tests, mainKey(token)))
              offenders.push(`${rel}/api.ts: keyboard ${row.keys} — ${token}`);
          }
        }
        expect(offenders, "keyboard-tests").toEqual([]);
      });

      it("tests never fake an activation with keyDown + click (keydown-click)", () => {
        expect(
          walk(rel, /\.test\.tsx?$/).flatMap((file) => keyDownThenClick(file, read(file))),
          "keydown-click",
        ).toEqual([]);
      });

      it("COMPONENT.md lists the examples in page order with their JSDoc", () => {
        const section = docSection(read(docPath), "## Examples");
        expect(section).toContain("| Example | Shows |");
        const rows = [
          ...section.matchAll(/^\| \[([\w-]+)\.tsx\]\(examples\/\1\.tsx\) \| (.+) \|$/gm),
        ];
        expect(rows.map((m) => m[1])).toEqual(page.examples.map(exampleFile));
        for (const [, stem, shows] of rows) {
          expect(shows, `${stem}.tsx`).toBe(jsdocOf(read(`${rel}/examples/${stem}.tsx`)));
        }
      });
    });
  });
});

describe("vocabulary exceptions", () => {
  it("every kept name is a documented prop", () => {
    const documented = new Set(
      dirs.flatMap(({ base, dir }) =>
        (apiOf(base, dir)?.parts ?? []).flatMap((part) =>
          part.name
            .split(" · ")
            .flatMap((name) => part.props.map((prop) => `${name}.${prop.name}`)),
        ),
      ),
    );
    expect(Object.keys(KEPT).filter((where) => !documented.has(where))).toEqual([]);
  });
});

describe("kit icons first", () => {
  const byGlyph = registryNamesByGlyph();
  const glyphs = lucide as unknown as Record<string, unknown>;
  /** Examples (screens included) and the code in SKILL docs: everything a consumer copies. */
  const sources = [
    ...dirs.flatMap(({ rel }) => walk(`${rel}/examples`, /\.tsx$/)),
    ...walk("SKILL", /\.(tsx|md)$/),
  ];

  it("reads the registry", () => {
    expect(byGlyph.size).toBeGreaterThan(40);
  });

  /** Code of a source: the whole file, or the ```tsx blocks of a markdown doc without the deliberate
   * `// bad` part of a bad / good pair. */
  const code = (file: string) =>
    file.endsWith(".md")
      ? [...read(file).matchAll(/^```tsx[^\n]*\n([\s\S]*?)^```$/gm)]
          .map((m) => m[1].replace(/^\/\/ bad\b[\s\S]*?(?=^\/\/ good\b|(?![\s\S]))/gm, ""))
          .join("\n")
      : read(file);

  it.each(sources)("%s takes glyphs from the kit registry", (file) => {
    for (const name of lucideImports(code(file))) {
      const glyph = glyphs[name];
      expect(glyph, `${file}: "${name}" is not a lucide-react export`).toBeDefined();
      const registered = byGlyph.get(glyph);
      expect(
        registered,
        `${file}: use <Icon name="${registered?.[0]}" /> instead of lucide "${name}"`,
      ).toBeUndefined();
      const inSet = Object.entries(iconSet).find(
        ([, value]) =>
          typeof value === "function" &&
          "source" in value &&
          glyphs[value.source as string] === glyph,
      );
      expect(
        inSet,
        `${file}: use ${inSet?.[0]} from "prime-ui-kit/icons" instead of lucide "${name}"`,
      ).toBeUndefined();
      expect(
        DOMAIN_GLYPHS[name],
        `${file}: lucide "${name}" — add it to the registry (src/icons) or, for a domain glyph, to DOMAIN_GLYPHS with a reason`,
      ).toBeDefined();
    }
  });

  it("allows only domain glyphs that are still used and absent from the registry", () => {
    const used = new Set(sources.flatMap((file) => lucideImports(code(file))));
    for (const name of Object.keys(DOMAIN_GLYPHS)) {
      expect(used.has(name), `DOMAIN_GLYPHS.${name} is unused — remove it`).toBe(true);
      expect(byGlyph.has(glyphs[name]), `DOMAIN_GLYPHS.${name} is in the registry`).toBe(false);
    }
  });
});
