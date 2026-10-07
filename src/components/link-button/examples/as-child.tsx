/** The link look on a button for an inline action that is not navigation — `asChild`. */
import { LinkButton, Typography } from "prime-ui-kit";
import * as React from "react";

export default function LinkButtonAsChildExample() {
  const [sent, setSent] = React.useState(false);

  return (
    <Typography.Root variant="body-m" tone="secondary">
      {sent ? "Письмо отправлено повторно." : "Не пришло письмо со счётом?"}{" "}
      <LinkButton asChild>
        <button type="button" onClick={() => setSent(true)}>
          Отправить ещё раз
        </button>
      </LinkButton>
    </Typography.Root>
  );
}
