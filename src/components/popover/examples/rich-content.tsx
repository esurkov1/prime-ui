import { Badge, Button, Divider, Hint, Popover, Typography } from "prime-ui-kit";

/**
 * Rich panel: badges, section divider, supporting hint — still a lightweight non-modal surface.
 */
export default function RichContentExample() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root mode="ghost" variant="neutral">
          Release notes
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--prime-sys-spacing-x2)" }}>
          <Badge.Root color="green" variant="light">
            Stable
          </Badge.Root>
          <Badge.Root color="blue" variant="stroke">
            v2.4
          </Badge.Root>
        </div>
        <Typography.Root as="p" variant="body-small" weight="semibold">
          What changed
        </Typography.Root>
        <Typography.Root as="p" variant="body-small">
          Command menu now respects nested Select listboxes without closing the panel on outside
          detection.
        </Typography.Root>
        <Divider.Root variant="text">Heads-up</Divider.Root>
        <Hint.Root variant="default">
          Prefer Modal when the flow must block the page or trap focus by default.
        </Hint.Root>
      </Popover.Content>
    </Popover.Root>
  );
}
