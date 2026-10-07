import type * as React from "react";

import { Button } from "@/components/button/Button";
import { useControllableState } from "@/hooks/useControllableState";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./Pagination.module.css";

/** Page numbers around `page` with `"…"` gaps; first and last are always shown. */
function pageRange(page: number, total: number, siblings: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
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

const DEFAULT_LABELS: PaginationLabels = {
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
  /** Current page (1-based), controlled. */
  value?: number;
  defaultValue?: number;
  onValueChange?: (page: number) => void;
  totalPages: number;
  /** Pages on each side of the current one before an ellipsis. */
  siblingCount?: number;
  size?: ControlSize;
  /**
   * Arrows + «current / total» instead of page numbers. `"auto"` fills the parent and switches to
   * the compact view when the container is narrow.
   */
  compact?: boolean | "auto";
  labels?: Partial<PaginationLabels>;
};

export function Pagination({
  value,
  defaultValue = 1,
  onValueChange,
  totalPages,
  siblingCount = 1,
  size = "m",
  compact = false,
  labels: labelsProp,
  className,
  ...rest
}: PaginationProps) {
  const [page, setPage] = useControllableState({ value, defaultValue, onChange: onValueChange });
  if (totalPages < 1) return null;

  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const current = Math.min(Math.max(1, page), totalPages);
  const go = (next: number) => {
    if (next !== current) setPage(next);
  };
  const mode = compact === "auto" ? "auto" : compact ? "true" : "false";

  return (
    <nav
      {...rest}
      aria-label={labels.nav}
      className={cx(styles.root, className)}
      {...toDataAttributes({ size, compact: mode })}
    >
      <div className={styles.list}>
        <Button.Root
          variant="ghost"
          tone="neutral"
          size={size}
          disabled={current <= 1}
          onClick={() => go(current - 1)}
          aria-label={labels.previous}
        >
          <Button.Icon>
            <Icon name="nav.chevronLeft" />
          </Button.Icon>
        </Button.Root>

        {mode !== "true"
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
                  size={size}
                  className={cx(styles.page, styles.pageItem)}
                  onClick={() => go(item)}
                  aria-current={item === current ? "page" : undefined}
                  aria-label={labels.page.replace("{page}", String(item))}
                >
                  {item}
                </Button.Root>
              ),
            )
          : null}

        {mode !== "false" ? (
          <span className={styles.summary}>
            <span className={styles.summaryCurrent}>{current}</span>
            <span aria-hidden="true">/</span>
            <VisuallyHidden>{labels.of}</VisuallyHidden>
            <span>{totalPages}</span>
          </span>
        ) : null}

        <Button.Root
          variant="ghost"
          tone="neutral"
          size={size}
          disabled={current >= totalPages}
          onClick={() => go(current + 1)}
          aria-label={labels.next}
        >
          <Button.Icon>
            <Icon name="nav.chevronRight" />
          </Button.Icon>
        </Button.Root>
      </div>
    </nav>
  );
}
