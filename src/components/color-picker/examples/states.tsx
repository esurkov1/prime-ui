/** A disabled area and hue slider keep showing the color but take no input — `disabled`. */
import { ColorPicker } from "prime-ui-kit/color-picker";

import styles from "./examples.module.css";

export default function ColorPickerStatesExample() {
  return (
    <ColorPicker.Root defaultValue="#30a46c">
      <ColorPicker.Panel className={styles.panel}>
        <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness" disabled>
          <ColorPicker.AreaThumb />
        </ColorPicker.Area>
        <ColorPicker.Slider channel="hue" colorSpace="hsl" disabled>
          <ColorPicker.SliderMeta label="disabled" />
          <ColorPicker.SliderTrack>
            <ColorPicker.Thumb />
          </ColorPicker.SliderTrack>
        </ColorPicker.Slider>
      </ColorPicker.Panel>
    </ColorPicker.Root>
  );
}
