import { Button, Input, Popover, Typography } from "prime-ui-kit";
import * as React from "react";

/**
 * Short form inside the panel: enable trapFocus when multiple fields need a tight tab cycle.
 */
export default function FormInPopoverExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          Quick edit
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content
        align="start"
        insetGap="x3"
        insetPadding="x2"
        side="bottom"
        size="m"
        trapFocus
      >
        <form
          style={{ width: "min(22rem, 100vw)" }}
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
          }}
        >
          <Typography.Root as="p" variant="body-small" weight="semibold">
            Workspace label
          </Typography.Root>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--prime-sys-spacing-x3)",
              marginTop: "var(--prime-sys-spacing-x2)",
            }}
          >
            <Input.Root label="Display name" size="m">
              <Input.Wrapper>
                <Input.Field autoComplete="organization" name="displayName" type="text" />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root label="Slug" hint="Lowercase, no spaces." size="m">
              <Input.Wrapper>
                <Input.Field name="slug" type="text" />
              </Input.Wrapper>
            </Input.Root>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--prime-sys-spacing-x2)",
              marginTop: "var(--prime-sys-spacing-x3)",
            }}
          >
            <Button.Root
              mode="stroke"
              size="m"
              type="button"
              variant="neutral"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button.Root>
            <Button.Root size="m" type="submit" variant="primary">
              Save
            </Button.Root>
          </div>
        </form>
      </Popover.Content>
    </Popover.Root>
  );
}
