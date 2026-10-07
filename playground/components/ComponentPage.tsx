import * as React from "react";

import { DataTable, type DataTableColumn } from "@/components/data-table/DataTable";
import { PageContent } from "@/components/page-content/PageContent";
import { Typography } from "@/components/typography/Typography";

import type { ApiLabel, ApiProp, ComponentApi } from "../../scripts/docs/componentApi";
import { type ExampleBase, getExample } from "../exampleRegistry";
import { type PageKind, SLOTS, type SlotId, slotLayout } from "../pageStandard";
import {
  type PlaygroundApiPropRow,
  PlaygroundApiTable,
  renderInlineCode,
} from "./PlaygroundApiTable";
import { DemoApiTitle, DemoDescription, DemoSectionTitle } from "./PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "./PlaygroundExampleFrame";

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

export type ComponentPageConfig = {
  /** Folder under `src/<base>/`. */
  dir: string;
  base?: ExampleBase;
  title: string;
  kind: PageKind;
  /** One or two sentences on purpose; keyboard and behaviour go to `accessibility`. */
  description: string;
  /** In slot order (see `KIND_SLOTS`). Descriptions: «What it shows — `prop`, `prop`.» */
  examples: ComponentExample[];
  /** The component's `api.ts`: one source for these tables and for COMPONENT.md. */
  api: ComponentApi;
  accessibility: ComponentAccessibility;
};

const toRow = (prop: ApiProp): PlaygroundApiPropRow => ({
  prop: prop.name,
  type: prop.type,
  defaultValue: prop.default ?? "—",
  required: prop.required ? "Да" : "Нет",
  description: prop.ru,
});

export const exampleFile = (example: ComponentExample) =>
  "slot" in example ? example.slot : example.scenario;

export const exampleTitle = (example: ComponentExample) =>
  "slot" in example ? SLOTS[example.slot].title : example.title;

type KeyRow = ComponentAccessibility["keyboard"][number];
type LabelRow = ApiLabel;

const code = (text: string) => (
  <Typography.Root as="span" variant="body-m">
    <code>{text}</code>
  </Typography.Root>
);

const prose = (text: string) => (
  <Typography.Root as="span" variant="body-m" tone="secondary">
    {renderInlineCode(text)}
  </Typography.Root>
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

const LABEL_COLUMNS: DataTableColumn<LabelRow>[] = [
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
  const { Component, source } = getExample(
    page.base ?? "components",
    page.dir,
    exampleFile(example),
  );
  const layout = slotLayout(page.kind, "slot" in example ? example.slot : null);
  return (
    <div className="demoBlock">
      <DemoSectionTitle>{exampleTitle(example)}</DemoSectionTitle>
      <DemoDescription>{renderInlineCode(example.description)}</DemoDescription>
      <PlaygroundExampleFrame.Root code={source} previewLayout={layout}>
        <React.Suspense fallback={null}>
          <Component />
        </React.Suspense>
      </PlaygroundExampleFrame.Root>
    </div>
  );
}

/**
 * One component page, the same for every component: title → description → examples by slots →
 * API → accessibility. A section is only a `ComponentPageConfig`.
 */
export function ComponentPage({ page }: { page: ComponentPageConfig }) {
  const { accessibility, api } = page;
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>{page.title}</PageContent.Title>
        <PageContent.Description measure="full">
          {renderInlineCode(page.description)}
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          {page.examples.map((example) => (
            <ExampleBlock key={exampleFile(example)} page={page} example={example} />
          ))}

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            {api.parts.map((part) => (
              <React.Fragment key={part.name}>
                <DemoApiTitle>{part.name}</DemoApiTitle>
                {part.ru ? <DemoDescription>{renderInlineCode(part.ru)}</DemoDescription> : null}
                {part.props.length > 0 ? <PlaygroundApiTable rows={part.props.map(toRow)} /> : null}
              </React.Fragment>
            ))}
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Доступность</DemoSectionTitle>
            <DemoApiTitle>Клавиатура</DemoApiTitle>
            <DataTable
              columns={KEY_COLUMNS}
              rows={accessibility.keyboard}
              getRowKey={(row) => row.keys}
              paging="none"
              highlightRowOnHover={false}
              labels={{ empty: "Своих клавиш нет" }}
            />
            <DemoApiTitle>ARIA</DemoApiTitle>
            <ul className="demoList">
              {accessibility.aria.map((line) => (
                <li key={line}>
                  <Typography.Root as="span" variant="body-m" tone="secondary">
                    {renderInlineCode(line)}
                  </Typography.Root>
                </li>
              ))}
            </ul>
            {api.labels.length > 0 ? (
              <>
                <DemoApiTitle>Системные строки (labels)</DemoApiTitle>
                <DataTable
                  columns={LABEL_COLUMNS}
                  rows={api.labels}
                  getRowKey={(row) => row.key}
                  paging="none"
                  highlightRowOnHover={false}
                />
              </>
            ) : null}
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
