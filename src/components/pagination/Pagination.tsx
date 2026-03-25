import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/button/Button";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { PaginationSize } from "@/internal/states";

import styles from "./Pagination.module.css";

export type { PaginationSize };

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

export type PaginationRootProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  /** Размер кнопок страниц и стрелок; многоточие — тот же ярус `--prime-sys-size-control-*`. */
  size?: PaginationSize;
  className?: string;
};

function PaginationRoot({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  size = "m",
  className,
}: PaginationRootProps) {
  if (totalPages < 1) {
    return null;
  }

  const safePage = Math.min(Math.max(1, page), totalPages);
  const pages = buildPageRange(safePage, totalPages, siblingCount);

  return (
    <nav
      aria-label="Pagination"
      className={cx(styles.root, className)}
      {...toDataAttributes({ size })}
    >
      <span className={styles.control}>
        <Button.Root
          className={styles.pageButton}
          size={size}
          variant="neutral"
          mode="ghost"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          aria-label="Previous page"
        >
          <Button.Icon>
            <ChevronLeft strokeWidth={2} />
          </Button.Icon>
        </Button.Root>
      </span>
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-after-${pages[i - 1]}-before-${pages[i + 1]}`}
            className={styles.control}
          >
            <span className={styles.ellipsis} aria-hidden="true">
              …
            </span>
          </span>
        ) : (
          <span key={p} className={styles.control}>
            <Button.Root
              className={styles.pageButton}
              size={size}
              variant={p === safePage ? "primary" : "neutral"}
              mode={p === safePage ? "filled" : "ghost"}
              onClick={() => onPageChange(p)}
              aria-current={p === safePage ? "page" : undefined}
              aria-label={`Page ${p}`}
            >
              {p}
            </Button.Root>
          </span>
        ),
      )}
      <span className={styles.control}>
        <Button.Root
          className={styles.pageButton}
          size={size}
          variant="neutral"
          mode="ghost"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          aria-label="Next page"
        >
          <Button.Icon>
            <ChevronRight strokeWidth={2} />
          </Button.Icon>
        </Button.Root>
      </span>
    </nav>
  );
}

PaginationRoot.displayName = "PaginationRoot";

export const Pagination = { Root: PaginationRoot };
