/**
 * Single source of a component's API prose: `src/<base>/<dir>/api.ts` exports a `ComponentApi`.
 * The structure it names (parts, props, `required`, `…rest`, label keys and defaults) is checked
 * against the TypeScript code by `src/test/api-types.test.ts`; every description is written in
 * both languages side by side — `en` for COMPONENT.md, `ru` for the playground page — and both
 * name the same code tokens.
 *
 * `bun run docs:build` renders the `## API` section and the `### Keyboard`, `### ARIA` and
 * `### Labels` subsections of COMPONENT.md from it (`applyApiToDoc`); the playground's
 * `ComponentPage` renders its tables from the same object. The docs contract test fails when the
 * markdown differs from what `api.ts` renders.
 */

/** A description in both languages; both name the same code tokens. */
export type ApiText = {
  en: string;
  ru: string;
};

export type ApiProp = ApiText & {
  /** Prop name as written in JSX; `…rest` for the forwarded native attributes. */
  name: string;
  /** TypeScript type as text, e.g. `"solid" | "soft"`. */
  type: string;
  /** Default as a code literal (`"m"`, `false`, `360`), never prose and never a backtick. */
  default?: string;
  /** A default that is not a literal (the host tier, a computed value), as prose. */
  defaultNote?: ApiText;
  required?: boolean;
};

export type ApiPart = ApiText & {
  /** `Button.Root`, `Spinner`, `Modal.Title · Modal.Description`… */
  name: string;
  props: ApiProp[];
};

export type ApiLabel = ApiText & {
  key: string;
  /** Russian default text (without quotes): the runtime default, through `labelRows`. */
  default: string;
  /** The part whose `labels` prop takes the key; the root (first part) when omitted. */
  part?: string;
};

/** A row of the keyboard table: the keys as written (`Enter · Space`) and what they do. */
export type ApiKeyboardRow = ApiText & {
  keys: string;
  /**
   * The browser handles the keys (a native `<button>`, `<input>`, Tab order): the component's
   * tests need not press them.
   */
  native?: boolean;
};

export type ApiAccessibility = {
  keyboard: ApiKeyboardRow[];
  aria: ApiText[];
};

/** An exported data type of the component (a row shape, a bar, an option). */
export type ApiType = ApiText & {
  /** The exported type name, `DataTableColumn<Row>`. */
  name: string;
  fields: ApiProp[];
};

/** An exported function or hook of the component. */
export type ApiFunction = ApiText & {
  /** The call as written, `getWaveform(source, count)`. */
  name: string;
  /** TypeScript signature as text. */
  type: string;
};

export type ComponentApi = {
  /** The first part is the root (or the leaf itself); its props drive required page slots. */
  parts: ApiPart[];
  /** Exported data types; omitted when the component exports none worth a table. */
  types?: ApiType[];
  /** Exported functions and hooks. */
  functions?: ApiFunction[];
  /** Every key of the component's `labels` props, each on its part; empty when it has none. */
  labels: ApiLabel[];
  accessibility: ApiAccessibility;
};

/**
 * The descriptions of every key of a labels type, each with the part that takes it: the second
 * argument of `labelRows`, and the shared descriptions a donor's `*.api.ts` exports for the keys
 * it brings (`LabelDocs<TransferLabels>`).
 */
export type LabelDocs<Labels> = { [Key in keyof Labels]: ApiText & { part?: string } };

/**
 * Label rows from the runtime defaults: `labelRows(BUTTON_LABELS, { holdHint: { en, ru } })`.
 * TypeScript requires a description for every key, and the default text comes from the code. A
 * key that holds a record of strings (a name per palette colour) shows its values joined by ` · `.
 */
export function labelRows<
  Defaults extends Record<string, string | Readonly<Record<string, string>>>,
>(defaults: Defaults, docs: LabelDocs<Defaults>): ApiLabel[] {
  return Object.keys(defaults).map((key) => {
    const value = defaults[key];
    return {
      key,
      default: typeof value === "string" ? value : Object.values(value).join(" · "),
      ...docs[key],
    };
  });
}

export const GENERATED_NOTE =
  "<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->";

const cell = (text: string) => text.replaceAll("|", "\\|");

