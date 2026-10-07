/** Disabled area and slider, a disabled swatch and a hex field that reverts invalid input. Use it as a reference for part-level states. */
import { ColorPicker } from "prime-ui-kit";

import styles from "./examples.module.css";

const PRESETS = ["#e5484d", "#30a46c", "#0090ff", "#8e4ec6"];

export default function ColorPickerStatesExample() {
  return (
    <ColorPicker.Root defaultValue="#30a46c">
      <ColorPicker.Panel surface="raised" className={styles.panel}>
        <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness" disabled>
          <ColorPicker.AreaThumb />
        </ColorPicker.Area>
        <ColorPicker.Slider channel="hue" colorSpace="hsl" disabled>
          <ColorPicker.SliderMeta label="Оттенок (disabled)" />
          <ColorPicker.SliderTrack>
            <ColorPicker.Thumb />
          </ColorPicker.SliderTrack>
        </ColorPicker.Slider>
        <ColorPicker.SwatchPicker aria-label="Пресеты, красный недоступен">
          {PRESETS.map((color, index) => (
            <ColorPicker.SwatchPickerItem key={color} color={color} disabled={index === 0}>
              <ColorPicker.Swatch />
            </ColorPicker.SwatchPickerItem>
          ))}
        </ColorPicker.SwatchPicker>
        <ColorPicker.HexInput label="Hex" />
      </ColorPicker.Panel>
    </ColorPicker.Root>
  );
}
