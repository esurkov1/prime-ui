import { PackagePlus } from "lucide-react";

import { Button } from "@/components/button/Button";
import { EmptyPage } from "@/components/empty-page/EmptyPage";

import styles from "./empty-page-demos.module.css";

export default function EmptyPageTableRegionSnippet() {
  return (
    <div>
      <p className={styles.lead}>
        Имитация тела таблицы или карточки: обводка задаёт границу области данных.
      </p>
      <div className={styles.tableRegion}>
        <EmptyPage.Root layout="fill" aria-labelledby="empty-table-heading">
          <EmptyPage.Icon aria-hidden>
            <PackagePlus strokeWidth={2} aria-hidden />
          </EmptyPage.Icon>
          <EmptyPage.Title id="empty-table-heading">Пока нет позиций</EmptyPage.Title>
          <EmptyPage.Description>
            Создайте первую строку вручную или импортируйте каталог.
          </EmptyPage.Description>
          <EmptyPage.Actions>
            <Button.Root type="button" variant="primary">
              Добавить позицию
            </Button.Root>
          </EmptyPage.Actions>
        </EmptyPage.Root>
      </div>
    </div>
  );
}
