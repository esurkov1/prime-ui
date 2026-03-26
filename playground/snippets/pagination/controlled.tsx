import * as React from "react";

import { Button } from "@/components/button/Button";
import { Pagination } from "@/components/pagination/Pagination";
import ExampleSurface from "../../components/ExampleSurface";

import styles from "./controlled.module.css";

const TOTAL = 12;

/** Номер страницы хранится в родителе: пагинация и кнопки меняют одно и то же состояние. */
export default function PaginationControlledSnippet() {
  const [page, setPage] = React.useState(4);

  return (
    <>
      <p className="previewCaption previewCaptionTopBase">
        Открыта страница {page} из {TOTAL} — значение приходит из <code>page</code> и обновляется
        через <code>onPageChange</code>.
      </p>
      <ExampleSurface>
        <Pagination.Root page={page} totalPages={TOTAL} onPageChange={setPage} />
      </ExampleSurface>
      <div className={styles.actions}>
        <Button.Root
          size="s"
          variant="neutral"
          mode="stroke"
          onClick={() => setPage(1)}
          disabled={page <= 1}
        >
          К первой
        </Button.Root>
        <Button.Root
          size="s"
          variant="neutral"
          mode="stroke"
          onClick={() => setPage(TOTAL)}
          disabled={page >= TOTAL}
        >
          К последней
        </Button.Root>
      </div>
    </>
  );
}
