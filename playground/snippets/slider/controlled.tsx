import * as React from "react";

import { Slider } from "@/components/slider/Slider";

/** Внешнее состояние: `value` и `onChange`; значение дублируется в подписи рядом. */
export default function SliderControlledSnippet() {
  const [level, setLevel] = React.useState(62);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}>
      <Slider.Root
        label="Уровень запаса"
        value={level}
        onChange={setLevel}
        min={0}
        max={100}
        step={1}
      />
      <span style={{ fontSize: 13, color: "var(--prime-sys-color-content-secondary)" }}>
        Текущее значение: {level}%
      </span>
    </div>
  );
}
