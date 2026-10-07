/** A short timer, a toast that stays until closed, and one without a close button — `duration`, `persistent`, `closable`. */
import { Button, NotificationProvider, useNotifications } from "prime-ui-kit";

import styles from "./examples.module.css";

function DismissButtons() {
  const { notify } = useNotifications();
  return (
    <div className={styles.row}>
      <Button.Root
        variant="outline"
        tone="neutral"
        onClick={() => notify({ title: "Черновик сохранён", duration: 2000 })}
      >
        На 2 секунды
      </Button.Root>
      <Button.Root
        variant="outline"
        tone="neutral"
        onClick={() =>
          notify({
            tone: "danger",
            title: "Платёж отклонён",
            description: "Банк не подтвердил операцию.",
            persistent: true,
            action: { label: "Повторить", onClick: () => undefined },
          })
        }
      >
        Без таймера
      </Button.Root>
      <Button.Root
        variant="outline"
        tone="neutral"
        onClick={() => notify({ tone: "success", title: "Ссылка скопирована", closable: false })}
      >
        Без кнопки закрытия
      </Button.Root>
    </div>
  );
}

export default function NotificationDismissExample() {
  // In an app NotificationProvider wraps the root once; here it keeps the example self-contained.
  return (
    <NotificationProvider>
      <DismissButtons />
    </NotificationProvider>
  );
}
