/**
 * Building blocks of every playground document (component and foundation pages): the
 * page shell, a titled block, a table and a bulleted list — one copy each, built from the kit.
 */
import * as React from "react";

import { DataTable, type DataTableColumn } from "@/components/data-table/DataTable";
import { Typography } from "@/components/typography/Typography";
import { Page } from "@/layout/page/Page";

import { PlaygroundTopBar } from "./PlaygroundChrome";

/** Page shell: the site's top bar, the h1 with its lead in the flow and a column of blocks. */
export function DocPage({
  title,
  description,
  children,
}: {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Page.Root>
      <PlaygroundTopBar />
      <Page.Header>
        <Page.Heading>
          <Page.Title>{title}</Page.Title>
          <Page.Description>{description}</Page.Description>
        </Page.Heading>
      </Page.Header>
      <Page.Body>{children}</Page.Body>
    </Page.Root>
  );
}

/** One block of a page: a `Page.Section` — title (h2), optional lead, content. */
export function DocBlock({
  title,
  description,
  children,
  id,
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <Page.Section id={id} label={title} description={description}>
      {children}
    </Page.Section>
  );
}

/** A reference table: the kit DataTable with every row at once and no row hover. */
export function DocTable<Row>({
  columns,
  rows,
  getRowKey,
  empty,
}: {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  getRowKey: (row: Row, index: number) => React.Key;
  /** Text of the empty state. */
  empty?: string;
}) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={getRowKey}
      paging="none"
      highlightRowOnHover={false}
      labels={empty ? { empty } : undefined}
    />
  );
}

/** A bulleted list whose `<li>` texts are Typography body-m (secondary for notes). */
export function DocList({ tone, children }: { tone?: "secondary"; children: React.ReactNode }) {
  return (
    <ul className="demoList">
      {React.Children.map(children, (child) =>
        React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === "li" ? (
          <li>
            <Typography as="span" variant="body-m" tone={tone}>
              {child.props.children}
            </Typography>
          </li>
        ) : (
          child
        ),
      )}
    </ul>
  );
}