/** Inline code with a fence longer than any backtick run inside. */
export function code(text: string): string {
  const longest = Math.max(0, ...[...text.matchAll(/`+/g)].map((m) => m[0].length));
  const fence = "`".repeat(longest + 1);
  const pad = text.startsWith("`") || text.endsWith("`") ? " " : "";
  return `${fence}${pad}${cell(text)}${pad}${fence}`;
}

function renderDefault(prop: ApiProp): string {
  if (prop.default !== undefined) return code(prop.default);
  if (prop.defaultNote) return cell(prop.defaultNote.en);
  return prop.required ? "— (required)" : "—";
}

function propTable(props: ApiProp[], first = "Prop"): string[] {
  return [
    "",
    `| ${first} | Type | Default | Description |`,
    "|---|---|---|---|",
    ...props.map(
      (prop) =>
        `| ${code(prop.name)} | ${code(prop.type)} | ${renderDefault(prop)} | ${cell(prop.en)} |`,
    ),
  ];
}

/** Body of `## API` (everything after the heading line, up to the next `## `). */
export function renderApiSection(api: ComponentApi): string {
  const blocks = api.parts.map((part) => {
    const lines = [`### ${part.name}`, part.en];
    if (part.props.length > 0) lines.push(...propTable(part.props));
    return lines.join("\n");
  });
  if (api.types?.length) {
    blocks.push(
      [
        "### Types",
        ...api.types.map((type) =>
          [
            "",
            `#### ${code(type.name)}`,
            type.en,
            ...(type.fields.length ? propTable(type.fields, "Field") : []),
          ].join("\n"),
        ),
      ].join("\n"),
    );
  }
  if (api.functions?.length) {
    blocks.push(
      [
        "### Functions",
        ...api.functions.map((fn) =>
          ["", `#### ${code(fn.name)}`, code(fn.type), "", fn.en].join("\n"),
        ),
      ].join("\n"),
    );
  }
  return `\n${GENERATED_NOTE}\n\n${blocks.join("\n\n")}\n\n`;
}

/** Body of `### Keyboard`. */
export function renderKeyboardSection(api: ComponentApi): string {
  const { keyboard } = api.accessibility;
  if (keyboard.length === 0) return `${GENERATED_NOTE}\n\nNo keyboard interaction.\n\n`;
  const rows = keyboard.map(
    (row) =>
      `| ${row.keys
        .split(" · ")
        .map((key) => code(key))
        .join(" · ")} | ${cell(row.en)} |`,
  );
  return `${GENERATED_NOTE}\n\n| Key | Action |\n|---|---|\n${rows.join("\n")}\n\n`;
}

/** Body of `### ARIA`. */
export function renderAriaSection(api: ComponentApi): string {
  const lines = api.accessibility.aria.map((line) => `- ${line.en}`);
  return `${GENERATED_NOTE}\n\n${lines.join("\n")}\n\n`;
}

/** The labels of `api` by the part that takes them, in part order (the root first). */
export function labelsByPart(api: ComponentApi): { part: string; labels: ApiLabel[] }[] {
  const root = api.parts[0]?.name ?? "";
  const groups = new Map<string, ApiLabel[]>();
  for (const label of api.labels) {
    const part = label.part ?? root;
    groups.set(part, [...(groups.get(part) ?? []), label]);
  }
  const order = api.parts.map((part) => part.name);
  return [...groups]
    .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
    .map(([part, labels]) => ({ part, labels }));
}

/** Body of `### Labels` inside `## Accessibility` (up to the next `## `). */
export function renderLabelsSection(api: ComponentApi): string {
  if (api.labels.length === 0) return `${GENERATED_NOTE}\n\nNo \`labels\`.\n\n`;
  const table = (labels: ApiLabel[]) =>
    [
      "| Key | Default | Used for |",
      "|---|---|---|",
      ...labels.map(
        (label) => `| ${code(label.key)} | ${code(`"${label.default}"`)} | ${cell(label.en)} |`,
      ),
    ].join("\n");
  const groups = labelsByPart(api);
  const body =
    groups.length === 1 && groups[0].part === api.parts[0]?.name
      ? table(groups[0].labels)
      : groups.map(({ part, labels }) => `#### ${part}\n\n${table(labels)}`).join("\n\n");
  return `${GENERATED_NOTE}\n\n${body}\n\n`;
}

/**
 * COMPONENT.md with its `## API` section and its `### Keyboard`, `### ARIA` and `### Labels`
 * subsections replaced by the rendering of `api`. Throws when the document lacks a heading.
 */
export function applyApiToDoc(doc: string, api: ComponentApi): string {
  /** Replaces the body of `heading` up to the next heading of its level or above. */
  const replaceBody = (source: string, heading: string, body: string) => {
    const start = source.indexOf(`\n${heading}\n`);
    if (start === -1) throw new Error(`missing "${heading}"`);
    const bodyStart = start + heading.length + 2;
    const rest = source.slice(bodyStart);
    const level = heading.match(/^#+/)?.[0].length ?? 2;
    const next = rest.search(new RegExp(`^#{2,${level}} `, "m"));
    const end = next === -1 ? source.length : bodyStart + next;
    return source.slice(0, bodyStart) + body + source.slice(end);
  };
  let next = replaceBody(doc, "## API", renderApiSection(api));
  next = replaceBody(next, "### Keyboard", renderKeyboardSection(api));
  next = replaceBody(next, "### ARIA", renderAriaSection(api));
  return replaceBody(next, "### Labels", renderLabelsSection(api));
}
