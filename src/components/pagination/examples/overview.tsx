/** Pages of an order list: arrows, page numbers and the current page — `totalPages`, `defaultValue`. */
import { Pagination } from "prime-ui-kit";

export default function PaginationOverviewExample() {
  return <Pagination totalPages={12} defaultValue={4} />;
}
