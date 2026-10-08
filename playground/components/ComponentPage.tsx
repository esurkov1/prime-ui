import type { LucideIcon } from "lucide-react";
import * as React from "react";

import type { DataTableColumn } from "@/components/data-table/DataTable";
import { Typography } from "@/components/typography/Typography";

import type { ApiLabel, ComponentApi } from "../../scripts/docs/componentApi";
import type { PlaygroundCategoryId } from "../categories";
import { type ExampleBase, getExample } from "../exampleRegistry";
import { type PageKind, SLOT_TITLES, type SlotId, slotLayout } from "../pageStandard";
import { DocBlock, DocList, DocPage, DocTable } from "./Doc";
import { PlaygroundApiTable, renderInlineCode } from "./PlaygroundApiTable";
import { DemoApiTitle, DemoDescription } from "./PlaygroundDemoTypography";
import { PlaygroundSourceFrame } from "./PlaygroundExampleFrame";

/** A cross-cutting slot: file `<slot>.tsx`, title from the vocabulary. */
export type SlotExample = { slot: SlotId; description: string };

/** A component-specific scenario: file `<scenario>.tsx` (kebab-case by meaning), own title. */
export type ScenarioExample = { scenario: string; title: string; description: string };

export type ComponentExample = SlotExample | ScenarioExample;

/** Keyboard and ARIA notes (Russian); the `labels` table comes from `api.labels`. */
export type ComponentAccessibility = {
  keyboard: { keys: string; action: string }[];
  aria: string[];
};

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
  icon: LucideIcon;
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
  /** One or two sentences on purpose; keyboard and behaviour go to `accessibility`. */
  description: string;
  /** In slot order (see `KIND_SLOTS`). Descriptions: «What it shows — `prop`, `prop`.» */
  examples: ComponentExample[];
  /** The component's `api.ts`: one source for these tables and for COMPONENT.md. */
  api: ComponentApi;
  accessibility: ComponentAccessibility;
};

export const exampleFile = (example: ComponentExample) =>
  "slot" in example ? example.slot : example.scenario;

export const exampleTitle = (example: ComponentExample) =>
  "slot" in example ? SLOT_TITLES[example.slot] : example.title;

type KeyRow = ComponentAccessibility["keyboard"][number];

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

const KEY_COLUMNS: DataTableColumn<KeyRow>[] = [
  { id: "keys", header: "Клавиши", minWidth: "10rem", cell: (row) => code(row.keys) },
  {
    id: "action",
    header: "Действие",
    grow: true,
    minWidth: "16rem",
    cell: (row) => prose(row.action),
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
  return (
    <DocBlock title={exampleTitle(example)} description={renderInlineCode(example.description)}>
      <PlaygroundSourceFrame
        entry={getExample(page.base ?? "components", page.dir, exampleFile(example))}
        previewLayout={slotLayout(page.kind, "slot" in example ? example.slot : null)}
      />
    </DocBlock>
  );
}

/**
 * One component page, the same for every component: title → description → examples by slots →
 * API → accessibility. A section is only a `ComponentPageConfig`.
 */
export function ComponentPage({ page }: { page: ComponentPageConfig }) {
  const { accessibility, api } = page;
  return (
    <DocPage title={page.title} description={renderInlineCode(page.description)} measure="full">
      {page.examples.map((example) => (
        <ExampleBlock key={exampleFile(example)} page={page} example={example} />
      ))}

      <DocBlock title="API">
        {api.parts.map((part) => (
          <React.Fragment key={part.name}>
            <DemoApiTitle>{part.name}</DemoApiTitle>
            {part.ru ? <DemoDescription>{renderInlineCode(part.ru)}</DemoDescription> : null}
            {part.props.length > 0 ? <PlaygroundApiTable props={part.props} /> : null}
          </React.Fragment>
        ))}
      </DocBlock>

      <DocBlock title="Доступность">
        <DemoApiTitle>Клавиатура</DemoApiTitle>
        <DocTable
          columns={KEY_COLUMNS}
          rows={accessibility.keyboard}
          getRowKey={(row) => row.keys}
          empty="Своих клавиш нет"
        />
        <DemoApiTitle>ARIA</DemoApiTitle>
        <DocList tone="secondary">
          {accessibility.aria.map((line) => (
            <li key={line}>{renderInlineCode(line)}</li>
          ))}
        </DocList>
        {api.labels.length > 0 ? (
          <>
            <DemoApiTitle>Системные строки (labels)</DemoApiTitle>
            <DocTable columns={LABEL_COLUMNS} rows={api.labels} getRowKey={(row) => row.key} />
          </>
        ) : null}
      </DocBlock>
    </DocPage>
  );
}
