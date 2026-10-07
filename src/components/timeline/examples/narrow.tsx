/** At 375px the title wraps and the amount stays on the right; below 20rem of its own width (container query) the amount moves under the meta line. Use to check mobile layouts. */

import { Timeline, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

function Rows() {
  return (
    <Timeline.Group label="Недавно">
      <Timeline.Item>
        <Timeline.Title>Аренда закончилась · Марина Л.</Timeline.Title>
        <Timeline.Meta>
          <Timeline.MetaPrimary>17.07.26</Timeline.MetaPrimary> · 81 д. назад
        </Timeline.Meta>
        <Timeline.Value>+9 450 ฿</Timeline.Value>
      </Timeline.Item>
      <Timeline.Item active>
        <Timeline.Title>ТО: замена масла и фильтров, проверка тормозов</Timeline.Title>
        <Timeline.Meta>
          <Timeline.MetaPrimary>10.09.26</Timeline.MetaPrimary> · 26 д. назад
        </Timeline.Meta>
        <Timeline.Value>−689 ฿</Timeline.Value>
      </Timeline.Item>
    </Timeline.Group>
  );
}

export default function TimelineNarrowExample() {
  return (
    <div className={styles.stack}>
      <div className={styles.phone}>
        <Typography.Root variant="caption" tone="muted">
          375px
        </Typography.Root>
        <Timeline.Root>
          <Rows />
        </Timeline.Root>
      </div>
      <div className={styles.narrow}>
        <Typography.Root variant="caption" tone="muted">
          280px
        </Typography.Root>
        <Timeline.Root>
          <Rows />
        </Timeline.Root>
      </div>
    </div>
  );
}
