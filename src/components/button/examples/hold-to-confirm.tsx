/** A destructive action that needs a held press; letting go early rolls the fill back and does nothing — `holdToConfirm`, `onConfirm`. */
import { Button, Icon } from "prime-ui-kit";
import * as React from "react";

export default function ButtonHoldToConfirmExample() {
  const [deleted, setDeleted] = React.useState(false);

  return deleted ? (
    <Button.Root variant="ghost" tone="neutral" onClick={() => setDeleted(false)}>
      <Button.Icon>
        <Icon name="action.refresh" />
      </Button.Icon>
      Восстановить проект
    </Button.Root>
  ) : (
    <Button.Root variant="soft" tone="danger" holdToConfirm onConfirm={() => setDeleted(true)}>
      <Button.Icon>
        <Icon name="action.delete" />
      </Button.Icon>
      Удерживайте, чтобы удалить проект
    </Button.Root>
  );
}
