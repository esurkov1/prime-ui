import { Button, Input, Popover, Typography } from "prime-ui-kit";

/**
 * Date-oriented trigger: formatted label on the anchor, native date input inside the panel.
 */
export default function DateTriggerExample() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root aria-label="Choose due date" mode="stroke" size="m" variant="neutral">
          Due · Mar 27, 2025
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
        <Typography.Root as="p" variant="body-small" weight="semibold">
          Adjust due date
        </Typography.Root>
        <Input.Root hint="Uses the control size from Popover.Content." label="Due date" size="m">
          <Input.Wrapper>
            <Input.Field defaultValue="2025-03-27" name="dueDate" type="date" />
          </Input.Wrapper>
        </Input.Root>
      </Popover.Content>
    </Popover.Root>
  );
}
