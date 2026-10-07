/** The full raised panel and its part order: format, area, hue and alpha sliders, channels, brand swatches — `ColorPicker.Panel`, `surface`, `ColorPicker.Swatches`. */
import { ColorPicker } from "prime-ui-kit";

import styles from "./examples.module.css";

const BRAND_COLORS = [
  { value: "#e5484d", label: "Красный" },
  { value: "#f76b15", label: "Оранжевый" },
  { value: "#ffc53d", label: "Янтарный" },
  { value: "#30a46c", label: "Зелёный" },
  { value: "#12a594", label: "Бирюзовый" },
  { value: "#0090ff", label: "Синий" },
  { value: "#8e4ec6", label: "Фиолетовый" },
];

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
        <ColorPicker.Swatches label="Цвета бренда" size="s" presets={BRAND_COLORS} />
      </ColorPicker.Panel>
    </ColorPicker.Root>
  );
}
