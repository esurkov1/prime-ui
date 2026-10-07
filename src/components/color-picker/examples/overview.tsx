/** A color field: a hex value and a swatch button that opens the picker panel — `ColorPicker.HexInput`, `ColorPicker.TriggerSwatch`. */
import { Button, ColorPicker, Popover } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ColorPickerOverviewExample() {
  return (
    <ColorPicker.Root defaultValue="#5b5bd6">
      <div className={styles.fieldRow}>
        <ColorPicker.HexInput label="Акцентный цвет" />
        <Popover.Root>
          <Popover.Trigger>
            <Button.Root variant="soft" tone="neutral" aria-label="Открыть палитру">
              <Button.Icon>
                <ColorPicker.TriggerSwatch />
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
