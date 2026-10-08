/** The channel strip in each value format; three pickers edit one color — `defaultFormat`, `ColorPicker.ChannelStrip`. */
import { ColorPicker, type ColorValueFormat, parseColor } from "prime-ui-kit/color-picker";
import * as React from "react";

import styles from "./examples.module.css";

const FORMATS: ColorValueFormat[] = ["hsl", "rgb", "hex"];

export default function ColorPickerFormatsExample() {
  const [color, setColor] = React.useState(() => parseColor("hsl(160, 60%, 42%)"));

  return (
    <div className={styles.panel}>
      {FORMATS.map((format) => (
        <ColorPicker.Root
          key={format}
          value={color}
          onValueChange={setColor}
          defaultFormat={format}
        >
          <ColorPicker.ChannelStrip />
        </ColorPicker.Root>
      ))}
    </div>
  );
}
