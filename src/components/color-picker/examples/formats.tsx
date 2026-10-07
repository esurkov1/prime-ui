/** Three Roots sharing one controlled color with defaultFormat hsl, rgb and hex for the channel strip. Use it to pick the value format users edit. */
import { ColorPicker, type ColorValueFormat, parseColor, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const FORMATS: { format: ColorValueFormat; title: string }[] = [
  { format: "hsl", title: "HSL — оттенок, насыщенность, яркость, альфа" },
  { format: "rgb", title: "RGB — красный, зелёный, синий, альфа" },
  { format: "hex", title: "Hex — одно поле #RRGGBB" },
];

export default function ColorPickerFormatsExample() {
  // Three Roots with one controlled value: every strip edits the same color.
  const [color, setColor] = React.useState(() => parseColor("hsl(160, 60%, 42%)"));

  return (
    <div className={`${styles.formats} ${styles.panel}`}>
      {FORMATS.map(({ format, title }) => (
        <div key={format} className={styles.formatItem}>
          <Typography.Root as="p" variant="caption" tone="secondary">
            {title}
          </Typography.Root>
          <ColorPicker.Root value={color} onValueChange={setColor} defaultFormat={format}>
            <ColorPicker.ChannelStrip />
          </ColorPicker.Root>
        </div>
      ))}
    </div>
  );
}
