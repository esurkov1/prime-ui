/** In a 320 px side panel the text wraps under the tile and the actions wrap to a second line. */
import { Button, EmptyPage, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function EmptyPageNarrowExample() {
  return (
    <div className={styles.narrow}>
      <EmptyPage.Root size="s" aria-labelledby="empty-narrow-title">
        <EmptyPage.Icon>
          <Icon name="action.filter" />
        </EmptyPage.Icon>
        <EmptyPage.Title id="empty-narrow-title">Нет подходящих поставщиков</EmptyPage.Title>
        <EmptyPage.Description>
          Под выбранные регион и категорию никто не подходит. Ослабьте фильтры.
        </EmptyPage.Description>
        <EmptyPage.Actions>
          <Button.Root variant="outline" tone="neutral" size="s">
            Сбросить фильтры
          </Button.Root>
          <Button.Root size="s">Пригласить поставщика</Button.Root>
        </EmptyPage.Actions>
      </EmptyPage.Root>
    </div>
  );
}
