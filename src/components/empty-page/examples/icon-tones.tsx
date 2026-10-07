/** The tile tone tells why the area is empty: no data yet, a first run, or a failed load — `tone`. */
import { Button, EmptyPage, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function EmptyPageIconTonesExample() {
  return (
    <div className={styles.grid}>
      <EmptyPage.Root size="s" aria-labelledby="tone-neutral">
        <EmptyPage.Icon tone="neutral">
          <Icon name="object.inbox" />
        </EmptyPage.Icon>
        <EmptyPage.Title id="tone-neutral">Входящих нет</EmptyPage.Title>
        <EmptyPage.Description>Новые заявки появятся здесь.</EmptyPage.Description>
      </EmptyPage.Root>

      <EmptyPage.Root size="s" aria-labelledby="tone-accent">
        <EmptyPage.Icon tone="accent">
          <Icon name="object.rocket" />
        </EmptyPage.Icon>
        <EmptyPage.Title id="tone-accent">Создайте первый проект</EmptyPage.Title>
        <EmptyPage.Description>Проекты объединяют задачи, файлы и команду.</EmptyPage.Description>
        <EmptyPage.Actions>
          <Button.Root size="s">Создать проект</Button.Root>
        </EmptyPage.Actions>
      </EmptyPage.Root>

      <EmptyPage.Root size="s" aria-labelledby="tone-danger">
        <EmptyPage.Icon tone="danger">
          <Icon name="status.offline" />
        </EmptyPage.Icon>
        <EmptyPage.Title id="tone-danger">Не удалось загрузить</EmptyPage.Title>
        <EmptyPage.Description>Сервер не ответил. Проверьте соединение.</EmptyPage.Description>
        <EmptyPage.Actions>
          <Button.Root variant="outline" tone="neutral" size="s">
            Повторить
          </Button.Root>
        </EmptyPage.Actions>
      </EmptyPage.Root>
    </div>
  );
}
