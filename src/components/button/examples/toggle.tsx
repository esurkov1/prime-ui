/** A toggle in a toolbar: the favourite mark turns the button on with the selected fill and back off — `pressed`. */
import { Button, Icon } from "prime-ui-kit";
import * as React from "react";

export default function ButtonToggleExample() {
  const [favorite, setFavorite] = React.useState(true);

  return (
    <Button.Root
      variant="ghost"
      tone="neutral"
      pressed={favorite}
      onClick={() => setFavorite((value) => !value)}
    >
      <Button.Icon>
        <Icon name="status.favorite" />
      </Button.Icon>
      В избранном
    </Button.Root>
  );
}
