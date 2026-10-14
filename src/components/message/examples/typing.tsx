/** The typing signal: an incoming bubble of three dots that enters like a message and leaves closing its height; switch it, keep it mounted — `Message.Typing`, `open`. */
import { Button, Message } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function MessageTypingExample() {
  const [typing, setTyping] = React.useState(true);
  return (
    <div className={styles.stage}>
      <div className={styles.thread}>
        <Message.Root time="14:02">
          <Message.Text>Сейчас проверю остатки на складе.</Message.Text>
        </Message.Root>
        <Message.Typing open={typing} />
      </div>
      <Button.Root variant="soft" tone="neutral" onClick={() => setTyping((on) => !on)}>
        {typing ? "Перестал печатать" : "Снова печатает"}
      </Button.Root>
    </div>
  );
}
