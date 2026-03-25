import type * as React from "react";

import { PageContent } from "@/components/page-content/PageContent";
import { cx } from "@/internal/cx";

export type PlaygroundDocPageProps = {
  title: string;
  /** `id` заголовка и `aria-labelledby` у `<section>` (доступность). */
  headingId?: string;
  /** Кратко: назначение компонента, ключевые пропсы и ограничения; без пустых отсылок к превью или коду. */
  description?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Одна страница док-плейграунда: шапка (h1 + описание) и тело через `PageContent.Header` / `PageContent.Body`
 * без лишней обёртки `PageContent.Root` (отступы страницы не дублируем на `<main>`).
 */
export function PlaygroundDocPage({
  title,
  headingId,
  description,
  className,
  children,
}: PlaygroundDocPageProps) {
  return (
    <section
      className={cx("playgroundDocPage", className)}
      {...(headingId != null ? { "aria-labelledby": headingId } : {})}
    >
      <PageContent.Header>
        <PageContent.Title id={headingId}>{title}</PageContent.Title>
        {description != null ? (
          <PageContent.Description>{description}</PageContent.Description>
        ) : null}
      </PageContent.Header>
      {children != null ? <PageContent.Body>{children}</PageContent.Body> : null}
    </section>
  );
}
