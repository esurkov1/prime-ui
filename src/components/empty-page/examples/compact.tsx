/** The quiet empty state of a search panel: no entrance motion, body-s text, one action — `layout="compact"`. */
import { Button, EmptyPage, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function EmptyPageCompactExample() {
  return (
    <div className={styles.panel}>
      <EmptyPage.Root layout="compact" size="s" role="status">
        <EmptyPage.Icon>
          <Icon name="action.search" />
        </EmptyPage.Icon>
        <EmptyPage.Title>Ничего не найдено</EmptyPage.Title>
        <EmptyPage.Description>Нет клиентов с названием «Северный»</EmptyPage.Description>
        <EmptyPage.Actions>
          <Button.Root variant="soft" tone="neutral" size="s">
            Сбросить поиск
          </Button.Root>
        </EmptyPage.Actions>
      </EmptyPage.Root>
    </div>
  );
}
