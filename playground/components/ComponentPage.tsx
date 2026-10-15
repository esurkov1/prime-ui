import * as React from "react";
import type { DataTableColumn } from "@/components/data-table/DataTable";
import type { ExampleFramePreviewLayout } from "@/components/example-frame/ExampleFrame";
import { Typography } from "@/components/typography/Typography";
import {
  type ApiKeyboardRow,
  type ApiLabel,
  type ComponentApi,
  labelsByPart,
} from "../../scripts/docs/componentApi";
import type { PlaygroundCategoryId } from "../categories";
import { type ExampleBase, getExample } from "../exampleRegistry";
import type { Glyph } from "../icons";
import { type PageKind, SLOT_TITLES, type SlotId, slotLayout } from "../pageStandard";
import { DocBlock, DocList, DocPage, DocTable } from "./Doc";
import { PlaygroundApiTable, renderInlineCode } from "./PlaygroundApiTable";
import { DemoApiTitle, DemoDescription } from "./PlaygroundDemoTypography";
import { PlaygroundSourceFrame } from "./PlaygroundExampleFrame";
import { screenStage } from "./ScreenStage";

/** A cross-cutting slot: file `<slot>.tsx`, title from the vocabulary. */
export type SlotExample = { slot: SlotId; description: string };

/**
 * A component-specific scenario: file `<scenario>.tsx` (kebab-case by meaning), own title. Its
 * preview layout is the kind's scenario layout unless `layout` picks another layout of the kind
 * (`kindLayouts`).
 */
export type ScenarioExample = {
  scenario: string;
  title: string;
  description: string;
  layout?: ExampleFramePreviewLayout;
};

export type ComponentExample = SlotExample | ScenarioExample;

/** The page's own route and sidebar entry. */
export type ComponentPageNav = {
  /** Route segment. */
  segment: string;
  /** Sidebar and search title. */
  label: string;
  /** One line for search results. */
  summary: string;
  /** Extra search terms: Russian name, synonyms, main props. */
  keywords: string[];
  icon: Glyph;
  /** Position inside the category: related components side by side, common ones first. */
  order: number;
};

export type ComponentPageConfig = {
  /** Folder under `src/<base>/`. */
  dir: string;
  base?: ExampleBase;
  title: string;
  kind: PageKind;
  /** Sidebar category; `COMPONENT.md` declares the same `**Category:**`. */
  category: PlaygroundCategoryId;
  /** Own route; absent when another page embeds this one (Typography → Foundations). */
  nav?: ComponentPageNav;
  /** One or two sentences on purpose; keyboard and ARIA live in `api.accessibility`. */
  description: string;
  /** In slot order (see `KIND_SLOTS`). Descriptions: «What it shows — `prop`, `prop`.» */
  examples: ComponentExample[];
  /** The component's `api.ts`: one source for the API, keyboard, ARIA and labels tables. */
  api: ComponentApi;
};

export const exampleFile = (example: ComponentExample) =>
  "slot" in example ? example.slot : example.scenario;

export const exampleTitle = (example: ComponentExample) =>
  "slot" in example ? SLOT_TITLES[example.slot] : example.title;

/** The preview layout of an example: its slot's, or the scenario's own `layout`. */
export const exampleLayout = (kind: PageKind, example: ComponentExample) =>
  "slot" in example ? slotLayout(kind, example.slot) : (example.layout ?? slotLayout(kind, null));

const code = (text: string) => (
  <Typography as="span" variant="body-m">
    <code>{text}</code>
  </Typography>
);

const prose = (text: string) => (
  <Typography as="span" variant="body-m" tone="secondary">
    {renderInlineCode(text)}
  </Typography>
);

const KEY_COLUMNS: DataTableColumn<ApiKeyboardRow>[] = [
  { id: "keys", header: "Клавиши", minWidth: "10rem", cell: (row) => code(row.keys) },
  {
    id: "action",
    header: "Действие",
    grow: true,
    minWidth: "16rem",
    cell: (row) => prose(row.ru),
  },
];

const LABEL_COLUMNS: DataTableColumn<ApiLabel>[] = [
  { id: "key", header: "Ключ", minWidth: "8rem", cell: (row) => code(row.key) },
  {
    id: "default",
    header: "По умолчанию",
    minWidth: "12rem",
    cell: (row) => code(row.default),
  },
  {
    id: "description",
    header: "Назначение",
    grow: true,
    minWidth: "16rem",
    cell: (row) => prose(row.ru),
  },
];

function ExampleBlock({ page, example }: { page: ComponentPageConfig; example: ComponentExample }) {
  const slot = "slot" in example ? example.slot : null;
  return (
    <DocBlock title={exampleTitle(example)} description={renderInlineCode(example.description)}>
      <PlaygroundSourceFrame
        entry={getExample(page.base ?? "components", page.dir, exampleFile(example))}
        previewLayout={exampleLayout(page.kind, example)}
        stage={slot === "screen" ? screenStage : undefined}
      />
    </DocBlock>
  );
}

/**
 * One component page, the same for every component: title → description → examples by slots →
 * API → accessibility. A section is only a `ComponentPageConfig`.
 */
export function ComponentPage({ page }: { page: ComponentPageConfig }) {
  const { api } = page;
  return (
    <DocPage title={page.title} description={renderInlineCode(page.description)}>
      {page.examples.map((example) => (
        <ExampleBlock key={exampleFile(example)} page={page} example={example} />
      ))}

      <DocBlock title="API">
        {api.parts.map((part) => (
          <React.Fragment key={part.name}>
            <DemoApiTitle>{part.name}</DemoApiTitle>
            <DemoDescription>{renderInlineCode(part.ru)}</DemoDescription>
            {part.props.length > 0 ? <PlaygroundApiTable props={part.props} /> : null}
          </React.Fragment>
        ))}
        {api.types?.map((type) => (
          <React.Fragment key={type.name}>
            <DemoApiTitle>{type.name}</DemoApiTitle>
            <DemoDescription>{renderInlineCode(type.ru)}</DemoDescription>
            {type.fields.length > 0 ? <PlaygroundApiTable props={type.fields} /> : null}
          </React.Fragment>
        ))}
        {api.functions?.map((fn) => (
          <React.Fragment key={fn.name}>
            <DemoApiTitle>{fn.name}</DemoApiTitle>
            <DemoDescription>
              {code(fn.type)} {renderInlineCode(fn.ru)}
            </DemoDescription>
          </React.Fragment>
        ))}
      </DocBlock>

      <DocBlock title="Доступность">
        <DemoApiTitle>Клавиатура</DemoApiTitle>
        <DocTable
          columns={KEY_COLUMNS}
          rows={api.accessibility.keyboard}
          getRowKey={(row) => row.keys}
          empty="Своих клавиш нет"
        />
        <DemoApiTitle>ARIA</DemoApiTitle>
        <DocList tone="secondary">
          {api.accessibility.aria.map((line) => (
            <li key={line.ru}>{renderInlineCode(line.ru)}</li>
          ))}
        </DocList>
        {labelsByPart(api).map(({ part, labels }, index, groups) => (
          <React.Fragment key={part}>
            <DemoApiTitle>
              {groups.length === 1 && index === 0 && part === api.parts[0]?.name
                ? "Системные строки (labels)"
                : `Системные строки (labels) · ${part}`}
            </DemoApiTitle>
            <DocTable columns={LABEL_COLUMNS} rows={labels} getRowKey={(row) => row.key} />
          </React.Fragment>
        ))}
      </DocBlock>
    </DocPage>
  );
}
