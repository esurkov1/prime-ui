/** The tone tells why the area is empty: no data yet, a first run, or a failed load with a retry — `tone`, `EmptyPage.RetryButton`. */
import { Button, EmptyPage, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

/** A retry that answers after a second, as a slow server would. */
const retryInbox = () => new Promise<void>((resolve) => window.setTimeout(resolve, 1000));

export default function EmptyPageVariantsExample() {
  return (
    <div className={styles.grid}>
      <EmptyPage.Root size="s" aria-labelledby="tone-neutral">
        <EmptyPage.Icon>
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
          <Button.Root>Создать проект</Button.Root>
        </EmptyPage.Actions>
      </EmptyPage.Root>

      <EmptyPage.Root size="s" tone="danger" aria-labelledby="tone-danger">
        <EmptyPage.Icon>
          <Icon name="status.offline" />
        </EmptyPage.Icon>
        <EmptyPage.Title id="tone-danger">Не удалось загрузить</EmptyPage.Title>
        <EmptyPage.Description>Сервер не ответил. Проверьте соединение.</EmptyPage.Description>
        <EmptyPage.Actions>
          <EmptyPage.RetryButton onRetry={retryInbox} />
        </EmptyPage.Actions>
      </EmptyPage.Root>
    </div>
  );
}
