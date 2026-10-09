/** The typing signal: an incoming bubble of three dots that enters like a message and leaves closing its height; switch it, keep it mounted — `Message.Typing`, `active`. */
import { Button, Message } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function MessageTypingExample() {
  const [active, setActive] = React.useState(true);
  return (
    <div className={styles.stage}>
      <div className={styles.thread}>
        <Message.Root time="14:02">
          <Message.Text>Сейчас проверю остатки на складе.</Message.Text>
        </Message.Root>
        <Message.Typing active={active} />
      </div>
      <Button.Root variant="soft" tone="neutral" onClick={() => setActive((on) => !on)}>
        {active ? "Перестал печатать" : "Снова печатает"}
      </Button.Root>
    </div>
  );
}
