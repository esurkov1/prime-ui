/** Up to 7 pages without an ellipsis, then a window around the current page; a wider window — `siblingCount`. */
import { Pagination, Typography } from "prime-ui-kit";

const CASES = [
  { caption: "5 страниц", total: 5, page: 3, siblings: 1 },
  { caption: "siblingCount 1", total: 40, page: 20, siblings: 1 },
  { caption: "siblingCount 2", total: 40, page: 20, siblings: 2 },
] as const;

export default function PaginationOverflowExample() {
  return (
    <div>
      {CASES.map(({ caption, total, page, siblings }) => (
        <div key={caption}>
          <Pagination totalPages={total} defaultValue={page} siblingCount={siblings} />
          <Typography.Root as="span" variant="caption" tone="muted">
            {caption}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}
