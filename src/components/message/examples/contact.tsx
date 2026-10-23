/** A shared contact: initials or a photo, name and phone, with the actions to write or save — `Message.Contact`, `phone`. */
import { Button, Message } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function MessageContactExample() {
  return (
    <div className={styles.thread}>
      <Message.Root direction="incoming" time="11:20">
        <Message.Text>Вот контакт бухгалтера, она пришлёт акты.</Message.Text>
      </Message.Root>
      <Message.Root direction="incoming" time="11:20">
        <Message.Contact name="Ирина Белова" phone="+7 916 204-18-77" color="pink">
          <Button.Root variant="soft" tone="neutral">
            Написать
          </Button.Root>
          <Button.Root variant="soft" tone="neutral">
            Добавить
          </Button.Root>
        </Message.Contact>
      </Message.Root>
    </div>
  );
}
