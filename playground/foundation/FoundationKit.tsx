import type * as React from "react";

import { PageContent } from "@/components/page-content/PageContent";
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

/** White card on the canvas: the default container for token tables and demos. */
export function Panel({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return (
    <div {...rest} className={cx(s.panel, className)}>
      {children}
    </div>
  );
}

/** CSS variable name, monospace, wraps anywhere. */
export function TokenName({ children }: { children: string }) {
  return <code className={s.tokenName}>{children}</code>;
}

/** Bulleted rule list (do/don't, guidance). */
export function RuleList({ children }: { children: React.ReactNode }) {
  return <ul className={s.ruleList}>{children}</ul>;
}

/** Plain semantic table with the playground look; scrolls horizontally when narrow. */
export function TokenTable({
  head,
  children,
  className,
}: {
  head: React.ReactNode[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx(s.tableWrap, className)}>
      <table className={s.table}>
        <thead>
          <tr>
            {head.map((h, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static header list
              <th key={i} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
