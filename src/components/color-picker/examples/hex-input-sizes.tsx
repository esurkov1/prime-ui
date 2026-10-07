/** HexInput in every size tier with a square soft trigger of the same size that opens the panel in a Popover. Use it for a color field inside forms. */
import { Button, ColorPicker, Popover } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

function ColorField({ size }: { size: (typeof SIZES)[number] }) {
  return (
    <ColorPicker.Root defaultValue="#0090ff">
      <div className={styles.fieldRow}>
        <ColorPicker.HexInput label={`Цвет · ${size}`} size={size} />
        <Popover.Root>
          <Popover.Trigger>
            <Button.Root
              variant="soft"
              tone="neutral"
              size={size}
              aria-label="Открыть палитру"
              className={styles.swatchTrigger}
            >
              <Button.Icon>
                <ColorPicker.TriggerSwatch className={styles.swatchFill} />
              </Button.Icon>
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="end">
            <ColorPicker.Panel className={styles.panel}>
              <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
                <ColorPicker.AreaThumb />
              </ColorPicker.Area>
              <ColorPicker.Slider channel="hue" colorSpace="hsl">
                <ColorPicker.SliderTrack>
                  <ColorPicker.Thumb />
                </ColorPicker.SliderTrack>
              </ColorPicker.Slider>
              <ColorPicker.ChannelStrip />
            </ColorPicker.Panel>
          </Popover.Content>
        </Popover.Root>
      </div>
    </ColorPicker.Root>
  );
}

export default function ColorPickerHexInputSizesExample() {
  return (
    <div className={styles.sizes}>
      {SIZES.map((size) => (
        <ColorField key={size} size={size} />
      ))}
    </div>
  );
}
