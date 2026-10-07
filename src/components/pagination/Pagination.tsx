import { ChevronLeft, ChevronRight } from "lucide-react";
import type * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";

import styles from "./Pagination.module.css";

function buildPageRange(page: number, total: number, siblings: number): Array<number | "..."> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const left = Math.max(2, page - siblings);
  const right = Math.min(total - 1, page + siblings);

  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < total - 1;

  const pages: Array<number | "..."> = [1];
  if (showLeftEllipsis) pages.push("...");
  for (let i = left; i <= right; i++) pages.push(i);
  if (showRightEllipsis) pages.push("...");
  pages.push(total);

  return pages;
}

/** Тексты для ассистивных технологий; по умолчанию на русском. */
export type PaginationLabels = {
  /** `aria-label` навигации. */
  nav: string;
  previous: string;
  next: string;
  /** `aria-label` кнопки номера страницы. */
  page: (page: number) => string;
  /** Скрытый предлог между текущей и общей страницей в компактном виде («3 из 12»). */
  of: string;
};

const DEFAULT_PAGINATION_LABELS: PaginationLabels = {
  nav: "Навигация по страницам",
  previous: "Предыдущая страница",
  next: "Следующая страница",
  page: (page) => `Страница ${page}`,
  of: "из",
};

export type PaginationRootProps = {
  /** Current page (1-based), controlled. */
  value?: number;
  /** Initial page when uncontrolled. Default `1`. */
  defaultValue?: number;
  onValueChange?: (page: number) => void;
  totalPages: number;
  /** Pages shown on each side of the current one before an ellipsis. Default `1`. */
  siblingCount?: number;
  /** Ярус контролов: высота кнопок = `--prime-control-<size>-height`. */
  size?: ControlSize;
  /**
   * Компактный режим: стрелки + «текущая / всего» вместо ряда номеров.
   * `"auto"` растягивает навигацию на ширину родителя и включает компактный вид на узкой ширине
   * (container query).
   */
  compact?: boolean | "auto";
  /** Тексты для скринридеров (частично). */
  labels?: Partial<PaginationLabels>;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "defaultValue" | "onChange">;

function PaginationRoot({
  value,
  defaultValue = 1,
  onValueChange,
  totalPages,
  siblingCount = 1,
  size = "m",
  compact = false,
  labels,
  className,
  ...rest
}: PaginationRootProps) {
  const [page, setPage] = useControllableState({ value, defaultValue, onChange: onValueChange });

  if (totalPages < 1) {
    return null;
  }

  const safePage = Math.min(Math.max(1, page), totalPages);
  const onPageChange = (next: number) => {
    if (next !== safePage) setPage(next);
  };
  const pages = buildPageRange(safePage, totalPages, siblingCount);
  const compactMode = compact === "auto" ? "auto" : compact ? "true" : "false";
  const text = { ...DEFAULT_PAGINATION_LABELS, ...labels };

  return (
    <nav
      {...rest}
      aria-label={text.nav}
      className={cx(styles.root, className)}
      {...toDataAttributes({ size, compact: compactMode })}
    >
      <div className={styles.list}>
        <button
          type="button"
          className={styles.button}
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          aria-label={text.previous}
        >
          <ChevronLeft className={styles.icon} strokeWidth={2} aria-hidden="true" />
        </button>

        {compactMode !== "true"
          ? pages.map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-after-${pages[i - 1]}-before-${pages[i + 1]}`}
                  className={cx(styles.ellipsis, styles.pageItem)}
                  aria-hidden="true"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  className={cx(styles.button, styles.pageItem)}
                  data-current={p === safePage ? "true" : undefined}
                  onClick={() => onPageChange(p)}
                  aria-current={p === safePage ? "page" : undefined}
                  aria-label={text.page(p)}
                >
                  {p}
                </button>
              ),
            )
          : null}

        {compactMode !== "false" ? (
          <span className={styles.summary}>
            <span className={styles.summaryCurrent}>{safePage}</span>
            <span aria-hidden="true">/</span>
            <span className={styles.srOnly}>{text.of}</span>
            <span>{totalPages}</span>
          </span>
        ) : null}

        <button
          type="button"
          className={styles.button}
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          aria-label={text.next}
        >
          <ChevronRight className={styles.icon} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

PaginationRoot.displayName = "PaginationRoot";

export const Pagination = { Root: PaginationRoot };
