/** A pipeline stage takes a kit palette hue, so its badge and column read the same in both themes — `mode`, `palette`. */
import { Badge, ColorSwatches, type PaletteColor } from "prime-ui-kit";
import * as React from "react";

const STAGE_HUES: PaletteColor[] = ["gray", "blue", "teal", "green", "yellow", "orange", "red"];

export default function ColorSwatchesPaletteExample() {
  const [hue, setHue] = React.useState<PaletteColor | null>("teal");

  return (
    <>
      <ColorSwatches
        mode="palette"
        label="Цвет этапа «Переговоры»"
        palette={STAGE_HUES}
        value={hue}
        onValueChange={setHue}
      />
      <div>
        <Badge.Root color={hue ?? "gray"}>Переговоры</Badge.Root>
      </div>
    </>
  );
}
