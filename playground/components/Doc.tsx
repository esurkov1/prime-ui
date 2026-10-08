/**
 * Building blocks of every playground document (component, foundation, composition pages): the
 * page shell, a titled block, a table and a bulleted list — one copy each, built from the kit.
 */
import * as React from "react";

import { DataTable, type DataTableColumn } from "@/components/data-table/DataTable";
import { PageContent } from "@/components/page-content/PageContent";
import { Typography } from "@/components/typography/Typography";

import { DemoDescription, DemoSectionTitle } from "./PlaygroundDemoTypography";

/** Page shell: the h1, its lead and a column of blocks. */
export function DocPage({
  title,
  description,
  measure = "readable",
  children,
}: {
  title: string;
  description: React.ReactNode;
  /** `full` lets the lead run the page width (component and pattern pages). */
  measure?: "readable" | "full";
  children: React.ReactNode;
}) {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>{title}</PageContent.Title>
        <PageContent.Description measure={measure}>{description}</PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">{children}</div>
      </PageContent.Body>
    </PageContent.Section>
  );
}

/** One block of a page: title (h2), optional lead, content. */
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
    <section className="demoBlock" aria-labelledby={id}>
      <DemoSectionTitle id={id}>{title}</DemoSectionTitle>
      {description ? <DemoDescription>{description}</DemoDescription> : null}
      {children}
    </section>
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
