import { Button, Tooltip } from "prime-ui-kit";

/**
 * Explicit placement: no automatic flip—pick side when the default clips.
 */
export default function TooltipScenarioSideBottom() {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button.Root type="button" variant="neutral" mode="stroke" size="m">
            Anchor near top
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom" size="m">
          Shown below the trigger; position is clamped to the viewport inset.
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
