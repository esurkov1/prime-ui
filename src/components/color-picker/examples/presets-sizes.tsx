/** The preset trigger in every size, a square of the control height next to an input of the same tier — `ColorPresets`, `size`. */
import { ColorPresets, Input } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function ColorPickerPresetsSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <div key={size} className={styles.row}>
          <ColorPresets.Root size={size} defaultValue="#f97316" labels={{ trigger: "Цвет метки" }}>
            <ColorPresets.Trigger />
            <ColorPresets.Content />
          </ColorPresets.Root>
          <Input.Root size={size}>
            <Input.Wrapper>
              <Input.Field aria-label={`Название метки, ${size}`} defaultValue="Маркетинг" />
            </Input.Wrapper>
          </Input.Root>
        </div>
      ))}
    </>
  );
}
