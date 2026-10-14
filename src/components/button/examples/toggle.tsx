/** A toggle in a toolbar keeps its own state: the favourite mark turns the button on with the selected fill and back off — `defaultPressed`. */
import { Button, Icon } from "prime-ui-kit";

export default function ButtonToggleExample() {
  return (
    <Button.Root variant="ghost" tone="neutral" defaultPressed>
      <Button.Icon>
        <Icon name="status.favorite" />
      </Button.Icon>
      В избранном
    </Button.Root>
  );
}
