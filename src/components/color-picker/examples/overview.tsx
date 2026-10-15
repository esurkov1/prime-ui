/** A color field: a hex value and a swatch segment at its end that opens the picker panel — `ColorPicker.HexInput`, `ColorPicker.SwatchButton`. */
import { Popover } from "prime-ui-kit";
import { ColorPicker } from "prime-ui-kit/color-picker";

import styles from "./examples.module.css";

export default function ColorPickerOverviewExample() {
  return (
    <ColorPicker.Root defaultValue="#5b5bd6">
      <ColorPicker.HexInput label="Акцентный цвет" className={styles.field}>
        <Popover.Root>
          <Popover.Trigger>
            <ColorPicker.SwatchButton />
          </Popover.Trigger>
          <Popover.Content>
            <ColorPicker.Panel className={styles.panel}>
              <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
                <ColorPicker.Thumb />
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
      </ColorPicker.HexInput>
    </ColorPicker.Root>
  );
}
