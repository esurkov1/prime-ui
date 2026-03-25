import * as React from "react";

import { Button } from "@/components/button/Button";
import { ProgressCircle } from "@/components/progress-circle/ProgressCircle";
import { Typography } from "@/components/typography/Typography";

/** Значение приходит из состояния родителя — типичный сценарий для загрузки или опроса прогресса. */
export default function ProgressCircleControlledSnippet() {
  const [value, setValue] = React.useState(35);

  return (
    <div className="previewLabeledCenter" style={{ gap: "1rem" }}>
      <ProgressCircle.Root value={value} max={100} size="l">
        <Typography.Root as="span" size="s" weight="medium">
          {value}%
        </Typography.Root>
      </ProgressCircle.Root>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
        <Button.Root
          mode="stroke"
          size="s"
          type="button"
          onClick={() => setValue((v) => Math.max(0, v - 10))}
        >
          −10
        </Button.Root>
        <Button.Root
          mode="stroke"
          size="s"
          type="button"
          onClick={() => setValue((v) => Math.min(100, v + 10))}
        >
          +10
        </Button.Root>
        <Button.Root mode="lighter" size="s" type="button" onClick={() => setValue(0)}>
          Сброс
        </Button.Root>
      </div>
    </div>
  );
}
