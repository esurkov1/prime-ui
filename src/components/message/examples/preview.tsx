/** A bot's welcome message as its settings page shows it: the same bubble with its keyboard, nothing in it pressed or opened, the time in the zone of the profile — `preview`, `timeZone`. */
import { Button, Message } from "prime-ui-kit";

import styles from "./examples.module.css";

const SENT = new Date(Date.UTC(2026, 9, 14, 23, 30));

export default function MessagePreviewExample() {
  return (
    <div className={styles.thread}>
      <Message.Root preview time={SENT} timeZone="Asia/Vladivostok">
        <Message.Text>
          {
            "**Здравствуйте!** Я бот склада «Прайм»: подскажу статус заказа и пришлю счёт. Выберите, с чего начать."
          }
        </Message.Text>
        <Message.Actions>
          <Button.Root variant="soft" tone="neutral">
            Статус заказа
          </Button.Root>
          <Button.Root variant="soft" tone="neutral">
            Прислать счёт
          </Button.Root>
        </Message.Actions>
      </Message.Root>
    </div>
  );
}
