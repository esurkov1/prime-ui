import type * as React from "react";

import { PageContent } from "@/components/page-content/PageContent";
import { Typography } from "@/components/typography/Typography";
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
        <Typography.Root
          as="h1"
          variant="heading-page"
          weight="semibold"
          tracking="tight"
          className="playgroundDocPageTitle"
          {...(headingId != null ? { id: headingId } : {})}
        >
          {title}
        </Typography.Root>
        {description != null ? (
          <Typography.Root
            as="p"
            variant="body-default"
            tone="muted"
            className="playgroundDocPageDescription"
          >
            {description}
          </Typography.Root>
        ) : null}
      </PageContent.Header>
      {children != null ? <PageContent.Body>{children}</PageContent.Body> : null}
    </section>
  );
}
