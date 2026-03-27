import { PackagePlus } from "lucide-react";
import { Button, EmptyPage } from "prime-ui-kit";

import styles from "./examples-demos.module.css";

/**
 * Пустое состояние в «области таблицы»: родитель с фиксированной минимальной высотой,
 * `layout="fill"` растягивает блок и центрирует содержимое.
 */
export function EmptyPageTableRegion() {
  return (
    <div>
      <p className={styles.lead}>
        Имитация тела таблицы или карточки со списком: обводка задаёт границу области данных.
      </p>
      <div className={styles.tableRegion}>
        <EmptyPage.Root layout="fill" aria-labelledby="empty-table-heading">
          <EmptyPage.Icon aria-hidden>
            <PackagePlus strokeWidth={2} aria-hidden />
          </EmptyPage.Icon>
          <EmptyPage.Title id="empty-table-heading">Пока нет позиций</EmptyPage.Title>
          <EmptyPage.Description>
            Импортируйте каталог или создайте первую строку вручную — таблица заполнится
            автоматически.
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
