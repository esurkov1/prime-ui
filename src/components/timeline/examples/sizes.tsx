/** Every tier scales text, dot and row rhythm, rows 40 to 76 px — `size`. */
import { Timeline } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function TimelineSizesExample() {
  return (
    <div className={styles.stack}>
      {SIZES.map((size) => (
        <Timeline.Root key={size} size={size}>
          <Timeline.Group label={size}>
            <Timeline.Item>
              <Timeline.Title>Аренда закончилась · Иван К.</Timeline.Title>
              <Timeline.Meta>
                <Timeline.MetaPrimary>21.09.26</Timeline.MetaPrimary> · 15 д. назад
              </Timeline.Meta>
              <Timeline.Value>+6 300 ₽</Timeline.Value>
            </Timeline.Item>
            <Timeline.Item>
              <Timeline.Title>ТО: замена масла</Timeline.Title>
              <Timeline.Meta>
                <Timeline.MetaPrimary>10.09.26</Timeline.MetaPrimary> · 26 д. назад
              </Timeline.Meta>
              <Timeline.Value>−689 ₽</Timeline.Value>
            </Timeline.Item>
          </Timeline.Group>
        </Timeline.Root>
      ))}
    </div>
  );
}
