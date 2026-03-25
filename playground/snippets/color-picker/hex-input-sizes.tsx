import { ColorPicker } from "@/components/color-picker/ColorPicker";
import ExampleSurface from "../../components/ExampleSurface";

import preview from "./preview.module.css";

const SIZES = ["s", "m", "l", "xl"] as const;

export default function ColorPickerHexInputSizesSnippet() {
  return (
    <ExampleSurface className={preview.sizesRow}>
      {SIZES.map((size) => (
        <ColorPicker.Root key={size} defaultValue="#3b82f6">
          <ColorPicker.HexInput label={`Hex (${size})`} size={size} />
        </ColorPicker.Root>
      ))}
    </ExampleSurface>
  );
}
