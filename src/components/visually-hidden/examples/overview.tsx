/** A count that sighted users read from the layout, said in words to screen readers, and a polite announcement after an action — `VisuallyHidden`, `live`. */
import { Badge, Button, Typography, VisuallyHidden } from "prime-ui-kit";
import * as React from "react";

export default function VisuallyHiddenOverviewExample() {
  const [archived, setArchived] = React.useState(0);

  return (
    <>
      <Typography as="span" variant="body-m">
        Счета к оплате <Badge.Root color="orange">3</Badge.Root>
        <VisuallyHidden>: три счёта ждут оплаты</VisuallyHidden>
      </Typography>
      <Button.Root variant="soft" tone="neutral" onClick={() => setArchived((count) => count + 1)}>
        В архив
      </Button.Root>
      <VisuallyHidden live="polite">
        {archived > 0 ? `Счетов в архиве: ${archived}` : ""}
      </VisuallyHidden>
    </>
  );
}
