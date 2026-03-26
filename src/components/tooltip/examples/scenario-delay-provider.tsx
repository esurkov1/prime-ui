import { Button, Tooltip } from "prime-ui-kit";

/**
 * Shared hover/focus delay via Tooltip.Provider (default is 400ms).
 */
export default function TooltipScenarioDelayProvider() {
  return (
    <Tooltip.Provider delayDuration={800}>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button.Root type="button" variant="neutral" mode="stroke" size="m">
            Hover slowly
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>This tooltip opens after 800ms on hover or focus</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
