/** Every size tier next to buttons of the same tier; take the tier of the control it describes — `size`. */
import { Button, Tooltip, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function TooltipSizesExample() {
  return (
    <Tooltip.Provider>
      <div>
        {SIZES.map((size) => (
          <div key={size}>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button.Root variant="soft" tone="neutral" size={size}>
                  Черновик
                </Button.Root>
              </Tooltip.Trigger>
              <Tooltip.Content size={size}>Черновик сохранится на сервере</Tooltip.Content>
            </Tooltip.Root>
            <Typography as="span" variant="caption" tone="muted">
              {size}
            </Typography>
          </div>
        ))}
      </div>
    </Tooltip.Provider>
  );
}
