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
        <Button.Root mode="stroke" variant="neutral">
          Quick edit
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom" trapFocus>
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
            <Input.Root label="Display name">
              <Input.Wrapper>
                <Input.Field autoComplete="organization" name="displayName" type="text" />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root label="Slug" hint="Lowercase, no spaces.">
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
              type="button"
              variant="neutral"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button.Root>
            <Button.Root type="submit" variant="primary">
              Save
            </Button.Root>
          </div>
        </form>
      </Popover.Content>
    </Popover.Root>
  );
}
