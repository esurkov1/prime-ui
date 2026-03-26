import { Button, Popover, Typography } from "prime-ui-kit";

/**
 * Canonical panel: stroke trigger, inset spacing, and a short description inside the portaled surface.
 */
export default function CanonicalPanelExample() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          View details
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom" size="m">
        <Typography.Root as="p" variant="body-small" weight="semibold">
          Shipping estimate
        </Typography.Root>
        <Typography.Root as="p" variant="body-small">
          Arrives Tuesday–Thursday for metro addresses. Rural routes may add one business day.
        </Typography.Root>
      </Popover.Content>
    </Popover.Root>
  );
}
