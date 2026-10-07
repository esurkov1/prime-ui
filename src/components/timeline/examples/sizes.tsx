/** `size` scales text, dot and row rhythm: rows 40 · 52 · 64 · 68 · 76, default `m`. Use `s` in side panels, `m` in page content. */

import { type ControlSize, Timeline, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes: ControlSize[] = ["xs", "s", "m", "l", "xl"];

export default function TimelineSizesExample() {
  return (
    <div className={styles.stack}>
      {sizes.map((size) => (
        <div key={size} className={styles.cell}>
          <Typography.Root variant="code" tone="muted">
            size="{size}"
          </Typography.Root>
          <Timeline.Root size={size}>
            <Timeline.Group label="Недавно">
              <Timeline.Item>
                <Timeline.Title>Аренда закончилась · Иван К.</Timeline.Title>
                <Timeline.Meta>
                  <Timeline.MetaPrimary>21.09.26</Timeline.MetaPrimary> · 15 д. назад
                </Timeline.Meta>
                <Timeline.Value>+6 300 ฿</Timeline.Value>
              </Timeline.Item>
              <Timeline.Item active>
                <Timeline.Title>ТО: замена масла</Timeline.Title>
                <Timeline.Meta>
                  <Timeline.MetaPrimary>10.09.26</Timeline.MetaPrimary> · 26 д. назад
                </Timeline.Meta>
                <Timeline.Value>−689 ฿</Timeline.Value>
              </Timeline.Item>
            </Timeline.Group>
          </Timeline.Root>
        </div>
      ))}
    </div>
  );
}
