/** A standalone raised panel with format select, area, hue and alpha sliders, channel strip and brand swatches. Use it as the full picker layout and part order. */
import { ColorPicker, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const PRESETS = ["#e5484d", "#f76b15", "#ffc53d", "#30a46c", "#12a594", "#0090ff", "#8e4ec6"];

export default function ColorPickerPanelExample() {
  return (
    <ColorPicker.Root defaultValue="hsl(220, 90%, 56%)">
      <ColorPicker.Panel surface="raised" className={styles.panel}>
        <ColorPicker.FormatSelect />
        <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
          <ColorPicker.AreaThumb />
        </ColorPicker.Area>
        <ColorPicker.Slider channel="hue" colorSpace="hsl">
          <ColorPicker.SliderMeta label="Оттенок" />
          <ColorPicker.SliderTrack>
            <ColorPicker.Thumb />
          </ColorPicker.SliderTrack>
        </ColorPicker.Slider>
        <ColorPicker.Slider channel="alpha">
          <ColorPicker.SliderMeta label="Непрозрачность" />
          <ColorPicker.SliderTrack>
            <ColorPicker.Thumb />
          </ColorPicker.SliderTrack>
        </ColorPicker.Slider>
        <ColorPicker.ChannelStrip />
        <Typography.Root as="p" variant="caption" tone="secondary">
          Цвета бренда
        </Typography.Root>
        <ColorPicker.SwatchPicker aria-label="Цвета бренда">
          {PRESETS.map((color) => (
            <ColorPicker.SwatchPickerItem key={color} color={color}>
              <ColorPicker.Swatch />
            </ColorPicker.SwatchPickerItem>
          ))}
        </ColorPicker.SwatchPicker>
      </ColorPicker.Panel>
    </ColorPicker.Root>
  );
}
