/**
 * Single source of a component's API: `src/<base>/<dir>/api.ts` exports a `ComponentApi`.
 * Structure (names, types, defaults, required) is written once; every description is written in
 * both languages side by side — `en` for COMPONENT.md, `ru` for the playground page.
 *
 * `bun run docs:build` renders the `## API` section and the `### Labels` subsection of
 * COMPONENT.md from it (`renderApiSection`, `renderLabelsSection`); the playground's
 * `ComponentPage` renders its tables from the same object. The docs contract test fails when the
 * markdown differs from what `api.ts` renders.
 */

export type ApiProp = {
  /** Prop name as written in JSX; `…rest` for the forwarded native attributes. */
  name: string;
  /** TypeScript type as text, e.g. `"solid" | "soft"`. */
  type: string;
  /** Default as code text (`"m"`, `false`); omitted → no default. */
  default?: string;
  required?: boolean;
  en: string;
  ru: string;
};

export type ApiPart = {
  /** `Button.Root`, `Spinner`, `Modal.Title · Modal.Description`… */
  name: string;
  /** COMPONENT.md line under the heading: ref / rendered element / forwarded props, then purpose. */
  en: string;
  /** Playground description of the part (optional). */
  ru?: string;
  props: ApiProp[];
};

export type ApiLabel = {
  key: string;
  /** Russian default text (without quotes). */
  default: string;
  en: string;
  ru: string;
};

export type ComponentApi = {
  /** The first part is the root (or the leaf itself); its props drive required page slots. */
  parts: ApiPart[];
  /** Every key of the component's `labels` prop; empty when it has none. */
  labels: ApiLabel[];
};

export const GENERATED_NOTE =
  "<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->";

const cell = (text: string) => text.replaceAll("|", "\\|");
const code = (text: string) => `\`${cell(text)}\``;

function renderDefault(prop: ApiProp): string {
  if (prop.default !== undefined) return code(prop.default);
  return prop.required ? "— (required)" : "—";
}

/** Body of `## API` (everything after the heading line, up to the next `## `). */
export function renderApiSection(api: ComponentApi): string {
  const blocks = api.parts.map((part) => {
    const lines = [`### ${part.name}`, part.en];
    if (part.props.length > 0) {
      lines.push(
        "",
        "| Prop | Type | Default | Description |",
        "|---|---|---|---|",
        ...part.props.map(
          (prop) =>
            `| ${code(prop.name)} | ${code(prop.type)} | ${renderDefault(prop)} | ${cell(prop.en)} |`,
        ),
      );
    }
    return lines.join("\n");
  });
  return `\n${GENERATED_NOTE}\n\n${blocks.join("\n\n")}\n\n`;
}

/** Body of `### Labels` inside `## Accessibility` (up to the next `## `). */
export function renderLabelsSection(api: ComponentApi): string {
  if (api.labels.length === 0) return `${GENERATED_NOTE}\n\nNo \`labels\`.\n\n`;
  const rows = api.labels.map(
    (label) => `| ${code(label.key)} | ${code(`"${label.default}"`)} | ${cell(label.en)} |`,
  );
  return `${GENERATED_NOTE}\n\n| Key | Default | Used for |\n|---|---|---|\n${rows.join("\n")}\n\n`;
}

/**
 * COMPONENT.md with its `## API` section and `### Labels` subsection replaced by the rendering of
 * `api`. Throws when the document lacks either heading.
 */
export function applyApiToDoc(doc: string, api: ComponentApi): string {
  const replaceUntilNextH2 = (source: string, heading: string, body: string) => {
    const start = source.indexOf(`\n${heading}\n`);
    if (start === -1) throw new Error(`missing "${heading}"`);
    const bodyStart = start + heading.length + 2;
    const rest = source.slice(bodyStart);
    const next = rest.search(/^## /m);
    const end = next === -1 ? source.length : bodyStart + next;
    return source.slice(0, bodyStart) + body + source.slice(end);
  };
  const withApi = replaceUntilNextH2(doc, "## API", renderApiSection(api));
  return replaceUntilNextH2(withApi, "### Labels", renderLabelsSection(api));
}
