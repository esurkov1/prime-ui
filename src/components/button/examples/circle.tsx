/** Round icon buttons in every treatment, and a disk whose ring tracks an export it can cancel — `shape`, `variant`, `tone`, `progress`. */
import { Button, Icon } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** Share of the export done at each tick. */
const TICKS = [0, 0.12, 0.25, 0.31, 0.47, 0.58, 0.72, 0.86, 1];

export default function ButtonCircleExample() {
  const [tick, setTick] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (tick === null) return;
    const timer = window.setTimeout(
      () => setTick(tick + 1 < TICKS.length ? tick + 1 : null),
      tick === 0 ? 900 : 320,
    );
    return () => window.clearTimeout(timer);
  }, [tick]);

  const exporting = tick !== null;
  // The first tick has no share yet: the ring turns a quarter arc.
  const progress = tick === null ? undefined : tick === 0 ? null : TICKS[tick];

  return (
    <div className={styles.row}>
      <Button.Root shape="circle" aria-label="Новый заказ">
        <Button.Icon>
          <Icon name="action.add" />
        </Button.Icon>
      </Button.Root>
      <Button.Root shape="circle" variant="soft" aria-label="Обновить список">
        <Button.Icon>
          <Icon name="action.refresh" />
        </Button.Icon>
      </Button.Root>
      <Button.Root shape="circle" variant="outline" tone="neutral" aria-label="Фильтры">
        <Button.Icon>
          <Icon name="action.filter" />
        </Button.Icon>
      </Button.Root>
      <Button.Root shape="circle" variant="ghost" tone="neutral" aria-label="Ещё действия">
        <Button.Icon>
          <Icon name="action.more" />
        </Button.Icon>
      </Button.Root>
      <Button.Root shape="circle" variant="soft" tone="danger" aria-label="Удалить заказ">
        <Button.Icon>
          <Icon name="action.delete" />
        </Button.Icon>
      </Button.Root>
      <Button.Root
        shape="circle"
        size="l"
        variant={exporting ? "solid" : "soft"}
        progress={progress}
        aria-label={exporting ? "Отменить выгрузку заказов" : "Выгрузить заказы"}
        onClick={() => setTick(exporting ? null : 0)}
      >
        <Button.Icon>
          <Icon name={exporting ? "action.close" : "action.download"} />
        </Button.Icon>
      </Button.Root>
    </div>
  );
}
