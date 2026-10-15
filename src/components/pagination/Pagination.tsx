import type * as React from "react";

import { Button } from "@/components/button/Button";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { Icon } from "@/icons";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldTierClass } from "@/internal/fieldClasses";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";
import type { ControlSize } from "@/internal/states";

import styles from "./Pagination.module.css";

/**
 * Page numbers around `page` with `"…"` gaps; first and last are always shown. The collapsed view
 * takes first + gap + siblings + current + siblings + gap + last slots: while every page fits
 * that, every page is shown.
 */
function pageRange(page: number, total: number, siblings: number): Array<number | "…"> {
  if (total <= 2 * siblings + 5) return Array.from({ length: total }, (_, i) => i + 1);
  const left = Math.max(2, page - siblings);
  const right = Math.min(total - 1, page + siblings);
  const pages: Array<number | "…"> = [1];
  if (left > 2) pages.push("…");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

/** System strings; `{page}` is replaced. */
export type PaginationLabels = {
  /** `aria-label` of the `<nav>`. */
  nav: string;
  previous: string;
  next: string;
  /** `aria-label` of a page button. */
  page: string;
  /** Hidden word between the current and the total page in the compact view («3 из 12»). */
  of: string;
};

export const PAGINATION_LABELS: PaginationLabels = {
  nav: "Навигация по страницам",
  previous: "Предыдущая страница",
  next: "Следующая страница",
  page: "Страница {page}",
  of: "из",
};

export type PaginationProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  "defaultValue" | "onChange"
> & {
  ref?: React.Ref<HTMLElement>;
  value?: number;
  defaultValue?: number;
  onValueChange?: (page: number) => void;
  totalPages: number;
  siblingCount?: number;
  size?: ControlSize;
  compact?: boolean;
  align?: "start" | "center" | "end";
  labels?: Partial<PaginationLabels>;
};

export function Pagination({
  value,
  defaultValue = 1,
  onValueChange,
  totalPages,
  siblingCount = 1,
  size: sizeProp,
  compact = false,
  align = "center",
  labels: labelsProp,
  className,
  ...rest
}: PaginationProps) {
  const [page, setPage] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const { size, provide } = useHostTier(sizeProp);
  const labels = useLabels(PAGINATION_LABELS, labelsProp);
  if (totalPages < 1) return null;

  const current = Math.min(Math.max(1, page), totalPages);
  const go = (next: number) => {
    if (next !== current) setPage(next);
  };
  // By default the nav fills its parent and turns compact when it is narrow; `compact` forces it.
  const mode = compact ? "compact" : "auto";

  return provide(
    <nav
      {...rest}
      aria-label={labels.nav}
      className={cx(fieldTierClass, styles.root, className)}
      {...toDataAttributes({ size, compact: mode, align })}
    >
      <div className={styles.list}>
        <Button.Root
          variant="ghost"
          tone="neutral"
          disabled={current <= 1}
          onClick={() => go(current - 1)}
          aria-label={labels.previous}
        >
          <Button.Icon>
            <Icon name="nav.chevronLeft" />
          </Button.Icon>
        </Button.Root>

        {mode === "auto"
          ? pageRange(current, totalPages, siblingCount).map((item, i, all) =>
              item === "…" ? (
                <span
                  key={`gap-${all[i - 1]}`}
                  className={cx(styles.ellipsis, styles.pageItem)}
                  aria-hidden="true"
                >
                  …
                </span>
              ) : (
                <Button.Root
                  key={item}
                  variant="ghost"
                  tone="neutral"
                  density="tight"
                  current={item === current}
                  className={styles.pageItem}
                  onClick={() => go(item)}
                  aria-label={formatLabel(labels.page, { page: item })}
                >
                  {item}
                </Button.Root>
              ),
            )
          : null}

        <span className={styles.summary}>
          <span className={styles.summaryCurrent}>{current}</span>
          <span aria-hidden="true">/</span>
          <VisuallyHidden>{labels.of}</VisuallyHidden>
          <span>{totalPages}</span>
        </span>

        <Button.Root
          variant="ghost"
          tone="neutral"
          disabled={current >= totalPages}
          onClick={() => go(current + 1)}
          aria-label={labels.next}
        >
          <Button.Icon>
            <Icon name="nav.chevronRight" />
          </Button.Icon>
        </Button.Root>
      </div>
    </nav>,
  );
}
