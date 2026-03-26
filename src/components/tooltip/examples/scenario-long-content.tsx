import { Button, Tooltip } from "prime-ui-kit";

/**
 * Long supplementary copy: tooltip content is clamped by theme max-width and wraps.
 */
export default function TooltipScenarioLongContent() {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button.Root type="button" variant="neutral" mode="stroke" size="m">
            Password rules
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content size="m">
          Use at least 12 characters with upper and lower case letters and numbers. Do not reuse
          passwords from other sites; use a unique passphrase for this account.
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
