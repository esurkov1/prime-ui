import * as React from "react";

import { Card } from "@/components/card/Card";
import { DataTable, type DataTableColumn } from "@/components/data-table/DataTable";
import { PageContent } from "@/components/page-content/PageContent";
import { Typography } from "@/components/typography/Typography";
import { cx } from "@/internal/cx";

import { DemoDescription, DemoSectionTitle } from "../components/PlaygroundDemoTypography";
import s from "./foundation.module.css";

/** Page shell shared by every Foundation topic. */
export function FoundationPage({
  title,
  description,
  children,
}: {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>{title}</PageContent.Title>
        <PageContent.Description measure="readable">{description}</PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">{children}</div>
      </PageContent.Body>
    </PageContent.Section>
  );
}

/** One topic block: title, short lead, content. */
export function FoundationSection({
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

/** A tile for token demos: the kit Card; `className` lays out the content inside it. */
export function Panel({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return (
    <Card.Root {...rest} variant="cta" flat>
      <div className={cx(s.panel, className)}>{children}</div>
    </Card.Root>
  );
}

/** CSS variable name: Typography in the code role, secondary tone. */
export function TokenName({ children }: { children: string }) {
  return (
    <Typography.Root as="span" variant="code" tone="secondary" className={s.tokenName}>
      {children}
    </Typography.Root>
  );
}

/** Bulleted rule list (do/don't, guidance): the text of every item is Typography body-m. */
export function RuleList({ children }: { children: React.ReactNode }) {
  return (
    <ul className={s.ruleList}>
      {React.Children.map(children, (child) =>
        React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === "li" ? (
          <li>
            <Typography.Root as="span" variant="body-m">
              {child.props.children}
            </Typography.Root>
          </li>
        ) : (
          child
        ),
      )}
    </ul>
  );
}

/** Token table: the kit DataTable, all rows at once. */
export function TokenTable<Row>({
  columns,
  rows,
  getRowKey,
}: {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  getRowKey: (row: Row, index: number) => React.Key;
}) {
  return (
    <DataTable.Root
      columns={columns}
      rows={rows}
      getRowKey={getRowKey}
      showPagination={false}
      pageSize={rows.length || 1}
      highlightRowOnHover={false}
    />
  );
}
