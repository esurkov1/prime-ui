/** A long download inside the button: the fill shows how far it got, the label counts and then offers the file — `progress`. */
import { Button, Icon } from "prime-ui-kit";
import * as React from "react";

/** Share of the file received at each network tick. */
const TICKS = [0.06, 0.15, 0.27, 0.34, 0.48, 0.61, 0.66, 0.79, 0.88, 0.97, 1];

export default function ButtonDownloadExample() {
  const [tick, setTick] = React.useState<number | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (tick === null) return;
    const timer = window.setTimeout(() => {
      if (tick + 1 < TICKS.length) setTick(tick + 1);
      else {
        setTick(null);
        setReady(true);
      }
    }, 220);
    return () => window.clearTimeout(timer);
  }, [tick]);

  const progress = tick === null ? undefined : TICKS[tick];

  return (
    <Button.Root
      variant={ready ? "soft" : "solid"}
      progress={progress}
      onClick={() => {
        if (ready) setReady(false);
        else if (tick === null) setTick(0);
      }}
    >
      <Button.Icon>
        <Icon name={ready ? "action.externalLink" : "action.download"} />
      </Button.Icon>
      {progress !== undefined
        ? `Скачивание ${Math.round(progress * 100)}%`
        : ready
          ? "Открыть отчёт"
          : "Скачать отчёт за октябрь"}
    </Button.Root>
  );
}
