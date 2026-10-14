/** A count that sighted users read from the layout, said in words to screen readers, and a polite announcement after an action — `VisuallyHidden`, `live`. */
import { Badge, Button, Typography, VisuallyHidden } from "prime-ui-kit";
import * as React from "react";

const UNPAID_INVOICES = 3;

export default function VisuallyHiddenOverviewExample() {
  const [unpaid, setUnpaid] = React.useState(UNPAID_INVOICES);
  const [announcement, setAnnouncement] = React.useState("");

  const archive = () => {
    const left = Math.max(0, unpaid - 1);
    setUnpaid(left);
    setAnnouncement(`Счёт перенесён в архив. Ждут оплаты: ${left}`);
  };

  return (
    <>
      <Typography as="span" variant="body-m">
        Счета к оплате{" "}
        <Badge.Root color="orange" aria-hidden="true">
          {unpaid}
        </Badge.Root>
        <VisuallyHidden>, ждут оплаты: {unpaid}</VisuallyHidden>
      </Typography>
      <Button.Root variant="soft" tone="neutral" disabled={unpaid === 0} onClick={archive}>
        В архив
      </Button.Root>
      <VisuallyHidden live="polite">{announcement}</VisuallyHidden>
    </>
  );
}
