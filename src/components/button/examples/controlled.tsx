/** A toggle whose state the screen owns: pinning an order shows the note under it — `pressed`, `onPressedChange`. */
import { Button, Icon, Typography } from "prime-ui-kit";
import * as React from "react";

export default function ButtonControlledExample() {
  const [pinned, setPinned] = React.useState(false);

  return (
    <>
      <Button.Root variant="ghost" tone="neutral" pressed={pinned} onPressedChange={setPinned}>
        <Button.Icon>
          <Icon name="action.pin" />
        </Button.Icon>
        Закрепить заказ
      </Button.Root>
      <Typography variant="body-s" tone="muted">
        {pinned ? "Заказ № 4815 закреплён вверху списка" : "Заказ № 4815 в общем списке"}
      </Typography>
    </>
  );
}
