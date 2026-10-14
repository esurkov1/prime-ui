/** Every tier scales text, dot and row rhythm, rows 40 to 76 px — `size`. */
import { Timeline } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function TimelineSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <Timeline.Root key={size} size={size} className={styles.feed}>
          <Timeline.Group label={size}>
            <Timeline.Item>
              <Timeline.ItemTitle>Аренда закончилась · Иван К.</Timeline.ItemTitle>
              <Timeline.ItemMeta>
                <strong>21.09.26</strong> · 15 д. назад
              </Timeline.ItemMeta>
              <Timeline.ItemValue>+6 300 ₽</Timeline.ItemValue>
            </Timeline.Item>
            <Timeline.Item>
              <Timeline.ItemTitle>ТО: замена масла</Timeline.ItemTitle>
              <Timeline.ItemMeta>
                <strong>10.09.26</strong> · 26 д. назад
              </Timeline.ItemMeta>
              <Timeline.ItemValue>−689 ₽</Timeline.ItemValue>
            </Timeline.Item>
          </Timeline.Group>
        </Timeline.Root>
      ))}
    </>
  );
}
