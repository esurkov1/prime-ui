/** Every size tier next to buttons of the same tier; take the tier of the control it describes — `size`. */
import { Button, Tooltip } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function TooltipSizesExample() {
  return (
    <Tooltip.Provider>
      {SIZES.map((size) => (
        <Tooltip.Root key={size}>
          <Tooltip.Trigger>
            <Button.Root variant="soft" tone="neutral" size={size}>
              {size}
            </Button.Root>
          </Tooltip.Trigger>
          <Tooltip.Content size={size}>Черновик сохранится на сервере</Tooltip.Content>
        </Tooltip.Root>
      ))}
    </Tooltip.Provider>
  );
}
