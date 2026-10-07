/** `mask` hides the digits of a PIN, `name` puts the joined code into a native form submit, `autoFocus` starts typing at once. Use it for PIN confirmation inside a regular form. */
import { Button, DigitInput, Label, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function DigitInputMaskedInFormExample() {
  const [sent, setSent] = React.useState<string | null>(null);

  return (
    <form
      className={styles.wide}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(String(new FormData(e.currentTarget).get("pin")));
      }}
    >
      <Label.Root>PIN-код карты</Label.Root>
      <DigitInput.Root
        name="pin"
        length={4}
        size="l"
        fullWidth
        mask
        autoFocus
        labels={{ group: "PIN-код карты" }}
      />
      <Button.Root type="submit" size="l" fullWidth>
        Продолжить
      </Button.Root>
      {sent !== null ? (
        <Typography.Root variant="caption" tone="muted">
          Отправлено в форме: {sent}
        </Typography.Root>
      ) : null}
    </form>
  );
}
