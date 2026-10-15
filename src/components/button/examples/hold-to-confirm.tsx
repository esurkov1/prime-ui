/** A destructive action that needs a held press; letting go early rolls the fill back and does nothing, and the delete request keeps the button loading until the server answers — `holdToConfirm`, `onConfirm`. */
import { Button, Icon } from "prime-ui-kit";
import * as React from "react";

/** The server deleting the project a beat later. */
const deleteProject = () => new Promise<void>((resolve) => setTimeout(resolve, 900));

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
    <Button.Root
      variant="soft"
      tone="danger"
      holdToConfirm
      onConfirm={async () => {
        await deleteProject();
        setDeleted(true);
      }}
    >
      <Button.Icon>
        <Icon name="action.delete" />
      </Button.Icon>
      Удержите, чтобы удалить
    </Button.Root>
  );
}
